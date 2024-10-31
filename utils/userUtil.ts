import { generateUUID } from "./uuid";

export const USER_ID_KEY = "userId";

export function getUserId() {
	if (typeof localStorage == undefined) {
		throw new Error("Local Storage Not Defined");
	}
	const userId = localStorage.getItem(USER_ID_KEY) ?? generateUUID();
	localStorage.setItem(USER_ID_KEY, userId);
	return userId;
}
