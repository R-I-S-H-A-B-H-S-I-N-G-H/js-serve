import style from "./Navbar.module.css";
export default function Navbar(props) {
	const { title } = props;
	return (
		<div className={style.container}>
			<div className={style.titleContainer}>{title}</div>
		</div>
	);
}
