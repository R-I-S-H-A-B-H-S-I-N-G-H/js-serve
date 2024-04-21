import Icon from "../Icon/Icon";
import style from "./Navbar.module.css";
export default function Navbar(props) {
	const { title } = props;

	function goToPage(link) {
		window.open(link, "_blank");
	}

	return (
		<div className={style.container}>
			<div className={style.titleContainer}>{title}</div>
			<div onClick={() => goToPage("https://github.com/R-I-S-H-A-B-H-S-I-N-G-H/js-serve")} className={style.icon}>
				<Icon type={"GITHUB"} />
			</div>
		</div>
	);
}
