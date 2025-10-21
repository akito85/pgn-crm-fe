import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spin, Input, Select, message, Modal } from "antd";
import BreadCrumb from "../../../../components/BreadCrumb";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import ButtonComponent from "../../../../components/ButtonComponent";
import BaseContainer from "../../../../components/BaseContainer";
import TablePaginationNew from "../../../../components/TablePaginationNew";
import SVGIcon from "../../../../assets/Icon/index";
import { RBI_ROUTES } from "../../../../routes/rating_billing/rbi_routes";
import {
  getPendingApprovals,
  downloadPendingApprovals,
} from "../../../../redux/slices/rating_billing_invoice/monitoringSlice";
import { columnsPendingApprovals } from "./Table/TablePendingApprovals";

const { Option } = Select;

const DetailPendingApprovals = ({ filterPeriod, handleBack }) => {
  const { loading, pendingApprovalsData } = useSelector(
    (state) => state.monitoring
  );

  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const dataSource = pendingApprovalsData?.result;

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
      getPendingApprovals({
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
      breadcrumbName: "Pending Approvals",
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
      downloadPendingApprovals({
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize,
        sort,
      })
    );
    message.success("Download berhasil!");
  };

  const handleApprovalDetail = (record) => {
    Modal.info({
      title: "Approval Detail",
      content: (
        <div>
          <p>
            <strong>Batch ID:</strong> {record.batchId}
          </p>
          <p>
            <strong>Account Number:</strong> {record.accountNumber}
          </p>
          <p>
            <strong>Billing Period:</strong> {record.billingPeriod}
          </p>
          <p>
            <strong>Total Customers:</strong> {record.totalCustomers}
          </p>
          <p>
            <strong>Estimated Amount:</strong> Rp{" "}
            {record.estimatedAmount?.toLocaleString("id-ID")}
          </p>
          <p>
            <strong>Created By:</strong> {record.createdBy}
          </p>
          <p>
            <strong>Created At:</strong> {record.createdAt}
          </p>
        </div>
      ),
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

        <BaseContainer header={"Detail - Pending Approvals"}>
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
                  <Option value="In Review">In Review</Option>
                </Select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="w-full">
            <TablePaginationNew
              dataSource={dataSource}
              columns={columnsPendingApprovals(
                page,
                pageSize,
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                search,
                handleApprovalDetail
              )}
              current={page}
              pageSize={pageSize}
              onChange={handleChange}
              onSizeChanger={handleChange}
              totalData={pendingApprovalsData?.page?.totalElements || 0}
              onSort={onSortApi}
              tableScrolled={{ y: 525, x: 1500 }}
            />
          </div>
        </BaseContainer>
      </Spin>
    </LayoutMenu>
  );
};

export default DetailPendingApprovals;