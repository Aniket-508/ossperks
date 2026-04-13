// eslint-disable prefer-destructuring
import { useEffect, useRef, useState } from "react";

interface State {
  isIntersecting: boolean;
  entry?: IntersectionObserverEntry;
}

interface UseIntersectionObserverOptions {
  root?: Element | Document | null;
  rootMargin?: string;
  threshold?: number | number[];
  freezeOnceVisible?: boolean;
  onChange?: (
    isIntersecting: boolean,
    entry: IntersectionObserverEntry,
  ) => void;
  initialIsIntersecting?: boolean;
}

type IntersectionReturn = [
  (node?: Element | null) => void,
  boolean,
  IntersectionObserverEntry | undefined,
] & {
  ref: (node?: Element | null) => void;
  isIntersecting: boolean;
  entry?: IntersectionObserverEntry;
};

export const useIntersectionObserver = ({
  threshold = 0,
  root = null,
  rootMargin = "0%",
  freezeOnceVisible = false,
  initialIsIntersecting = false,
  onChange,
}: UseIntersectionObserverOptions = {}): IntersectionReturn => {
  const [ref, setRef] = useState<Element | null>(null);

  const [state, setState] = useState<State>(() => ({
    entry: undefined,
    isIntersecting: initialIsIntersecting,
  }));

  const callbackRef = useRef<UseIntersectionObserverOptions["onChange"] | null>(
    null,
  );

  callbackRef.current = onChange;

  const frozen = state.entry?.isIntersecting && freezeOnceVisible;

  useEffect(() => {
    // Ensure we have a ref to observe
    if (!ref) {
      return;
    }

    // Ensure the browser supports the Intersection Observer API
    if (!("IntersectionObserver" in window)) {
      return;
    }

    // Skip if frozen
    if (frozen) {
      return;
    }

    let unobserve: (() => void) | undefined;

    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]): void => {
        const thresholds = Array.isArray(observer.thresholds)
          ? observer.thresholds
          : [observer.thresholds];

        for (const entry of entries) {
          const isIntersecting =
            entry.isIntersecting &&
            thresholds.some((t) => entry.intersectionRatio >= t);

          setState({ entry, isIntersecting });

          if (callbackRef.current) {
            callbackRef.current(isIntersecting, entry);
          }

          if (isIntersecting && freezeOnceVisible && unobserve) {
            unobserve();
            unobserve = undefined;
          }
        }
      },
      { root, rootMargin, threshold },
    );

    observer.observe(ref);

    return () => {
      observer.disconnect();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    ref,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(threshold),
    root,
    rootMargin,
    frozen,
    freezeOnceVisible,
  ]);

  // ensures that if the observed element changes, the intersection observer is reinitialized
  const prevRef = useRef<Element | null>(null);

  useEffect(() => {
    if (
      !ref &&
      state.entry?.target &&
      !freezeOnceVisible &&
      !frozen &&
      prevRef.current !== state.entry.target
    ) {
      prevRef.current = state.entry.target;
      setState({ entry: undefined, isIntersecting: initialIsIntersecting });
    }
  }, [ref, state.entry, freezeOnceVisible, frozen, initialIsIntersecting]);

  const result = [
    setRef,
    !!state.isIntersecting,
    state.entry,
  ] as IntersectionReturn;

  // Support object destructuring, by adding the specific values.
  result.ref = result[0];
  result.isIntersecting = result[1];
  result.entry = result[2];

  return result;
};
