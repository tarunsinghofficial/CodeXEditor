import React, { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import ACTIONS from "../actions";
import debounce from 'lodash/debounce';

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
  const isTyping = useRef(false);
  const lastReceivedCode = useRef("");
  
  // Debounced emit function to prevent too frequent updates
  const debouncedEmit = useRef(
    debounce((code) => {
      if (socketRef.current) {
        socketRef.current.emit(ACTIONS.CODE_CHANGE, { roomId, code });
      }
    }, 100)
  ).current;

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    
    // Configure editor options for better performance
    editor.getModel()?.updateOptions({
      tabSize: 2,
      insertSpaces: true,
      trimAutoWhitespace: true,
      wordWrap: 'on'
    });

    // Handle content changes with cursor position preservation
    editor.onDidChangeModelContent((event) => {
      if (!isTyping.current) {
        const code = editor.getValue();
        if (code !== lastReceivedCode.current) {
          onCodeChange(code);
          debouncedEmit(code);
        }
      }
    });
  }

  useEffect(() => {
    const socket = socketRef.current;
    if (socket) {
      socket.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        if (
          code !== null && 
          code !== lastReceivedCode.current && 
          editorRef.current
        ) {
          isTyping.current = true;
          lastReceivedCode.current = code;
          
          // Preserve cursor position
          const position = editorRef.current.getPosition();
          editorRef.current.setValue(code);
          editorRef.current.setPosition(position);
          
          // Update local state
          setValue(code);
          
          // Reset typing flag
          setTimeout(() => {
            isTyping.current = false;
          }, 10);
        }
      });

      return () => {
        socket.off(ACTIONS.CODE_CHANGE);
        debouncedEmit.cancel();
      };
    }
  }, [socketRef.current]);

  const handleEditorChange = (value) => {
    if (!isTyping.current) {
      setValue(value);
      onChange("code", value);
    }
  };

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