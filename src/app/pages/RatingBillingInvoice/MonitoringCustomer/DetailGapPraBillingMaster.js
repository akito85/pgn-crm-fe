import React, { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spin, Input, Select, message, Modal } from "antd";
import { SyncOutlined } from "@ant-design/icons";
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
  downloadGapPraBillingMaster,
} from "../../../../redux/slices/rating_billing_invoice/monitoringSlice";
import { getColumnsGapPraBillingMaster } from "./Table/TableGapPraBillingMaster";
import { applyFixedColumns } from "../../../../utils/applyFixedColumns";

const { Option } = Select;

const DetailGapPraBillingMaster = ({ filterPeriod, handleBack }) => {
  const { loading, gapPraBillingMasterData } = useSelector(
    (state) => state.monitoring
  );

  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const dataSource = gapPraBillingMasterData?.result;

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [filterArea, setFilterArea] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  // State untuk sync modals
  const [syncModalOpen, setSyncModalOpen] = useState(false);
  const [syncRecord, setSyncRecord] = useState(null);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [failedModalOpen, setFailedModalOpen] = useState(false);
  const [dataInfoExpanded, setDataInfoExpanded] = useState(true);

  // State untuk fix column
  const [fixedColumns, setFixedColumns] = useState({
    no: "left",
    action: "right",
  });

  useEffect(() => {
    if (filterPeriod) {
      dispatch(
        getGapPraBillingMaster({
          period: filterPeriod,
          page: page - 1,
          pageSize,
        })
      );
    }
  }, [filterPeriod, page, pageSize, dispatch]);

  const routes = [
    {
      path: "",
      breadcrumbName: "Rating & Billing",
    },
    {
      path: RBI_ROUTES.MONITORING_CUSTOMER,
      breadcrumbName: "Monitoring Customer",
    },
    {
      path: "",
      breadcrumbName: "Gap Pra-Billing vs Master",
    },
  ];

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setPage(1);
      }
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
  };

  const handleChangePage = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  const onSort = (_, __, sorter) => {
    const dataSort =
      sorter.order !== undefined
        ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const handleDownload = () => {
    dispatch(
      downloadGapPraBillingMaster({
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize,
        sort,
      })
    );
    message.success("Download berhasil!");
  };

  const handleSyncData = (record) => {
    setSyncRecord(record);
    setDataInfoExpanded(true);
    setSyncModalOpen(true);
  };

  const handleConfirmSync = () => {
    setSyncModalOpen(false);
    // TODO: wire real API call; on success -> setSuccessModalOpen(true), on error -> setFailedModalOpen(true)
    setSuccessModalOpen(true);
  };

  const handleCloseSyncModal = () => {
    setSyncModalOpen(false);
    setSyncRecord(null);
  };

  const handleCloseSuccessModal = () => {
    setSuccessModalOpen(false);
    setSyncRecord(null);
    dispatch(
      getGapPraBillingMaster({
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize,
        sort,
      })
    );
  };

  const handleCloseFailedModal = () => {
    setFailedModalOpen(false);
  };

  const handleCreateTicket = (record) => {
    Modal.info({
      title: "Buat Tiket Laporan",
      content: (
        <div>
          <p style={{ marginBottom: 12 }}>
            Tiket laporan akan dibuat untuk tim Master Data:
          </p>
          <div
            style={{ backgroundColor: "#f5f5f5", padding: 12, borderRadius: 4 }}
          >
            <p>
              <strong>Customer ID:</strong> {record.customerId}
            </p>
            <p>
              <strong>Customer Name:</strong> {record.customerName}
            </p>
            <p>
              <strong>Billing Period:</strong> {record.billingPeriod}
            </p>
            <p>
              <strong>Field Mismatch:</strong> {record.fieldMismatch}
            </p>
            <p>
              <strong>Pra-Billing Value:</strong> {record.praBillingValue}
            </p>
            <p>
              <strong>Master Value:</strong> {record.masterValue}
            </p>
          </div>
          <p style={{ marginTop: 12, fontSize: 12, color: "#666" }}>
            Tiket akan dikirim ke sistem ticketing untuk ditindaklanjuti oleh
            tim Master Data.
          </p>
        </div>
      ),
      okText: "Kirim Tiket",
      onOk() {
        message.success("Tiket berhasil dibuat dan dikirim ke tim Master Data");
      },
      width: 600,
    });
  };

  // Get columns from separated file
  const baseColumns = useMemo(
    () =>
      getColumnsGapPraBillingMaster(
        page,
        pageSize,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        search,
        handleSyncData,
        handleCreateTicket
      ),
    [page, pageSize, searchedColumn, searchText, search]
  );

  // Combine columns with keys
  const allColumns = useMemo(() => {
    const columnsWithKeys = baseColumns.map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
    return columnsWithKeys;
  }, [baseColumns]);

  // Apply fixed columns
  const processedColumns = useMemo(() => {
    return applyFixedColumns(allColumns, fixedColumns);
  }, [allColumns, fixedColumns]);

  // Column definitions for dropdown
  const columnDefinitions = useMemo(() => {
    return allColumns.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [allColumns]);

  return (
    <LayoutMenu>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />

        <div className="w-full flex justify-between gap-[20px] mb-4">
          <ButtonComponent type="default" onClick={handleBack}>
            ← Kembali ke Dashboard
          </ButtonComponent>
          <ButtonComponent
            icon={<SVGIcon name="IconButtonDownload" width={24} />}
            type="submit"
            onClick={handleDownload}
          >
            Download
          </ButtonComponent>
        </div>

        <CardContainer
          header={
            <div className="flex -my-4 justify-between items-center">
              <p className="mt-[15px] font-bold">
                DETAIL - GAP DATA: PRA-BILLING VS MASTER DATA
              </p>
            </div>
          }
        >
          {/* Filters */}
          <div className="w-full mb-4 mt-4">
            <div
              style={{
                display: "flex",
                gap: 16,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <div>
                <span style={{ marginRight: 8, fontWeight: 500 }}>Period:</span>
                <Input value={filterPeriod} disabled style={{ width: 120 }} />
              </div>
              <div>
                <span style={{ marginRight: 8, fontWeight: 500 }}>Area:</span>
                <Select
                  value={filterArea}
                  onChange={setFilterArea}
                  style={{ width: 150 }}
                >
                  <Option value="All">All</Option>
                  <Option value="Jakarta">Jakarta</Option>
                  <Option value="Bandung">Bandung</Option>
                  <Option value="Surabaya">Surabaya</Option>
                </Select>
              </div>
              <div>
                <span style={{ marginRight: 8, fontWeight: 500 }}>Status:</span>
                <Select
                  value={filterStatus}
                  onChange={setFilterStatus}
                  style={{ width: 150 }}
                >
                  <Option value="All">All</Option>
                  <Option value="Pending">Pending</Option>
                  <Option value="Synced">Synced</Option>
                  <Option value="Ticket Created">Ticket Created</Option>
                </Select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="my-0">
            <TableRBI
              dataSource={dataSource}
              columns={processedColumns}
              current={page}
              pageSize={pageSize}
              onChange={handleChangePage}
              onSizeChanger={handleChangePage}
              totalData={gapPraBillingMasterData?.page?.totalElements || 0}
              tableScrolled={{ x: 1800, y: 525 }}
              onSort={onSort}
              columnDefinitions={columnDefinitions}
              fixedColumns={fixedColumns}
              setFixedColumns={setFixedColumns}
              loading={loading}
            />
          </div>
        </CardContainer>

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
            style={{
              border: "1px solid #d9e8f5",
              borderRadius: 6,
              backgroundColor: "#f0f7ff",
            }}
          >
            <div
              className="flex justify-between items-center cursor-pointer px-4 py-2"
              style={{
                borderBottom: dataInfoExpanded ? "1px solid #d9e8f5" : "none",
              }}
              onClick={() => setDataInfoExpanded((prev) => !prev)}
            >
              <span style={{ fontWeight: 600, fontSize: 13, color: "#0075bf" }}>
                DATA INFORMATION
              </span>
              <span style={{ fontSize: 16, color: "#0075bf" }}>
                {dataInfoExpanded ? "^" : "v"}
              </span>
            </div>
            {dataInfoExpanded && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "8px 16px",
                  padding: "12px 16px",
                }}
              >
                <div>
                  <div style={{ fontSize: 11, color: "#888", marginBottom: 2 }}>
                    Customer ID
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>
                    {syncRecord?.customerId ?? "-"}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "#888", marginBottom: 2 }}>
                    Feld Mismatch
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>
                    {syncRecord?.fieldMismatch ?? "-"}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "#888", marginBottom: 2 }}>
                    Pra-Billing Value
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: "#fa8c16" }}>
                    {syncRecord?.praBillingValue ?? "-"}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "#888", marginBottom: 2 }}>
                    Master Value
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: "#52c41a" }}>
                    {syncRecord?.masterValue ?? "-"}
                  </div>
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
              <ButtonComponent type="submit" onClick={handleCloseSuccessModal}>
                Done
              </ButtonComponent>
            </div>,
          ]}
        >
          <div className="flex flex-col items-center text-center py-8 px-4">
            <SVGIcon name="IconSuccess" width={64} />
            <p style={{ fontWeight: 700, fontSize: 18, marginTop: 16, marginBottom: 8 }}>
              Successful
            </p>
            <p style={{ fontSize: 13, color: "#555" }}>
              Your data has been Successfuly syncronized with the Master Data
            </p>
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
              <ButtonComponent type="submit" onClick={handleCloseFailedModal}>
                Done
              </ButtonComponent>
            </div>,
          ]}
        >
          <div className="flex flex-col items-center text-center py-8 px-4">
            <SVGIcon name="IconFailed" width={64} />
            <p style={{ fontWeight: 700, fontSize: 18, marginTop: 16, marginBottom: 8 }}>
              Unsuccessful
            </p>
            <div
              style={{
                width: "80%",
                borderTop: "1px dashed #d9d9d9",
                margin: "8px auto 12px",
              }}
            />
            <p style={{ fontSize: 13, color: "#555", whiteSpace: "pre-line" }}>
              {"Failed to syncronizzed data with Master Data\nPlease try again.."}
            </p>
          </div>
        </Modal>

      </Spin>
    </LayoutMenu>
  );
};

export default DetailGapPraBillingMaster;
