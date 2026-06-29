import { LeftOutlined } from "@ant-design/icons";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import AttachmentComponent from "../../../../../../components/Attachment/AttachmentComponent";
import BaseContainer from "../../../../../../components/BaseContainer";
import BreadCrumb from "../../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import ModalApproveOrReject from "../../../../../../components/Modal/ModalApproveOrReject";
import RadioTabs from "../../../../../../components/RadioTabs";
import { configApp } from "../../../../../../constants/configApp";
import ratingBillingHttpService from "../../../../../../redux/services/ratingBillingHttpService";
import { getConfigFileRBIData } from "../../../../../../redux/slices/attachmentSlice";
import {
  approveCreate,
  approveRejectActivated,
  approveRejectInactive,
  getDetailDR,
  getDetailDraftDR,
} from "../../../../../../redux/slices/rating_billing_invoice/MasterData/dailyrate";
import { RBI_ROUTES } from "../../../../../../routes/rating_billing/rbi_routes";
import DetailDailyRate from "./DetailDailyRate";
import CardContainer from "../../../../../../components/CardContainer";

const ListDetailDailyRate = () => {
  const { data_detail, data_detail_draft } = useSelector(
    (state) => state.daily_rate,
  );
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const id = location?.state?.id;

  const [approveOrReject, setApproveOrReject] = useState("");
  const [modalConfirm, setModalConfirm] = useState(false);
  const [remark, setRemark] = useState("");
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [dataText, setDataText] = useState({});
  const [dataTextDraft, setDataTextDraft] = useState({});
  const [convertedRates, setConvertedRates] = useState();
  const [convertedRatesDraft, setConvertedRatesDraft] = useState();

  //handle radio tab
  const [tabData, setTabData] = useState([
    { value: "Daily Rate" },
    { value: "Attachment" },
  ]);
  const [segmentedPage, setSegmentedPage] = useState(tabData[0].value);
  const handleSegmentedPage = (e) => {
    setSegmentedPage(e.target.value);
  };

  useEffect(() => {
    if (id) {
      dispatch(getDetailDR(id));
      dispatch(getDetailDraftDR(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (
      id &&
      data_detail?.ratesId &&
      data_detail &&
      data_detail?.ratesId === id
    ) {
      setDataText(data_detail);
      setConvertedRates(data_detail?.convertedRate);
      const dataAttachment = (data_detail?.mattachments || []).map((item) => {
        return {
          id: item.id,
          size: item.size,
          fileName: item.fileName,
          fileSize: item.fileSize,
          fileType: item.fileType,
          fileCategoryId: item.fileCategoryId,
          fileCategoryName: item.fileCategoryName,
          pathFile: item.pathFile,
          urlFile1: item.urlFile1,
          urlFile2: item.urlFile2,
          createdBy: item.createdBy,
          createdDate: item.createdDate
            ? moment(item.createdDate).format("DD MMM YYYY")
            : "",
          dataType: "exist",
        };
      });
      setListDataAttachment(dataAttachment);
    }
    if (
      id &&
      data_detail_draft?.ratesId === id &&
      data_detail_draft &&
      data_detail_draft?.ratesId === data_detail?.ratesId
    ) {
      setDataTextDraft(data_detail_draft);
      setConvertedRatesDraft(data_detail_draft?.convertedRate);
      setTabData([
        { value: "Daily Rate" },
        // { value: "Draft" },
        { value: "Attachment" },
      ]);
    }
  }, [id, data_detail, data_detail_draft]);

  const showButtonApproval = data_detail?.isApprover;
  const approvalType = (data_detail?.approvalType || "").toUpperCase();
  const isCreateApproval = approvalType === "DAILY_RATES";
  const isInactiveApproval =
    approvalType === "INACTIVE_DAILY_RATES" ||
    approvalType === "INACTIVE_DAILY_RATE";
  const isActivatedApproval =
    approvalType === "ACTIVATED_DAILY_RATES" ||
    approvalType === "ACTIVATED_DAILY_RATE";

  // handle Confirm
  const handleConfirm = (res, handleClear) => {
    const data = {
      id: id,
      remark: res.remark,
      approvalId: data_detail?.tappId,
      action: approveOrReject,
    };

    setModalConfirm(false);

    if (isCreateApproval) {
      dispatch(approveCreate({ body: data }));
    } else if (isActivatedApproval) {
      dispatch(approveRejectActivated({ body: data }));
    } else if (isInactiveApproval) {
      dispatch(approveRejectInactive({ body: data }));
    } else {
      dispatch(approveRejectInactive({ body: data }));
    }

    handleClear();
  };

  const tempValue = convertedRates ? (convertedRates + "").split(".") : [];
  const thousandSeparator = ",";
  const decimalSeparator = ".";
  const descimal = tempValue[1]
    ? `${decimalSeparator}${tempValue[1]}`
    : `${decimalSeparator}00`;

  const convertedRate =
    tempValue.length > 0
      ? tempValue[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator) +
        descimal
      : "";

  const handleCancel = () => {
    setRemark("");
    setModalConfirm(false);
  };
  // Breadcrumbs
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
      path: RBI_ROUTES.DAILY_RATE_VIEW,
      breadcrumbName: "Daily Rate",
    },
    {
      path: "",
      breadcrumbName: `Detail Daily Rate`,
    },
  ];

  //control radio Tab
  const renderSection = (segmentedPage) => {
    switch (segmentedPage) {
      case "Daily Rate":
        return (
          <DetailDailyRate
            key={"active"}
            data_detail={dataText}
            // totalData={totalElement}
            // data_req={data_detail?.tApprovalDto}
          />
        );
      case "Attachment":
        return (
          <CardContainer header={"ATTACHMENT INFORMATION"}>
            <AttachmentComponent
              type={"detail"}
              data={listDataAttachment}
              updateData={setListDataAttachment}
              typeSelector={"daily_rate"}
              dispatch={dispatch}
              // getAPICategory={getListCategory}
              service={ratingBillingHttpService}
              configApplication={configApp.RATING_BILLING_SERVICE}
              getAPIGuard={getConfigFileRBIData}
              typeRBI={"data"}
            />
          </CardContainer>
        );
      // case "Draft":
      //   return (
      //     <DetailDailyRate
      //       key={"draft"}
      //       data_detail={dataTextDraft}
      //       // totalData={totalElementDraft}
      //       // data_req={data_detail_draft?.tApprovalDto}
      //     />
      //   );
      default:
        return (
          <DetailDailyRate
            key={"active"}
            data_detail={dataText}
            // totalData={totalElement}
            // data_req={data_detail?.tApprovalDto}
          />
        );
    }
  };

  return (
    <>
      <BreadCrumb routes={routes} />
      <div>
        <RadioTabs data={tabData} onChange={handleSegmentedPage} />

        {renderSection(segmentedPage)}
      </div>

      <div className="flex mt-[10px] justify-between">
        <ButtonComponent type={"submit"} onClick={() => navigate(-1)}>
          Back
        </ButtonComponent>

        {showButtonApproval === true ? (
          <div className="flex align-middle gap-5">
            <ButtonComponent
              type="reject"
              onClick={() => {
                setModalConfirm(true);
                setApproveOrReject("REJECT");
              }}
            >
              Reject
            </ButtonComponent>
            <ButtonComponent
              type="approve"
              onClick={() => {
                setModalConfirm(true);
                setApproveOrReject("APPROVE");
              }}
            >
              Approve
            </ButtonComponent>
          </div>
        ) : null}
      </div>

      {/* Modal Approve/Reject*/}
      <ModalApproveOrReject
        isOpen={modalConfirm}
        handleCloseModal={handleCancel}
        onFinish={handleConfirm}
        header={approveOrReject}
        approveOrReject={approveOrReject}
        menu={"Daily Rate"}
        named={data_detail?.rateType}
      />
      {/* <ModalApproveOrReject
        key={modalConfirm ? true : false}
        isOpen={modalConfirm}
        header={`${approveOrReject} information`}
        message={`Are you sure you want to ${approveOrReject} this Daily Rate with 
        Converted Rate ${convertedRate} ?`}
        width={1000}
        handleCancel={handleCancel}
        footer={
          <div className={"w-full flex justify-end gap-5"}>
            <ButtonComponent type={"default"} onClick={handleCancel}>
              Cancel
            </ButtonComponent>
            <ButtonComponent
              form={"formApproveRejcet"}
              type={"submit"}
              htmlType={"submit"}
              border={false}
            >
              Confirm
            </ButtonComponent>
          </div>
        }
      >
        <Form name="formApproveRejcet" onFinish={handleConfirm}>
          <Form.Item
            name={"remark"}
            rules={[{ message: requiredMessage("Remark"), required: true }]}
          >
            <InputComponent
              rows={1}
              placeholder="Type your remark"
              type="textarea"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
            />
          </Form.Item>
        </Form>
      </ModalApproveOrReject> */}
    </>
  );
};

export default ListDetailDailyRate;
