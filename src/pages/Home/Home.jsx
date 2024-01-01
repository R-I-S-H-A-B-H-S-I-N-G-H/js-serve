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
	const debounceSearch = useDebounce(filename);

	useEffect(() => {
		get(debounceSearch).then((res) => {
			if (fileDataRef.current) fileDataRef.current.value = res;
		});
	}, [debounceSearch]);

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
	return (
		<div className={style.container}>
			<input
				onChange={onFileNameChange}
				className={style.linkContainer}
				ref={fileNameRef}
				placeholder="Enter file name with extenion"
			/>
			<textarea
				rows={25}
				ref={fileDataRef}
				placeholder="Enter file content"
			></textarea>

			<input className={style.linkContainer} value={link} readOnly={true} />
			<LoadingButton
				variant="outlined"
				loading={loading}
				onClick={() =>
					uploadFile(fileNameRef.current.value, fileDataRef.current.value)
				}
			>
				Create Link
			</LoadingButton>
		</div>
	);
}
