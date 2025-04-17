// CodeEditor.tsx
import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { markdown } from "@codemirror/lang-markdown";
import { sql } from "@codemirror/lang-sql";
import { json } from "@codemirror/lang-json";

type Props = {
	language: string;
	value: string;
	onChange: (val: string) => void;
};

const languageSupportMap: Record<string, any> = {
	js: javascript(),
	py: python(),
	java: java(),
	html: html(),
	css: css(),
	markdown: markdown(),
	sql: sql(),
	json: json(),
};

function CodeEditor({ language, value, onChange }: Props) {
	const extensions = languageSupportMap[language] ? [languageSupportMap[language]] : [];

	return (
		<CodeMirror
			className="h-full"
			value={value}
			height="100%"
			width="100%"
			theme="dark"
			extensions={extensions}
			onChange={(val) => onChange(val)}
			basicSetup={{
				lineNumbers: true,
				highlightActiveLine: true,
				autocompletion: true,
			}}
		/>
	);
}

export default CodeEditor;
