import { generateShortUID } from "./crypto";

const USER_ID_KEY = "USER_ID";

export function genUserId() {
	const shortId = generateShortUID();
	localStorage.setItem(USER_ID_KEY, shortId);
	return shortId;
}

export function getUserId() {
	const userId = localStorage.getItem(USER_ID_KEY);
	if (!userId) return genUserId();
	return userId;
}
