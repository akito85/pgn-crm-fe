import React from "react";

const SVG = ({
	style = {},
	width = "100%",
	className = "",
	onClick = () => { },
	color,
	...otherProps
}) => (
	<svg
		{...otherProps}
		width={width}
		style={style}
		height={width}
		className={`cursor-pointer ${className}`}
		onClick={onClick}
		viewBox="0 0 20 20"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<g clipPath="url(#clip0_36365_42683)">
			<path
				d="M17.5 17.5001H6.66664C6.44688 17.5006 6.2292 17.4576 6.02612 17.3737C5.82303 17.2897 5.63856 17.1664 5.4833 17.0109L2.15497 13.6784C1.84252 13.3658 1.66699 12.942 1.66699 12.5001C1.66699 12.0581 1.84252 11.6343 2.15497 11.3217L10.4883 2.98839C10.6431 2.83356 10.8268 2.71073 11.0291 2.62693C11.2313 2.54313 11.4481 2.5 11.6671 2.5C11.886 2.5 12.1028 2.54313 12.305 2.62693C12.5073 2.71073 12.691 2.83356 12.8458 2.98839L17.845 7.98839C18.1574 8.30094 18.3329 8.72479 18.3329 9.16673C18.3329 9.60867 18.1574 10.0325 17.845 10.3451L10.695 17.5001M4.23497 9.24173L11.5916 16.5984"
				stroke={color || "#D32F2F"}
				strokeWidth="1.66667"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</g>
		<defs>
			<clipPath id="clip0_36365_42683">
				<rect width="20" height="20" fill="white" />
			</clipPath>
		</defs>
	</svg>
);

export default SVG;
