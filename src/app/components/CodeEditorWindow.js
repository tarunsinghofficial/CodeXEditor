import React, { useState } from "react";
import Editor from "@monaco-editor/react";

const CodeEditorWindow = ({ onChange, language, code, theme }) => {
  const [value, setValue] = useState(code || "");

  const handleEditorChange = (value) => {
    setValue(value);
    onChange("code", value);
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
      />
    </div>
  );
};
export default CodeEditorWindow;