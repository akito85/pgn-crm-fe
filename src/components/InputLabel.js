import React from "react";

const InputLabel = (props) => {
	const { text, mandatory } = props;
	const lbl = "flex -mb-2 text-[#4B465C] text-xs";
	const mc = "ml-1.5 text-dg-red";
	return text ? (
		<div className={lbl}>
			<label>{text}</label>
			{mandatory && <p className={mc}>*</p>}
			<p className="ml-1.5">:</p>
		</div>
	) : (
		<div></div>
	);
};

export default InputLabel;
