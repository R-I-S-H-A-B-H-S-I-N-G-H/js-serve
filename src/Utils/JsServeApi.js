import axios from "axios";

const BASE_CDN_URL = "https://s3.us-east-005.backblazeb2.com/testb23";
// const BASE_URL = "https://js-serve.cyclic.cloud";
const BASE_URL = "https://go-microservice-k2dn.onrender.com/s3";
// const BASE_URL = "http://localhost:3000/s3";

export async function upload(props) {
	const { fileBody, fileName } = props;
	try {
		const resp = await axios.post(BASE_URL + "/uptos3", {
			filePath: fileName,
			fileData: fileBody,
		});
		const jsonResp = await resp.data;
		return jsonResp;
	} catch (error) {
		// console.error(error);
		return null;
	}
}

export function getFileUrl(fileName) {
	if (!fileName) return null;
	return `${BASE_CDN_URL}/${fileName}`;
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
