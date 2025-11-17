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

declare global {
  interface Window {
    electronAPI?: {
      minimizeWindow: () => void;
      maximizeWindow: () => void;
      closeWindow: () => void;
    };
  }
}
export default function Toolbar() {
  return (
    <div
      className="bg-[#1e1e1e] border-b border-[#3e3e42] "
      style={{ WebkitAppRegion: "drag" }}
    >
      <div className="flex items-center h-10 px-0">
        <TrafficCone className="text-emerald-300 ml-3 mr-2" size={20} />
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
            <DropdownMenuItem className="text-[#d4d4d4] focus:bg-[#004c97] text-xs py-1">
              Open File
              <span className="ml-auto text-[#858585] text-xs">Ctrl+O</span>
            </DropdownMenuItem>
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
              Selection
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="bg-[#3c3c3c] border-[#3e3e42]"
          >
            <DropdownMenuLabel className="text-[#d4d4d4]">
              Selection
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#3e3e42]" />
            <DropdownMenuItem className="text-[#d4d4d4] focus:bg-[#004c97] text-xs py-1">
              Select All
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="px-3 h-10 text-xs text-[#d4d4d4] hover:bg-[#3e3e42] transition-colors flex items-center"
              style={{ WebkitAppRegion: "no-drag" }}
            >
              View
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="bg-[#3c3c3c] border-[#3e3e42]"
          >
            <DropdownMenuLabel className="text-[#d4d4d4]">
              View
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#3e3e42]" />
            <DropdownMenuItem className="text-[#d4d4d4] focus:bg-[#004c97] text-xs py-1">
              Explorer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="px-3 h-10 text-xs text-[#d4d4d4] hover:bg-[#3e3e42] transition-colors flex items-center"
              style={{ WebkitAppRegion: "no-drag" }}
            >
              Go
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="bg-[#3c3c3c] border-[#3e3e42]"
          >
            <DropdownMenuLabel className="text-[#d4d4d4]">Go</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#3e3e42]" />
            <DropdownMenuItem className="text-[#d4d4d4] focus:bg-[#004c97] text-xs py-1">
              Go to Line
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="px-3 h-10 text-xs text-[#d4d4d4] hover:bg-[#3e3e42] transition-colors flex items-center"
              style={{ WebkitAppRegion: "no-drag" }}
            >
              Run
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="bg-[#3c3c3c] border-[#3e3e42]"
          >
            <DropdownMenuLabel className="text-[#d4d4d4]">
              Run
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#3e3e42]" />
            <DropdownMenuItem className="text-[#d4d4d4] focus:bg-[#004c97] text-xs py-1">
              Start Debugging
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
              Help
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="bg-[#3c3c3c] border-[#3e3e42]"
          >
            <DropdownMenuLabel className="text-[#d4d4d4]">
              Help
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#3e3e42]" />
            <DropdownMenuItem className="text-[#d4d4d4] focus:bg-[#004c97] text-xs py-1">
              About
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
