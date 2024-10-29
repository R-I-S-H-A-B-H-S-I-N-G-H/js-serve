import React from "react";
import { CodeiumEditor } from "@codeium/react-code-editor";

export default function CodeEditor({ value, language, onChange }: any) {
	return <CodeiumEditor onChange={onChange} width={"100%"} height={"100%"} value={value} language={language} />;
}
