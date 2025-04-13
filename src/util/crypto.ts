import hash from "object-hash";

export function hashString(input: string): string {
	return hash(input);
}
