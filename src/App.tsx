import { useEffect, useState } from "react";
import "./App.css";
import FileTree from "./components/fileTree";
import { addEntryToFs, copyFsEntry, fileSystemObj, getFS, renameFsEntry } from "./store/fileStore";

function App() {
	const [fileSystem, setFileSystem] = useState(getFS());
	useEffect(() => {
		fileSystemObj.subscribe(setFileSystem);
	}, []);

	function addNewFile(filepath: string, isFolder = true) {
		addEntryToFs(filepath, isFolder);
	}

	function renameFs(ele: any, renamedName: string) {
		if (!ele.path) return;
		renameFsEntry(ele.path, renamedName);
	}

	return (
		<div>
			<FileTree items={fileSystem} onRenameItem={renameFs} />
			{/* <CodeEditor language="json" value="" onChange={(v) => {}} /> */}
		</div>
	);
}

export default App;
