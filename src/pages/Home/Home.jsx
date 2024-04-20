import { useEffect, useRef, useState } from "react";
import { get, upload, getFileUrl } from "../../Utils/JsServeApi";
import style from "./Home.module.css";
import { useDebounce } from "../../customHooks/hooks";
import CodeEditor from "../../components/CodeEditor/CodeEditor";
import { extensionToName } from "../../Utils/LanguageUtil";
import Icon from "../../components/Icon/Icon";

export default function Home(props) {
	const [link, setLink] = useState(null);
	const [loading, setLoading] = useState(false);
	const [uploadingStatus, setUploadingStatus] = useState(false);
	const fileNameRef = useRef();
	const [filename, setFileName] = useState("");
	const [fileData, setFileData] = useState("");
	const debounceSearch = useDebounce(filename);
	const debounceFileData = useDebounce(fileData);
	const [fileExtension, setFileExtension] = useState("");

	useEffect(() => {
		onDebounceFileNameUpdate();
	}, [debounceSearch]);

	useEffect(() => {
		onDebounceFileDataUpdate();
	}, [debounceFileData]);

	async function getFile(_filename) {
		if (!_filename) return null;
		return get(_filename);
	}

	async function uploadFile(fileName, fileBody) {
		if (!fileName || !fileBody || fileName.length === 0 || fileBody.length === 0) return;
		setUploadingStatus(true);
		await upload({ fileName, fileBody });
		setUploadingStatus(false);
	}

	async function onDebounceFileNameUpdate() {
		setLoading(true);
		const res = await getFile(debounceSearch);
		setFileData(res);
		setLink(getFileUrl(debounceSearch));
		setLoading(false);
	}

	async function onDebounceFileDataUpdate() {
		await uploadFile(debounceSearch, debounceFileData);
	}

	function onFileNameChangeHandler(e) {
		const val = e.target.value;
		const extension = val?.split(".").pop() || "";
		const fileLangName = extensionToName(`.${extension}`);
		setFileExtension(fileLangName);
		setFileName(val);
	}

	function onFileDataChangeHandler(e) {
		const val = e;
		setFileData(val);
	}

	return (
		<div className={style.container}>
			<input onChange={onFileNameChangeHandler} className={style.nameContainer} ref={fileNameRef} placeholder="Enter file name with extenion" />

			<div className={style.codeArea}>
				<CodeEditor onChange={onFileDataChangeHandler} defaultLanguage={fileExtension} value={fileData} />
			</div>
			<div className={style.linkContainer}>
				<input value={loading ? "Loading..." : link || "..."} readOnly={true} />
				<div className={style.loadingIcon}>
					<Icon enabled={uploadingStatus} />
				</div>
			</div>
		</div>
	);
}
