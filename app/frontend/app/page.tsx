// Home.tsx - Main page with WebSocket logic
"use client";
import EditorPage from "@/components/editor";
import { useEffect, useRef, useState } from "react";
import Toolbar from "@/components/toolbar";
import BottomToolbar from "@/components/bottomtoolbar";
import XTermTerminal from "@/components/terminal";
import { message } from "./types/message";
const USER_ID = Math.random().toString(36).substring(7);

export default function Home() {
  const wsRef = useRef<WebSocket | null>(null);
  const [sessionCode, setSessionCode] = useState<string>();
  const [line, setLine] = useState<number>(1);
  const [column, setColumn] = useState<number>(1);
  const [data, setData] = useState<message>({ column: 1, line: 1, text: "" });
  const [text, setText] = useState<string>("");
  const [cursorPosition, setCursorPosition] = useState<number>(1);
  const [cursorLine, setCursorLine] = useState<number>(1);
  const [sharedCursorLine, setSharedCursorLine] = useState<number>(1);
  const [sharedCursorPosition, setSharedCursorPosition] = useState<number>(1);
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

        ws.onopen = () => {
          console.log("WebSocket connected");
        };

        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          console.log("Received:", data);

          if (data.userId === USER_ID) {
            return;
          }

          const action = data.action;

          if (action === "cursor") {
            setSharedCursorLine(data.cursorLine);
            setSharedCursorPosition(data.cursorPosition);
          } else if (action === "edit") {
            const Message: message = {
              column: data.column,
              line: data.line,
              text: data.text,
            };
            setData(Message);
          }
        };

        ws.onclose = () => {
          console.log("WebSocket disconnected, reconnecting...");
          setTimeout(connectToWebsocket, 3000);
        };

        ws.onerror = (error) => {
          console.error("WebSocket error:", error);
        };
      } catch (error) {
        console.log("Couldn't connect to websocket", error);
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
          userId: USER_ID,
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
          userId: USER_ID,

          code: "123456",
        })
      );
      setSessionCode("123456");
    }
  };

  useEffect(() => {
    if (!text || !sessionCode) return;

    const sendMessage = () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            action: "edit",
            code: sessionCode,
            line: line,
            column: column,
            userId: USER_ID,

            text: text,
          })
        );
      }
    };
    sendMessage();
  }, [text, line, column, sessionCode]);

  useEffect(() => {
    if (!sessionCode) return;

    const sendCursorUpdate = () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            action: "cursor",
            code: sessionCode,
            userId: USER_ID,

            cursorLine: cursorLine,
            cursorPosition: cursorPosition,
          })
        );
      }
    };
    sendCursorUpdate();
  }, [cursorLine, cursorPosition, sessionCode]);

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
            setPosition={setColumn}
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
