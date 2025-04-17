import { Tree } from "react-arborist";
import { Folder, FolderOpen, FileText } from "lucide-react";

export type TreeNode = {
	id: string;
	name: string;
	children?: TreeNode[];
};

export default function FileTree({ data, onFocusItem = (e: any) => {} }: { data: TreeNode[]; onFocusItem?: (e: any) => void }) {
	return (
		<div className="bg-white dark:bg-[#0d1117] text-[#24292f] dark:text-[#c9d1d9] p-3  border-gray-500 dark:border-gray-700 font-mono text-sm w-full h-full">
			<Tree
				data={data}
				disableDrag
				disableDrop
				rowHeight={28}
				padding={12}
				width={"100%"}
				height={400}
				onFocus={onFocusItem}
				children={({ node, style }) => {
					const isFolder = !node.isLeaf;

					return (
						<div
							style={style}
							className={`flex items-center gap-2 pr-2 py-1 rounded-sm transition-colors duration-100 select-none 
							${node.isSelected ? "bg-[#0969da]/10 text-[#0969da] dark:bg-[#58a6ff]/10 dark:text-[#58a6ff]" : "hover:bg-[#f6f8fa] dark:hover:bg-[#21262d]"}
							pl-[${node.level * 16}px]`}
							onClick={() => isFolder && node.toggle()}
						>
							{isFolder ? (
								node.isOpen ? (
									<FolderOpen size={16} className="text-[#e3b341]" />
								) : (
									<Folder size={16} className="text-[#e3b341]" />
								)
							) : (
								<FileText size={16} className="text-gray-500 dark:text-gray-400" />
							)}
							<span className="truncate">{node.data.name}</span>
						</div>
					);
				}}
			/>
		</div>
	);
}
