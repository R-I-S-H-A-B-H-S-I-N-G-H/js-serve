import { TreeNode } from "@/components/fileTree";
import { hashString } from "@/util/crypto";
import { getUserId } from "@/util/userUtil";
import { signal } from "@preact/signals-react";

export const fileSystemObj = signal<TreeNode[]>([]);
let lastUpdatedHash = "";
export function createNewFS(userId: string) {
	const nwFsObj = [
		{
			id: userId,
			name: userId,
			children: [],
		},
	];
	updateFS(nwFsObj);
	updateHash();
}

export function updateHash() {
	lastUpdatedHash = hashString(JSON.stringify(fileSystemObj.peek()));
}

export function isFsOld() {
	return lastUpdatedHash == hashString(JSON.stringify(fileSystemObj.peek()));
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

export function getEntry(absPath: string, fs = fileSystemObj.peek()): TreeNode | null {
	let absPathArr = absPath.split("/").filter((ele) => ele);
	const currentEle = absPathArr.shift();

	for (const node of fs) {
		const curNodeId = node.id;
		if (curNodeId != currentEle) continue;
		if (absPathArr.length == 0) return node;
		return getEntry(absPathArr.join("/"), node.children);
	}

	return null;
}

function removeEntryFromTree(parentPath: string, targetId: string, fs = fileSystemObj.peek()): TreeNode[] | null {
	if (parentPath === "") {
		return fs.filter((node) => node.id !== targetId);
	}

	const parent = getEntry(parentPath, fs);
	if (!parent || !parent.children) return null;

	parent.children = parent.children.filter((child) => child.id !== targetId);
	return fs;
}

export function removeEntry(absPath: string) {
	const parentPath = getParentFolderPath(absPath);
	const childId = getFileName(absPath);

	const updatedFS = removeEntryFromTree(parentPath, childId);
	if (updatedFS) {
		updateFS(updatedFS);
	}
}

export function addEntryToFs(absPath: string = "", isFolder: boolean = true) {
	if (!absPath) return;

	const name = getFileName(absPath);
	const parentPath = getParentFolderPath(absPath);

	const fsCopy = fileSystemObj.peek();

	const parent = getEntry(parentPath, fsCopy);
	if (!parent || !parent.children) return;

	const exists = parent.children.find((child) => child.id === name);
	if (exists) return; // Prevent duplicate

	const newEntry: TreeNode = isFolder ? { id: name, name, children: [] } : { id: name, name };

	parent.children.push(newEntry);
	updateFS(fsCopy);
}

function updateFS(val: TreeNode[]) {
	fileSystemObj.value = [...val];
}

export function renameFsEntry(absPath: string, newName: string) {
	const oldEntry = getEntry(absPath);
	removeEntry(absPath);
	const newEntryPath = getParentFolderPath(absPath) + "/" + newName;
	addEntryToFs(newEntryPath, !!oldEntry?.children);
}

export function copyFsEntry(fromAbsPath: string, toAbsPath: string) {}

export function getFS() {
	return fileSystemObj.value;
}

export function getBackUpPayload(): string {
	const backupObj = fileSystemObj ?? {};

	return JSON.stringify(backupObj);
}

export function restoreBackUp(backup: string) {
	const backupObj = JSON.parse(backup);

	if (!backupObj || Object.keys(backupObj).length == 0) {
		createNewFS(getUserId());
		return;
	}

	updateFS(backupObj);
	updateHash();
}
