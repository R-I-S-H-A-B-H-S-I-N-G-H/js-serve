import axios from "axios";

const BASE_CDN_URL = "https://s3.us-east-005.backblazeb2.com/testb23";
// const BASE_URL = "https://js-serve.cyclic.cloud";
const BASE_URL = "https://jsserve.onrender.com";

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

export async function get(fileName) {
	try {
		const url = BASE_CDN_URL + `/${fileName}`;
		const resp = await axios.get(url);
		const jsonResp = await resp.data;
		return jsonResp;
	} catch (error) {
		return null;
	}
}
