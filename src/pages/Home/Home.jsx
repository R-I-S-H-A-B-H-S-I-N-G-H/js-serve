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

	function updateFileNameFromLocation(_filename = "") {
		const fileArr = _filename.split(".");
		const filename = fileArr[0] || "";
		const fileExt = fileArr[1] || "";
		const searchParam = searchParams;

		searchParam.set("file", filename);
		searchParam.set("ext", fileExt);

		setSearchParams(searchParam.toString());
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
		if (res && typeof res != "string") res = JSON.stringify(res);
		setFileData(res);
		setLink(getFileUrl(debounceSearch));
		setLoading(false);
	}

	async function onDebounceFileDataUpdate() {
		await uploadFile(debounceSearch, debounceFileData);
	}

	function onFileNameChangeHandler(e) {
		const val = e.target.value;
		const fileNameArr = val?.split(".") || [];
		const extension = fileNameArr.pop() || "";
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
			<input value={fileName} onChange={onFileNameChangeHandler} className={style.nameContainer} placeholder="Enter file name with extenion" />

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
