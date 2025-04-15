import { useEffect, useState } from "react";
import "./App.css";
import FileTree from "./components/fileTree";
import { addEntryToFs, fileSystemObj, getEntry, getFileName, getFS, removeEntry, renameFsEntry } from "./store/fileStore";
import CodeEditor from "./components/codeEditor";
import FilePathInput from "./components/filePathInput";
import EditorBar from "./components/editorBar";

function App() {
	const [fileSystem, setFileSystem] = useState(getFS());
	const [selectedFile, setSelectedFile] = useState([]);
	useEffect(() => {
		fileSystemObj.subscribe(setFileSystem);

		setTimeout(() => {
			addEntryToFs("/src/test");
		}, 1000 * 1);

		setTimeout(() => {
			renameFsEntry("/src/test", "test1.js");
		}, 1000 * 2);
	}, []);

	function addNewFile(filepath: string, isFolder = true) {
		addEntryToFs(filepath, isFolder);
	}

	function renameFs(ele: any, renamedName: string) {
		console.log(ele, renameFs);

		if (!ele.path) return;
		renameFsEntry(ele.path, renamedName);
	}

	function onFocusItem(ele: any) {
		const { path } = ele;
		setSelectedFile(ele);
	}

	return (
		<div className="flex ">
			<div className=" h-dvh w-50">
				<FileTree onFocusItem={onFocusItem} data={fileSystem} />
			</div>
			<div className="flex-1 m-0.5">
				<div>
					{/* <FilePathInput
						filepath={selectedFile?.path}
						onChange={(val) => {
							renameFsEntry(selectedFile?.path, getFileName(val));
							setSelectedFile({
								path: val,
							});
						}}
					/> */}
					{/* <EditorBar
						filepath={selectedFile?.path}
						onFilePathChange={(val) => {
							renameFsEntry(selectedFile?.path, getFileName(val));
							setSelectedFile({
								path: val,
							});
						}}
					/> */}
				</div>
				<CodeEditor language="js" value="" onChange={(v) => {}} />
			</div>
		</div>
	);
}

export default App;
