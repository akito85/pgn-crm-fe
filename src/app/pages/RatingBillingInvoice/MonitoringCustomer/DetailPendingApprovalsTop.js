import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Spin, Tooltip, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import BreadCrumb from "../../../../components/BreadCrumb";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import ButtonComponent from "../../../../components/ButtonComponent";
import CardContainer from "../../../../components/CardContainer";
import TableRBI from "../../../../components/TableRBI";
import ModalHistory from "../../../../components/Modal/ModalHistory";
import SVGIcon from "../../../../assets/Icon/index";
import { RBI_ROUTES } from "../../../../routes/rating_billing/rbi_routes";
import {
  getAnomaliesPendingAprv,
  getApprovalHistoryDetail,
} from "../../../../redux/slices/rating_billing_invoice/monitoringSlice";

const DetailPendingApprovalsTop = () => {
  const location = useLocation();
  const period = location.state?.period;
  const accountNumber = location.state?.accountNumber;
  const dispatch = useDispatch();

  const { anomaliesPendingAprvData, approvalHistoryDetailData, loading } =
    useSelector((state) => state.monitoring);

  const [page, setPage] = useState(1);
  const [isApprovalHistoryOpen, setIsApprovalHistoryOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const routes = [
    { path: "", breadcrumbName: "Rating & Billing" },
    { path: RBI_ROUTES.MONITORING_CUSTOMER_VIEW, breadcrumbName: "Monitoring Customer" },
    { path: "", breadcrumbName: "Detail Pending Approvals" },
  ];

  useEffect(() => {
    if (period && accountNumber) {
      dispatch(
        getAnomaliesPendingAprv({ period, accountNumber, page, pageSize: 10 })
      );
    }
  }, [period, accountNumber, page, dispatch]);

  const handleDownload = () => {
    message.info("Fitur download sedang dalam pengembangan.");
  };

  const handleApprovalHistory = (record) => {
    setModalLoading(true);
    dispatch(getApprovalHistoryDetail({ appId: record.appId }))
      .unwrap()
      .then(() => {
        setIsApprovalHistoryOpen(true);
        setModalLoading(false);
      })
      .catch(() => setModalLoading(false));
  };

  const dataHistory = (approvalHistoryDetailData ?? []).map((d) => ({
    id: d.ids,
    status: d.actionStatus,
    hierarchy: d.hierarchy,
    name: d.actionBy,
    role: d.positionName,
    taskDate: d.rawActionDate,
    actionDate: d.rawActionDate,
    description: d.notes,
  }));

  const dataApprover = (approvalHistoryDetailData ?? []).map((d) => ({
    name: d.actionBy,
    role: d.positionName,
    status: d.actionStatus,
  }));

  const tableColumns = [
    {
      title: "NO",
      dataIndex: "no",
      key: "no",
      width: 60,
      align: "center",
      fixed: "left",
      render: (_, __, index) => (page - 1) * 10 + index + 1,
    },
    {
      title: "CUSTOMER ID",
      dataIndex: "customerId",
      key: "customerId",
      width: 150,
    },
    {
      title: "BILLING",
      dataIndex: "billing",
      key: "billing",
      width: 150,
    },
    {
      title: "PERIOD",
      dataIndex: "periodStr",
      key: "periodStr",
      width: 120,
    },
    {
      title: "ACCOUNT NUMBER",
      dataIndex: "accountNumber",
      key: "accountNumber",
      width: 160,
    },
    {
      title: "EST AMOUNT",
      dataIndex: "estAmount",
      key: "estAmount",
      width: 150,
      isNumber: true,
    },
    {
      title: "CREATED BY",
      dataIndex: "createdBy",
      key: "createdBy",
      width: 150,
    },
    {
      title: "CREATED AT",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 160,
    },
    {
      title: "ACTION",
      key: "action",
      width: 80,
      align: "center",
      fixed: "right",
      render: (_, record) => (
        <Tooltip title="Approval History">
          <div
            className="cursor-pointer flex justify-center"
            onClick={() => handleApprovalHistory(record)}
          >
            <SVGIcon name="IconLogHistory" width={24} />
          </div>
        </Tooltip>
      ),
    },
  ];

  return (
    <LayoutMenu grantPath={RBI_ROUTES.MONITORING_CUSTOMER_VIEW}>
      <Spin spinning={loading || modalLoading}>
        <BreadCrumb routes={routes} />

        <CardContainer
          header={
            <div className="flex justify-between items-center -my-4">
              <p className="mt-[15px] font-bold">DETAIL PENDING APPROVALS</p>
              <ButtonComponent
                icon={<SVGIcon name="IconButtonDownload" width={24} />}
                type="submit"
                onClick={handleDownload}
              >
                Download List
              </ButtonComponent>
            </div>
          }
        >
          <TableRBI
            idTable="table-detail-pending-approvals"
            dataSource={anomaliesPendingAprvData?.result ?? []}
            columns={tableColumns}
            pageSize={10}
            current={page}
            loading={loading}
            totalData={anomaliesPendingAprvData?.page?.totalElements ?? 0}
            tableScrolled={{ x: "max-content" }}
            usePagination={true}
            useSelect={true}
            showAdvanceSearch={true}
            showSearchBar={false}
            onChange={(p) => setPage(p)}
          />
        </CardContainer>
      </Spin>

      <ModalHistory
        isOpen={isApprovalHistoryOpen}
        handleClose={() => setIsApprovalHistoryOpen(false)}
        header="APPROVAL HISTORY"
        width={700}
        cancelText="Close"
        dataApprover={dataApprover}
        dataHistory={dataHistory}
      />
    </LayoutMenu>
  );
};

export default DetailPendingApprovalsTop;
