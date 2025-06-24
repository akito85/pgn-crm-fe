import React from "react";

const DetailTextNonPopUp = (props) => {
	const { label, children } = props;
	return (
		<div className={"flex flex-col -mb-2 text-dg-grey-dark grid-cols-3 text-l "}>
			<label>{label} :</label>
			<p className="text-dg-black col-span-2 font-bold">{children ? children : "-"}</p>
		</div>
	);
};

export default DetailTextNonPopUp;
