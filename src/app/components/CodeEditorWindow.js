import React, { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import ACTIONS from "../actions";

const CodeEditorWindow = ({
  onChange,
  language,
  code,
  theme,
  socketRef,
  roomId,
  onCodeChange
}) => {
  const [value, setValue] = useState(code || "");
  const editorRef = useRef(null);
  const lastReceivedCode = useRef(code || "");

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    
    editor.getModel()?.updateOptions({
      tabSize: 2,
      insertSpaces: true,
      trimAutoWhitespace: true,
      wordWrap: 'on'
    });
  }

  // Handle local code changes
  const handleEditorChange = (newValue) => {
    setValue(newValue);
    onChange("code", newValue);
    onCodeChange(newValue);
    
    // Emit code changes to other users
    if (socketRef.current) {
      socketRef.current.emit(ACTIONS.CODE_CHANGE, {
        roomId,
        code: newValue,
        version: Date.now() // Add version for conflict resolution
      });
    }
  };

  // Listen for remote code changes
  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code: remoteCode }) => {
        if (remoteCode !== lastReceivedCode.current) {
          lastReceivedCode.current = remoteCode;
          setValue(remoteCode);
          if (editorRef.current) {
            const position = editorRef.current.getPosition();
            editorRef.current.setValue(remoteCode);
            editorRef.current.setPosition(position);
          }
        }
      });

      return () => {
        socketRef.current.off(ACTIONS.CODE_CHANGE);
      };
    }
  }, [socketRef.current]);

  // Sync initial code when joining room
  useEffect(() => {
    if (code !== value) {
      setValue(code);
      lastReceivedCode.current = code;
    }
  }, [code]);

  return (
    <div className="shadow-4xl w-full h-full overflow-hidden">
      <Editor
        height="93vh"
        width={`100%`}
        language={language || "javascript"}
        value={value}
        theme={theme}
        defaultValue="// start your code in real-time"
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          roundedSelection: true,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: true,
          formatOnPaste: true,
          formatOnType: true
        }}
      />
    </div>
  );
};

export default CodeEditorWindow;