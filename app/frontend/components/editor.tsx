"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

export default function EditorPage() {
  const [code, setCode] = useState("Test test");

  return (
    <main className="flex-1 bg-blue-500">
      <MonacoEditor
        height="100%"
        defaultLanguage="javascript"
        theme="vs-dark"
        value={code}
        onChange={(v) => setCode(v || "")}
        options={{ minimap: { enabled: false }, automaticLayout: true }}
      />
    </main>
  );
}
