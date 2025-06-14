import { useEffect, useState } from "react";
import "./App.css";
import FileTree from "./components/fileTree";
import { addEntryToFs, createNewFS, fileSystemObj, getBackUpPayload, getFS, isFsOld, restoreBackUp, updateHash } from "./store/fileStore";
import CodeEditor from "./components/codeEditor";
import { getUserId } from "./util/userUtil";
import { getResourcePath, getFileData, getIndexFile, updateIndexFile, upload } from "./util/s3Utils/s3Utils";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

function App() {
	const [fileSystem, setFileSystem] = useState(getFS());
	const [selectedFile, setSelectedFile] = useState([]);
	const [pathVal, setPathVal] = useState("");
	const [fileContent, setFileContent] = useState("");
	const userId = getUserId();

	useEffect(() => {
		initFileSystem();
		fileSystemObj.subscribe(setFileSystem);
	}, []);

	useEffect(() => {
		getFileData(pathVal)
			.then((data) => {
				setFileContent(data ?? "");
			})
			.catch((err) => {
				setFileContent("");
			});
	}, [pathVal]);

	function initFileSystem() {
		getIndexFile()
			.then((res) => {
				createNewFS(userId);
				restoreBackUp(JSON.stringify(res));
			})
			.catch((err) => {
				createNewFS(userId);
				restoreBackUp("{}");
			});
	}

	function addNewFile(filepath: string, isFolder = true) {
		addEntryToFs(`/${userId}${filepath}`, isFolder);
	}

	function backUpFs() {
		if (isFsOld()) return;
		const backup = getBackUpPayload();
		updateIndexFile(backup);
	}

	function generatePath(ele: any): string {
		if (!ele || ele.level == 0) return "";
		const curPath = ele.data.id;
		return generatePath(ele.parent) + "/" + curPath;
	}

	function onFocusItem(ele: any) {
		const curPath = generatePath(ele);
		setPathVal(curPath);
	}

	async function createMultipleFiles(filePath = "", _isFolder = true) {
		let curpath = "";
		const pathArr = filePath.split("/").filter((ele) => ele);

		pathArr.forEach((ele, index) => {
			const isFolder = index == pathArr.length - 1 ? _isFolder : true;
			curpath = `${curpath}/${ele}`;
			addNewFile(curpath, isFolder);
		});

		// updating the backup
		backUpFs();
		updateHash();

		try {
			// updatig file
			await upload({ fileName: pathVal, fileBody: fileContent });
			successToast({ message: `File ${filePath} created successfully` });
		} catch (error) {
			errorToast({ message: `Error in creating file ${filePath}` });
		}
	}

	function updateFileNameInputHandler(e: any) {
		let fileName = e.target.value;
		if (!fileName.startsWith("/")) fileName = "/" + fileName;
		setPathVal(fileName);
	}

	function successToast({ message }: { message: string }) {
		toast.success(message);
	}

	function errorToast({ message }: { message: string }) {
		toast.error(message);
	}

	function warnToast({ message }: { message: string }) {
		toast.warning(message);
	}

	function copyToClipBoard(type: "CDN" | "S3") {
		if (!pathVal) {
			warnToast({ message: `Select a file to copy its path` });
			return;
		}

		const textToCopy = getResourcePath(pathVal, type);

		navigator.clipboard
			.writeText(textToCopy)
			.then(() => {
				successToast({ message: `${type} path copied to ClipBoard` });
			})
			.catch((err) => {
				errorToast({ message: `Error in coping ${type} path to ClipBoard` });
			});
	}

	return (
		<div className="flex h-dvh">
			{/* Sidebar */}
			<div className="min-w-44 w-[20%] max-w-64 border-r border-gray-200">
				<FileTree onFocusItem={onFocusItem} data={fileSystem} />
			</div>

			{/* Main Content */}
			<div className="flex-1 p-2 flex flex-col overflow-hidden">
				{/* Top Bar */}
				<div className="flex gap-2 items-center mb-2">
					<span className="text-2xl font-bold text-blue-400 mr-4">JsServe</span>
					<Input onChange={updateFileNameInputHandler} value={pathVal} className="flex-1" />
					<Button onClick={() => createMultipleFiles(pathVal, false)} disabled={false} variant="outline">
						{fileContent ? "update" : "create"}
					</Button>
					<Button onClick={() => copyToClipBoard("S3")} variant="outline">
						S3 <Copy className="ml-1 w-4 h-4" />
					</Button>
					<Button onClick={() => copyToClipBoard("CDN")} disabled variant="outline">
						CDN <Copy className="ml-1 w-4 h-4" />
					</Button>
				</div>

				{/* Code Editor */}
				<div className="flex-1 overflow-auto">
					<CodeEditor language="js" value={fileContent} onChange={setFileContent} />
				</div>
			</div>
		</div>
	);
}

export default App;
