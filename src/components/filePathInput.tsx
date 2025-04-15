import { Input } from "./ui/input";

export default function FilePathInput({ filepath = "", onChange = (val: string) => {} }) {
	function getFolders() {
		const filesArr = filepath.split("/");
		filesArr.pop();
		return filesArr.join("/");
	}

	function getFileName() {
		const filesArr = filepath.split("/");
		return filesArr.pop();
	}

	function onChangeHandler(fileName) {
		const absPath = getFolders() + "/" + fileName;
		onChange(absPath);
	}

	return (
		<div className="w-[100%] flex items-center gap-2">
			<h4 className="w-max tracking-[3px]">{getFolders()}</h4>
			<div>
				<Input value={getFileName()} onChange={(e) => onChangeHandler(e.target.value)} />
			</div>
		</div>
	);
}
