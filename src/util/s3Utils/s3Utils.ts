import { BASE_URL, BASE_CDN_URL } from "../../../config/config";
const S3_BASE_URL = `${BASE_URL}/s3`;
import axios from "axios";
import { getUserId } from "../userUtil";

const INDEX_FILE_BASE = `index`;
const USER_DATA_BASE = `userdata`;
/**
	 https://go-microservice-k2dn.onrender.com/s3/uptos3
 */

export function getAbsDataFilePath(filePath: string) {
	return `${USER_DATA_BASE}/${getUserId()}${filePath}`;
}

export function getAbsIndexFilePath(userId: string) {
	return `${USER_DATA_BASE}/${userId}.json`;
}

export async function upload(props: { fileName: string; fileBody: string }) {
	const { fileBody, fileName } = props;
	const S3_SERVICE_URL = `${S3_BASE_URL}/uptos3`;
	const resp = await axios.post(S3_SERVICE_URL, {
		filePath: getAbsDataFilePath(fileName),
		fileData: fileBody,
	});
	const jsonResp = await resp.data;
	return jsonResp;
}

export function getFileUrl(fileName: string) {
	if (!fileName) return null;
	return `${BASE_CDN_URL}/${getAbsDataFilePath(fileName)}`;
}

export async function getFileData(fileName: string) {
	const url = getFileUrl(fileName);

	console.log(url);
	if (!url) return;
	const resp = await axios.get(url);
	const jsonResp = await resp.data;
	return jsonResp;
}

export async function getIndexFile() {
	const userId = getUserId();
	const url = BASE_CDN_URL + "/" + getAbsIndexFilePath(userId);
	const resp = await axios.get(url);
	const jsonResp = await resp.data;
	return jsonResp;
}

export async function updateIndexFile(fileData: string) {
	const userId = getUserId();

	console.log(JSON.parse(fileData));

	const S3_SERVICE_URL = `${S3_BASE_URL}/uptos3`;
	const resp = await axios.post(S3_SERVICE_URL, {
		filePath: getAbsIndexFilePath(userId),
		fileData: fileData,
	});
	const jsonResp = await resp.data;
	return jsonResp;
}
