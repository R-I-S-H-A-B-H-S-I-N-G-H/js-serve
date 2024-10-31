import React from "react";
import { CodeiumEditor } from "@codeium/react-code-editor";

export default function CodeEditor({ value, language, onChange, theme: _theme }: { value: string; language: string; onChange: any; theme: string }) {
	const theme = _theme.includes("dark") ? "vs-dark" : _theme;
	return <CodeiumEditor onChange={onChange} theme={theme} width={"100%"} height={"100%"} value={value} language={language} />;
}
