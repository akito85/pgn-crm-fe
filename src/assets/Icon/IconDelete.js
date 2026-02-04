import React from "react";

const SVG = ({
	style = {},
	width = "100%",
	className = "",
	onClick = () => { },
	color = "#FF2E2E",
	...otherProps
}) => (
	<svg
		{...otherProps}
		width={width}
		style={style}
		height={width}
		className={`cursor-pointer${className}`}
		onClick={onClick}
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			d="M4 7H20"
			stroke={color}
			strokeWidth="1.75"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M10 11V17"
			stroke={color}
			strokeWidth="1.75"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M14 11V17"
			stroke={color}
			strokeWidth="1.75"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M5 7L6 19C6 20.1046 6.89543 21 8 21H16C17.1046 21 18 20.1046 18 19L19 7"
			stroke={color}
			strokeWidth="1.75"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M9 7V4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V7"
			stroke={color}
			strokeWidth="1.75"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

export default SVG;
