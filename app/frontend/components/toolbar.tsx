import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TrafficCone, Minimize2, Maximize2, X } from "lucide-react";
import { useState, useEffect } from "react";

const rainbow_colors = [
  "text-red-400",
  "text-orange-400",
  "text-yellow-400",
  "text-green-400",
  "text-cyan-400",
  "text-blue-400",
  "text-purple-400",
  "text-emerald-300",
];

declare global {
  interface Window {
    electronAPI?: {
      minimizeWindow: () => void;
      maximizeWindow: () => void;
      closeWindow: () => void;
    };
  }
}

type toolbarProps = {
  setFileContent: React.Dispatch<React.SetStateAction<string>>;
  fileContent: string;
  createSession(code: string): void;
  joinSession(code: string): void;
  sessionCode?: string;
};

export default function Toolbar({
  setFileContent,
  fileContent,
  createSession,
  joinSession,
  sessionCode,
}: toolbarProps) {
  const [RainbowIndex, setRainbowIndex] = useState(rainbow_colors.length - 1);
  const [sessionInput, setSessionInput] = useState("");

  useEffect(() => {
    if (sessionCode) {
      setSessionInput(sessionCode);
    }
  }, [sessionCode]);

  const nextRainbowColor = () => {
    setRainbowIndex((i) => (i + 1) % rainbow_colors.length);
  };

  const handleFile = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setFileContent(text);
  };

  const handleSave = () => {
    const blob = new Blob([fileContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "quickpad.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCreateSession = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    createSession(code);
  };

  const handleJoinSession = () => {
    if (sessionInput) {
      joinSession(sessionInput);
    }
  };

  return (
    <div
      className="bg-[#1e1e1e] border-b border-[#3e3e42] "
      style={{ WebkitAppRegion: "drag" } as any}
    >
      <div className="flex items-center h-10 px-0">
        <TrafficCone
          className={rainbow_colors[RainbowIndex] + " ml-3 mr-2"}
          size={20}
          onClick={nextRainbowColor}
          style={{ WebkitAppRegion: "no-drag", cursor: "pointer" } as any}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="px-3 h-10 text-xs text-[#d4d4d4] hover:bg-[#3e3e42] transition-colors flex items-center"
              style={{ WebkitAppRegion: "no-drag" } as any}
            >
              File
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="bg-[#3c3c3c] border-[#3e3e42]"
          >
            <DropdownMenuLabel className="text-[#d4d4d4]">
              File Operations
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#3e3e42]" />
            <DropdownMenuItem
              className="text-[#d4d4d4] focus:bg-[#004c97] text-xs py-1"
              onClick={() => setFileContent("")}
            >
              New File
              <span className="ml-auto text-[#858585] text-xs">Ctrl+N</span>
            </DropdownMenuItem>
            <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-xs outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-[#d4d4d4] hover:bg-[#004c97]">
              Open File
              <input
                onChange={handleFile}
                type="file"
                accept="*"
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <span className="ml-auto text-[#858585] text-xs">Ctrl+O</span>
            </div>
            <DropdownMenuItem
              className="text-[#d4d4d4] focus:bg-[#004c97] text-xs py-1"
              onClick={handleSave}
            >
              Save File
              <span className="ml-auto text-[#858585] text-xs">Ctrl+S</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="px-3 h-10 text-xs text-[#d4d4d4] hover:bg-[#3e3e42] transition-colors flex items-center"
              style={{ WebkitAppRegion: "no-drag" } as any}
            >
              Session
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="bg-[#3c3c3c] border-[#3e3e42] min-w-[200px]"
          >
            <DropdownMenuLabel className="text-[#d4d4d4]">
              Session {sessionCode ? `- ${sessionCode}` : ""}
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#3e3e42]" />
            <DropdownMenuItem
              onClick={handleCreateSession}
              className="text-[#d4d4d4] focus:bg-[#004c97] text-xs py-1"
            >
              Create new Session
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#3e3e42]" />
            <div className="px-2 py-1.5">
              <input
                type="text"
                placeholder="Enter Session Code"
                className="w-full bg-[#2d2d2d] text-[#d4d4d4] text-xs px-2 py-1 rounded border border-[#3e3e42] focus:outline-none focus:border-[#007acc]"
                value={sessionInput}
                onChange={(e) => setSessionInput(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                  e.stopPropagation();
                  if (e.key === 'Enter') handleJoinSession();
                }}
              />
            </div>
            <DropdownMenuItem
              onClick={handleJoinSession}
              className="text-[#d4d4d4] focus:bg-[#004c97] text-xs py-1"
            >
              Join Session
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex-1" />

        <div className="flex items-center space-x-1 mr-2">
          <button
            onClick={() => {
              if (window.electronAPI) {
                window.electronAPI.minimizeWindow();
              }
            }}
            title="Minimize"
            aria-label="Minimize"
            className="p-1 h-8 w-8 flex items-center justify-center text-[#d4d4d4] hover:bg-[#3e3e42] rounded"
            style={{ WebkitAppRegion: "no-drag" } as any}
          >
            <Minimize2 size={16} />
          </button>

          <button
            onClick={() => {
              if (window.electronAPI) {
                window.electronAPI.maximizeWindow();
              }
            }}
            title="Maximize"
            aria-label="Maximize"
            className="p-1 h-8 w-8 flex items-center justify-center text-[#d4d4d4] hover:bg-[#3e3e42] rounded"
            style={{ WebkitAppRegion: "no-drag" } as any}
          >
            <Maximize2 size={16} />
          </button>

          <button
            onClick={() => {
              if (window.electronAPI) {
                window.electronAPI.closeWindow();
              }
            }}
            title="Close"
            aria-label="Close"
            className="p-1 h-8 w-8 flex items-center justify-center text-[#d4d4d4] hover:bg-[#b22222] hover:text-white rounded"
            style={{ WebkitAppRegion: "no-drag" } as any}
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
