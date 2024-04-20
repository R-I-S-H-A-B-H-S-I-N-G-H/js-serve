import { useEffect, useRef, useState } from "react";
import { get, upload } from "../../Utils/JsServeApi";
import style from "./Home.module.css";
import { useDebounce } from "../../customHooks/hooks";
import CodeEditor from "../../components/CodeEditor/CodeEditor";
import { extensionToName } from "../../Utils/LanguageUtil";

export default function Home(props) {
	const [link, setLink] = useState(null);
	const [loading, setLoading] = useState(false);
	const fileNameRef = useRef();
	const fileDataRef = useRef();
	const [filename, setFileName] = useState("");
	const [fileData, setFileData] = useState("");
	const debounceSearch = useDebounce(filename);
	const debounceData = useDebounce(fileData);
	const [fileExtension, setFileExtension] = useState("");

	useEffect(() => {
		if (fileData) return;
		get(debounceSearch).then((res) => {
			setFileData(res);
			fileDataRef.current.readOnly = false;
		});
	}, [debounceSearch]);

	useEffect(() => {
		if (!debounceData || !debounceSearch) return;
		uploadFile(debounceSearch, debounceData);
	}, [debounceData]);

	async function uploadFile(fileName, fileBody) {
		setLoading(false);
		if (!fileName || !fileBody || fileName.length === 0 || fileBody.length === 0) return;
		setLink("LOADING YOUR LINK");
		setLoading(true);
		const { url } = await upload({ fileName, fileBody });
		setLink(url);
		setLoading(false);
	}

	function onFileNameChange(e) {
		const val = e.target.value;
		const extenion = val?.split(".").pop() || "";
		const fileLangName = extensionToName("." + extenion);
		setFileExtension(fileLangName);
		setFileName(val);
	}

	function onFileDataChange(e) {
		const val = e;
		setFileData(val);
	}

	return (
		<div className={style.container}>
			<input onChange={onFileNameChange} className={style.nameContainer} ref={fileNameRef} placeholder="Enter file name with extenion" />

			<div className={style.codeArea}>
				<CodeEditor onChange={onFileDataChange} ref={fileDataRef} defaultLanguage={fileExtension} value={fileData} />
			</div>
			<input className={style.linkContainer} value={loading ? "Loading..." : link} readOnly={true} />
			{/* <LoadingButton
				variant="outlined"
				loading={loading}
				onClick={() =>
					uploadFile(fileNameRef.current.value, fileDataRef.current.value)
				}
			>
				Create Link
			</LoadingButton> */}
		</div>
	);
}
