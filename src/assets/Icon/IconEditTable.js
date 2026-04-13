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
		<g clipPath="url(#clip0_36365_42682)">
			<path
				d="M12.5 4.16633L15.8334 7.49967M17.645 5.67633C18.0856 5.23585 18.3332 4.63839 18.3333 4.01538C18.3333 3.39237 18.0859 2.79484 17.6454 2.35425C17.205 1.91366 16.6075 1.66609 15.9845 1.66602C15.3615 1.66594 14.764 1.91335 14.3234 2.35383L3.20169 13.478C3.00821 13.6709 2.86512 13.9084 2.78503 14.1697L1.68419 17.7963C1.66266 17.8684 1.66103 17.945 1.67949 18.0179C1.69794 18.0908 1.73579 18.1574 1.78902 18.2105C1.84225 18.2636 1.90888 18.3014 1.98183 18.3197C2.05477 18.3381 2.13133 18.3363 2.20336 18.3147L5.83086 17.2147C6.09183 17.1353 6.32934 16.9931 6.52253 16.8005L17.645 5.67633Z"
				stroke={color || "#0075BF"}
				strokeWidth="1.66667"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</g>
		<defs>
			<clipPath id="clip0_36365_42682">
				<rect width="20" height="20" fill="white" />
			</clipPath>
		</defs>
	</svg>
);

export default SVG;
