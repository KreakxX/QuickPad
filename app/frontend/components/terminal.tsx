"use client";

import React, { useEffect, useRef } from "react";
import { Terminal } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";

export default function XTermTerminal() {
  const containerRef = useRef(null);
  const termRef = useRef<Terminal | null>(null);

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
