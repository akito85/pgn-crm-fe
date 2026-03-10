import React, { useEffect, useState, useMemo } from "react";
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Tabs, Spin } from "antd";
import moment from "moment";
import {
  getDetailWarranty,
  getListCategory,
  getListApprovalById,
  getAllApprovalList,
  submitApproval,
} from "../../../../../redux/slices/receipt_collection/warranty";
import DetailWarranty from "./DetailWarranty";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import ModalApproveOrReject from "../../../../../components/Modal/ModalApproveOrReject";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import BreadCrumb from "../../../../../components/BreadCrumb";
import FooterDetail from "../../../../../components/FooterDetail";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";
import BaseContainer from "../../../../../components/BaseContainer";
import CardContainerNoBorder from "../../../../../components/CardContainerNoBorder";
import LogHistoryInfo from "../../../../../components/LogHistoryInfo";
import TableRBI from "../../../../../components/TableRBI";
import { configApp } from "../../../../../constants/configApp";
import receiptCollectionHttpService from "../../../../../redux/services/receiptCollectionHttpService";
import { columnsHoldInfo } from "./Modal/Table/TableHoldInfo";
import { columnsReleaseInfo } from "./Modal/Table/TableReleaseInfo";
import { columnsRefundInfo } from "./Modal/Table/TableRefundInfo";
import { getDetailWarrantyMutation } from "../../../../../redux/slices/receipt_collection/warranty";
import { applyFixedColumns } from "../../../../../utils/applyFixedColumns";
import { useFilteredMutations } from "../../../../../hooks/useFilteredMutations";
import "./warrantyStyles.css";

