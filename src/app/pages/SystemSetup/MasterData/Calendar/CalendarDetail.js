import React, { useState, useEffect } from "react";
import { LeftOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Spin } from "antd";
import moment from "moment";
import ButtonComponent from "../../../../../components/ButtonComponent";
import { SYSTEM_SETUP_ROUTES } from "../../../../../routes/system_setup/setup_routes";
import BreadCrumb from "../../../../../components/BreadCrumb";
import RadioTabs from "../../../../../components/RadioTabs";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import CardContainer from "../../../../../components/CardContainer";
import DetailText from "../../../../../components/DetailText";
import { dateFormatting } from "../../../../../utils";
import ratingBillingHttpService from "../../../../../redux/services/ratingBillingHttpService";
import { configApp } from "../../../../../constants/configApp";
import {
  getDetailCalendar,
  approveRejectCalendar,
  approveRejectInactiveCalendar,
} from "../../../../../redux/slices/system_setup/master_data/calendar";
import FunctionalCriteriaBillingBucket from "../../../RatingBillingInvoice/MasterData/BillingBucket/Form/FunctionalCriteriaBillingBucket";
import ModalApproveOrReject from "../../../../../components/Modal/ModalApproveOrReject";

const CalendarDetail = () => {
  const { loading, data_detail } = useSelector((state) => state.calendar);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const calendarId = location.state?.id;

  const [valuePage, setValuePage] = useState("Calendar");
  const [listSectionInfo] = useState([
    { value: "Calendar" },
    { value: "Attachment" },
  ]);

  const [calendarData, setCalendarData] = useState({});
  const [criteriaData, setCriteriaData] = useState([]);
  const [criteriaIndexValues, setCriteriaIndexValues] = useState([]);
  const [dataLogInformation, setDataLogInformation] = useState({});
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [bodyApproval, setBodyApproval] = useState({
    isApprover: false,
    tAppId: null,
    approvalType: null,
  });
  const [modalConfirm, setModalConfirm] = useState(false);
  const [approveOrReject, setApproveOrReject] = useState("");

  const showButtonApproval = bodyApproval.isApprover === true;

  useEffect(() => {
    if (calendarId) {
      dispatch(getDetailCalendar(calendarId));
      fetchAttachments(calendarId);
    }
  }, [dispatch, calendarId]);

  const fetchAttachments = async (id) => {
    try {
      const url = `/v1/dbs/api/calendar/list-attachment/${id}`;
      const response = await ratingBillingHttpService.getPagination(url);
      const baseURL = configApp.RATING_BILLING_SERVICE || "";
      const mapped = (response.data?.result || []).map((item) => {
        const fullURL =
          item.urlFile1 ||
          item.urlFile2 ||
          (item.pathFile ? `${baseURL}${item.pathFile}` : null);
        return {
          id: item.id,
          size: item.fileSize,
          fileName: item.fileName,
          fileSize: item.fileSize,
          fileType: item.fileType,
          fileCategoryId: item.fileCategoryId,
          fileCategoryName: item.fileCategoryName,
          pathFile: item.pathFile || "",
          urlFile1: fullURL,
          urlFile2: fullURL,
          createdBy: item.createdBy,
          createdDate: item.createdDate
            ? moment(item.createdDate).format("DD MMM YYYY")
            : "",
          dataType: "exist",
        };
      });
      setListDataAttachment(mapped);
    } catch (error) {
      console.error("Error fetching attachments:", error);
    }
  };

  useEffect(() => {
    if (!data_detail) return;

    const callendar = data_detail?.callendar || {};
    const criterias = Array.isArray(data_detail?.criterias)
      ? data_detail.criterias
      : data_detail?.criterias?.criteriaData || [];
    const attachments = data_detail?.attachments || [];

    setCalendarData(callendar);

    const mappedCriteria = criterias.map((item, index) => ({
      id: item.id,
      budget: item.budget,
      subDistrict: item.subDistrict,
      district: item.district,
      city: item.city,
      province: item.province,
      area: item.costCenter,
      sor: item.sor,
      industrialSector: item.industrialSector,
      gsizes: item.gsizes,
      customerSegment: item.customerSegment,
      accountGroup: item.accountGroup,
      accountClass: item.accountClass,
      accountCategory: item.accountCategory,
      serviceType: item.serviceType,
      customer: item.customer,
      startDate: item.startDate,
      endDate: item.endDate,
      key: index + 1,
      type: "exist",
      createdDate: item.createdDate,
      createdBy: item.createdBy,
      updatedDate: item.updatedDate,
      updatedBy: item.updatedBy,
    }));
    setCriteriaData(mappedCriteria);

    // field name → indexValue mapping (from TableCriteriaBillingBucket)
    const FIELD_INDEX_MAP = {
      accountCategory: 22,
      serviceType: 21,
      customerSegment: 19,
      accountGroup: 20,
      industrialSector: 18,
      budget: 17,
      sor: 11,
      area: 16,
      province: 15,
      city: 39,
      district: 14,
      subDistrict: 13,
      customer: 12,
      gsizes: 23,
    };
    const activeIndexValues = Object.entries(FIELD_INDEX_MAP)
      .filter(([field]) =>
        mappedCriteria.some((row) => row[field]?.label != null),
      )
      .map(([, idx]) => idx);
    setCriteriaIndexValues(activeIndexValues);

    setDataLogInformation({
      recordId: callendar.calendarId,
      createdDate: callendar.createdDate,
      createdBy: callendar.createdBy,
      updatedDate: callendar.updatedDate,
      updatedBy: callendar.updatedBy,
    });

    const approval = data_detail?.approvalInformation || {};
    setBodyApproval({
      isApprover: approval.isApprover || false,
      tAppId: approval.tAppId || null,
      approvalType: approval.approvalType || null,
    });

    // Use attachments from API response as fallback if direct fetch hasn't populated it
    if (attachments.length > 0) {
      setListDataAttachment((prev) => {
        if (prev.length > 0) return prev;
        const baseURL = configApp.RATING_BILLING_SERVICE || "";
        return attachments.map((item) => {
          const fullURL =
            item.urlFile1 ||
            item.urlFile2 ||
            (item.pathFile ? `${baseURL}${item.pathFile}` : null);
          return {
            id: item.id,
            size: item.fileSize,
            fileName: item.fileName,
            fileSize: item.fileSize,
            fileType: item.fileType,
            fileCategoryId: item.fileCategoryId,
            fileCategoryName: item.fileCategoryName,
            pathFile: item.pathFile || "",
            urlFile1: fullURL,
            urlFile2: fullURL,
            createdBy: item.createdBy,
            createdDate: item.createdDate
              ? moment(item.createdDate).format("DD MMM YYYY")
              : "",
            dataType: "exist",
          };
        });
      });
    }
  }, [data_detail]);

  const handleConfirm = (res, handleClear) => {
    setModalConfirm(false);
    const body = {
      id: calendarId,
      remark: res.remark,
      action: approveOrReject.toUpperCase(),
      approvalId: bodyApproval.tAppId,
    };
    const thunk =
      bodyApproval.approvalType === "INACTIVE_MASTER_CALLENDAR"
        ? approveRejectInactiveCalendar({ body })
        : approveRejectCalendar({ body });
    dispatch(thunk)
      .unwrap()
      .then(() => {
        handleClear();
        dispatch(getDetailCalendar(calendarId));
      })
      .catch(() => {});
  };

  const routes = [
    { path: "", breadcrumbName: "Master Data" },
    { path: SYSTEM_SETUP_ROUTES.VIEW_CALENDAR, breadcrumbName: "Calendar" },
    {
      path: SYSTEM_SETUP_ROUTES.DETAIL_CALENDAR,
      breadcrumbName: "Detail",
    },
  ];

  const renderStatusBadge = (value) => {
    if (!value) return "-";
    const colorMap = {
      ACTIVE: "bg-green-100 text-green-700",
      INACTIVE: "bg-red-100 text-red-700",
      APPROVED: "bg-green-100 text-green-700",
      DRAFT: "bg-yellow-100 text-yellow-700",
      REJECTED: "bg-red-100 text-red-700",
      PENDING: "bg-blue-100 text-blue-700",
      SUBMITTED: "bg-blue-100 text-blue-700",
    };
    const cls = colorMap[value?.toUpperCase()] || "bg-gray-100 text-gray-700";
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${cls}`}>
        {value}
      </span>
    );
  };

  const layout = (page) => {
    switch (page) {
      case "Calendar":
        return (
          <>
            {/* Calendar Information */}
            <CardContainer header={"CALENDAR INFORMATION"}>
              <div className="w-full grid grid-cols-5 gap-3">
                <DetailText label={"Name"}>
                  {calendarData?.calendarName || "-"}
                </DetailText>
                <DetailText label={"Start Date"}>
                  {calendarData?.startDate
                    ? moment(calendarData.startDate).format("DD MMM YYYY")
                    : "-"}
                </DetailText>
                <DetailText label={"End Date"}>
                  {calendarData?.endDate
                    ? moment(calendarData.endDate).format("DD MMM YYYY")
                    : "-"}
                </DetailText>
                <DetailText label={"Status"}>
                  {renderStatusBadge(calendarData?.status)}
                </DetailText>
                <DetailText label={"Status Approval"}>
                  {renderStatusBadge(calendarData?.statusApproval)}
                </DetailText>
              </div>
              {calendarData?.description && (
                <div className="w-full mt-3">
                  <DetailText label={"Description"}>
                    {calendarData.description}
                  </DetailText>
                </div>
              )}
            </CardContainer>

            {/* Criteria Information */}
            <CardContainer header={"CRITERIA INFORMATION"}>
              <FunctionalCriteriaBillingBucket
                data={criteriaData}
                dataCriteria={criteriaIndexValues}
                type={"detail"}
                showAction={"show"}
              />
            </CardContainer>

            {/* History Log Information */}
            <CardContainer header={"HISTORY LOG INFORMATION"}>
              <div className="w-full grid grid-cols-5 gap-3">
                <DetailText label={"Record ID"}>
                  {dataLogInformation?.recordId || "-"}
                </DetailText>
                <DetailText label={"Created Date"}>
                  {dataLogInformation?.createdDate
                    ? moment(dataLogInformation.createdDate).format(
                        dateFormatting.dateTime,
                      )
                    : "-"}
                </DetailText>
                <DetailText label={"Created By"}>
                  {dataLogInformation?.createdBy || "-"}
                </DetailText>
                <DetailText label={"Updated Date"}>
                  {dataLogInformation?.updatedDate
                    ? moment(dataLogInformation.updatedDate).format(
                        dateFormatting.dateTime,
                      )
                    : "-"}
                </DetailText>
                <DetailText label={"Updated By"}>
                  {dataLogInformation?.updatedBy || "-"}
                </DetailText>
              </div>
            </CardContainer>
          </>
        );

      case "Attachment":
        return (
          <CardContainer header={"ATTACHMENT INFORMATION"}>
            <AttachmentComponent
              type={"detail"}
              data={listDataAttachment}
              updateData={setListDataAttachment}
              typeSelector="calendar"
              service={ratingBillingHttpService}
              configApplication={configApp.RATING_BILLING_SERVICE}
            />
          </CardContainer>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />

        <div className="flex flex-col w-full gap-4">
          <RadioTabs
            data={listSectionInfo}
            onChange={(e) => setValuePage(e.target.value)}
            currentPosition={valuePage}
          />
          {layout(valuePage)}
        </div>

        <div className="flex mt-[30px]">
          <ButtonComponent
            type={"submit"}
            onClick={() => navigate(-1)}
            icon={
              <LeftOutlined
                style={{ color: "#fff", fontSize: 24, justifyItems: "center" }}
              />
            }
          >
            Back
          </ButtonComponent>

          {showButtonApproval && (
            <div className="w-full flex justify-end gap-5">
              <ButtonComponent
                type="reject"
                onClick={() => {
                  setApproveOrReject("Reject");
                  setModalConfirm(true);
                }}
              >
                Reject
              </ButtonComponent>
              <ButtonComponent
                type="approve"
                onClick={() => {
                  setApproveOrReject("Approve");
                  setModalConfirm(true);
                }}
              >
                Approve
              </ButtonComponent>
            </div>
          )}
        </div>

        <ModalApproveOrReject
          isOpen={modalConfirm}
          handleCloseModal={() => setModalConfirm(false)}
          onFinish={handleConfirm}
          header={approveOrReject}
          approveOrReject={approveOrReject}
          menu={"Calendar"}
          named={calendarData?.calendarName}
        />
      </Spin>
    </>
  );
};

export default CalendarDetail;
