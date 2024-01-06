import { useEffect, useRef, useState } from "react";
import { get, upload } from "../../Utils/JsServeApi";
import style from "./Home.module.css";
import { LoadingButton } from "@mui/lab";
import { useDebounce } from "../../customHooks/hooks";

export default function Home(props) {
	const [link, setLink] = useState(null);
	const [loading, setLoading] = useState(false);
	const fileNameRef = useRef();
	const fileDataRef = useRef();
	const [filename, setFileName] = useState("");
	const [fileData, setFileData] = useState("");
	const debounceSearch = useDebounce(filename);
	const debounceData = useDebounce(fileData);

	useEffect(() => {
		if (fileData) return;
		get(debounceSearch).then((res) => {
			// if (fileDataRef.current)
			// fileDataRef.current.value = res;
			setFileData(res);
			fileDataRef.current.readOnly = false;
		});
	}, [debounceSearch]);

	useEffect(() => {
		console.log(debounceData, debounceSearch);
		if (!debounceData || !debounceSearch) return;
		uploadFile(debounceSearch, debounceData);
	}, [debounceData]);

	async function uploadFile(fileName, fileBody) {
		setLoading(false);
		if (
			!fileName ||
			!fileBody ||
			fileName.length === 0 ||
			fileBody.length === 0
		)
			return;
		setLink("LOADING YOUR LINK");
		setLoading(true);
		const { url } = await upload({ fileName, fileBody });
		setLink(url);
		setLoading(false);
	}

	function onFileNameChange(e) {
		setFileName(e.target.value);
	}

	function onFileDataChange(e) {
		setFileData(e.target.value);
	}

	return (
		<div className={style.container}>
			<input
				onChange={onFileNameChange}
				className={style.nameContainer}
				ref={fileNameRef}
				placeholder="Enter file name with extenion"
			/>
			<textarea
				onChange={onFileDataChange}
				readOnly={true}
				rows={25}
				ref={fileDataRef}
				placeholder="Enter file content"
				value={fileData}
			></textarea>

			<input
				className={style.linkContainer}
				value={loading ? "Loading..." : link}
				readOnly={true}
			/>
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
