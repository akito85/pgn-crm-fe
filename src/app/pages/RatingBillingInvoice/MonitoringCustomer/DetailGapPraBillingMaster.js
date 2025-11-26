import React, { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spin, Input, Select, message, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import BreadCrumb from "../../../../components/BreadCrumb";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import ButtonComponent from "../../../../components/ButtonComponent";
import CardContainer from "../../../../components/CardContainer";
import TableRBI from "../../../../components/TableRBI";
import SVGIcon from "../../../../assets/Icon/index";
import { RBI_ROUTES } from "../../../../routes/rating_billing/rbi_routes";
import {
  getGapPraBillingMaster,
  downloadGapPraBillingMaster,
} from "../../../../redux/slices/rating_billing_invoice/monitoringSlice";
import { getColumnsGapPraBillingMaster } from "./Table/TableGapPraBillingMaster";
import { applyFixedColumns } from "../../../../utils/applyFixedColumns";

const { Option } = Select;
const { confirm } = Modal;

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

  // State untuk fix column
  const [fixedColumns, setFixedColumns] = useState({
    no: "left",
    action: "right",
  });

  useEffect(() => {
    dispatch(
      getGapPraBillingMaster({
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize,
        sort,
      })
    );
  }, [search, page, pageSize, sort, dispatch]);

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
    confirm({
      title: "Konfirmasi Sinkronisasi Data",
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>
            Anda akan menyinkronkan data untuk customer:{" "}
            <strong>{record.customerId}</strong>
          </p>
          <p style={{ marginTop: 8 }}>
            <strong>Field:</strong> {record.fieldMismatch}
          </p>
          <p>
            <strong>Pra-Billing Value:</strong> {record.praBillingValue}
          </p>
          <p>
            <strong>Master Value:</strong> {record.masterValue}
          </p>
          <p style={{ marginTop: 12, color: "#fa8c16" }}>
            Data Pra-Billing akan diperbarui mengikuti Master Data. Lanjutkan?
          </p>
        </div>
      ),
      okText: "Ya, Sinkronkan",
      cancelText: "Batal",
      onOk() {
        message.success(
          `Data ${record.customerId} berhasil disinkronkan dengan Master Data`
        );
        // Refresh data
        dispatch(
          getGapPraBillingMaster({
            search: encodeURIComponent(JSON.stringify(search)),
            page,
            pageSize,
            sort,
          })
        );
      },
    });
  };

  const handleCreateTicket = (record) => {
    Modal.info({
      title: "Buat Tiket Laporan",
      content: (
        <div>
          <p style={{ marginBottom: 12 }}>
            Tiket laporan akan dibuat untuk tim Master Data:
          </p>
          <div style={{ backgroundColor: "#f5f5f5", padding: 12, borderRadius: 4 }}>
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
              <p className="mt-[15px] font-bold">DETAIL - GAP DATA: PRA-BILLING VS MASTER DATA</p>
            </div>
          }
        >
          {/* Filters */}
          <div className="w-full mb-4 mt-4">
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
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
          <div className="my-5">
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
      </Spin>
    </LayoutMenu>
  );
};

export default DetailGapPraBillingMaster;