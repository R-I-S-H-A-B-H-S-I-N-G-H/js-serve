import { LanguageListMap } from "./LanguageMap";

/**
 * 	{
		name: "ABAP",
		type: "programming",
		extensions: [".abap"],
	},
 * 
 */
export function extensionToName(extension) {
	const language = LanguageListMap.find(({ extensions }) => extensions?.includes(extension));
	const res = language ? language.name : "txt";
	return res;
}
