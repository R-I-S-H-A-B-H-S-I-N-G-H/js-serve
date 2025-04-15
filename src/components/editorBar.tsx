import FilePathInput from "./filePathInput";

export default function EditorBar() {
	return (
		<div className="h-10 px-1 py-0.5 border-2 border-gray-400 rounded-t-sm flex items-center justify-between">
			<FilePathInput />
			<div className="flex items-center gap-1 border-2 border-gray-400 rounded-sm px-1">
				<Button label="Raw" />
				<Divider />
				<Button label="CDN" />
				<Divider />
				<Button label="Download" />
			</div>
		</div>
	);
}

function Button({ label }: { label: string }) {
	return <div className="px-2 py-0.5 hover:cursor-pointer hover:bg-gray-200 rounded-sm">{label}</div>;
}

function Divider() {
	return <div className="w-0.5 h-5 bg-gray-400" />;
}
