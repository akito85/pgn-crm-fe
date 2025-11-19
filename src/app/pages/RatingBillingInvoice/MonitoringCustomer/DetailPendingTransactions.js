import React, { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spin, Select, message, Modal } from "antd";
import BreadCrumb from "../../../../components/BreadCrumb";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import ButtonComponent from "../../../../components/ButtonComponent";
import CardContainer from "../../../../components/CardContainer";
import TableRBI from "../../../../components/TableRBI";
import SVGIcon from "../../../../assets/Icon/index";
import { RBI_ROUTES } from "../../../../routes/rating_billing/rbi_routes";
import {
  getPendingTransactions,
  downloadPendingTransactions,
  getListBillingPeriod,
  updateInvestigationFlag
} from "../../../../redux/slices/rating_billing_invoice/monitoringSlice";
import { getColumnsPendingTransactions } from "./Table/TablePendingTransactions";
import { applyFixedColumns } from "../../../../utils/applyFixedColumns";

const { Option } = Select;

const DetailPendingTransactions = ({ filterPeriod: initialPeriod, handleBack }) => {
  const { loading, pendingTransactionsData, list_billing_period } = useSelector(
    (state) => state.monitoring
  );

  // Declaration
  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const dataSource = pendingTransactionsData?.result;

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [filterPeriod, setFilterPeriod] = useState(initialPeriod || 340);
  const [filterType, setFilterType] = useState("All");
  const [filterArea, setFilterArea] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  // State untuk fix column
  const [fixedColumns, setFixedColumns] = useState({
    no: "left",
    action: "right",
  });

  useEffect(() => {
    if (list_billing_period.length === 0) {
      dispatch(getListBillingPeriod());
    }
  }, [dispatch, list_billing_period.length]);

  useEffect(() => {
    dispatch(
      getPendingTransactions({
        period: filterPeriod,
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize,
        sort,
      })
    );
  }, [filterPeriod, search, page, pageSize, sort, dispatch]);

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
      breadcrumbName: "Pending Transactions",
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
      downloadPendingTransactions({
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize,
        sort,
      })
    );
    message.success("Download berhasil!");
  };

  const handleRecalculate = (record) => {
    message.info(
      `Memproses ulang kalkulasi untuk ${record.customerId} - ${record.customerName}`
    );
  };

  const handleInvestigate = (record) => {
    Modal.confirm({
      title: "Update Investigation Flag",
      content: `Are you sure you want to mark ${record.customerId} - ${record.customerName} as under investigation?`,
      okText: "Yes, Update",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await dispatch(updateInvestigationFlag(record.id)).unwrap();
          
          dispatch(
            getPendingTransactions({
              period: filterPeriod,
              search: encodeURIComponent(JSON.stringify(search)),
              page,
              pageSize,
              sort,
            })
          );
          
          message.success(`Investigation flag updated for ${record.customerId}`);
        } catch (error) {
          message.error("Failed to update investigation flag");
        }
      },
    });
  };

  // Get columns from separated file
  const baseColumns = useMemo(
    () =>
      getColumnsPendingTransactions(
        page,
        pageSize,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        search,
        handleRecalculate,
        handleInvestigate
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
              <p className="mt-[15px] font-bold">DETAIL - PENDING TRANSACTIONS</p>
            </div>
          }
        >
          {/* Filters */}
          <div className="w-full mb-4 mt-4">
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
              <div>
                <span style={{ marginRight: 8, fontWeight: 500 }}>Period:</span>
                <Select
                  value={filterPeriod}
                  onChange={(value) => {
                    setFilterPeriod(value);
                    setPage(1);
                  }}
                  style={{ width: 200 }}
                  showSearch
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {list_billing_period.map((period) => (
                    <Option key={period.id} value={period.id}>
                      {period.name}
                    </Option>
                  ))}
                </Select>
              </div>
              <div>
                <span style={{ marginRight: 8, fontWeight: 500 }}>Type:</span>
                <Select
                  value={filterType}
                  onChange={setFilterType}
                  style={{ width: 150 }}
                >
                  <Option value="All">All</Option>
                  <Option value="Rumah Tangga">Rumah Tangga</Option>
                  <Option value="Komersial">Komersial</Option>
                  <Option value="Industri">Industri</Option>
                </Select>
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
                  <Option value="Tangerang">Tangerang</Option>
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
                  <Option value="Investigating">Investigating</Option>
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
              totalData={pendingTransactionsData?.page?.totalElements || 0}
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

export default DetailPendingTransactions;