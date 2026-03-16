import { Separator } from "@/components/ui/separator";

export default function CheckLoading() {
  return (
    <div className="container max-w-4xl flex-1 flex flex-col w-full py-12 px-4 mx-auto animate-pulse">
      <div className="mb-8">
        <div className="h-9 w-64 bg-fd-muted rounded mb-2" />
        <div className="h-5 w-2/3 bg-fd-muted rounded mb-4" />
        <div className="flex gap-2">
          <div className="h-6 w-24 bg-fd-muted rounded-full" />
          <div className="h-6 w-16 bg-fd-muted rounded-full" />
          <div className="h-6 w-28 bg-fd-muted rounded-full" />
        </div>
      </div>
      <Separator className="mb-8" />
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="text-center p-4 rounded-lg border">
            <div className="h-9 w-8 bg-fd-muted rounded mx-auto mb-2" />
            <div className="h-4 w-20 bg-fd-muted rounded mx-auto" />
          </div>
        ))}
      </div>
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-16 bg-fd-muted rounded-lg mb-3" />
      ))}
    </div>
  );
}
