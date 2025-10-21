import React, { useCallback, useEffect } from "react";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import BreadCrumb from "../../../../../components/BreadCrumb";
import { RBI_ROUTES } from "../../../../../routes/rating_billing/rbi_routes";
import ButtonComponent from "../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../assets/Icon/index";
import RadioTabs from "../../../../../components/RadioTabs";
import { useState } from "react";
import UploadLayout from "../UploadLayout";
import ApprovalLayout from "../ApprovalLayout";
import { Form, Modal, Spin } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  clearUpdatedDeleted,
  getDetailBatch,
  getDownloadFailed,
  setClearData,
} from "../../../../../redux/slices/rating_billing_invoice/monitoring_usage";
import { SummaryTable } from "../SummaryTableUpdateDelete";
import { ModalAttention } from "../../../../../components/Modal/ModalPopUp";
import ConfirmationUpdateDetail from "../ConfirmationUpdateDetail";
import DetailUpload from "./DetailUpload";
import ModalUpdateUsage from "../ModalUpdateUsage";

const DetailPage = () => {
  const { detail_batch, loading, updatedData, deletedData } = useSelector(
    (state) => state.monitoring_usage,
  );
  const [tabHeader, setTabHeader] = useState("Upload");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isSubmit, setIsSubmit] = useState(false);
  const [apphierId, setApphierId] = useState(null);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [modalConfirmation, setModalConfirmation] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const batchId = location?.state?.id;
  const [dataTabs, setDataTabs] = useState([
    {
      key: "upload",
      value: "Upload",
      // paramValue: []
    },
    {
      key: "approval",
      value: "Approval",
      paramValue: ["approval"],
    },
  ]);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [form] = Form.useForm();
  const [dataHeader, setDataHeader] = useState(null);
  const [dataTable, setDataTable] = useState([]);
  const [batchID, setBatchID] = useState(batchId);
  // use effect
  useEffect(() => {
    dispatch(clearUpdatedDeleted());
    if (detail_batch) {
      setDataHeader(detail_batch);
      setDataTable(detail_batch?.usageList?.result);
      setApphierId(detail_batch?.batchInformation?.apphierId);
    }
  }, [detail_batch, dispatch]);

  useEffect(() => {
    if (batchId) {
      dispatch(getDetailBatch({ page, pageSize, batchId }));
    }
  }, [batchId, dispatch, page, pageSize]);

  // change tabs
  const changeTabHeader = (e) => {
    setTabHeader(e.target.value);
  };

  // handle error
  const handleFinishError = ({ values, errorFields, outOfDate }) => {
    console.log(errorFields, " error field");
    setDataTabs((prevState) => {
      const res = prevState.map((item) => {
        if (!item.paramValue || item.paramValue.length < 0) {
          return {
            value: item.value,
            paramValue: item.paramValue,
          };
        }
        const errorBadge = errorFields.reduce(
          (current, next) =>
            item.paramValue.includes(next.name[0]) ? current + 1 : current,
          0,
        );
        return {
          value: item.value,
          paramValue: item.paramValue,
          errorBadge,
        };
      });
      console.log(res, " res");
      return res;
    });
  };
  // handle Save
  const handleSave = () => {
    // setShowSummaryModal(true)
    if (apphierId === null) {
      // console.log("apphierid null")
      // setModalConfirmation(true)
    } else {
      // setShowSummaryModal(true);
      setOpenConfirmation(true);
    }
  };

  const handleApprovalChangeFromLayout = (newApphierId) => {
    setApphierId(newApphierId);
  };

  const handleClose = () => {
    setModalConfirmation(false);
    setOpenConfirmation(false);
  };

  const handleDownloadFailed = () => {
    dispatch(getDownloadFailed(batchId))
      .unwrap()
      .then((response) => {
        // openNotification("success","Success", "Template successfully dowloaded");
        console.log("Download successful", response);
      })
      .catch((error) => {
        // openNotification("error","Error", error.message);
        console.error("Download failed", error);
      });
  };

  const handleBack = () => {
    navigate(-1);
    dispatch(clearUpdatedDeleted());
  };

  const routes = [
    {
      path: "",
      breadcrumbName: "Rating Billing",
    },
    {
      path: RBI_ROUTES.MONITORING_USAGE_VIEW,
      breadcrumbName: "Monitoring Usage",
    },
    {
      path: "",
      breadcrumbName: "Detail Batch Usage",
    },
  ];

  return (
    <LayoutMenu>
      <BreadCrumb routes={routes} />
      <Spin spinning={loading}>
        <div className={"w-full flex justify-start"}>
          <RadioTabs
            data={dataTabs}
            onChange={changeTabHeader}
            currentPosition={tabHeader}
          />
        </div>
        <div className={"w-full flex justify-end"}>
          {tabHeader === "Upload" && (
            <ButtonComponent
              type={"submit"}
              icon={<SVGIcon name="IconButtonDownload" width={24} />}
              onClick={handleDownloadFailed}
            >
              Download Failed Data
            </ButtonComponent>
          )}
        </div>
        <Form
          form={form}
          onFinishFailed={handleFinishError}
          onFinish={handleSave}
          layout="vertical"
        >
          {tabHeader === "Upload" ? (
            <DetailUpload
              form={form}
              dataHeader={dataHeader}
              dataTable={dataTable}
              setDataTable={setDataTable}
              id={batchId}
            />
          ) : (
            <ApprovalLayout
              type={"detail-approval"}
              onApprovalChange={setApphierId}
              selectedAppHierId={apphierId}
              status={detail_batch?.batchInformation?.status}
              form={form}
            />
          )}
          <div className={"w-full flex mt-5"}>
            <div className={"w-full justify-start"}>
              <Form.Item>
                <ButtonComponent
                  type={"submit"}
                  icon={
                    <LeftOutlined
                      style={{
                        color: "#fff",
                        fontSize: 16,
                        justifyItems: "left",
                      }}
                    />
                  }
                  // onClick={handleBackPage}
                  onClick={handleBack}
                >
                  Back
                </ButtonComponent>
              </Form.Item>
            </div>
            {detail_batch?.batchInformation?.status !== "COMPLETE" && (
              <div className={"w-full justify-end flex gap-2"}>
                <Form.Item>
                  <ButtonComponent
                    type={"submit"}
                    icon={<SVGIcon name={`IconButtonClear`} width={24} />}
                  >
                    Clear
                  </ButtonComponent>
                </Form.Item>
                <Form.Item>
                  <ButtonComponent
                    type={"submit"}
                    htmlType={"submit"}
                    onClick={() => {
                      setIsSubmit(false);
                    }}
                  >
                    Save as Draft
                  </ButtonComponent>
                </Form.Item>
                <Form.Item>
                  <ButtonComponent
                    type={"submit"}
                    htmlType={"submit"}
                    onClick={() => {
                      setIsSubmit(true);
                    }}
                  >
                    Save & Submit
                  </ButtonComponent>
                </Form.Item>
              </div>
            )}
          </div>
          {showSummaryModal && (
            <SummaryTable
              visible={showSummaryModal}
              onClose={() => setShowSummaryModal(false)}
              updatedData={updatedData}
              deletedData={deletedData}
              apphierId={apphierId}
              batchId={batchId}
              isSubmit={isSubmit}
            />
          )}
          <ModalAttention
            isOpen={modalConfirmation}
            handleCancel={handleClose}
            handleOk={handleClose}
            textList={"approval hierarchy"}
          />

          <ConfirmationUpdateDetail
            isOpen={openConfirmation}
            handleCancel={handleClose}
            detail_batch={detail_batch}
            setApphierId={setApphierId}
            apphierId={apphierId}
            updatedData={updatedData}
            deletedData={deletedData}
            batchId={batchID}
            isSubmit={isSubmit}
            dataTable={dataTable}
            setDataTable={setDataTable}
          />
        </Form>
      </Spin>
    </LayoutMenu>
  );
};

export default DetailPage;
