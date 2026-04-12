/* oxlint-disable vitest/prefer-called-once */
import type * as PostHogModule from "posthog-node";

const readFileSyncMock = vi.fn();
const writeFileSyncMock = vi.fn();
const randomUUIDMock = vi.fn();
const captureMock = vi.fn();
const shutdownMock = vi.fn();
const postHogConstructorMock = vi.fn();

vi.mock(import("node:fs"), () => ({
  readFileSync: readFileSyncMock,
  writeFileSync: writeFileSyncMock,
}));

vi.mock(import("node:crypto"), () => ({
  randomUUID: randomUUIDMock,
}));

vi.mock(import("posthog-node"), () => {
  class MockPostHog {
    capture = captureMock;
    shutdown = shutdownMock;

    constructor(apiKey: string, options: unknown) {
      postHogConstructorMock(apiKey, options);
    }
  }

  return {
    PostHog: MockPostHog,
  } as unknown as typeof PostHogModule;
});

const originalEnv = { ...process.env };

const importTelemetry = () => import("../src/utils/telemetry.js");
const expectedCi =
  Boolean(process.env["CI"]) ||
  Boolean(process.env["GITHUB_ACTIONS"]) ||
  Boolean(process.env["GITLAB_CI"]) ||
  Boolean(process.env["CIRCLECI"]) ||
  Boolean(process.env["TRAVIS"]) ||
  Boolean(process.env["BUILDKITE"]);

describe("telemetry", () => {
  beforeEach(() => {
    vi.resetModules();

    readFileSyncMock.mockReset();
    writeFileSyncMock.mockReset();
    randomUUIDMock.mockReset();
    captureMock.mockReset();
    shutdownMock.mockReset();
    shutdownMock.mockResolvedValue(undefined as never);
    postHogConstructorMock.mockReset();

    process.env = {
      ...originalEnv,
      POSTHOG_API_KEY: "test-posthog-key",
      VERSION: "0.3.3",
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("generates and persists a distinct id on first run", async () => {
    readFileSyncMock.mockImplementation(() => {
      throw new Error("ENOENT");
    });
    randomUUIDMock.mockReturnValue("machine-id");

    const { capture } = await importTelemetry();

    capture("cli:list");

    expect(randomUUIDMock).toHaveBeenCalledTimes(1);
    expect(writeFileSyncMock).toHaveBeenCalledWith(
      expect.stringContaining(".ossperks-telemetry.json"),
      JSON.stringify({ distinctId: "machine-id" }, null, 2),
      "utf8",
    );
    expect(captureMock).toHaveBeenCalledWith(
      expect.objectContaining({
        distinctId: "machine-id",
        event: "cli:list",
        properties: expect.objectContaining({
          ci: expectedCi,
          cli_version: "0.3.3",
        }),
      }),
    );
  });

  it("reuses a persisted distinct id instead of generating a new one", async () => {
    readFileSyncMock.mockReturnValue(
      JSON.stringify({ distinctId: "persisted-id" }),
    );
    randomUUIDMock.mockReturnValue("new-id");

    const { capture } = await importTelemetry();

    capture("cli:search");

    expect(randomUUIDMock).not.toHaveBeenCalled();
    expect(writeFileSyncMock).not.toHaveBeenCalled();
    expect(captureMock).toHaveBeenCalledWith(
      expect.objectContaining({
        distinctId: "persisted-id",
        event: "cli:search",
      }),
    );
  });

  it("recovers from a corrupt telemetry file by generating a replacement id", async () => {
    readFileSyncMock.mockReturnValue("{not-json");
    randomUUIDMock.mockReturnValue("replacement-id");

    const { capture } = await importTelemetry();

    capture("cli:show");

    expect(randomUUIDMock).toHaveBeenCalledTimes(1);
    expect(writeFileSyncMock).toHaveBeenCalledWith(
      expect.stringContaining(".ossperks-telemetry.json"),
      JSON.stringify({ distinctId: "replacement-id" }, null, 2),
      "utf8",
    );
    expect(captureMock).toHaveBeenCalledWith(
      expect.objectContaining({
        distinctId: "replacement-id",
        event: "cli:show",
      }),
    );
  });

  it("does not recreate or reuse the client after shutdown", async () => {
    readFileSyncMock.mockReturnValue(
      JSON.stringify({ distinctId: "persisted-id" }),
    );

    const { flush, capture } = await importTelemetry();

    capture("first");

    expect(postHogConstructorMock).toHaveBeenCalledTimes(1);
    expect(captureMock).toHaveBeenCalledTimes(1);

    await flush();

    expect(shutdownMock).toHaveBeenCalledTimes(1);

    capture("second");

    expect(postHogConstructorMock).toHaveBeenCalledTimes(1);
    expect(captureMock).toHaveBeenCalledTimes(1);
  });
});
