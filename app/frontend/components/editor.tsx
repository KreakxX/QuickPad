// editor.tsx - Fixed editor component
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

    const highlighter = await createHighlighter({
      themes: ["vitesse-dark"],
      langs: ["typescript", "tsx", "javascript", "jsx", "python", "java", "go"],
    });
    shikiToMonaco(highlighter, monaco);

    editor.onDidChangeCursorPosition((e: any) => {
      const pos = editor.getPosition();
      if (pos) {
        setCursorPosition(pos.column);
        setCursorLine(pos.lineNumber);
      }
    });

    editor.onDidChangeModelContent((e: any) => {
      if (applyingRemoteRef.current) return;

      const model = editor.getModel();
      if (!model) return;

      for (const ch of e.changes) {
        if (!ch.text && ch.rangeLength > 0) {
          const { range } = ch;

          setLine(range.startLineNumber);
          setPosition(range.startColumn);

          setText("\u200B");
          continue;
        }

        if (ch.text) {
          const offset = ch.rangeOffset;
          const pos = model.getPositionAt(offset);

          setLine(pos.lineNumber);
          setPosition(pos.column);
          setText(ch.text);
        }
      }
    });
  };

  useEffect(() => {
    if (!editorRef.current || !monacoRef.current) return;
    if (!data.text) return;

    const editor = editorRef.current;
    const monaco = monacoRef.current;
    const model = editor.getModel();
    if (!model) return;

    applyingRemoteRef.current = true;

    try {
      const range = new monacoRef.current.Range(
        data.line,
        data.column,
        data.line,
        data.column + 1
      );

      if (data.text == "\u200B") {
        editor.executeEdits("remote", [
          {
            range,
            text: "",
            forceMoveMarkers: true,
          },
        ]);
      } else {
        editor.executeEdits("remote", [
          {
            range,
            text: data.text,
            forceMoveMarkers: true,
          },
        ]);
      }

      setCode(model.getValue());
    } finally {
      setTimeout(() => {
        applyingRemoteRef.current = false;
      }, 0);
    }
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
