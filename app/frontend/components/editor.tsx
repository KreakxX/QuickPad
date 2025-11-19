import { message } from "@/app/types/message";
import { editor } from "monaco-editor";
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});
import { shikiToMonaco } from "@shikijs/monaco";
import { createHighlighter } from "shiki";

type EditorProps = {
  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>;
  setPosition: React.Dispatch<React.SetStateAction<number>>;
  setCursorPosition: React.Dispatch<React.SetStateAction<number>>;
  setCursorLine: React.Dispatch<React.SetStateAction<number>>;
  setLine: React.Dispatch<React.SetStateAction<number>>;
  data: message;
  setText: React.Dispatch<React.SetStateAction<string>>;
  sharedCursorPosition: number;
  sharedCursorLine: number;
};

export default function EditorPage({
  code,
  setCode,
  setPosition,
  setLine,
  sharedCursorPosition,
  sharedCursorLine,
  data,
  setText,
  setCursorLine,
  setCursorPosition,
}: EditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<any>(null);
  const applyingRemoteRef = useRef(false);

  const handleMount = async (editor: any, monaco: any) => {
    monacoRef.current = monaco;
    editorRef.current = editor;

    // Shiki Syntax Highlighting Setup
    const highlighter = await createHighlighter({
      themes: ["vitesse-dark"],
      langs: ["typescript", "tsx", "javascript", "jsx", "python", "java", "go"],
    });
    shikiToMonaco(highlighter, monaco);

    // Cursor Position Listener for shared Cursor
    editor.onDidChangeCursorPosition((e: any) => {
      const pos = editor.getPosition();
      setCursorPosition(pos.column);
      setCursorLine(pos.lineNumber);
    });

    editor.onDidChangeModelContent((event: any) => {
      if (applyingRemoteRef.current) {
        return;
      }

      event.changes.forEach((change: any) => {
        const { range, rangeOffset, rangeLength, text } = change;

        if (text.length > 0) {
          setText(text);
          setPosition(range.startColumn + text.length);
          setLine(range.endLineNumber);
        } else if (rangeLength > 0) {
          setText("");
          setPosition(range.startColumn);
          setLine(range.startLineNumber);
        }
      });

      setCode(editor.getValue());
    });
  };

  useEffect(() => {
    const insertCode = () => {
      if (!editorRef.current || !monacoRef.current) return;

      const editor = editorRef.current;
      const monaco = monacoRef.current;
      const column = data.column;
      const line = data.line;
      const text = data.text;
      const range = new monaco.Range(line, column, line, column);

      applyingRemoteRef.current = true;

      editor.executeEdits("", [
        {
          range,
          text,
          forceMoveMarkers: true,
        },
      ]);

      editor.setPosition({
        lineNumber: line,
        column: column + (text?.length ?? 0),
      });
      editor.focus();

      setTimeout(() => {
        applyingRemoteRef.current = false;
      }, 0);
    };
    insertCode();
  }, [data]);

  return (
    <main className="h-[100vh] w-[100vw] bg-zinc-950">
      <MonacoEditor
        onMount={handleMount}
        height="100%"
        defaultLanguage="javascript"
        value={code}
        theme="vs-dark"
        options={{
          minimap: { enabled: true },
          automaticLayout: true,
          wordWrap: "on",
          formatOnType: true,
          formatOnPaste: true,
          autoClosingBrackets: "always",
          autoClosingQuotes: "always",
          suggest: { showKeywords: false, showSnippets: false },
          renderValidationDecorations: "off",
        }}
      />
    </main>
  );
}
