import React from "react";

const GridLayout = (props) => {
	const { children, cols } = props;

	return (
		<div className={`grid grid-cols-${cols} w-full gap-x-10`}>{children}</div>
	);
};

export default GridLayout;
