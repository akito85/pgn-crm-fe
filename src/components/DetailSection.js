import React from "react";

const DetailSection = ({ header, children, className = "" }) => {
    return (
        <div className={`border border-[#000] border-[5px] rounded-lg overflow-hidden bg-white mt-[30px] ${className}`}>

            {header && (
                <div className="bg-[#F8F9FB] px-[20px] py-[15px] border-b border-[#000]">
                    <span className="text-[#0075bf] font-bold uppercase text-[13px] tracking-wide">
                        {header}
                    </span>
                </div>
            )}

            <div className="px-[20px] py-[25px]">
                {children}
            </div>

        </div>
    );
};

export default DetailSection;
