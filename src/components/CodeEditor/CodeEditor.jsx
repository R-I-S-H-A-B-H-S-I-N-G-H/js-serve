import { Editor } from "@monaco-editor/react";
import { useEffect, useState } from "react";

const CodeEditor = (props) => {
	const { onChange, defaultLanguage, defaultValue = "//Enter file content", value } = props;
	const [language, setLanguage] = useState(defaultLanguage?.toLowerCase());

	// Handle language change
	useEffect(() => {
		if (defaultLanguage) {
			setLanguage(defaultLanguage?.toLowerCase());
		}
	}, [defaultLanguage]);

	return (
		<Editor
			options={{
				minimap: {
					enabled: false,
				},
			}}
			theme="vs-dark"
			onChange={onChange}
			language={language}
			defaultValue={defaultValue}
			value={value}
		/>
	);
};

export default CodeEditor;
