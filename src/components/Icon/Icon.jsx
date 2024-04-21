import React from "react";

import loadingGif from "../../assets/loading.gif";
import github from "../../assets/github.png";
const Icon = (props) => {
	const { type = "LOADING", enabled = true } = props;
	return (
		<>
			{type === "LOADING" && enabled && <img src={loadingGif} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
			{type === "GITHUB" && enabled && <img src={github} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
		</>
	);
};

export default Icon;
