import { Editor } from "@monaco-editor/react";
import { useEffect, useRef, useState } from "react";
import { LanguageListMap } from "../../Utils/LanguageMap";

const CodeEditor = (props) => {
	const { onChange, defaultLanguage, defaultValue = "//Enter file name with extension", value } = props;
	const [language, setLanguage] = useState(defaultLanguage?.toLowerCase());

	// Handle language change
	useEffect(() => {
		if (defaultLanguage) {
			setLanguage(defaultLanguage?.toLowerCase());
		}
	}, [defaultLanguage]);

	return <Editor theme="vs-dark" onChange={onChange} language={language} defaultValue={defaultValue} value={value} />;
};

export default CodeEditor;
