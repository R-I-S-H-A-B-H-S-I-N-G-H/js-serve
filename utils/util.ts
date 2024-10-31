export function getSizeInBytes(str: string) {
	return Buffer.byteLength(str, "utf8");
}
