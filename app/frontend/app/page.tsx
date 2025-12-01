// Home.tsx - Main page with WebSocket logic
"use client";
import EditorPage from "@/components/editor";
import { useEffect, useRef, useState } from "react";
import Toolbar from "@/components/toolbar";
import { message } from "./types/message";

const USER_ID = Math.random().toString(36).substring(7);

export default function Home() {
  const wsRef = useRef<WebSocket | null>(null);
  const [sessionCode, setSessionCode] = useState<string>();
  const [data, setData] = useState<message>({ column: 1, line: 1, text: "" });
  const [cursorPosition, setCursorPosition] = useState<number>(1);
  const [cursorLine, setCursorLine] = useState<number>(1);
  const [sharedCursorLine, setSharedCursorLine] = useState<number>(1);
  const [sharedCursorPosition, setSharedCursorPosition] = useState<number>(1);

  const [selectionStartLine, setSelectionStartLine] = useState<number>(1);
  const [selectionStartColumn, setSelectionStartColumn] = useState<number>(1);
  const [selectionEndLine, setSelectionEndLine] = useState<number>(1);
  const [selectionEndColumn, setSelectionEndColumn] = useState<number>(1);

  const [sharedSelectionStartLine, setSharedSelectionStartLine] = useState<number>(1);
  const [sharedSelectionStartColumn, setSharedSelectionStartColumn] = useState<number>(1);
  const [sharedSelectionEndLine, setSharedSelectionEndLine] = useState<number>(1);
  const [sharedSelectionEndColumn, setSharedSelectionEndColumn] = useState<number>(1);

  const [fileContent, setFileContent] = useState<string>("");
  const [code, setCode] = useState<string>(`function greet(name) {
    return "Hello " + name + "!";
  }
  
  console.log(greet("ChatGPT"));`);

  const codeRef = useRef(code);
  const sessionCodeRef = useRef(sessionCode);

  useEffect(() => {
    codeRef.current = code;
  }, [code]);

  useEffect(() => {
    sessionCodeRef.current = sessionCode;
  }, [sessionCode]);

  useEffect(() => {
    const connectToWebsocket = () => {
      try {
        const ws = new WebSocket("ws://localhost:8080");
        wsRef.current = ws;

        let pingInterval: NodeJS.Timeout;

        ws.onopen = () => {
          console.log("WebSocket connected");
          pingInterval = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ action: "ping" }));
            }
          }, 10000);
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
          } else if (action === "selection") {
            setSharedSelectionStartLine(data.startLine);
            setSharedSelectionStartColumn(data.startColumn);
            setSharedSelectionEndLine(data.endLine);
            setSharedSelectionEndColumn(data.endColumn);
          } else if (action === "edit") {
            const Message: message = {
              column: data.column,
              line: data.line,
              endColumn: data.endColumn,
              endLine: data.endLine,
              text: data.text,
            };
            setData(Message);
          } else if (action === "request_sync") {
            if (wsRef.current?.readyState === WebSocket.OPEN) {
              wsRef.current.send(JSON.stringify({
                action: "sync_file",
                code: sessionCodeRef.current,
                userId: USER_ID,
                targetId: data.targetId,
                text: codeRef.current
              }));
            }
          } else if (action === "sync_file") {
            // Only sync if the message is targeted to us, or if it's a legacy broadcast (no targetId)
            if (!data.targetId || data.targetId === USER_ID) {
              setFileContent(data.text);
            }
          }
        };

        // try reconnecting after 3 seconds
        ws.onclose = () => {
          clearInterval(pingInterval);
          setTimeout(connectToWebsocket, 3000);
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

  const createSession = (code: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          action: "create",
          userId: USER_ID,
          code: code,
        })
      );
      setSessionCode(code);
    }
  };

  const joinSession = (code: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          action: "join",
          userId: USER_ID,
          code: code,
        })
      );
      setSessionCode(code);
    }
  };

  const handleEdit = (line: number, column: number, endLine: number, endColumn: number, text: string) => {
    if (!sessionCodeRef.current) return;

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          action: "edit",
          code: sessionCodeRef.current,
          line: line,
          column: column,
          endLine: endLine,
          endColumn: endColumn,
          userId: USER_ID,
          text: text,
        })
      );
    }
  };

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
  }, [cursorLine, cursorPosition]);

  useEffect(() => {
    if (!sessionCode) return;

    const sendSelectionUpdate = () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            action: "selection",
            code: sessionCode,
            userId: USER_ID,
            startLine: selectionStartLine,
            startColumn: selectionStartColumn,
            endLine: selectionEndLine,
            endColumn: selectionEndColumn,
          })
        );
      }
    };
    sendSelectionUpdate();
  }, [selectionStartLine, selectionStartColumn, selectionEndLine, selectionEndColumn]);

  useEffect(() => {
    setCode(fileContent);
  }, [fileContent]);

  return (
    <div className="w-[100vw] h-[100vh] overflow-hidden flex flex-col">
      <Toolbar
        createSession={createSession}
        joinSession={joinSession}
        setFileContent={setFileContent}
        fileContent={code}
        sessionCode={sessionCode}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className={`${"h-full"} overflow-hidden`}>
          <EditorPage
            sharedCursorLine={sharedCursorLine}
            sharedCursorPosition={sharedCursorPosition}
            setCursorLine={setCursorLine}
            setCursorPosition={setCursorPosition}

            setSelectionStartLine={setSelectionStartLine}
            setSelectionStartColumn={setSelectionStartColumn}
            setSelectionEndLine={setSelectionEndLine}
            setSelectionEndColumn={setSelectionEndColumn}

            sharedSelectionStartLine={sharedSelectionStartLine}
            sharedSelectionStartColumn={sharedSelectionStartColumn}
            sharedSelectionEndLine={sharedSelectionEndLine}
            sharedSelectionEndColumn={sharedSelectionEndColumn}

            onEdit={handleEdit}
            code={code}
            setCode={setCode}
            data={data}
          />
        </div>
      </div>
    </div>
  );
}
