"use client";
import EditorPage from "@/components/editor";
import { useEffect, useRef, useState } from "react";
import Toolbar from "@/components/toolbar";
import BottomToolbar from "@/components/bottomtoolbar";
import XTermTerminal from "@/components/terminal";
import { message } from "./types/message";

export default function Home() {
  const wsRef = useRef<WebSocket | null>(null);
  const [sessionCode, setSessionCode] = useState<string>();
  const [line, setLine] = useState<number>(0);
  const [position, setPosition] = useState<number>(0);
  const [data, setData] = useState<message>({ column: 0, line: 0, text: "T" });
  const [text, setText] = useState<string>("");
  const [cursorPosition, setCursorPosition] = useState<number>(0);
  const [cursorLine, setCursorLine] = useState<number>(0);
  const [sharedCursorLine, setSharedCursorLine] = useState<number>(0);
  const [sharedCursorPosition, setSharedCursorPosition] = useState<number>(0);
  const [code, setCode] = useState<string>(`function greet(name) {
    return "Hello " + name + "!";
  }
  
  console.log(greet("ChatGPT"));`);

  const [isTerminalVisible, setIsTerminalVisible] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && (e.key === "ö" || e.key === "Ö")) {
        e.preventDefault();
        setIsTerminalVisible((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const connectToWebsocket = () => {
      try {
        const ws = new WebSocket("ws://localhost:8080");
        wsRef.current = ws;
        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          console.log(data);
          const action = data.action;
          if (action == "cursor") {
            setSharedCursorLine(data.cursorLine);
            setSharedCursorPosition(data.cursorPosition);
          } else {
            const Message: message = {
              column: data.column,
              line: data.line,
              text: data.text,
            };
            setData(Message);
          }
        };
        ws.onclose = () => {
          setTimeout(connectToWebsocket, 3000);
        };
      } catch (error) {
        console.log("couldnt connect to websocket", error);
      }
    };
    connectToWebsocket();
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const createSession = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          action: "create",
          code: "123456",
        })
      );
      setSessionCode("123456");
    }
  };

  const joinSession = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          action: "join",
          code: "123456",
        })
      );
      setSessionCode("123456");
    }
  };

  useEffect(() => {
    const sendMessage = () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            code: sessionCode,
            line: line,
            position: position,
            text: text,
          })
        );
      }
    };
    sendMessage();
  }, [text]);

  useEffect(() => {
    const sendCursorUpdate = () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            action: "cursor",
            code: sessionCode,
            cursorLine: cursorLine,
            cursorPosition: cursorPosition,
          })
        );
      }
    };
    sendCursorUpdate();
  }, [cursorLine]);

  return (
    <div className="w-[100vw] h-[100vh] overflow-hidden flex flex-col">
      <Toolbar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div
          className={`${
            isTerminalVisible ? "flex-1" : "h-full"
          } overflow-hidden`}
        >
          <EditorPage
            sharedCursorLine={sharedCursorLine}
            sharedCursorPosition={sharedCursorPosition}
            setCursorLine={setCursorLine}
            setCursorPosition={setCursorPosition}
            setLine={setLine}
            setPosition={setPosition}
            code={code}
            setCode={setCode}
            data={data}
            setText={setText}
          />
        </div>

        {isTerminalVisible && (
          <div className="h-[300px] border-t border-gray-700 bg-black">
            <XTermTerminal />
          </div>
        )}
      </div>

      <BottomToolbar createSession={createSession} joinSession={joinSession} />
    </div>
  );
}
