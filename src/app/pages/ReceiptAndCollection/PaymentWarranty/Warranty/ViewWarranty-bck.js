import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spin, Tooltip, Dropdown, message, Menu } from "antd";
import { ReloadOutlined, DownOutlined, PauseCircleOutlined, MailOutlined } from "@ant-design/icons";
import moment from "moment";

// Routes
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";

// Global Custom Components
import BreadCrumb from "../../../../../components/BreadCrumb";
import CardContainer from "../../../../../components/CardContainer";
import TableRBI from "../../../../../components/TableRBI";
import ButtonComponent from "../../../../../components/ButtonComponent";
import Toolbar from "../../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../../components/ColumnActionPermission";

// Utils
import { applyFixedColumns } from "../../../../../utils/applyFixedColumns";

// Column Configuration
import { getWarrantyColumn, getActionColumn } from "./ColumnConfig/WarrantyColumns";

// Redux / Service
import { getAllWarrantyListPaginate, downloadWarrantyList } from "../../../../../redux/slices/receipt_collection/warranty";

// Modal
import RefundModal from "./Modal/RefundModal";

const ViewWarranty = () => {
  // Selector
  const {
    data_warranty_list,
    loading,
    pagination,
    data_approval_history,
    loading_approval_history,
  } = useSelector((state) => state.warranty);

  // Declaration
  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const dataSource = data_warranty_list || [];

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState("invoiceDate~desc");
  const [search, setSearch] = useState({});
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");

  const [selectedBilling, setSelectedBilling] = useState(null);
  const [dataApprovalHistory, setDataApprovalHistory] = useState({});

  // Modal
  const [refundModal, setRefundModal] = useState(false);
  
  const [fixedColumns, setFixedColumns] = useState(() => ({
    left: ["no"],
    right: [],
  }));

  // Breadcrumbs
  const routes = [
    {
      path: "",
      breadcrumbName: "Receipt & Collection",
    },
    {
      path: "",
      breadcrumbName: "Payment Guarantee",
    },
    {
      path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_WARRANTY,
      breadcrumbName: "Guarantee List",
    }
  ];

  // Fetch data with filters
  useEffect(() => {
    dispatch(
      getAllWarrantyListPaginate({
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize,
        sort,
      })
    );
  }, [dispatch, search, page, pageSize, sort]);

  useEffect(() => {
    if (data_approval_history?.dataApprover) {
      const temp = {
        dataApprover: data_approval_history?.dataApprover?.EFAKTUR || [],
        dataHistory: data_approval_history?.dataHistory?.EFAKTUR || [],
      };
      setDataApprovalHistory(temp);
    } else {
      setDataApprovalHistory({});
    }
  }, [data_approval_history]);

  // Handle Search
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

  // Handle Change Page
  const handleChangePage = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  // Sort Table
  const onSort = (_, __, sorter) => {
    const dataSort =
      sorter && sorter.order !== undefined
        ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  // Handle Download
  const handleDownload = () => {
    dispatch(
      downloadWarrantyList({
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize,
        sort,
      })
    );
  };

  // Columns Definition
  const baseColumns = useMemo(
    () =>
      getWarrantyColumn({
        page,
        pageSize,
        search,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      }),
    [page, pageSize, search, searchText, searchedColumn]
  );

  const handleRefresh = () => {
    let tempSearch = "";
    for (const dataIndex in search) {
      if (Object.hasOwnProperty.call(search, dataIndex)) {
        const tempSearchText = search[dataIndex];
        if (tempSearchText) {
          tempSearch += `${dataIndex}~${tempSearchText},`;
        }
      }
    }
    tempSearch = tempSearch ? tempSearch.slice(0, -1) : "";
    const reqSearch = encodeURIComponent(JSON.stringify(search));

    dispatch(
      getAllWarrantyListPaginate({ search: reqSearch, page, pageSize, sort })
    );
    // dispatch(getAllBillingRequestPaginate());
    // dispatch(getAllBillingApprovePaginate());
  };
  // Action Dropdown Menu - Updated Design
  const actionMenu = (
    <Menu
      items={[
        {
          key: "refund",
          label: "Refund",
          icon: <ReloadOutlined style={{ color: "rgba(207, 0, 0, 1)" }} />,
          onClick: () => setRefundModal(true),
        },
        {
          type: "divider",
        },
        {
          key: "hold",
          label: "Hold",
          icon: <PauseCircleOutlined style={{ color: "#1890ff" }} />,
          onClick: null,
        },
        {
          type: "divider",
        },
        {
          key: "release",
          label: "Release",
          icon: <MailOutlined style={{ color: "rgba(81, 255, 0, 1)" }} />,
          onClick: null,
        }
      ]}
    />
  );

  // Item Grant Access untuk action columns
  const itemGrantAccess = [
    ...getActionColumn({
    }),
  ];

  const actionCols = useColumnActionPermission(
    ["view", "update"],
    itemGrantAccess
  );

  const allColumns = useMemo(() => {
    const columnsWithKeys = [...baseColumns, ...actionCols].map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
    return columnsWithKeys;
  }, [baseColumns, actionCols]);

  const processedColumns = useMemo(() => {
    return applyFixedColumns(allColumns, fixedColumns);
  }, [allColumns, fixedColumns]);

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

        <CardContainer
          header={
            <div className="flex -my-4 justify-between items-center">
              <p className="mt-[15px] font-bold">Guarantee List</p>
              <div className="flex gap-2">
                {/* Action Dropdown - Updated */}
                <Dropdown overlay={actionMenu} trigger={["click"]}>
                  <ButtonComponent type="default">
                    Actions <DownOutlined />
                  </ButtonComponent>
                </Dropdown>
              </div>
            </div>
          }
        >
          {/* Table Section */}
          <div className="my-5">
            <TableRBI
              dataSource={dataSource}
              columns={processedColumns}
              current={page}
              pageSize={pageSize}
              onChange={handleChangePage}
              onSizeChanger={handleChangePage}
              totalData={pagination?.totalElements || 0}
              tableScrolled={{ x: 3000, y: 525 }}
              onSort={onSort}
              handleDownload={handleDownload}
              columnDefinitions={columnDefinitions}
              fixedColumns={fixedColumns}
              setFixedColumns={setFixedColumns}
              loading={loading}
            />
          </div>
        </CardContainer>

        <RefundModal
          isOpen={refundModal}
          handleCancel={() => setRefundModal(false)}
          handleRefresh={handleRefresh}
          handleOpenModal={() => setRefundModal(true)}
        />
      </Spin>
    </>
  );
};

export default ViewWarranty;
