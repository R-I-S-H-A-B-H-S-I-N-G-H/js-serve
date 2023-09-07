import axios from "axios";

const BASE_URL = "https://js-serve.cyclic.cloud";

export async function upload(props) {
	const { fileBody, fileName } = props;
	try {
		const resp = await axios.post(BASE_URL + "/upload", {
			fileName: fileName,
			fileBody: fileBody,
		});
		const jsonResp = await resp.data;
		return jsonResp;
	} catch (error) {
		// console.error(error);
		return null;
	}
}
