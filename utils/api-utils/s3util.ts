import { BASE_URL, BASE_CDN_URL } from "@/config";
const S3_BASE_URL = `${BASE_URL}/s3`;
import axios from "axios";

export async function upload(props: { fileName: string; fileBody: string }) {
	const { fileBody, fileName } = props;
	const S3_SERVICE_URL = `${S3_BASE_URL}/uptos3`;
	const resp = await axios.post(S3_SERVICE_URL, {
		filePath: fileName,
		fileData: fileBody,
	});
	const jsonResp = await resp.data;
	return jsonResp;
}

export function getFileUrl(fileName: string) {
	if (!fileName) return null;
	return `${BASE_CDN_URL}/${fileName}`;
}

export async function getFileData(fileName: string) {
	const url = BASE_CDN_URL + `/${fileName}`;
	const resp = await axios.get(url);
	const jsonResp = await resp.data;
	return jsonResp;
}
