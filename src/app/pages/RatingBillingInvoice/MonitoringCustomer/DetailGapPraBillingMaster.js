import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spin, Input, Select, message, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import BreadCrumb from "../../../../components/BreadCrumb";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import ButtonComponent from "../../../../components/ButtonComponent";
import BaseContainer from "../../../../components/BaseContainer";
import TablePaginationNew from "../../../../components/TablePaginationNew";
import SVGIcon from "../../../../assets/Icon/index";
import { RBI_ROUTES } from "../../../../routes/rating_billing/rbi_routes";
import {
  getGapPraBillingMaster,
  downloadGapPraBillingMaster,
} from "../../../../redux/slices/rating_billing_invoice/monitoringSlice";
import { columnsGapPraBillingMaster } from "./Table/TableGapPraBillingMaster";

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
    setSearchedColumn(selectedKeys[0] ? dataIndex : "");
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

  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  const onSortApi = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
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

        <BaseContainer header={"Detail - Gap Data: Pra-Billing vs Master Data"}>
          {/* Filters */}
          <div className="w-full mb-4">
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <div>
                <span style={{ marginRight: 8 }}>Periode:</span>
                <Input value={filterPeriod} disabled style={{ width: 120 }} />
              </div>
              <div>
                <span style={{ marginRight: 8 }}>Area:</span>
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
                <span style={{ marginRight: 8 }}>Status:</span>
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
          <div className="w-full">
            <TablePaginationNew
              dataSource={dataSource}
              columns={columnsGapPraBillingMaster(
                page,
                pageSize,
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                search,
                handleSyncData,
                handleCreateTicket
              )}
              current={page}
              pageSize={pageSize}
              onChange={handleChange}
              onSizeChanger={handleChange}
              totalData={gapPraBillingMasterData?.page?.totalElements || 0}
              onSort={onSortApi}
              tableScrolled={{ y: 525, x: 1800 }}
            />
          </div>
        </BaseContainer>
      </Spin>
    </LayoutMenu>
  );
};

export default DetailGapPraBillingMaster;