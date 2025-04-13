import { useEffect, useState } from "react";
import "./App.css";
import FileTree from "./components/fileTree";
import { addEnterToFs, fileSystemObj, getFS } from "./store/fileStore";

function App() {
	const [fileSystem, setFileSystem] = useState(getFS());
	useEffect(() => {
		fileSystemObj.subscribe(setFileSystem);

		setTimeout(() => {
			addEnterToFs("/test");
			addEnterToFs("/test/test2");
			addEnterToFs("/test/test2/test.js", false);
			addEnterToFs("/test4");
		}, 100);
	}, []);

	return (
		<div>
			<FileTree items={fileSystem} />
			{/* <CodeEditor language="json" value="" onChange={(v) => {}} /> */}
		</div>
	);
}

export default App;
