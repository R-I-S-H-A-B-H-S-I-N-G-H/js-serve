import { API_BASE_URL, BASE_CDN_URL, BASE_S3_URL } from "../../../config/config";
const S3_BASE_URL = `${API_BASE_URL}/s3`;
import axios from "axios";
import { getUserId } from "../userUtil";

const INDEX_FILE_BASE = `user/index`;
const USER_DATA_BASE = `user/data`;

export function getAbsDataFilePath(filePath: string) {
	return `${USER_DATA_BASE}/${getUserId()}${filePath}`;
}

export function getAbsIndexFilePath(userId: string) {
	return `${INDEX_FILE_BASE}/${userId}.json`;
}

export function getResourcePath(filepath: string, type: "CDN" | "S3" = "CDN") {
	if (type == "CDN") return `${BASE_CDN_URL}/${getAbsDataFilePath(filepath)}`;
	return `${BASE_S3_URL}/${getAbsDataFilePath(filepath)}`;
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
	return `${BASE_S3_URL}/${getAbsDataFilePath(fileName)}`;
}

export async function getFileData(fileName: string) {
	const url = getFileUrl(fileName);

	if (!url) return;
	const resp = await axios.get(url);
	const jsonResp = await resp.data;
	return jsonResp;
}

export async function getIndexFile() {
	const userId = getUserId();
	const url = BASE_S3_URL + "/" + getAbsIndexFilePath(userId);
	const resp = await axios.get(url);
	const jsonResp = await resp.data;
	return jsonResp;
}

export async function updateIndexFile(fileData: string) {
	const userId = getUserId();

	const S3_SERVICE_URL = `${S3_BASE_URL}/uptos3`;
	const resp = await axios.post(S3_SERVICE_URL, {
		filePath: getAbsIndexFilePath(userId),
		fileData: fileData,
	});
	const jsonResp = await resp.data;
	return jsonResp;
}
