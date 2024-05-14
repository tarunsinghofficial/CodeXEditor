import React, { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { initSocket } from "../socket";
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

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;

    editor.onDidChangeModelContent(() => {
      const code = editor.getValue();
      onCodeChange(code);
      console.log("Working", code);
      socketRef.current.emit(ACTIONS.CODE_CHANGE, { roomId, code });
    });
  }

  useEffect(() => {
    const socket = socketRef.current;
    if (socket) {
      socket.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        console.log("recccc", code);
        if (code !== null && code !== editorRef.current.getValue()) {
          editorRef.current.setValue(code);
        }
      });

      return () => {
        socket.off(ACTIONS.CODE_CHANGE);
      };
    }
  }, [socketRef.current]);

  const handleEditorChange = (value) => {
    setValue(value);
    onChange("code", value);
    console.log("value", value);
  };

  return (
    <div className="overflow-hidden w-full h-full shadow-4xl">
      <Editor
        height="93vh"
        width={`100%`}
        language={language || "javascript"}
        value={value}
        theme={theme}
        defaultValue="// start your code in real-time"
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
      />
    </div>
  );
};
export default CodeEditorWindow;
