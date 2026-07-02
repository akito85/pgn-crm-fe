import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BaseContainer from "../../../../components/BaseContainer";
import BreadCrumb from "../../../../components/BreadCrumb";
import { ArrowLeftOutlined } from "@ant-design/icons";
import DetailText from "../../../../components/DetailText";
import ModalCustom from "../../../../components/Modal/ModalCustom";
import ModalBack from "../../../../components/Modal/ModalBack";
import ButtonComponent from "../../../../components/ButtonComponent";
import { Select, Spin, Tooltip } from "antd";
import { USER_ROUTES } from "../../../../routes/user_management/user_routes";
import HierarchyComponent from "../../../../components/HierarchyComponent";
import { useDispatch, useSelector } from "react-redux";
import {
  getDetailHierarchy,
  getDetailPosition,
  getPosition,
} from "../../../../redux/slices/user_management/position_hirarchy";
import { hasValue, renderDateConverter, toTitleCase } from "../../../../utils";
import DetailPosition from "./DetailPosition";
import SelectComponent from "../../../../components/SelectComponent";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useTryAgainHooks } from "../../../../utils/useTryAgainHooks";

const DetailPositionHierarchy = () => {
  const navigate = useNavigate();
  const { data_detail, loading, data_position, data_employee } = useSelector(
    (state) => state?.position_hierarchy
  );
  const { bodyError } = useSelector((state) => state?.general);
  const dispatch = useDispatch();
  const location = useLocation();
  const id = location?.state?.id;
  const containerRefHierarchy = useRef(null);
  // use state
  const [openModal, setOpenModal] = useState(false);
  const [openBackModal, setOpenBackModal] = useState(false);
  const [dataDiagram, setDataDiagram] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [body, setBody] = useState({});
  //use effect
  useEffect(() => {
    dispatch(getPosition());
    if (id) {
      dispatch(getDetailHierarchy(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (id && data_detail && data_position) {
      const idMap = data_position?.reduce((acc, item) => {
        acc[item.id] = item?.name;
        return acc;
      }, {});
      const transformDataTable = data_detail?.rPhierarchys?.map(
        (item, index) => {
          return {
            key:
              hasValue(item?.parentId) === false || item?.parentId === ""
                ? 1
                : index + 2,
            id: item?.id,
            rHierId: item?.idHier,
            parentId:
              hasValue(item?.parentId) && hasValue(idMap[item.parentId])
                ? idMap[item.parentId]
                : null,
            positionId:
              hasValue(item?.positionId) && hasValue(idMap[item.positionId])
                ? idMap[item.positionId]
                : null,
            positionName: item?.positionName,
            employeeCount: item?.employeeCount,
            status: item?.status,
            remark: item?.description,
          };
        }
      );
      setDataDiagram(transformDataTable);
    }
  }, [id, dispatch, data_detail, data_position]);

  // console.log(data_detail?.rPhierarchys);
  // console.log(dataDiagram);

  // handle cancel modal
  const handleCancel = () => {
    setOpenModal(false);
  };

  const handleDetailPosition = async (record) => {
    try {
      setBody(record?.id);
      await dispatch(getDetailPosition(record?.id))?.unwrap();
      setOpenModal(true);
    } catch (error) {
      await dispatch(getPosition())?.unwrap();
      setOpenModal(false);
    }
  };
  const transformDataToTree = (data) => {
    const nodes = {};
    const rootNodeIds = new Set();
    if (data?.length === 0) {
      return [{ name: "No Data", children: [] }];
    } else {
      data.forEach((node) => {
        const { positionId, parentId } = node;
        nodes[positionId] = { ...node, children: [] };
        if (hasValue(parentId) === false) {
          rootNodeIds.add(positionId);
        }
      });

      data.forEach((node) => {
        const { positionId, parentId } = node;
        if (hasValue(parentId)) {
          if (nodes[parentId]) {
            nodes[parentId].children.push(nodes[positionId]);
          }
        }
      });
    }

    return Array.from(rootNodeIds).map((rootId) => {
      if (nodes[rootId]?.children?.length > 0) {
        return nodes[rootId];
      } else {
        return { data: nodes[rootId]?.children?.length };
      }
    });
  };

  const renderForeignObjectNode = ({
    nodeDatum,
    toggleNode,
    onSelectedSearch,
    foreignObjectProps,
  }) => {
    return (
      <g data-id={nodeDatum?.id} onClick={toggleNode}>
        <circle r={10} className={"bg-black"}></circle>
        <foreignObject {...foreignObjectProps}>
          <div
            style={{
              backgroundColor: "lightblue",
              textAlign: "center",
              borderRadius: "5px",
            }}
            onClick={() => handleDetailPosition(nodeDatum)}
          >
            <div className="flex justify-center rounded-lg m-2">
              <div className="flex-col items-center my-2">
                <div className={"flex gap-3 justify-center mx-auto w-full"}>
                  <div className="flex-col items-center justify-center">
                    <p className="text-black leading-none text-[12px] text-center">
                      {nodeDatum.positionId}
                    </p>
                    <p>
                      <Tooltip
                        placement="top"
                        title={nodeDatum?.positionName
                          ?.split(",")
                          ?.map((item) => (
                            <p className="text-white text-[12px] text-center">
                              {item}
                            </p>
                          ))}
                        className="text-[12px]"
                      >
                        {nodeDatum.employeeCount}{" "}
                        Employee(s)
                      </Tooltip>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </foreignObject>
      </g>
    );
  };

  const routes = [
    {
      path: "",
      breadcrumbName: "Master Data",
    },
    {
      path: USER_ROUTES.VIEW_POSITION,
      breadcrumbName: "Position Hierarchy List",
    },
    {
      path: "",
      breadcrumbName: "Detail Position Hierarchy",
    },
  ];

  // handle select
  const onSelectedSearch = (value) => {
    setSelectedNode(value);
  };

  // download image
  const handleDownloadPDF = () => {
    const input = containerRefHierarchy.current;
    const name = data_detail?.name;

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("landscape");

      // add title
      const pageWidth = pdf.internal.pageSize.getWidth();
      const textWidth = pdf.getTextWidth(name);
      const titleX = (pageWidth - textWidth) / 2;
      pdf.text(name, titleX, 10);

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      const yOffset = 20;
      pdf.addImage(imgData, "PNG", 0, yOffset, pdfWidth, pdfHeight);
      pdf.save(`${name}.pdf`);
    });
  };
  // download hierarchy
  const downloadDetailHierarchy = async (type) => {
    switch (type) {
      case "excel":
        break;

      default:
        handleDownloadPDF();
        break;
    }
  };

  const handleRetry = () => {
    try {
      handleCancelTryAgain();
      if (bodyError?.action === "GET_DETAIL_HIERARCHY") {
        dispatch(getDetailHierarchy(id));
      } else if (bodyError?.action === "GET_DETAIL_POSITION") {
        dispatch(getDetailPosition(body));
      }
      dispatch(getPosition());
    } catch (error) {
      dispatch(getPosition());
    }
  };

  const { renderModal, handleCancelTryAgain } = useTryAgainHooks(handleRetry);

  // console.log(transformDataToTree(dataDiagram));

  return (
    <>
      <BreadCrumb routes={routes} />
      <Spin spinning={loading}>
        <BaseContainer header={"POSITION HIERARCHY INFORMATION"}>
          <div className={"w-full flex flex-col max-h-screen"}>
            <div
              className={"h-1/6 w-full grid grid-cols-4 gap-10 flex-wrap mx-5"}
            >
              <DetailText label={"Position"}>{data_detail?.name}</DetailText>
              <DetailText label={"Status"}>
                {toTitleCase(data_detail?.status)}
              </DetailText>
              <DetailText label={"Start Date"}>
                {hasValue(data_detail?.startDate) && data_detail?.startDate}
              </DetailText>
              <DetailText label={"End Date"}>
                {hasValue(data_detail?.endDate) && data_detail?.endDate}
              </DetailText>
            </div>
            <div className="w-full mx-5">
              <DetailText label={"Description"}>
                {data_detail?.description}
              </DetailText>
            </div>
          </div>
        </BaseContainer>
        <BaseContainer header={"HISTORY LOG  INFORMATION"}>
          <div className={"w-full flex flex-col max-h-screen"}>
            <div
              className={"h-1/6 w-full grid grid-cols-5 gap-10 flex-wrap mx-5"}
            >
              <DetailText label={"Record Id"}>{data_detail?.id}</DetailText>
              <DetailText label={"Created Date"}>
                {hasValue(data_detail?.createdDate) &&
                  renderDateConverter(data_detail?.createdDate, "datetime")}
              </DetailText>
              <DetailText label={"Created By"}>
                {data_detail?.createdBy}
              </DetailText>
              <DetailText label={"Updated Date"}>
                {hasValue(data_detail?.updatedDate) &&
                  renderDateConverter(data_detail?.updatedDate, "datetime")}
              </DetailText>
              <DetailText label={"Updated By"}>
                {data_detail?.updatedBy}
              </DetailText>
            </div>
          </div>
        </BaseContainer>
        <BaseContainer header={"POSITION HIERARCHY"}>
          <div className={"w-full"}>
            {transformDataToTree(dataDiagram)[0]?.data !== 0 && (
              <div className={"w-full flex justify-between"}>
                <div className="w-4/12">
                  <SelectComponent
                    placeholder="Search Position"
                    onChange={onSelectedSearch}
                  >
                    {dataDiagram?.map((item) => (
                      <Select.Option value={item?.id}>
                        {item?.positionId}
                      </Select.Option>
                    ))}
                  </SelectComponent>
                </div>
                <div className={"flex gap-2"}>
                  <ButtonComponent
                    type={"submit"}
                    border={false}
                    // onClick={() => downloadDetailHierarchy("excel")}
                  >
                    Download Excel
                  </ButtonComponent>
                  <ButtonComponent
                    type={"submit"}
                    border={false}
                    onClick={() => downloadDetailHierarchy("pdf")}
                  >
                    Download PDF
                  </ButtonComponent>
                </div>
              </div>
            )}
            {data_detail?.rPhierarchys?.length === 0 ? (
              <div
                className={
                  "w-full bg-gray-200 flex justify-center items-center my-10"
                }
              >
                <span> Area Bagan Hierarchy</span>
              </div>
            ) : (
              <div ref={containerRefHierarchy}>
                <HierarchyComponent
                  data={transformDataToTree(dataDiagram)}
                  nodeWidth={150}
                  nodeHeight={400}
                  collapse={true}
                  zoomable={true}
                  containerHeight={"50vh"}
                  renderCustomNode={renderForeignObjectNode}
                  selectNode={selectedNode}
                  onSelectedSearch={onSelectedSearch}
                  nodeSize={{ x: 165, y: 190 }}
                  // zoom={selectedSearch}
                />
              </div>
            )}
          </div>
        </BaseContainer>
        <div className={"w-full flex"}>
          <ButtonComponent
            type={"submit"}
            border={false}
            onClick={() => setOpenBackModal(true)}
            className={"my-5"}
          >
            Back
          </ButtonComponent>

        </div>

        {/* modal back confirmation */}
        <ModalBack
          isOpen={openBackModal}
          handleCancel={() => setOpenBackModal(false)}
          handleOk={() => navigate(-1)}
        />

        {/* modal detail position */}
        <ModalCustom
          isOpen={openModal}
          handleCancel={handleCancel}
          header={"ASSIGNMENT HISTORY"}
          width={980}
          footer={
            <div className={"w-full flex justify-end gap-5"}>
              <ButtonComponent border={true} onClick={handleCancel}>
                Back
              </ButtonComponent>
            </div>
          }
        >
          <Spin spinning={loading}>
            <DetailPosition
              data_detail={data_employee}
              handleCancelModal={handleCancel}
              data_position={data_position}
            />
          </Spin>
        </ModalCustom>

        {/* render modal try again */}
        {renderModal()}
      </Spin>
    </>
  );
};

export default DetailPositionHierarchy;
