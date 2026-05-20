import { LeftOutlined } from "@ant-design/icons";
import { Form, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import BaseContainer from "../../../../../components/BaseContainer";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import ModalApproveOrReject from "../../../../../components/Modal/ModalApproveOrReject";
import RadioTabs from "../../../../../components/RadioTabs";
import { getListCriteria } from "../../../../../redux/slices/receipt_collection/bankSlice";
import {
  approveOrRejectInactiveTrans,
  approveOrRejectInactiveTransInactive,
  getDetailTransaction,
  getDetailTransactionDraft,
} from "../../../../../redux/slices/receipt_collection/transactionCalender";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";
import DetailTransactionCalender from "./DetailTransactionCalender";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import moment from "moment";
import { configApp } from "../../../../../constants/configApp";
import receiptCollectionHttpService from "../../../../../redux/services/receiptCollectionHttpService";

const ListDetailTransactionCalender = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [remark, setRemark] = useState("");
  const [modalConfirm, setModalConfirm] = useState(false);
  const [approveOrReject, setApproveOrReject] = useState("");
  const [form] = Form.useForm();
  const id = location?.state?.id;
  const statusApproval = location?.state?.statusApproval;
  const [valueOrUnlimited, setValueOrUnlimited] = useState(false);
  const [criteriaValues, setCriteriaValues] = useState([]);
  const [listDataCriteria, setListDataCriteria] = useState([]);
  const [criteriaValuesDraft, setCriteriaValuesDraft] = useState([]);
  const [listDataCriteriaDraft, setListDataCriteriaDraft] = useState([]);
  const [dataText, setDataText] = useState({});
  const [dataTextDraft, setDataTextDraft] = useState({});
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [listDataAttachmentDraft, setListDataAttachmentDraft] = useState([]);
  const [nameDetailCriteria, setNameDetailCriteria] = useState();
  const [nameDetailCriteriaDraft, setNameDetailCriteriaDraft] = useState([]);

  // Define tabData before using it in useState
  const [tabData, setTabData] = useState([
    { value: "Transaction Calendar" },
    { value: "Attachment" },
  ]);

  const { loading, data_detail, data_period, data_detail_draft } = useSelector(
    (state) => state.cycle
  );

  useEffect(() => {
    if (id) {
      dispatch(getDetailTransaction(id));
      dispatch(getDetailTransactionDraft(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (id && data_detail?.calendarDetailDto?.id === id) {
      // Data Criteria Select
      const criteriaSelect =
        data_detail?.calendarDetailDto?.criteriaDtoList?.map((item) => {
          return {
            id: item?.criteria,
            transactionCalendarId: item?.transactionCalendarId,
            name: item?.criteriaName,
          };
        });
      const nameCrit = criteriaSelect?.map((a) => a.name);
      const mappingCriteria = criteriaSelect?.map((a) => a.id);
      const dataCriteriaList = (
        data_detail?.calendarDetailDto?.criteriaDataDtoList || []
      ).map((item, index) => {
        return {
          id: item.id,
          startDate: item?.startDate,
          endDate: item?.endDate,
          referenceId: item.referenceId,
          budget: item.budget,
          subDistrict: item.subDistrict,
          district: item.district,
          city: item.city,
          province: item.province,
          area: item.area,
          sor: item.sor,
          industrialSector: item.industrialSector,
          product: item.product,
          gsizes: item.gsizes,
          customerSegment: item.customerSegment,
          accountGroup: item.accountGroup,
          accountClass: item.accountClass,
          accountCategory: item.accountCategory,
          customer: item.customer,
          key: index + 1,
          type: "exist",
          createdDate: item.createdDate,
          createdBy: item.createdBy,
          updatedDate: item.updatedDate,
          updatedBy: item.updatedBy,
        };
      });
      const dataAttachment = (data_detail?.attachmentDtoList || []).map(
        (item) => {
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
        }
      );
      setNameDetailCriteria(nameCrit);
      setListDataAttachment(dataAttachment);
      setListDataCriteria(dataCriteriaList);
      setCriteriaValues(mappingCriteria);
      setDataText(data_detail?.calendarDetailDto);
    }
    if (
      id &&
      data_detail_draft?.calendarDetailDto?.id === id &&
      data_detail_draft?.calendarDetailDto?.id ===
        data_detail?.calendarDetailDto?.id
    ) {
      // Data Criteria Select
      const criteriaSelect =
        data_detail_draft?.calendarDetailDto?.criteriaDtoList?.map((item) => {
          return {
            id: item?.criteria,
            transactionCalendarId: item?.transactionCalendarId,
            name: item?.criteriaName,
          };
        });
      const nameCrit = criteriaSelect?.map((a) => a.name);
      const mappingCriteria = criteriaSelect?.map((a) => a.id);
      const dataCriteriaList = (
        data_detail_draft?.calendarDetailDto?.criteriaDataDtoList || []
      ).map((item, index) => {
        return {
          id: item.id,
          startDate: item?.startDate,
          endDate: item?.endDate,
          referenceId: item.referenceId,
          budget: item.budget,
          subDistrict: item.subDistrict,
          district: item.district,
          city: item.city,
          province: item.province,
          area: item.area,
          sor: item.sor,
          industrialSector: item.industrialSector,
          product: item.product,
          gsizes: item.gsizes,
          customerSegment: item.customerSegment,
          accountGroup: item.accountGroup,
          accountClass: item.accountClass,
          accountCategory: item.accountCategory,
          customer: item.customer,
          key: index + 1,
          // type: "exist",
        };
      });
      const dataAttachment = (data_detail_draft?.attachmentDtoList || []).map(
        (item) => {
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
        }
      );
      setNameDetailCriteriaDraft(nameCrit);
      setListDataAttachmentDraft(dataAttachment);
      setDataTextDraft(data_detail_draft?.calendarDetailDto);
      setListDataCriteriaDraft(dataCriteriaList);
      setCriteriaValuesDraft(mappingCriteria);
      setTabData([
        { value: "Transaction Calendar" },
        { value: "Draft" },
        { value: "Attachment" },
      ]);
    }
  }, [id, data_detail, data_detail_draft]);

  // const [disabled, setdisabled] = useState((disabled = true));

  //handleTab
  const handleSegmentedPage = (e) => {
    setSegmentedPage(e.target.value);
  };
  const [segmentedPage, setSegmentedPage] = useState(tabData[0].value);

  useEffect(() => {
    dispatch(getListCriteria());
  }, [dispatch]);

  const handleChange = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };
  const renderSection = (segmentedPage) => {
    switch (segmentedPage) {
      case "Transaction Calendar":
        return (
          <DetailTransactionCalender
            data_detail={dataText}
            key={"Active"}
            id={id}
            statusApproval={statusApproval}
            type={"detail"}
            data={listDataCriteria}
            dataCriteria={criteriaValues}
            updateData={setListDataCriteria}
            data_req={data_detail?.tApprovalDto}
            detailNameCriteria={nameDetailCriteria}
          />
        );
      case "Draft":
        return (
          <DetailTransactionCalender
            data_detail={dataTextDraft}
            detailNameCriteria={nameDetailCriteriaDraft}
            statusApproval={statusApproval}
            id={id}
            key={"draft"}
            type={"detail"}
            data={listDataCriteriaDraft}
            dataCriteria={criteriaValuesDraft}
            updateData={setListDataCriteriaDraft}
            data_req={data_detail_draft?.tApprovalDto}
          />
        );
      case "Attachment":
        return (
          <BaseContainer header={"ATTACHMENT INFORMATION"}>
            <AttachmentComponent
              type={"detail"}
              data={listDataAttachment}
              updateData={setListDataAttachment}
              typeSelector="cycle"
              service={receiptCollectionHttpService}
              configApplication={configApp.PAYMENT_SERVICE}
            />
          </BaseContainer>
        );
      default:
        return <></>;
    }
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
      path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_TRANSACTION_CALENDER,
      breadcrumbName: "Transaction Calendar",
    },
    {
      path: RECEIPT_AND_COLLECTION_ROUTES.DETAIL_TRANSACTION_CALENDER,
      breadcrumbName: `Detail ${segmentedPage}`,
    },
  ];

  // handle Confirm
  const handleConfirm = (res, handleClear) => {
    if (data_detail?.tApprovalDto?.approvalType === "INACTIVE_TRANSACTION_CALENDAR") {
      const body = {
        id: id,
        remark: res.remark,
        approvalId: data_detail?.tApprovalDto?.tAppId,
        action: approveOrReject.toUpperCase(),
      };
      dispatch(approveOrRejectInactiveTransInactive({ body }));
      handleClear();
      setModalConfirm(false);
    } else {
      const body = {
        id: id,
        remark: res.remark,
        approvalId: data_detail?.tApprovalDto?.tAppId,
        action: approveOrReject.toUpperCase(),
      };
      dispatch(approveOrRejectInactiveTrans({ body }));
      handleClear();
      setModalConfirm(false);
    }
  };

  const showButtonApproval =
    data_detail?.calendarDetailDto?.statusApproval !== "APPROVED" &&
    data_detail?.tApprovalDto?.isApprover === true;

  const handleCancel = () => {
    setModalConfirm(false);
    setRemark("");
  };


  return (
    <>
      <BreadCrumb routes={routes} />
      <Spin spinning={loading}>
        <div>
          <RadioTabs data={tabData} onChange={handleSegmentedPage} />

          {renderSection(segmentedPage)}
        </div>

        <div className="flex mt-[30px] justify-between py-5">
          <ButtonComponent
            type={"submit"}
            onClick={() => navigate(-1)}
            icon={
              <LeftOutlined
                style={{
                  color: "#fff",
                  fontSize: 24,
                  justifyItems: "center",
                }}
              />
            }
          >
            Back
          </ButtonComponent>

          {showButtonApproval ? (
            <div className={"w-full flex justify-end gap-5"}>
              <ButtonComponent
                type="reject"
                onClick={() => {
                  setModalConfirm(true);
                  setApproveOrReject("reject");
                }}
              >
                Reject
              </ButtonComponent>
              <ButtonComponent
                type="approve"
                onClick={() => {
                  setModalConfirm(true);
                  setApproveOrReject("approve");
                }}
              >
                Approve
              </ButtonComponent>
            </div>
          ) : null}
        </div>

        <ModalApproveOrReject
          isOpen={modalConfirm}
          handleCloseModal={handleCancel}
          onFinish={handleConfirm}
          header={approveOrReject}
          approveOrReject={approveOrReject}
          menu={"Transaction Calendar"}
          named={
            data_detail_draft?.calendarDetailDto?.id === id
              ? data_detail_draft?.calendarDetailDto?.beginCycle
              : `${data_detail?.calendarDetailDto?.beginCycle} - ${data_detail?.calendarDetailDto?.endCycle}`
          }
        />
      </Spin>
    </>
  );
};

export default ListDetailTransactionCalender;
