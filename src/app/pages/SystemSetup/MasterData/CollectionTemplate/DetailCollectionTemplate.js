import React, { useEffect, useMemo, useState } from "react";
import { Table, Tabs, Tooltip } from "antd";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import CardContainer from "../../../../../components/CardContainer";
import SVGIcon from "../../../../../assets/Icon/index";
import ButtonComponent from "../../../../../components/ButtonComponent";
import ModalCreateDetailTemplate from "./ModalCreateDetailTemplate";
import CollapsibleContainer from "../../../../../components/CollapsibleContainer";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import debtAndCollectionHttpService from "../../../../../redux/services/debtAndCollectionHttpService";
import { configApp } from "../../../../../constants/configApp";
import {
  getSelectedApproval,
  getDetailCollectionTemplate,
  approveCollectionTemplate,
  rejectCollectionTemplate,
  approveInactiveCollectionTemplate,
  approveActivatedCollectionTemplate,
  getTemplateDetailApprovalInfo,
  approveTemplateDetail,
  rejectTemplateDetail,
} from "../../../../../redux/slices/system_setup/master_data/collectionTemplate";
import StatusComponent from "../../../../../components/StatusComponent";
import ModalApproveOrReject from "../../../../../components/Modal/ModalApproveOrReject";
import { ModalError } from "../../../../../components/Modal/ModalPopUp";

const { TabPane } = Tabs;

const renderStatus = (text) =>
  text ? (
    <StatusComponent colour={text} size="small">
      {text}
    </StatusComponent>
  ) : (
    "-"
  );

const InfoRow = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs text-gray-500 font-medium">{label}</span>
    <span className="text-sm text-gray-800">{value || "-"}</span>
  </div>
);

