import { hashString } from "@/util/crypto";
import { signal } from "@preact/signals-react";

type FSVal = {
	index: string;
	isFolder: boolean;
	children: string[];
	data: string;
	path?: string;
};
type FSObject = {
	[key: string]: FSVal | null;
};

export const fileSystemObj = signal<FSObject>(createNewFS());
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

export function getParentFolderPath(path = "") {
	const pathArr = path.split("/");
	pathArr.pop();
	return pathArr.join("/");
}

export function getFileName(path = "") {
	const pathArr = path.split("/");
	return pathArr.pop() ?? "";
}

function getParentFolderHash(absPath: string) {
	const parentDir = getParentFolderPath(absPath);
	const hashedParentPath = !parentDir ? "root" : hashString(parentDir);
	return hashedParentPath;
}

function getEntry(hashedPath: string): FSVal {
	if (!fileSystemObj.value[hashedPath]) throw new Error("value not present");
	return fileSystemObj.value[hashedPath];
}

function removeEntry(absPath: string) {
	const hashedParentPath = getParentFolderHash(absPath);
	const hashedChildPath = hashString(absPath);

	const parentEntry = getEntry(hashedParentPath);

	if (parentEntry == null) throw new Error("Doesnot have a parent");
	parentEntry.children = parentEntry.children.filter((ele) => ele != hashedChildPath);

	delete fileSystemObj.value[hashedChildPath];
	fileSystemObj.value = {
		...fileSystemObj.value,
		[hashedParentPath]: parentEntry,
	};
}

export function addEntryToFs(absPath: string = "", isFolder: boolean = true) {
	const hashedParentPath = getParentFolderHash(absPath);
	const hashedChildPath = hashString(absPath);

	const parentEntry = getEntry(hashedParentPath);

	if (parentEntry == null) throw new Error("Doesnot have a parent");
	parentEntry.children = [...new Set([...parentEntry.children, hashedChildPath])];

	fileSystemObj.value = {
		...fileSystemObj.value,
		[hashedParentPath]: parentEntry,
		[hashedChildPath]: {
			index: hashedChildPath,
			isFolder,
			children: [],
			data: getFileName(absPath),
			path: absPath,
		},
	};
}

export function renameFsEntry(absPath: string, newName: string) {
	const newFileAbsPath = getParentFolderPath(absPath) + "/" + newName;

	copyFsEntry(absPath, newFileAbsPath);
	removeEntry(absPath);

	console.log("rename");
}

export function copyFsEntry(fromAbsPath: string, toAbsPath: string) {
	const fromEntry = getEntry(hashString(fromAbsPath));
	const toPathHash = hashString(toAbsPath);
	const toEntry = {
		...fromEntry,
		index: toPathHash,
		data: getFileName(toAbsPath),
		path: toAbsPath,
	};

	const toParentHash = getParentFolderHash(toAbsPath);
	const toParentEntry = getEntry(toParentHash);
	if (!toParentEntry) throw new Error("Invalid Path parent not present");

	// adding the cpoied child to its parent
	toParentEntry.children = [...new Set([...toParentEntry.children, toPathHash])];
	fileSystemObj.value = {
		...fileSystemObj.value,
		[toParentHash]: toParentEntry,
		[toPathHash]: toEntry,
	};
}

export function getFS() {
	return fileSystemObj.value;
}
