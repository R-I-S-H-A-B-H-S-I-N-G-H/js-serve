import ShortUniqueId from "short-unique-id";

export function generateUUID(size = 8) {
	const uid = new ShortUniqueId({ length: size });
	return uid.rnd();
}
