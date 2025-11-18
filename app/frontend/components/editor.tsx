import { message } from "@/app/types/message";
import { editor } from "monaco-editor";
import dynamic from "next/dynamic";
import { useEffect, useReducer, useRef, useState } from "react";
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});
import { shikiToMonaco } from '@shikijs/monaco';
import { createHighlighter } from 'shiki';
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
  const handleMount = async (editor: any, monaco: any) => {
    // Cursor Listener
    monacoRef.current = monaco;
    editorRef.current = editor;
 const highlighter = await createHighlighter({
      themes: ['vitesse-dark'],
      langs: ['typescript', 'tsx', 'javascript', 'jsx'],
    });
    shikiToMonaco(highlighter, monaco);

    editor.onDidChangeCursorPosition((e: any) => {
      const pos = editor.getPosition();
      setPosition(pos.column);
      setLine(pos.line);
    });
  };

 

  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<any>(null);

  const prevCodeRef = useRef("");

  useEffect(() => {
    const insertCode = () => {
      if (!editorRef.current) return;

      const editor = editorRef.current;
      const monaco = monacoRef.current;
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
        defaultLanguage="typescript"
        value={code}
        theme="vs-dark"
        onChange={(v) => handleChange(v ? v : "No Update")}
        options={{
        minimap: { enabled: true },
        automaticLayout: true,
        wordWrap: "on",
        formatOnType: true,
        formatOnPaste: true,
        autoClosingBrackets: "always",
        autoClosingQuotes: "always",
        suggest: { showKeywords: false, showSnippets: false },
            renderValidationDecorations: "off", // wichtig: keine Fehler anzeigen

      }}
      />
    </main>
  );
}
