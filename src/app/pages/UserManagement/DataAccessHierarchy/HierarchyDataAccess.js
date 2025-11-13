import React from "react";
import HierarchyComponent from "../../../../components/HierarchyComponent";
import { Tooltip } from "antd";

const HierarchyDataAccess = ({ data, onClick = () => {} }) => {
  const renderCustomNode = ({ nodeDatum, toggleNode, foreignObjectProps }) => (
    <g onClick={toggleNode}>
      <circle r={10} className={"bg-black"} onClick={toggleNode}></circle>
      <foreignObject {...foreignObjectProps}>
        <div
          style={{
            backgroundColor: "lightblue",
            textAlign: "center",
            borderRadius: "5px",
          }}
          onClick={() => onClick(nodeDatum?.key)}
        >
          <div className="flex justify-center rounded-lg m-2">
            <div className="flex-col items-center my-2">
              <div className={"flex gap-3 justify-center mx-auto w-full"}>
                <div className="flex-col items-center justify-center">
                  <p className="text-black leading-none text-[12px] text-center">
                    {nodeDatum.costCenter}
                  </p>
                  {nodeDatum?.sibling?.length > 0 && (
                    <div className=" text-[12px] text-center">
                      <Tooltip
                        placement="top"
                        title={nodeDatum?.sibling?.map((item) => (
                          <p className="text-white text-[12px] text-center">
                            {item}
                          </p>
                        ))}
                      >
                        {nodeDatum?.sibling?.length + " Sibling"}
                      </Tooltip>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </foreignObject>
    </g>
  );

  return (
    <div className={"w-full"}>
      <HierarchyComponent
        data={data}
        nodeWidth={150}
        nodeHeight={100000}
        collapse={true}
        zoomable={true}
        containerHeight={"50vh"}
        renderCustomNode={renderCustomNode}
        nodeSize={{ x: 165, y: 170 }}
      />
    </div>
  );
};

export default HierarchyDataAccess;
