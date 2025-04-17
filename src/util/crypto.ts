import hash from "object-hash";
import { nanoid } from "nanoid";

export function hashString(input: string): string {
	return hash(input);
}

export function generateShortUID(length: number = 8) {
	return nanoid(length);
}
