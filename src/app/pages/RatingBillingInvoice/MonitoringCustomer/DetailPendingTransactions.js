import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spin, Input, Select, Tooltip, message, Modal } from "antd";
import BreadCrumb from "../../../../components/BreadCrumb";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import ButtonComponent from "../../../../components/ButtonComponent";
import BaseContainer from "../../../../components/BaseContainer";
import TablePaginationNew from "../../../../components/TablePaginationNew";
import SVGIcon from "../../../../assets/Icon/index";
import { RBI_ROUTES } from "../../../../routes/rating_billing/rbi_routes";
import {
  getPendingTransactions,
  downloadPendingTransactions,
  getListBillingPeriod,
  updateInvestigationFlag
} from "../../../../redux/slices/rating_billing_invoice/monitoringSlice";
import { columnsPendingTransactions } from "./Table/TablePendingTransactions";

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
      }
    },
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

        <BaseContainer header={"Detail - Pending Transactions"}>
          {/* Filters */}
          <div className="w-full mb-4">
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
             <div>
                <span style={{ marginRight: 8 }}>Periode:</span>
                <Select
                  value={filterPeriod}
                  onChange={(value) => {
                    setFilterPeriod(value);
                    setPage(1); // Reset to first page
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
                <span style={{ marginRight: 8 }}>Type:</span>
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
                  <Option value="Tangerang">Tangerang</Option>
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
                  <Option value="Investigating">Investigating</Option>
                </Select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="w-full">
            <TablePaginationNew
              dataSource={dataSource}
              columns={columnsPendingTransactions(
                page,
                pageSize,
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                search,
                handleRecalculate,
                handleInvestigate
              )}
              current={page}
              pageSize={pageSize}
              onChange={handleChange}
              onSizeChanger={handleChange}
              totalData={pendingTransactionsData?.page?.totalElements || 0}
              onSort={onSortApi}
              tableScrolled={{ y: 525, x: 1500 }}
            />
          </div>
        </BaseContainer>
      </Spin>
    </LayoutMenu>
  );
};

export default DetailPendingTransactions;