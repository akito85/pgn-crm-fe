import HierarchyComponent from "../../../../components/HierarchyComponent";

const PositionHierarchyDiagram = ({ data, onClick = () => {} }) => {
  // transform hieararchy
  const transformDataToTree = (data) => {
    const nodes = {};
    const rootNodeIds = new Set();
    if (data?.length === 0) {
      return [{ name: "No Data", children: [] }];
    } else {
      data?.forEach((node) => {
        const { positionName, positionParent } = node;
        nodes[positionName] = { ...node, children: [] };
        if (
          positionParent === null ||
          positionParent === "" ||
          positionParent === undefined
        ) {
          rootNodeIds?.add(positionName);
        }
      });
      data?.forEach((node) => {
        const { positionName, positionParent } = node;
        if (
          positionParent !== null ||
          positionParent === "" ||
          positionParent === undefined
        ) {
          nodes[positionParent]?.children?.push(nodes[positionName]);
        }
      });
    }
    return Array.from(rootNodeIds).map((rootId) => nodes[rootId]);
  };

  // to render custom node
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
            <div className="flex-col items-center my-5">
              <div className={"flex gap-3 justify-center mx-auto w-full"}>
                <div className="flex-col items-center justify-center">
                  <p className="text-black leading-none text-[12px] text-center">
                    {nodeDatum?.positionName}
                  </p>
                  <p className="text-gray-400 text-[12px] text-center">
                    {nodeDatum?.remark}
                  </p>
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

export default PositionHierarchyDiagram;