const DetailCollectionTemplate = ({
  data,
  loading,
  onCreateDetail,
  onRefresh,
}) => {
  const dispatch = useDispatch();
  const { dataListAppHierDetail } = useSelector(
    (state) => state.collectionTemplate,
  );

  const [appHierDataDetail, setAppHierDataDetail] = useState([]);
  const [listDataAttachment, setListDataAttachment] = useState([]);

  // Approval modal state (BillingBucketDetail pattern)
  const [modalCreateDetail, setModalCreateDetail] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalErrorServer, setModalErrorServer] = useState(false);
  const [bodyError, setBodyError] = useState({});
  const [approveOrReject, setApproveOrReject] = useState("");
  const [bodyApproval, setBodyApproval] = useState({
    isApprover: false,
    tAppId: null,
    approvalType: null,
  });

  const showButtonApproval = bodyApproval.isApprover === true;

  const details = useMemo(() => data?.details || [], [data]);

  const waitingDetails = useMemo(
    () => details.filter((d) => d.statusApproval === "Waiting Approval"),
    [details],
  );

  // Fetch approval hierarchy detail when appHierId changes
  useEffect(() => {
    if (data?.appHierId) {
      dispatch(getSelectedApproval({ id: data.appHierId }));
    }
  }, [dispatch, data?.appHierId]);

  // Sync approval info: template header takes priority; for detail items,
  // ask backend whether current user is approver before showing action buttons.
  useEffect(() => {
    let isMounted = true;

    const syncApprovalInfo = async () => {
      if (data?.approvalInfo?.isApprover) {
        setBodyApproval({
          isApprover: data.approvalInfo.isApprover,
          tAppId: data.approvalInfo.tAppId,
          approvalType: data.approvalInfo.approvalType,
        });
        return;
      }

      if (waitingDetails.length === 0) {
        setBodyApproval({
          isApprover: false,
          tAppId: null,
          approvalType: null,
        });
        return;
      }

      try {
        const firstWaitingDetail = waitingDetails[0];
        const infoResult = await dispatch(
          getTemplateDetailApprovalInfo(firstWaitingDetail.templateDetailId),
        ).unwrap();
        const approvalInfo = infoResult?.data || infoResult;

        if (!isMounted) return;

        if (approvalInfo?.isApprover) {
          setBodyApproval({
            isApprover: true,
            tAppId: null,
            approvalType: "PAY_COLLECTION_TEMPLATE_DETAIL",
          });
        } else {
          setBodyApproval({
            isApprover: false,
            tAppId: null,
            approvalType: null,
          });
        }
      } catch {
        if (isMounted) {
          setBodyApproval({
            isApprover: false,
            tAppId: null,
            approvalType: null,
          });
        }
      }
    };

    syncApprovalInfo();

    return () => {
      isMounted = false;
    };
  }, [
    dispatch,
    data?.approvalInfo?.isApprover,
    data?.approvalInfo?.tAppId,
    data?.approvalInfo?.approvalType,
    waitingDetails,
  ]);

  // Map hierarchy detail rows
  useEffect(() => {
    if (dataListAppHierDetail && dataListAppHierDetail.length > 0) {
      setAppHierDataDetail(
        dataListAppHierDetail.map((a, index) => ({
          ...a,
          key: index + 1,
          employeeDetail: (a.employeeDetail || []).map((b, i) => ({
            ...b,
            key: i + 1,
          })),
        })),
      );
    } else {
      setAppHierDataDetail([]);
    }
  }, [dataListAppHierDetail]);

  // Map attachments from API
  useEffect(() => {
    const attachments = data?.attachments || [];
    setListDataAttachment(
      attachments.map((item) => ({
        id: item.id,
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
      })),
    );
  }, [data?.attachments]);

  const activityDetails = useMemo(
    () => details.filter((d) => d.sourceType === "ACTIVITY"),
    [details],
  );

  const criteriaDetails = useMemo(
    () => details.filter((d) => d.sourceType === "CRITERIA"),
    [details],
  );

  const activityColumns = [
    {
      title: "NO",
      key: "no",
      width: 55,
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "ACTIVITIES NAME",
      dataIndex: ["activity", "activityName"],
      key: "activityName",
      width: 180,
      render: (v) => v || "-",
    },
    {
      title: "ACTIVITIES CODE",
      dataIndex: ["activity", "activityCode"],
      key: "activityCode",
      width: 140,
      align: "center",
      render: (v) => v || "-",
    },
    {
      title: "CATEGORY",
      dataIndex: ["activity", "category"],
      key: "category",
      width: 130,
      render: (v) => v || "-",
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      width: 90,
      align: "center",
      render: renderStatus,
    },
    {
      title: "APPROVAL STATUS",
      dataIndex: "statusApproval",
      key: "statusApproval",
      width: 130,
      align: "center",
      render: renderStatus,
    },
    {
      title: "ACTION",
      key: "action",
      width: 75,
      align: "center",
      render: () => (
        <Tooltip title="Detail">
          <SVGIcon name="IconDetail" width={20} />
        </Tooltip>
      ),
    },
  ];

  const criteriaColumns = [
    {
      title: "NO",
      key: "no",
      width: 55,
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "CUSTOMER SEGMENT",
      key: "customerSegment",
      width: 160,
      render: (_, record) => {
        const c = record.criteria;
        if (!c) return "-";
        return c.criteriaType === "CUSTOMER_SEGMENT"
          ? c.criteriaValueDisplay || c.criteriaValueText || "-"
          : c.criteriaValueDisplay || c.criteriaValueText || "-";
      },
    },
    {
      title: "ACCOUNT GROUP TYPE",
      key: "accountGroupType",
      width: 160,
      render: (_, record) => {
        const c = record.criteria;
        if (!c) return "-";
        return c.category || "-";
      },
    },
    {
      title: "START DATE",
      key: "startDate",
      width: 120,
      align: "center",
      render: (_, record) =>
        record.criteria?.startDate
          ? moment(record.criteria.startDate).format("DD MMM YYYY")
          : "-",
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      width: 90,
      align: "center",
      render: renderStatus,
    },
    {
      title: "APPROVAL STATUS",
      dataIndex: "statusApproval",
      key: "statusApproval",
      width: 130,
      align: "center",
      render: renderStatus,
    },
    {
      title: "ACTION",
      key: "action",
      width: 75,
      align: "center",
      render: () => (
        <Tooltip title="Detail">
          <SVGIcon name="IconDetail" width={20} />
        </Tooltip>
      ),
    },
  ];

  if (!data) return null;

  const handleConfirm = async (res, handleClear) => {
    const templateId = data.collectionTemplateId;
    const action = approveOrReject === "Approve" ? "APPROVE" : "REJECT";
    const isInactiveApproval =
      bodyApproval.approvalType === "INACTIVE_PAY_COLLECTION_TEMPLATE";
    const isActivatedApproval =
      bodyApproval.approvalType === "ACTIVATED_PAY_COLLECTION_TEMPLATE";
    const isDetailApproval =
      bodyApproval.approvalType === "PAY_COLLECTION_TEMPLATE_DETAIL";

    try {
      if (isDetailApproval) {
        // Approve / reject ALL waiting detail items sequentially
        for (const detail of waitingDetails) {
          const infoResult = await dispatch(
            getTemplateDetailApprovalInfo(detail.templateDetailId),
          ).unwrap();
          const approvalInfo = infoResult?.data || infoResult;
          if (approvalInfo?.approvalId) {
            await dispatch(
              approveOrReject === "Approve"
                ? approveTemplateDetail({
                    detailId: detail.templateDetailId,
                    body: {
                      approvalId: approvalInfo.approvalId,
                      remark: res.remark,
                    },
                  })
                : rejectTemplateDetail({
                    detailId: detail.templateDetailId,
                    body: {
                      approvalId: approvalInfo.approvalId,
                      remark: res.remark,
                    },
                  }),
            ).unwrap();
          }
        }
        setModalConfirm(false);
        handleClear();
        if (typeof onRefresh === "function") {
          await onRefresh();
        } else {
          await dispatch(getDetailCollectionTemplate(templateId)).unwrap();
        }
      } else {
        let thunkCall;
        if (isInactiveApproval) {
          thunkCall = approveInactiveCollectionTemplate({
            id: templateId,
            body: { remark: res.remark, action },
          });
        } else if (isActivatedApproval) {
          thunkCall = approveActivatedCollectionTemplate({
            id: templateId,
            body: { remark: res.remark, action },
          });
        } else {
          thunkCall =
            approveOrReject === "Approve"
              ? approveCollectionTemplate({
                  id: templateId,
                  body: { approvalId: bodyApproval.tAppId, remark: res.remark },
                })
              : rejectCollectionTemplate({
                  id: templateId,
                  body: { approvalId: bodyApproval.tAppId, remark: res.remark },
                });
        }
        await dispatch(thunkCall).unwrap();
        setModalConfirm(false);
        handleClear();
        if (typeof onRefresh === "function") {
          await onRefresh();
        } else {
          await dispatch(getDetailCollectionTemplate(templateId)).unwrap();
        }
      }
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || "An error occurred";
      setBodyError({ message });
      setModalErrorServer(true);
    }
  };

  const handleCloseModalError = () => {
    setModalErrorServer(false);
    setBodyError({});
  };

  return (
    <>
      <CardContainer
        header={
          <div className="flex -my-4 justify-between items-center">
            <p className="mt-[15px]">DETAIL TEMPLATE COLLECTION</p>
          </div>
        }
      >
        <Tabs defaultActiveKey="templateCollection">
          <TabPane tab="Template Collection" key="templateCollection">
            {/* Template Collection Information */}
            <CardContainer header="TEMPLATE COLLECTION INFORMATION">
              <div className="grid grid-cols-4 gap-4">
                <InfoRow label="Template Code" value={data.templateCode} />
                <InfoRow label="Template Name" value={data.templateName} />
                <InfoRow
                  label="Start Date"
                  value={
                    data.startDate
                      ? moment(data.startDate).format("DD MMM YYYY")
                      : "-"
                  }
                />
                <InfoRow
                  label="End Date"
                  value={
                    data.endDate
                      ? moment(data.endDate).format("DD MMM YYYY")
                      : "-"
                  }
                />
                <div className="col-span-2">
                  <InfoRow label="Criteria" value={data.category} />
                </div>
                <div className="col-span-2">
                  <InfoRow label="Description" value={data.description} />
                </div>
              </div>
            </CardContainer>

            {/* Activities & Criteria Information */}
            <CardContainer
              header="ACTIVITIES & CRITERIA INFORMATION"
              type="tabs"
            >
              <div className="flex justify-end mb-4">
                {onCreateDetail && (
                  <ButtonComponent
                    icon={
                      <SVGIcon
                        name="IconButtonCreate"
                        style={{ fontSize: "20px" }}
                      />
                    }
                    type="submit"
                    onClick={() => setModalCreateDetail(true)}
                  >
                    Create
                  </ButtonComponent>
                )}
              </div>
              <div className="flex flex-col gap-y-4">
                {/* Activities Table */}
                <CollapsibleContainer
                  header={
                    <p className="text-sm text-[#0075bf]">
                      ACTIVITIES INFORMATION
                    </p>
                  }
                  border
                >
                  <div className="pb-3">
                    <Table
                      rowKey={(r) => r.templateDetailId}
                      dataSource={activityDetails}
                      columns={activityColumns}
                      loading={loading}
                      pagination={false}
                      size="small"
                      scroll={{ x: 700 }}
                    />
                    <div className="text-right text-xs text-gray-400 mt-2">
                      {`Showing ${activityDetails.length} of ${activityDetails.length} entries`}
                      {activityDetails.length > 0 && (
                        <span className="ml-2 text-[#0075bf]">
                          All data showed
                        </span>
                      )}
                    </div>
                  </div>
                </CollapsibleContainer>

                {/* Criteria Table */}
                <CollapsibleContainer
                  header={
                    <p className="font-semibold text-sm text-[#0075bf]">
                      CRITERIA INFORMATION
                    </p>
                  }
                  border
                >
                  <div className="pb-3">
                    <Table
                      rowKey={(r) => r.templateDetailId}
                      dataSource={criteriaDetails}
                      columns={criteriaColumns}
                      loading={loading}
                      pagination={false}
                      size="small"
                      scroll={{ x: 800 }}
                    />
                    <div className="text-right text-xs text-gray-400 mt-2">
                      {`Showing ${criteriaDetails.length} of ${criteriaDetails.length} entries`}
                      {criteriaDetails.length > 0 && (
                        <span className="ml-2 text-[#0075bf]">
                          All data showed
                        </span>
                      )}
                    </div>
                  </div>
                </CollapsibleContainer>
              </div>
            </CardContainer>
          </TabPane>

          <TabPane tab="Approval" key="approval">
            <CardContainer header="Approval Hierarchy">
              <ApprovalComponentGeneral
                type="detail"
                dataTable={appHierDataDetail}
                selectedHierarchy={data?.appHierId}
                showSelect={false}
              />
            </CardContainer>
          </TabPane>

          <TabPane tab="Attachment" key="attachment">
            <CardContainer header="Attachment Information">
              <AttachmentComponent
                type="detail"
                data={listDataAttachment}
                dispatch={dispatch}
                typeSelector="collectionTemplate"
                service={debtAndCollectionHttpService}
                configApplication={configApp.PAYMENT_SERVICE}
              />
            </CardContainer>
          </TabPane>
        </Tabs>

        {/* Approve / Reject buttons */}
        {showButtonApproval && (
          <div className="w-full flex justify-end gap-4 mt-4">
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
      </CardContainer>

      {/* Modal Approve / Reject */}
      <ModalApproveOrReject
        isOpen={modalConfirm}
        handleCloseModal={() => setModalConfirm(false)}
        onFinish={handleConfirm}
        header={approveOrReject}
        approveOrReject={approveOrReject}
        menu={"Collection Template"}
        named={data.templateName}
        customMessage={
          bodyApproval.approvalType === "INACTIVE_PAY_COLLECTION_TEMPLATE"
            ? `Are you sure you want to ${approveOrReject.toLowerCase()} the inactivate request for Collection Template "${data.templateName}"?`
            : bodyApproval.approvalType === "ACTIVATED_PAY_COLLECTION_TEMPLATE"
              ? `Are you sure you want to ${approveOrReject.toLowerCase()} the activate request for Collection Template "${data.templateName}"?`
              : undefined
        }
      />

      {/* Modal Error */}
      <ModalError
        isOpen={modalErrorServer}
        handleOk={handleCloseModalError}
        handleCancel={handleCloseModalError}
        customText={"Close"}
      >
        <div className="px-5 pt-5 pb-[10px] justify-center">
          <div className="w-full flex gap-[20px]">
            <SVGIcon name="IconFailed" width={48} />
            <p className="text-[18px] font-bold">{"Failed"}</p>
          </div>
          <p className="pl-[70px]">{`Your data was not ${
            approveOrReject === "Approve" ? "Approved" : "Rejected"
          }. ${bodyError.message}.`}</p>
          <p className="pl-[70px]">Please try again.</p>
        </div>
      </ModalError>

      {/* Modal Create Activity/Criteria */}
      <ModalCreateDetailTemplate
        open={modalCreateDetail}
        onClose={() => setModalCreateDetail(false)}
        templateId={data.collectionTemplateId}
        templateStartDate={data.startDate}
        templateEndDate={data.endDate}
        onRefresh={() =>
          dispatch(getDetailCollectionTemplate(data.collectionTemplateId))
        }
      />
    </>
  );
};

export default DetailCollectionTemplate;
