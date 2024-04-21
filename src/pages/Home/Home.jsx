import { useEffect, useState } from "react";
import { get, upload, getFileUrl } from "../../Utils/JsServeApi";
import style from "./Home.module.css";
import { useDebounce } from "../../customHooks/hooks";
import CodeEditor from "../../components/CodeEditor/CodeEditor";
import { extensionToName } from "../../Utils/LanguageUtil";
import Icon from "../../components/Icon/Icon";
import { useSearchParams } from "react-router-dom";

export default function Home(props) {
	const [searchParams, setSearchParams] = useSearchParams();
	const [link, setLink] = useState(null);
	const [loading, setLoading] = useState(false);
	const [uploadingStatus, setUploadingStatus] = useState(false);
	const [fileName, setFileName] = useState(getFileNameFromLocation());
	const [fileData, setFileData] = useState("");
	const debounceSearch = useDebounce(fileName);
	const debounceFileData = useDebounce(fileData);
	const [fileExtension, setFileExtension] = useState("");

	function getFileNameFromLocation() {
		const extenion = searchParams.get("ext") || "";
		const fileName = searchParams.get("file") || "";
		if (!fileName) return "";
		return `${fileName}.${extenion}`;
	}

	function updateFileNameFromLocation(fileNameWithExt = "") {
		const fileArr = fileNameWithExt.split(".");
		const filename = fileArr[0] || "";
		const fileExt = fileArr[1] || "";
		const searchParam = searchParams;

		searchParam.set("file", filename);
		searchParam.set("ext", fileExt);

		setSearchParams(searchParam.toString());
		setFileExtension(getLanguageFromFileName(fileNameWithExt));
		// history.replace({ pathname: location.pathname, search: searchParam.toString() });
	}

	getFileNameFromLocation();

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
		updateFileNameFromLocation(debounceSearch);
		setLoading(true);
		let res = await getFile(debounceSearch);
		if (res && typeof res != "string") res = JSON.stringify(res, null, 4);
		setFileData(res);
		setLink(getFileUrl(debounceSearch));
		setLoading(false);
	}

	async function onDebounceFileDataUpdate() {
		await uploadFile(debounceSearch, debounceFileData);
	}

	function getLanguageFromFileName(filenameWithExt) {
		const fileNameArr = filenameWithExt?.split(".") || [];
		const extension = fileNameArr.pop() || "";
		return extensionToName(`.${extension}`);
	}

	function onFileNameChangeHandler(e) {
		const fileNameWithExt = e.target.value;

		setFileExtension(getLanguageFromFileName(fileNameWithExt));
		setFileName(fileNameWithExt);
	}

	function onFileDataChangeHandler(e) {
		const val = e;
		setFileData(val);
	}

	return (
		<div className={style.container}>
			<input value={fileName} onChange={onFileNameChangeHandler} className={style.nameContainer} placeholder="Enter file name with extenion" />

			<div className={style.codeArea}>
				<CodeEditor onChange={onFileDataChangeHandler} defaultLanguage={fileExtension} value={fileData} />
			</div>
			<div className={style.linkContainer}>
				<input value={loading ? "Loading..." : link || "..."} readOnly={true} />
				<div className={style.loadingIcon}>
					<Icon enabled={uploadingStatus || loading} />
				</div>
			</div>
		</div>
	);
}