const ListDetailWarranty = ({ id: propId, isEmbedded = false }) => {
  const location = useLocation();
  const id = propId || location.state?.id;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("warranty");
  const [activeTabHold, setActiveTabHold] = useState("hold");
  const [activeTabRelease, setActiveTabRelease] = useState("release");
  const [activeTabRefund, setActiveTabRefund] = useState("refund");

  const {
    data_detail,
    data_approval_info,
    dataListAppHierId,
    dataListAppHierDetail,
    dataMutation,
    loadingDetail,
    loadingApproval,
    loadingMutation,
  } = useSelector((state) => state.warranty);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [fixedColumns, setFixedColumns] = useState({ left: ["no"], right: [] });

  const isHold = data_detail?.withHold === true; // true;
  const isRelease = data_detail?.withRelease === true; // true;
  const isRefund = data_detail?.withRefund === true; // true;

  useEffect(() => {
    if (id) {
      dispatch(getDetailWarranty({ id }));
      dispatch(getDetailWarrantyMutation({ id, page: 1, pageSize: 999 }));
    }
    dispatch(getAllApprovalList());
  }, [id, dispatch]);

  useEffect(() => {
    if (activeTab === "approval") {
      if (data_detail?.appHierId) {
        dispatch(getListApprovalById({ id: data_detail?.appHierId }));
      }
    } else if (activeTab === "attachment") {
      dispatch(getListCategory());
    }
  }, [activeTab, dispatch, data_detail?.appHierId]);

  const transactionHoldItems = useFilteredMutations(dataMutation, "Hold");
  const transactionReleaseItems = useFilteredMutations(dataMutation, "Release");
  const transactionRefundItems = useFilteredMutations(dataMutation, "Refund");

  const approvalName = dataListAppHierId?.find(x => x.appHierId === data_detail?.appHierId)?.approvalName || data_detail?.approvalName || "-";

  const getCommonTabs = (dataList, fallbackData, hierarchyId) => {
    return [
      {
        key: "approval",
        label: "Approval",
        children: (
          <div className="p-5">
            <BaseContainer header={"APPROVAL INFORMATION"}>
              <ApprovalComponentGeneral
                dataTable={
                  dataList?.length > 0
                    ? dataList.map((a, index) => ({
                      ...a,
                      key: index + 1,
                      employeeDetail: a.employeeDetail.map((b, index) => ({
                        ...b,
                        key: index + 1,
                      })),
                    }))
                    : (fallbackData?.result || [])
                }
                approvalName={approvalName}
                showSelect={false}
                disableSelect={true}
                selectedHierarchy={hierarchyId}
              />
            </BaseContainer>
          </div>
        ),
      },
      {
        key: "attachment",
        label: "Attachment",
        children: (
          <div className="p-5">
            <BaseContainer header={"ATTACHMENT INFORMATION"}>
              <AttachmentComponent
                data={
                  data_detail?.attachmentDtoList
                    ? data_detail.attachmentDtoList.map((item) => ({
                      id: item.id,
                      uid: item.uid || item.id,
                      fileName: item.fileName,
                      fileSize: item.fileSize,
                      fileCategoryName: item.fileCategoryName,
                      urlFile1: item.urlFile1,
                      urlFile2: item.urlFile2,
                      createdBy: item.createdBy,
                      createdDate: item.createdDate ? moment(item.createdDate).format("YYYY-MM-DD HH:mm:ss") : null,
                      dataType: "exist",
                      fileType: item.fileType || "application/pdf"
                    }))
                    : []
                }
                type="detail"
                typeSelector="warranty"
                service={receiptCollectionHttpService}
                configApplication={configApp.PAYMENT_SERVICE}
              />
            </BaseContainer>
          </div>
        ),
      },
    ];
  };

  const items = [
    {
      key: "warranty",
      label: "Guarantee",
      children: <DetailWarranty data_detail={data_detail} />,
    },
    ...getCommonTabs(dataListAppHierDetail, data_approval_info, data_detail?.appHierId),
  ];

  const processedColumnsHold = columnsHoldInfo(1, 999, null, null, "", () => {}, {}, () => {}, true);
  const processedColumnsRelease = columnsReleaseInfo(1, 999, null, null, "", () => {}, {}, () => {}, {}, () => {}, true);
  const processedColumnsRefund = columnsRefundInfo(1, 999, null, null, "", () => {}, {}, () => {}, {}, () => {}, true);

  const itemHold = [
    {
      key: "hold",
      label: "Hold",
      children: <div className="w-full p-5">
                  <Spin spinning={loadingMutation}>
                    <TableRBI
                      dataSource={transactionHoldItems.map((item, index) => ({ ...item, key: index + 1 }))}
                      columns={processedColumnsHold}
                      fixedColumns={{ left: ["no"], right: ["holdAmount", "status", "approvalStatus"] }}
                      current={page}
                      pageSize={pageSize}
                      onChange={(p, s) => { setPage(p); setPageSize(s); }}
                      totalData={transactionHoldItems.length}
                      tableScrolled={{ y: 525, x: 1200 }}
                      showExport={false}
                      pagination={false}
                    />
                  </Spin>
                </div>,
    },
    ...getCommonTabs(dataListAppHierDetail, data_approval_info, data_detail?.appHierId),
  ];

  const itemRelease = [
    {
      key: "release",
      label: "Release",
      children: <div className="w-full p-5">
                  <Spin spinning={loadingMutation}>
                    <TableRBI
                      dataSource={transactionReleaseItems.map((item, index) => ({ ...item, key: index + 1 }))}
                      columns={processedColumnsRelease}
                      fixedColumns={{ left: ["no"], right: ["releaseAmount", "status", "approvalStatus"] }}
                      current={page}
                      pageSize={pageSize}
                      onChange={(p, s) => { setPage(p); setPageSize(s); }}
                      totalData={transactionReleaseItems.length}
                      tableScrolled={{ y: 525, x: 1200 }}
                      showExport={false}
                      pagination={false}
                    />
                  </Spin>
                </div>,
    },
    ...getCommonTabs(dataListAppHierDetail, data_approval_info, data_detail?.appHierId),
  ];

  const itemRefund = [
    {
      key: "refund",
      label: "Refund",
      children: <div className="w-full p-5">
                  <Spin spinning={loadingMutation}>
                    <TableRBI
                      dataSource={transactionRefundItems.map((item, index) => ({ ...item, key: index + 1 }))}
                      columns={processedColumnsRefund}
                      fixedColumns={{ left: ["no"], right: ["date", "refundAmount", "status", "approvalStatus"] }}
                      current={page}
                      pageSize={pageSize}
                      onChange={(p, s) => { setPage(p); setPageSize(s); }}
                      totalData={transactionRefundItems.length}
                      tableScrolled={{ y: 525, x: 1200 }}
                      showExport={false}
                      pagination={false}
                    />
                  </Spin>
                </div>,
    },
    ...getCommonTabs(dataListAppHierDetail, data_approval_info, data_detail?.appHierId),
  ];

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const handleTabChangeHold = (key) => {
    setActiveTabHold(key);
  };

  const handleTabChangeRelease = (key) => {
    setActiveTabRelease(key);
  };

  const handleTabChangeRefund = (key) => {
    setActiveTabRefund(key);
  };

  const isShowButton = data_detail?.isApprover || false;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [approvalAction, setApprovalAction] = useState("");

  const handleApprove = () => {
    setApprovalAction("APPROVE");
    setIsModalOpen(true);
  };

  const handleReject = () => {
    setApprovalAction("REJECT");
    setIsModalOpen(true);
  };

  const onFinishApproval = async (values, clearForm) => {
    const body = {
      approvalId: data_detail?.approvalId,
      id: data_detail?.id,
      action: approvalAction,
      remark: values.remark,
    };

    dispatch(submitApproval({ body }))
      .unwrap()
      .then(() => {
        setIsModalOpen(false);
        clearForm();
        dispatch(getDetailWarranty({ id }));
      })
      .catch(() => {
        // Error is handled in thunk with showModalError
      });
  };

  const routes = [
    {
      path: "",
      breadcrumbName: "Receipt & Collection",
    },
    {
      path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_WARRANTY,
      breadcrumbName: "Payment Guarantee",
    },
    {
      path: "",
      breadcrumbName: "Detail Guarantee",
    },
  ];

  const content = (
    <Spin spinning={loadingDetail || loadingApproval}>
      {!isEmbedded && <BreadCrumb routes={routes} />}

      <CardContainerNoBorder
        header="GUARANTEE DETAIL"
        className="mt-5 !border-[1.5px] !border-[#0075bf] !rounded-md !bg-white !shadow-none"
        noPadding
        collapsible={true}
        defaultExpanded={true}
      >
        <div className="full-width-tabs">
          <Tabs
            activeKey={activeTab}
            items={items}
            onChange={handleTabChange}
            className="custom-tabs-layout"
          />
        </div>
      </CardContainerNoBorder>

      {isHold && (
        <CardContainerNoBorder
          header="HOLD DETAIL"
          className="mt-5 !border-[1.5px] !border-[#0075bf] !rounded-md !bg-white !shadow-none"
          noPadding
          collapsible={true}
          defaultExpanded={true}
        >
          <div className="full-width-tabs">
            <Tabs
              activeKey={activeTabHold}
              items={itemHold}
              onChange={handleTabChangeHold}
              className="custom-tabs-layout"
            />
          </div>
        </CardContainerNoBorder>
      )}

      {isRelease && (
        <CardContainerNoBorder
          header="RELEASE DETAIL"
          className="mt-5 !border-[1.5px] !border-[#0075bf] !rounded-md !bg-white !shadow-none"
          noPadding
          collapsible={true}
          defaultExpanded={true}
        >
          <div className="full-width-tabs">
            <Tabs
              activeKey={activeTabRelease}
              items={itemRelease}
              onChange={handleTabChangeRelease}
              className="custom-tabs-layout"
            />
          </div>
        </CardContainerNoBorder>
      )}

      {isRefund && (
        <CardContainerNoBorder
          header="REFUND DETAIL"
          className="mt-5 !border-[1.5px] !border-[#0075bf] !rounded-md !bg-white !shadow-none"
          noPadding
          collapsible={true}
          defaultExpanded={true}
        >
          <div className="full-width-tabs">
            <Tabs
              activeKey={activeTabRefund}
              items={itemRefund}
              onChange={handleTabChangeRefund}
              className="custom-tabs-layout"
            />
          </div>
        </CardContainerNoBorder>
      )}

      <LogHistoryInfo
        data={{
          recordId: data_detail?.recordId || data_detail?.id || "-",
          createdDate: data_detail?.createdDate ? moment(data_detail?.createdDate).format("DD MMM YYYY HH:mm:ss") : "-",
          createdBy: data_detail?.createdBy || "-",
          updatedDate: data_detail?.updatedDate ? moment(data_detail?.updatedDate).format("DD MMM YYYY HH:mm:ss") : "-",
          updatedBy: data_detail?.updatedBy || "-"
        }} 
      />

      {!isEmbedded && (
        <FooterDetail
          onCancel={() => navigate(RECEIPT_AND_COLLECTION_ROUTES.WARRANTY)}
          showApproval={isShowButton === true}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}

      <ModalApproveOrReject
        isOpen={isModalOpen}
        handleCloseModal={() => setIsModalOpen(false)}
        onFinish={onFinishApproval}
        header={approvalAction === "APPROVE" ? "Approve" : "Reject"}
        approveOrReject={approvalAction === "APPROVE" ? "approve" : "reject"}
        menu="Payment Guarantee"
        named={data_detail?.customerName || "-"}
      />
    </Spin>
  );

  if (isEmbedded) {
    return content;
  }

  return (
    <LayoutMenu>
      {content}
    </LayoutMenu>
  );
};

ListDetailWarranty.propTypes = {
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  isEmbedded: PropTypes.bool
};

export default ListDetailWarranty;
