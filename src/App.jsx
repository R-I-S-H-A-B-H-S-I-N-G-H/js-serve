import Home from "./pages/Home/Home";
import style from "./App.module.css";
import Navbar from "./components/NavBar/Navbar";
import { Route, Routes } from "react-router-dom";

function App() {
	return (
		<div className={style.container}>
			<Navbar title="JS SERVE" />
			<Routes>
				<Route path="*" element={<Home />} />
			</Routes>
		</div>
	);
}

export default App;
