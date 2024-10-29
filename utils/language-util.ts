import { languageListMap } from "./languageMap";

export function fromExtension(extension: string) {
	const res = languageListMap.filter((item) => {
		if (item?.extensions?.includes(extension)) {
			return item;
		}
	});
	return res[0]?.name?.toLowerCase() ?? "text";
}
