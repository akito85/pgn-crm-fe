import React, { useCallback, useState, useEffect } from "react";
import { Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import BreadCrumb from "../../../../../components/BreadCrumb";
import BaseContainer from "../../../../../components/BaseContainer";
import Tree from "react-d3-tree";
import SVGIcon from "../../../../../assets/Icon/index";
import { NavLink, useNavigate } from "react-router-dom";
import { getHierarchy } from "../../../../../redux/slices/system_setup/master_data/master_cost_center";
import { SYSTEM_SETUP_ROUTES } from "../../../../../routes/system_setup/setup_routes";
import ButtonComponent from "../../../../../components/ButtonComponent";

const ViewHierarchy = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const nodeSize = { x: 150, y: 400 };
  const { data, parentData, loading } = useSelector((state) => state.master_cost_center);
  const dataSource = data;  

 
  useEffect(() => {
    dispatch(getHierarchy())
  }, [dispatch])
 
  const foreignObjectProps = {
    width: nodeSize.x,
    height: nodeSize.y,
    x: -70,
    y: 8,
  };
  const [translate, setTranslate] = useState({ x: 0, y: 0 });

  const containerRef = useCallback((containerElem) => {
    if (containerElem !== null) {
      const { width, height } = containerElem.getBoundingClientRect();
      setTranslate({ x: width / 2, y: height / 30 });
    }
  }, []);


  
  const datas = [
    {
      name: "Muhammad",
      code: "CEO",
      children: [
        {
          name: "Budi",
          department: "Production",
          children: [
            {
              name: "John",
              department: "Fabrication",
              children: [
                {
                  name: "Binar",
                  department: "Fabrication",
                },
              ],
            },
            {
              name: "Nina",
              department: "Assembly",
              children: [
                {
                  name: "Johan",
                  department: "Assembly",
                },
              ],
            },
          ],
        },
        {
          name: "Ibas",
          department: "Marketing",
          children: [
            {
              name: "Surya",
              department: "Marketing",
              children: [
                {
                  name: "Hadi",
                  department: "Marketing",
                },
              ],
            },
            {
              name: "Gayatri",
              department: "Marketing",
              children: [
                {
                  name: "RIma",
                  department: "Marketing",
                },
              ],
            },
          ],
        },
      ],
    },
  ];
  const datass = []
  const containerStyles = {
    width: "100%",
    height: "65vh",
  };

  const renderForeignObjectNode = ({
    nodeDatum,
    toggleNode,
    foreignObjectProps,
  }) => (
    <g onClick={toggleNode}>
      <circle r={5} className={"bg-black"}></circle>
      <foreignObject {...foreignObjectProps}>
        <div className="flex bg-[#CEDBEC] justify-center rounded-lg m-2">
          <div className="flex-col items-center my-5">
            <div className={"flex gap-3 justify-center mx-auto w-full"}>
              {/* <Avatar icon={<UserOutlined />} /> */}
              <div className="flex-col items-center justify-center">
                <p className="text-black leading-none text-[12px] text-center">
                  {nodeDatum.name}
                </p>
                <p className="text-gray-400 text-[12px] text-center">
                  {nodeDatum.code}
                </p>
              </div>
            </div>
          </div>
        </div>
      </foreignObject>
    </g>
  );
  const routes = [
    {
      path: "",
      breadcrumbName: "System Setup",
    },
    {
      path: "",
      breadcrumbName: "Master Data",
    },
    {
      path: SYSTEM_SETUP_ROUTES.VIEW_COST_CENTER,
      breadcrumbName: "Cost Center",
    },
    {
      path: SYSTEM_SETUP_ROUTES.VIEW_HIERARCHY,
      breadcrumbName: "View Hierarchy",
    },
  ];
  return (
    <LayoutMenu>
      <Spin spinning={loading} className="w-full top-20" tip="Loading">
        <BreadCrumb routes={routes}/>
        <BaseContainer header={"VIEW HIERARCHY"}>
          {dataSource?.[0] &&
            <div style={containerStyles} ref={containerRef}>
              <Tree
                data={dataSource?.[0]}
                collapsible={true}
                translate={translate}
                pathFunc="elbow"
                orientation="vertical"
                renderCustomNodeElement={(rd3tProps) =>
                  renderForeignObjectNode({ ...rd3tProps, foreignObjectProps })
                }
                zoomable={true}
              />
            </div>
          }
        </BaseContainer>
        <div className="flex gap-5 mt-4 w-full justify-between">
          <div>
            <NavLink onClick={() => navigate(-1)}>
              <ButtonComponent
                icon={(
                  <SVGIcon
                    name="IconArrowNarrowLeft"
                    width={24}
                    style={{
                      color: "#fff",
                      fontSize: 24,
                      justifyItems: "center",
                    }}
                  />
                )}
                type={"submit"}
              >
                Back
              </ButtonComponent>
            </NavLink>
          </div>
        </div>
      </Spin>
    </LayoutMenu>
  );
};

export default ViewHierarchy;
