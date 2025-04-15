import { useEffect, useState } from "react";
import "./App.css";
import FileTree from "./components/fileTree";
import { addEntryToFs, fileSystemObj, getFileName, getFS, renameFsEntry } from "./store/fileStore";
import CodeEditor from "./components/codeEditor";
import FilePathInput from "./components/filePathInput";

function App() {
	const [fileSystem, setFileSystem] = useState(getFS());
	const [selectedFile, setSelectedFile] = useState(null);
	useEffect(() => {
		fileSystemObj.subscribe(setFileSystem);
		addNewFile("/folder");
		addNewFile("/folder/file.js", false);
	}, []);

	function addNewFile(filepath: string, isFolder = true) {
		addEntryToFs(filepath, isFolder);
	}

	function renameFs(ele: any, renamedName: string) {
		console.log(ele, renameFs);

		if (!ele.path) return;
		renameFsEntry(ele.path, renamedName);
	}

	function onFocusItem(ele) {
		const { path } = ele;
		setSelectedFile(ele);
	}

	return (
		<div className="flex ">
			<div className=" h-dvh w-50">
				<FileTree onFocusItem={onFocusItem} items={fileSystem} onRenameItem={renameFs} />
			</div>
			<div className="flex-1">
				<FilePathInput
					filepath={selectedFile?.path}
					onChange={(val) => {
						renameFsEntry(selectedFile?.path, getFileName(val));
						setSelectedFile({
							path: val,
						});
					}}
				/>
				<CodeEditor language="js" value="" onChange={(v) => {}} />
			</div>
		</div>
	);
}

export default App;
