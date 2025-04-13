import { Tree, UncontrolledTreeEnvironment, StaticTreeDataProvider } from "react-complex-tree";
import "react-complex-tree/lib/style-modern.css";

function FileTree({ items }) {
	const dataProvider = new StaticTreeDataProvider(items, (item, newName) => ({ ...item, data: newName }));

	return (
		<UncontrolledTreeEnvironment
			onFocusItem={(ele) => {
				console.log(ele);
			}}
			dataProvider={dataProvider}
			getItemTitle={(item) => item.data}
			viewState={{}}
			canDragAndDrop={true}
			canDropOnFolder={true}
			canReorderItems={true}
		>
			<Tree treeId="s" rootItem="root" treeLabel="Tree Example" />
		</UncontrolledTreeEnvironment>
	);
}

export default FileTree;
