
import React from "react";

const IconPlusCircle = ({
    width = "24",
    height = "24",
    stroke = "#0075BF",
    strokeWidth = "1.75",
    fill = "none",
    ...props
}) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill={fill}
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <circle
                cx="12"
                cy="12"
                r="9"
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M9 12H15"
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M12 9V15"
                stroke={stroke}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default IconPlusCircle;
