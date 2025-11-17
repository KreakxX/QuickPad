import { message } from "@/app/types/message";
import dynamic from "next/dynamic";
import { useEffect, useReducer, useRef, useState } from "react";
import * as monaco from "monaco-editor";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

type EditorProps = {
  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>;
  setPosition: React.Dispatch<React.SetStateAction<number>>;
  setLine: React.Dispatch<React.SetStateAction<number>>;
  data: message;
  setText: React.Dispatch<React.SetStateAction<string>>;
};
export default function EditorPage({
  code,
  setCode,
  setPosition,
  setLine,
  data,
  setText,
}: EditorProps) {
  const handleMount = (editor: any, monaco: any) => {
    // Cursor Listener
    editorRef.current = editor;
    editor.onDidChangeCursorPosition((e: any) => {
      const pos = editor.getPosition();
      setPosition(pos.column);
      setLine(pos.line);
    });
  };

  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const prevCodeRef = useRef("");

  useEffect(() => {
    const insertCode = () => {
      if (!editorRef.current) return;

      const editor = editorRef.current;
      const column = data.column;
      const text = data.text;
      const range = new monaco.Range(data.line, column, data.line, column);

      editor.executeEdits("", [
        {
          range,
          text,
          forceMoveMarkers: true,
        },
      ]);
      editor.setPosition({
        lineNumber: data.line,
        column: column + text.length,
      });

      editor.focus();
    };
    insertCode();
  }, [data]);

  const handleChange = (v: string) => {
    const newValue = v || "";
    const oldValue = prevCodeRef.current;

    const added = newValue.replace(oldValue, "");

    prevCodeRef.current = newValue;
    setText(added);
  };

  return (
    <main className="h-[100vh] w-[100vw] bg-zinc-950">
      <MonacoEditor
        onMount={handleMount}
        height="100%"
        defaultLanguage="javascript"
        theme="vs-dark"
        value={code}
        onChange={(v) => handleChange}
        options={{ minimap: { enabled: true }, automaticLayout: true }}
      />
    </main>
  );
}
