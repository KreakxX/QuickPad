"use client";

import EditorPage from "@/components/editor";
import { useEffect, useRef, useState } from "react";
import Toolbar from "@/components/toolbar";
import { message } from "./types/message";
export default function Home() {
  const wsRef = useRef<WebSocket | null>(null);
  const [sessionCode, setSessionCode] = useState<string>();
  const [line, setLine] = useState<number>(0);
  const [position, setPosition] = useState<number>(0);
  const [data, setData] = useState<message>({ column: 0, line: 0, text: "T" });
  const [text, setText] = useState<string>("");
  const [code, setCode] = useState<string>(`function greet(name) {
    return "Hello " + name + "!";
  }
  
  console.log(greet("ChatGPT"));`);

  useEffect(() => {
    const connectToWebsocket = () => {
      try {
        const ws = new WebSocket("ws://localhost:8080");
        wsRef.current = ws;

        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);

          const Message: message = {
            column: data.column,
            line: data.line,
            text: data.text,
          };
          setData(Message);
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
  }, [code]);

  return (
    <div className="w-[100vw] h-[100vh]">
      <Toolbar></Toolbar>
      <EditorPage
        setLine={setLine}
        setPosition={setPosition}
        code={code}
        setCode={setCode}
        data={data}
        setText={setText}
      ></EditorPage>
    </div>
  );
}
