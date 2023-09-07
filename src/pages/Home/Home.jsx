import { useEffect, useRef, useState } from "react";
import { upload } from "../../Utils/JsServeApi";
import style from "./Home.module.css";

export default function Home(props) {
	const [link, setLink] = useState(null);
	const fileName = useRef();
	const fileData = useRef();

	async function uploadFile(fileName, fileBody) {
		if (
			!fileName ||
			!fileBody ||
			fileName.length() === 0 ||
			fileBody.length() === 0
		)
			return;
		setLink("LOADING YOUR LINK");
		const { url } = await upload({ fileName, fileBody });
		setLink(url);
	}

	return (
		<div className={style.container}>
			<input
				className={style.linkContainer}
				ref={fileName}
				placeholder="Enter file name with extenion"
			/>
			<textarea
				rows={15}
				ref={fileData}
				placeholder="Enter file content"
			></textarea>

			<input className={style.linkContainer} value={link} readOnly={true} />
			<button
				onClick={() =>
					uploadFile(fileName.current.value, fileData.current.value)
				}
			>
				Create Link
			</button>
		</div>
	);
}
