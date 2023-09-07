import Home from "./pages/Home/Home";
import style from "./App.module.css";
import Navbar from "./components/NavBar/Navbar";

function App() {
	return (
		<div className={style.container}>
			<Navbar title="JS SERVE" />
			<Home />
		</div>
	);
}

export default App;
