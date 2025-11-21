"use client";

import React, { useEffect, useRef, useState } from "react";
import { Terminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";

export default function XTermTerminal() {
  const containerRef = useRef(null);
  const termRef = useRef<Terminal | null>(null);
  const wsRef = useRef<WebSocket | null>(null)
  const [terminalData, setTerminalData] = useState<string>("");
  const [terminalDataLocal, setTerminalDataLocal] = useState<string>("");
  useEffect(()=>{
    const ws = new WebSocket("ws://localhost:8090");
        wsRef.current = ws;
            ws.onmessage = (event) => {
              const data = event.data
              setTerminalData(JSON.parse(data)) 
    }
  },[])


  useEffect(()=>{
    if(wsRef.current?.readyState == WebSocket.OPEN){
      wsRef.current.send(JSON.stringify({
        terminalDataLocal
      }))
    }
  },[terminalData])
  useEffect(() => {
    if (!containerRef.current) return;

    const term = new Terminal({ convertEol: true, cursorBlink: true });
    term.open(containerRef.current);
    termRef.current = term;

    term.write("$ ");

    term.onData((data) => {
      term.write(data);
    });

    return () => {
      try {
        term.dispose();
      } catch {}
      termRef.current = null;
    };
  }, []);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <div ref={containerRef} style={{ height: "100%", width: "100%" }} />
    </div>
  );
}
