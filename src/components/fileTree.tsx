import { Tree, UncontrolledTreeEnvironment, StaticTreeDataProvider } from "react-complex-tree";
import "react-complex-tree/lib/style-modern.css";

import "./fileTree.css";

function FileTree({ items, onFocusItem = () => {}, onRenameItem }) {
	const dataProvider = new StaticTreeDataProvider(items, (item, newName) => ({ ...item, data: newName }));

	return (
		<UncontrolledTreeEnvironment
			onRenameItem={onRenameItem}
			onFocusItem={onFocusItem}
			dataProvider={dataProvider}
			getItemTitle={(item) => item.data}
			viewState={{}}
			canDragAndDrop={false}
			canDropOnFolder={false}
			canReorderItems={false}
			canSearch={false}
		>
			<Tree treeId="s" rootItem="root" treeLabel="" />
		</UncontrolledTreeEnvironment>
	);
}

export default FileTree;
