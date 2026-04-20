import React from "react";

const IconAddTable = ({
    width = "20",
    height = "20",
    ...otherProps
}) => {
    return (
        <svg 
            width={width} 
            height={height} 
            viewBox="0 0 20 20" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            {...otherProps}
        >
            <path 
                d="M4.16675 9.99984H15.8334M10.0001 4.1665V15.8332" 
                stroke="#1976D2" 
                strokeWidth="2.01243"
            />
        </svg>
    );
};

export default IconAddTable;
