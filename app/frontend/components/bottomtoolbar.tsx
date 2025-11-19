import { Button } from "./ui/button";

type BottomToolbarprops = {
  joinSession(): void;
  createSession(): void;
};

export default function BottomToolbar({
  joinSession,
  createSession,
}: BottomToolbarprops) {
  return (
    <div className="w-full h-8 bg-[#252526] border-t border-[#3e3e42] flex items-center justify-end px-2 gap-4">
      <Button
        className="bg-zinc-900 text-white"
        onClick={() => {
          joinSession();
        }}
      >
        Join Session
      </Button>

      <Button
        className="bg-zinc-900 text-white"
        onClick={() => {
          createSession();
        }}
      >
        Create Session
      </Button>
    </div>
  );
}
