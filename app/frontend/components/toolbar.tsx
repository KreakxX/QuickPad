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
import { useState } from "react";

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
  setFileName: React.Dispatch<React.SetStateAction<string>>;
  setFileContent: React.Dispatch<React.SetStateAction<string>>;
  createSession(): void;
  joinSession(): void;
};

export default function Toolbar({
  setFileName,
  setFileContent,
  createSession,
  joinSession,
}: toolbarProps) {
  const [RainbowIndex, setRainbowIndex] = useState(rainbow_colors.length - 1);

  const nextRainbowColor = () => {
    setRainbowIndex((i) => (i + 1) % rainbow_colors.length);
  };

  const handleFile = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const fileName = file.name;
    setFileContent(text);

    setFileName(fileName);

    console.log(text + "LORD Gay Kanne");
  };
  return (
    <div
      className="bg-[#1e1e1e] border-b border-[#3e3e42] "
      style={{ WebkitAppRegion: "drag" }}
    >
      <div className="flex items-center h-10 px-0">
        <TrafficCone
          className={rainbow_colors[RainbowIndex] + " ml-3 mr-2"}
          size={20}
          onClick={nextRainbowColor}
          style={{ WebkitAppRegion: "no-drag", cursor: "pointer" }}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="px-3 h-10 text-xs text-[#d4d4d4] hover:bg-[#3e3e42] transition-colors flex items-center"
              style={{ WebkitAppRegion: "no-drag" }}
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
            <DropdownMenuItem className="text-[#d4d4d4] focus:bg-[#004c97] text-xs py-1">
              New File
              <span className="ml-auto text-[#858585] text-xs">Ctrl+N</span>
            </DropdownMenuItem>
            <input onChange={handleFile} type="file" accept="*"></input>
            <span className="ml-auto text-[#858585] text-xs">Ctrl+O</span>
            <DropdownMenuItem className="text-[#d4d4d4] focus:bg-[#004c97] text-xs py-1">
              Save File
              <span className="ml-auto text-[#858585] text-xs">Ctrl+S</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="px-3 h-10 text-xs text-[#d4d4d4] hover:bg-[#3e3e42] transition-colors flex items-center"
              style={{ WebkitAppRegion: "no-drag" }}
            >
              Edit
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="bg-[#3c3c3c] border-[#3e3e42]"
          >
            <DropdownMenuLabel className="text-[#d4d4d4]">
              Edit
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#3e3e42]" />
            <DropdownMenuItem className="text-[#d4d4d4] focus:bg-[#004c97] text-xs py-1">
              Undo
              <span className="ml-auto text-[#858585] text-xs">Ctrl+Z</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[#d4d4d4] focus:bg-[#004c97] text-xs py-1">
              Redo
              <span className="ml-auto text-[#858585] text-xs">Ctrl+Y</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="px-3 h-10 text-xs text-[#d4d4d4] hover:bg-[#3e3e42] transition-colors flex items-center"
              style={{ WebkitAppRegion: "no-drag" }}
            >
              Terminal
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="bg-[#3c3c3c] border-[#3e3e42]"
          >
            <DropdownMenuLabel className="text-[#d4d4d4]">
              Terminal
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#3e3e42]" />
            <DropdownMenuItem className="text-[#d4d4d4] focus:bg-[#004c97] text-xs py-1">
              New Terminal
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="px-3 h-10 text-xs text-[#d4d4d4] hover:bg-[#3e3e42] transition-colors flex items-center"
              style={{ WebkitAppRegion: "no-drag" }}
            >
              Session
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="bg-[#3c3c3c] border-[#3e3e42]"
          >
            <DropdownMenuLabel className="text-[#d4d4d4]">
              Session
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#3e3e42]" />
            <DropdownMenuItem
              onClick={() => {
                createSession();
              }}
              className="text-[#d4d4d4] focus:bg-[#004c97] text-xs py-1"
            >
              Create new Session
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#3e3e42]" />
            <DropdownMenuItem
              onClick={() => {
                joinSession();
              }}
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
            style={{ WebkitAppRegion: "no-drag" }}
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
            style={{ WebkitAppRegion: "no-drag" }}
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
            style={{ WebkitAppRegion: "no-drag" }}
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
