import { useEffect, useRef, useState } from "react";
import { upload } from "../../Utils/JsServeApi";
import style from "./Home.module.css";
import { LoadingButton } from "@mui/lab";

export default function Home(props) {
	const [link, setLink] = useState(null);
	const [loading, setLoading] = useState(false);
	const fileName = useRef();
	const fileData = useRef();

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

	return (
		<div className={style.container}>
			<input
				className={style.linkContainer}
				ref={fileName}
				placeholder="Enter file name with extenion"
			/>
			<textarea
				rows={25}
				ref={fileData}
				placeholder="Enter file content"
			></textarea>

			<input className={style.linkContainer} value={link} readOnly={true} />
			<LoadingButton
				variant="outlined"
				loading={loading}
				onClick={() =>
					uploadFile(fileName.current.value, fileData.current.value)
				}
			>
				Create Link
			</LoadingButton>
		</div>
	);
}