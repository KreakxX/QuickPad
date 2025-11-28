// editor.tsx - Fixed editor component
import { message } from "@/app/types/message";
import { editor } from "monaco-editor";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});
import { shikiToMonaco } from "@shikijs/monaco";
import { createHighlighter } from "shiki";

type EditorProps = {
  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>;
  setCursorPosition: React.Dispatch<React.SetStateAction<number>>;
  setCursorLine: React.Dispatch<React.SetStateAction<number>>;

  setSelectionStartLine: React.Dispatch<React.SetStateAction<number>>;
  setSelectionStartColumn: React.Dispatch<React.SetStateAction<number>>;
  setSelectionEndLine: React.Dispatch<React.SetStateAction<number>>;
  setSelectionEndColumn: React.Dispatch<React.SetStateAction<number>>;

  sharedSelectionStartLine: number;
  sharedSelectionStartColumn: number;
  sharedSelectionEndLine: number;
  sharedSelectionEndColumn: number;

  onEdit: (line: number, column: number, endLine: number, endColumn: number, text: string) => void;
  data: message;
  sharedCursorPosition: number;
  sharedCursorLine: number;
};

export default function EditorPage({
  code,
  setCode,
  onEdit,
  data,
  setCursorLine,
  setCursorPosition,
  setSelectionStartLine,
  setSelectionStartColumn,
  setSelectionEndLine,
  setSelectionEndColumn,
  sharedSelectionStartLine,
  sharedSelectionStartColumn,
  sharedSelectionEndLine,
  sharedSelectionEndColumn,
  sharedCursorLine,
  sharedCursorPosition,
}: EditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<any>(null);
  const applyingRemoteRef = useRef(false);
  const decorationsRef = useRef<string[]>([]);

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

    editor.onDidChangeCursorSelection((e: any) => {
      const selection = e.selection;
      if (selection) {
        setSelectionStartLine(selection.startLineNumber);
        setSelectionStartColumn(selection.startColumn);
        setSelectionEndLine(selection.endLineNumber);
        setSelectionEndColumn(selection.endColumn);
      }
    });

    editor.onDidChangeModelContent((e: any) => {
      if (applyingRemoteRef.current) return;

      const model = editor.getModel();
      if (!model) return;

      for (const change of e.changes) {
        const { range, text } = change;
        onEdit(range.startLineNumber, range.startColumn, range.endLineNumber, range.endColumn, text);
      }
    });
  };

  useEffect(() => {
    if (!editorRef.current || !monacoRef.current) return;

    const editor = editorRef.current;
    const monaco = monacoRef.current;

    const newDecorations: editor.IModelDeltaDecoration[] = [];

    if (sharedCursorLine > 0 && sharedCursorPosition > 0) {
      newDecorations.push({
        range: new monaco.Range(
          sharedCursorLine,
          sharedCursorPosition,
          sharedCursorLine,
          sharedCursorPosition
        ),
        options: {
          className: "remote-cursor",
          hoverMessage: { value: "Remote User" },
        },
      });
    }

    if (
      sharedSelectionStartLine > 0 &&
      sharedSelectionStartColumn > 0 &&
      sharedSelectionEndLine > 0 &&
      sharedSelectionEndColumn > 0
    ) {
      newDecorations.push({
        range: new monaco.Range(
          sharedSelectionStartLine,
          sharedSelectionStartColumn,
          sharedSelectionEndLine,
          sharedSelectionEndColumn
        ),
        options: {
          className: "remote-selection",
        },
      });
    }

    decorationsRef.current = editor.deltaDecorations(
      decorationsRef.current,
      newDecorations
    );

  }, [
    sharedCursorLine,
    sharedCursorPosition,
    sharedSelectionStartLine,
    sharedSelectionStartColumn,
    sharedSelectionEndLine,
    sharedSelectionEndColumn
  ]);

  useEffect(() => {
    if (!editorRef.current || !monacoRef.current) return;
    if (data.text === undefined) return;

    const editor = editorRef.current;
    const model = editor.getModel();
    if (!model) return;

    applyingRemoteRef.current = true;

    try {
      const endLine = data.endLine ?? data.line;
      const endColumn = data.endColumn ?? data.column;

      const range = new monacoRef.current.Range(
        data.line,
        data.column,
        endLine,
        endColumn
      );

      editor.executeEdits("remote", [
        {
          range,
          text: data.text,
          forceMoveMarkers: true,
        },
      ]);

      setCode(model.getValue());
    } finally {
      setTimeout(() => {
        applyingRemoteRef.current = false;
      }, 0);
    }
  }, [data]);

  return (
    <main className="h-[100vh] w-[100vw] bg-zinc-950">
      <style jsx global>{`
        .remote-cursor {
          background-color: #ff0000;
          width: 2px !important;
          height: 100% !important;
        }
        .remote-selection {
          background-color: rgba(255, 0, 0, 0.3);
        }
      `}</style>
      <MonacoEditor
        onMount={handleMount}
        height="100%"
        defaultLanguage="typescript"
        value={code}
        theme="vs-dark"
        options={{
          lineDecorationsWidth: 8,
          lineNumbersMinChars: 3,
          glyphMargin: false,
          folding: false,
          renderFinalNewline: "on",
          minimap: { enabled: true },
          automaticLayout: true,
          wordWrap: "on",
          formatOnType: true,
          formatOnPaste: true,
          suggest: { showKeywords: false, showSnippets: false },
          renderValidationDecorations: "off",
          smoothScrolling: true,
          mouseWheelZoom: true,
          cursorSmoothCaretAnimation: "on",
          cursorBlinking: "smooth",
          roundedSelection: true,
          scrollBeyondLastLine: false,
          scrollBeyondLastColumn: 5,
          renderWhitespace: "selection",
          renderLineHighlight: "line",
          tabSize: 2,
          insertSpaces: true,
          detectIndentation: true,
          bracketPairColorization: { enabled: true },
          guides: { bracketPairs: true },
          autoIndent: "full",
          tabCompletion: "on",
          copyWithSyntaxHighlighting: true,
          links: true, // detect URLs
          colorDecorators: true, // show color previews (#fff)
          codeLens: false, // keep it lightweight
          mouseWheelScrollSensitivity: 1,
        }}
      />
    </main>
  );
}
