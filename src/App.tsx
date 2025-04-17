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

	function createMultipleFiles(filePath = "", _isFolder = true) {
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

		// updatig file

		upload({ fileName: pathVal, fileBody: fileContent });
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
		<div className="flex ">
			<div className=" h-dvh w-50">
				<FileTree onFocusItem={onFocusItem} data={fileSystem} />
			</div>
			<div className="flex-1 m-0.5">
				<div className="flex gap-1">
					<Input onChange={updateFileNameInputHandler} value={pathVal} />
					<Button onClick={() => createMultipleFiles(pathVal, false)} variant={"secondary"}>
						{fileContent ? "update" : "create"}
					</Button>
					<Button onClick={() => copyToClipBoard("S3")} variant={"outline"}>
						S3
						<Copy />
					</Button>
					<Button onClick={() => copyToClipBoard("CDN")} variant={"outline"}>
						CDN
						<Copy />
					</Button>
				</div>
				<CodeEditor language="js" value={fileContent} onChange={setFileContent} />
			</div>
		</div>
	);
}

export default App;
