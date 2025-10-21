import React from "react";
import Tree from "react-d3-tree";
import useCenteredTree from "./Tree/useCenteredTree";

const HierarchyComponent = (props) => {
  const {
    data,
    zoomable,
    collapse,
    nodeWidth,
    nodeHeight,
    containerWidth,
    containerHeight,
    renderCustomNode = () => {},
    selectNode,
    onSelectedSearch = () => {},
    nodeSize,
  } = props;

  const [dimensions, translate, containerRef, containerUseRef] =
    useCenteredTree(selectNode, data);

  // to setting size node box
  const foreignObjectProps = {
    width: nodeWidth,
    height: nodeHeight,
    x: -70,
    y: 8,
  };

  // to setting container canvas
  const container = {
    width: containerWidth,
    height: containerHeight,
  };
  return (
    <div ref={containerUseRef}>
      <div style={container} ref={containerRef}>
        <Tree
          data={data}
          dimensions={dimensions}
          collapsible={collapse}
          translate={translate}
          pathFunc="step"
          orientation="vertical"
          renderCustomNodeElement={(rd3tProps) =>
            renderCustomNode({
              ...rd3tProps,
              onSelectedSearch,
              foreignObjectProps,
            })
          }
          zoomable={zoomable}
          rootNodeClassName="node__root"
          branchNodeClassName="node__branch"
          leafNodeClassName="node__leaf"
          nodeSize={nodeSize}
        />
      </div>
    </div>
  );
};

export default HierarchyComponent;
