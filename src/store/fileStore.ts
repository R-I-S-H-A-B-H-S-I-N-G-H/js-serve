import { hashString } from "@/util/crypto";
import { signal } from "@preact/signals-react";

export const fileSystemObj = signal(createNewFS());
export function createNewFS() {
	return {
		root: {
			index: "root",
			isFolder: true,
			children: [],
			data: "Root",
		},
	};
}

function resetFS() {
	fileSystemObj.value = createNewFS();
}

function getParentFolderPath(path = "") {
	const pathArr = path.split("/");
	pathArr.pop();
	return pathArr.join("/");
}

function getFileName(path = "") {
	const pathArr = path.split("/");
	return pathArr.pop();
}

export function addEnterToFs(completeFilePath = "", isFolder = true) {
	const parentDir = getParentFolderPath(completeFilePath);
	const hashedParentPath = !parentDir ? "root" : hashString(parentDir);
	const hashedChildPath = hashString(completeFilePath);

	const parentEntry = fileSystemObj.value[hashedParentPath];

	if (parentEntry == null) throw new Error("Doesnot have a parent");
	parentEntry.children = [...new Set([...parentEntry.children, hashedChildPath])];

	fileSystemObj.value = {
		...fileSystemObj.value,
		[hashedParentPath]: parentEntry,
		[hashedChildPath]: {
			index: hashedChildPath,
			isFolder,
			children: [],
			data: getFileName(completeFilePath),
			path: completeFilePath,
		},
	};
}

export function getFS() {
	return fileSystemObj.value;
}
