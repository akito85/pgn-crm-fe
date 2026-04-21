import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Spin, Dropdown, Menu, Modal } from "antd";
import { EllipsisOutlined, SyncOutlined } from "@ant-design/icons";
import BreadCrumb from "../../../../components/BreadCrumb";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import ButtonComponent from "../../../../components/ButtonComponent";
import CardContainer from "../../../../components/CardContainer";
import TableRBI from "../../../../components/TableRBI";
import SVGIcon from "../../../../assets/Icon/index";
import ModalCustom from "../../../../components/Modal/ModalCustom";
import { RBI_ROUTES } from "../../../../routes/rating_billing/rbi_routes";
import {
  getGapPraBillingMaster,
  syncGapPraBillingMaster,
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
          page: page - 1,
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
    // Download handler — wire up when backend endpoint is ready
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
    setSyncModalOpen(false);
    try {
      await dispatch(syncGapPraBillingMaster()).unwrap();
      setSuccessModalOpen(true);
    } catch {
      setFailedModalOpen(true);
    }
  };

  const handleCloseSuccessModal = () => {
    setSuccessModalOpen(false);
    setSyncRecord(null);
    dispatch(getGapPraBillingMaster({ period, page: page - 1, pageSize, accountNumber }));
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

      {/* Modal 1: Sync Confirmation */}
      <ModalCustom
        isOpen={syncModalOpen}
        type="confirmation"
        header="DATA SYNCHRONIZATION CONFIRMATION"
        width={550}
        handleCancel={handleCloseSyncModal}
        footer={
          <div className="w-full flex justify-end gap-3 px-4 py-3">
            <ButtonComponent type="default" onClick={handleCloseSyncModal}>
              Cancel
            </ButtonComponent>
            <ButtonComponent
              type="submit"
              icon={<SyncOutlined />}
              onClick={handleConfirmSync}
            >
              Sync Data
            </ButtonComponent>
          </div>
        }
      >
        <div
          style={{ border: "1px solid #d9e8f5", borderRadius: 6, backgroundColor: "#f0f7ff" }}
        >
          <div
            className="flex justify-between items-center cursor-pointer px-4 py-2"
            style={{ borderBottom: dataInfoExpanded ? "1px solid #d9e8f5" : "none" }}
            onClick={() => setDataInfoExpanded((prev) => !prev)}
          >
            <span style={{ fontWeight: 600, fontSize: 13, color: "#0075bf" }}>DATA INFORMATION</span>
            <span style={{ fontSize: 16, color: "#0075bf" }}>{dataInfoExpanded ? "^" : "v"}</span>
          </div>
          {dataInfoExpanded && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px", padding: "12px 16px" }}>
              <div>
                <div style={{ fontSize: 11, color: "#888", marginBottom: 2 }}>Customer ID</div>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{syncRecord?.customerId ?? "-"}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#888", marginBottom: 2 }}>Field Mismatch</div>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{syncRecord?.fieldMismatch ?? "-"}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#888", marginBottom: 2 }}>Pra-Billing Value</div>
                <div style={{ fontWeight: 600, fontSize: 13, color: "#fa8c16" }}>{syncRecord?.praBillingValue ?? "-"}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#888", marginBottom: 2 }}>Master Value</div>
                <div style={{ fontWeight: 600, fontSize: 13, color: "#52c41a" }}>{syncRecord?.masterValue ?? "-"}</div>
              </div>
            </div>
          )}
        </div>
      </ModalCustom>

      {/* Modal 2: Success */}
      <Modal
        open={successModalOpen}
        onCancel={handleCloseSuccessModal}
        centered
        width={450}
        maskClosable={false}
        className="modal-custom"
        footer={[
          <div key="footer" className="w-full flex justify-center pb-2">
            <ButtonComponent type="submit" onClick={handleCloseSuccessModal}>Done</ButtonComponent>
          </div>,
        ]}
      >
        <div className="flex flex-col items-center text-center py-8 px-4">
          <SVGIcon name="IconSuccess" width={64} />
          <p style={{ fontWeight: 700, fontSize: 18, marginTop: 16, marginBottom: 8 }}>Successful</p>
          <p style={{ fontSize: 13, color: "#555" }}>Your data has been Successfuly syncronized with the Master Data</p>
        </div>
      </Modal>

      {/* Modal 3: Failed */}
      <Modal
        open={failedModalOpen}
        onCancel={handleCloseFailedModal}
        centered
        width={450}
        maskClosable={false}
        className="modal-custom"
        footer={[
          <div key="footer" className="w-full flex justify-center pb-2">
            <ButtonComponent type="submit" onClick={handleCloseFailedModal}>Done</ButtonComponent>
          </div>,
        ]}
      >
        <div className="flex flex-col items-center text-center py-8 px-4">
          <SVGIcon name="IconFailed" width={64} />
          <p style={{ fontWeight: 700, fontSize: 18, marginTop: 16, marginBottom: 8 }}>Unsuccessful</p>
          <div style={{ width: "80%", borderTop: "1px dashed #d9d9d9", margin: "8px auto 12px" }} />
          <p style={{ fontSize: 13, color: "#555", whiteSpace: "pre-line" }}>
            {"Failed to syncronizzed data with Master Data\nPlease try again.."}
          </p>
        </div>
      </Modal>

    </LayoutMenu>
  );
};

export default DetailGapPraBillingMasterTop;
