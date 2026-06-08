import React, { useRef } from "react";
import BreadCrumb from "../../../../components/BreadCrumb";
import BaseContainer from "../../../../components/BaseContainer";
import ButtonComponent from "../../../../components/ButtonComponent";
import { Select, Spin, Tooltip } from "antd";
import { ArrowLeftOutlined, WarningOutlined } from "@ant-design/icons";
import { USER_ROUTES } from "../../../../routes/user_management/user_routes";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  downloadDetail,
  getDetailCostCenter,
  getDetailDataAccess,
} from "../../../../redux/slices/user_management/data_access";
import DataAccessInformation from "./DataAccessInformation";
import HistoryInformation from "./HistoryInformation";
import HierarchyComponent from "../../../../components/HierarchyComponent";
import { useState } from "react";
import ModalCustom from "../../../../components/Modal/ModalCustom";
import { ModalConfirm } from "../../../../components/Modal/ModalPopUp";
import DetailCostCenterLayout from "./DetailCostCenterLayout";
import SelectComponent from "../../../../components/SelectComponent";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useTryAgainHooks } from "../../../../utils/useTryAgainHooks";
const { Option } = Select;
const DetailDataAccessHierarchy = () => {
  const { data_detail, loading, data } = useSelector((state) => state.data_access);
  const { bodyError } = useSelector(state => state?.general);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const id = location?.state?.id;
  const containerRefHierarchy = useRef(null);


  // use state
  const [costCenters, setCostCenters] = useState([]);
  const [selectedSearch, setSelectedSearch] = useState();
  const [modalBack, setModalBack] = useState(false);
  const [modalCostCenter, setModalCostCenter] = useState(false);
  const [selectedData, setSelectedData] = useState({})
  const [body, setBody] = useState({});
  useEffect(() => {
    dispatch(getDetailDataAccess(id));
    if (data) {
      setSelectedData({
        ...data?.data,
        id : data?.data?.rDahId,
        sibling: data?.data?.sibling?.length > 0 ? data?.data?.sibling?.map(item => item?.sibling) : []
      })
    }
  }, [dispatch, id, data]);

  useEffect(() => {
    if (data_detail?.rDataAccessHierarchy?.length > 0) {
      setCostCenters(data_detail?.rDataAccessHierarchy);
    } else {
      setCostCenters([]);
    }
  }, [data_detail]);


  const transformDataToTree = (data) => {
    const nodes = {};
    const rootNodeIds = new Set();
    if (data?.length === 0) {
      return [{ name: "No Data", children: [] }];
    } else {
      data?.forEach((node) => {
        const { costCenter, parent } = node;
        nodes[costCenter] = { ...node, children: [] };
        if (parent === null || parent === "" || parent === undefined) {
          rootNodeIds?.add(costCenter);
        }
      });
      data?.forEach((node) => {
        const { costCenter, parent } = node;
        if (parent !== null || parent === "" || parent === undefined) {
          nodes[parent]?.children?.push(nodes[costCenter]);
        }
      });
    }
    return Array.from(rootNodeIds).map((rootId) => nodes[rootId]);
  };

  const onSelectedSearch = (value) => setSelectedSearch(value);
  const routes = [
    {
      path: "",
      breadcrumbName: "Master Data",
    },
    {
      path: USER_ROUTES.VIEW_DATA_ACCESS,
      breadcrumbName: "Data Access Hierarchy",
    },
    {
      path: "",
      breadcrumbName: "Detail Data Access Hierarchy",
    },
  ];

  // handle detail cost center 
  const handleDetailCostCenter = async (e) => {
    try {
      setBody(e);
      await dispatch(getDetailCostCenter(e))?.unwrap();
      setModalCostCenter(true)
    } catch (error) {
      await dispatch(getDetailDataAccess(id))?.unwrap()
      setModalCostCenter(false)
    }
  }


  const renderCustomNode = ({ nodeDatum, toggleNode, foreignObjectProps }) => {
    return (
      <g>
        <circle r={10} className={"bg-black"} onClick={toggleNode}></circle>
        <foreignObject {...foreignObjectProps} >
          <div style={{ backgroundColor: 'lightblue', textAlign: 'center', borderRadius: '5px', }} onClick={() => handleDetailCostCenter(nodeDatum?.rDahId)} >
            <div className="flex justify-center rounded-lg m-2">
              <div className="flex-col items-center my-2">
                <div className={"flex gap-3 justify-center mx-auto w-full"}>
                  <div className="flex-col items-center justify-center">
                    <p className="text-black leading-none text-[12px] text-center">
                      {nodeDatum.costCenter}
                    </p>
                    {nodeDatum?.sibling?.length > 0 &&
                      <div className=" text-[12px] text-center">
                        <Tooltip placement="top" title={nodeDatum?.sibling?.map((item) => (
                          <p className="text-white text-[12px] text-center">
                            {item?.sibling}
                          </p>
                        ))}>
                          {nodeDatum?.sibling?.length + " Sibling"}
                        </Tooltip>
                      </div>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </foreignObject>
      </g>
    )
  };

  const handleDownloadPDF = () => {
    const input = containerRefHierarchy.current;
    const name = data_detail?.name;


    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape');

      // add title
      const pageWidth = pdf.internal.pageSize.getWidth();
      const textWidth = pdf.getTextWidth(name);
      const titleX = (pageWidth - textWidth) / 2;
      pdf.text(name, titleX, 10);

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      const yOffset = 20;
      pdf.addImage(imgData, 'PNG', 0, yOffset, pdfWidth, pdfHeight);
      pdf.save(`${name}.pdf`);
    });
  }
  const downloadDetailHierarchy = async (type) => {
    switch (type) {
      case 'excel':
        setBody({ id, type })
        await dispatch(downloadDetail({ id, type }))?.unwrap();
        break;

      default:
        handleDownloadPDF();
        break;
    }
  };

  const handleRetry = () => {
    try {
      handleCancelTryAgain();
      if (bodyError?.action === 'DOWNLOAD_DATA_ACCESS') {
        dispatch(downloadDetail(body))
      } else if (bodyError?.action ==='GET_DETAIL_COST_CENTER') {
        dispatch(getDetailCostCenter(body))
      }
      dispatch(getDetailDataAccess(id));
    } catch (error) {
      dispatch(getDetailDataAccess(id));
    }
  }

  const { handleCancelTryAgain, renderModal } = useTryAgainHooks(handleRetry);
  return (
    <>
      <BreadCrumb routes={routes} />
      <Spin spinning={loading}>
        <div className={"w-full flex flex-col gap-5 my-5"}>
          <DataAccessInformation data={data_detail} />
          <HistoryInformation data={data_detail} />
          <BaseContainer header={"DATA ACCESS HIERARCHY"}>
            <div className={"w-full flex flex-col gap-5"}>
              <div className={"w-full flex justify-between"}>
                <div className='w-4/12'>
                  <SelectComponent
                    placeholder="Search Cost Center"
                    onChange={onSelectedSearch}
                  >
                    {costCenters?.map((item) => (
                      <Option value={item?.costCenter}>
                        {item?.costCenter}
                      </Option>
                    ))}
                  </SelectComponent>
                </div>
                <div className={"flex gap-2"}>
                  <ButtonComponent
                    type={"submit"}
                    border={false}
                    onClick={() => downloadDetailHierarchy("excel")}
                  >
                    Download Excel
                  </ButtonComponent>
                  {/* Download PDF disabled: /v1/dbs/api/dah/download-pdf/{id} endpoint does not exist yet */}
                  <ButtonComponent
                    type={"submit"}
                    border={false}
                    disabled={true}
                    onClick={() => downloadDetailHierarchy("pdf")}
                    title="Feature not available"
                  >
                    Download PDF
                  </ButtonComponent>
                </div>
              </div>
              <div className={"w-full text-center"}>
                {costCenters?.length === 0 ? (
                  <div
                    className={
                      "w-full bg-gray-200 flex justify-center items-center"
                    }
                  >
                    <span> Area Bagan Hierarchy</span>
                  </div>
                ) : (
                  <div ref={containerRefHierarchy}>

                    <HierarchyComponent
                      data={transformDataToTree(costCenters)}
                      nodeWidth={150}
                      nodeHeight={400}
                      collapse={true}
                      zoomable={true}
                      containerHeight={"50vh"}
                      renderCustomNode={renderCustomNode}
                      zoom={selectedSearch}
                      nodeSize={{ x: 165, y: 170 }}

                    />
                  </div>
                )}
              </div>
            </div>
          </BaseContainer>
          <ButtonComponent
            type={"submit"}
            icon={<ArrowLeftOutlined style={{ fontSize: "24px" }} />}
            border={false}
            onClick={() => navigate(-1)}
          >
            Back
          </ButtonComponent>
        </div>

        <ModalCustom
          header={'detail cost center'}
          isOpen={modalCostCenter}
          handleCancel={() => setModalCostCenter(false)}
          type={'detail'}
          width={1000}
          footer={
            <ButtonComponent border={true} onClick={() => setModalCostCenter(false)}>
              Back
            </ButtonComponent>
          }
        >
          <DetailCostCenterLayout
            // type={type}
            detatilCostCenter={selectedData}
          // rDahId={id}
          />
        </ModalCustom>
        {/* modal back */}
        <ModalConfirm
          isOpen={modalBack}
          handleCancel={() => setModalBack(false)}
          handleOk={() => navigate(-1)}
          width={400}
        >
          <div className="flex justify-center mt-5 gap-[20px]">
            <WarningOutlined style={{ fontSize: "24px", color: "#BE3036" }} />
            <p className="text-[18px] font-bold">
              Are you sure you want to back?
            </p>
          </div>
        </ModalConfirm>
      </Spin>

      {/* moda try again */}
      {renderModal()}
    </>
  );
};

export default DetailDataAccessHierarchy;
