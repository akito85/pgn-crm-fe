import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Spin, Dropdown, Menu } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import BreadCrumb from "../../../../components/BreadCrumb";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import ButtonComponent from "../../../../components/ButtonComponent";
import CardContainer from "../../../../components/CardContainer";
import TableRBI from "../../../../components/TableRBI";
import SVGIcon from "../../../../assets/Icon/index";
import SyncConfirmationModals from "./SyncConfirmationModals";
import { RBI_ROUTES } from "../../../../routes/rating_billing/rbi_routes";
import {
  getGapPraBillingMaster,
  syncGapPraBillingMaster,
  downloadGapPraBillingMaster,
} from "../../../../redux/slices/rating_billing_invoice/monitoringSlice";

const DetailGapPraBillingMasterTop = () => {
  const location = useLocation();
  const period = location.state?.period;
  const accountNumber = location.state?.accountNumber;
  const dispatch = useDispatch();
  const { loading, gapPraBillingMasterData } = useSelector(
    (state) => state.monitoring
  );

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Sync modal state
  const [syncModalOpen, setSyncModalOpen] = useState(false);
  const [syncRecord, setSyncRecord] = useState(null);
  const [dataInfoExpanded, setDataInfoExpanded] = useState(true);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [failedModalOpen, setFailedModalOpen] = useState(false);

  useEffect(() => {
    if (period) {
      dispatch(
        getGapPraBillingMaster({
          period,
          page,
          pageSize,
          accountNumber,
        })
      );
    }
  }, [period, page, pageSize, accountNumber, dispatch]);

  const routes = [
    {
      path: "",
      breadcrumbName: "Rating & Billing",
    },
    {
      path: RBI_ROUTES.MONITORING_CUSTOMER_VIEW,
      breadcrumbName: "Monitoring Customer",
    },
    {
      path: "",
      breadcrumbName: "Detail Gap Data Pra Billing vs Master Data",
    },
  ];

  const handleDownload = () => {
    dispatch(downloadGapPraBillingMaster({ period, accountNumber }));
  };

  const handleSynchronize = (record) => {
    setSyncRecord(record);
    setDataInfoExpanded(true);
    setSyncModalOpen(true);
  };

  const handleCloseSyncModal = () => {
    setSyncModalOpen(false);
    setSyncRecord(null);
  };

  const handleConfirmSync = async () => {
    if (!syncRecord) return;
    setSyncModalOpen(false);
    try {
      await dispatch(syncGapPraBillingMaster({ logId: syncRecord.id, period })).unwrap();
      setSuccessModalOpen(true);
    } catch {
      setFailedModalOpen(true);
    }
  };

  const handleCloseSuccessModal = () => {
    setSuccessModalOpen(false);
    setSyncRecord(null);
    dispatch(getGapPraBillingMaster({ period, page, pageSize, accountNumber }));
  };

  const handleCloseFailedModal = () => {
    setFailedModalOpen(false);
  };

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
      title: "NAME",
      dataIndex: "name",
      key: "name",
      width: 200,
    },
    {
      title: "BILLING PERIOD",
      dataIndex: "billingPeriod",
      key: "billingPeriod",
      width: 130,
    },
    {
      title: "FIELD MISMATCH",
      dataIndex: "fieldMismatch",
      key: "fieldMismatch",
      width: 160,
    },
    {
      title: "PRA-BILLING VALUE",
      dataIndex: "praBillingValue",
      key: "praBillingValue",
      width: 170,
      isNumber: true,
    },
    {
      title: "MASTER VALUE",
      dataIndex: "masterValue",
      key: "masterValue",
      width: 150,
      isNumber: true,
    },
    {
      title: "ACTION",
      key: "action",
      width: 80,
      align: "center",
      fixed: "right",
      render: (_, record) => {
        const menuItems = [
          {
            key: "synchronize",
            label: "Synchronize",
            onClick: () => handleSynchronize(record),
          },
        ];
        const menu = <Menu items={menuItems} />;
        return (
          <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
            <div className="cursor-pointer flex justify-center">
              <EllipsisOutlined style={{ fontSize: "18px" }} />
            </div>
          </Dropdown>
        );
      },
    },
  ];

  return (
    <LayoutMenu grantPath={RBI_ROUTES.MONITORING_CUSTOMER_VIEW}>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />

        <CardContainer
          header={
            <div className="flex justify-between items-center -my-4">
              <p className="mt-[15px] font-bold">DETAIL GAP DATA : PRA BILLING VS MASER DATA</p>
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
            idTable="table-detail-gap-pra-billing-master"
            dataSource={gapPraBillingMasterData?.result || []}
            columns={tableColumns}
            pageSize={pageSize}
            current={page}
            loading={loading}
            totalData={gapPraBillingMasterData?.page?.totalElements || 0}
            tableScrolled={{ x: "max-content" }}
            usePagination={true}
            useSelect={true}
            showAdvanceSearch={true}
            showSearchBar={true}
            onChange={(p) => setPage(p)}
          />
        </CardContainer>
      </Spin>

      {/* Sync Modals */}
      <SyncConfirmationModals
        syncModalOpen={syncModalOpen}
        syncRecord={syncRecord}
        dataInfoExpanded={dataInfoExpanded}
        setDataInfoExpanded={setDataInfoExpanded}
        syncing={false}
        successModalOpen={successModalOpen}
        failedModalOpen={failedModalOpen}
        onCancelSync={handleCloseSyncModal}
        onConfirmSync={handleConfirmSync}
        onCloseSuccess={handleCloseSuccessModal}
        onCloseFailed={handleCloseFailedModal}
      />

    </LayoutMenu>
  );
};

export default DetailGapPraBillingMasterTop;
