import React, { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spin, Input, Select, message, Modal } from "antd";
import BreadCrumb from "../../../../components/BreadCrumb";
import ButtonComponent from "../../../../components/ButtonComponent";
import CardContainer from "../../../../components/CardContainer";
import TableRBI from "../../../../components/TableRBI";
import SVGIcon from "../../../../assets/Icon/index";
import { RBI_ROUTES } from "../../../../routes/rating_billing/rbi_routes";
import {
  getPendingApprovals,
  downloadPendingApprovals,
} from "../../../../redux/slices/rating_billing_invoice/monitoringSlice";
import { getColumnsPendingApprovals } from "./Table/TablePendingApprovals";
import { applyFixedColumns } from "../../../../utils/applyFixedColumns";

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

  // State untuk fix column
  const [fixedColumns, setFixedColumns] = useState({
    no: "left",
    action: "right",
  });

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

  // Get columns from separated file
  const baseColumns = useMemo(
    () =>
      getColumnsPendingApprovals(
        page,
        pageSize,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        search,
        handleApprovalDetail
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
    <>
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
              <p className="mt-[15px] font-bold">DETAIL - PENDING APPROVALS</p>
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
                  <Option value="In Review">In Review</Option>
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
              totalData={pendingApprovalsData?.page?.totalElements || 0}
              tableScrolled={{ x: 1600, y: 525 }}
              onSort={onSort}
              columnDefinitions={columnDefinitions}
              fixedColumns={fixedColumns}
              setFixedColumns={setFixedColumns}
              loading={loading}
            />
          </div>
        </CardContainer>
      </Spin>
    </>
  );
};

export default DetailPendingApprovals;
