import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spin, Tooltip, Dropdown, Menu } from "antd";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { EyeOutlined, WarningOutlined } from "@ant-design/icons";
import { debounce } from "lodash";

// Routes
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";

// Global Custom Components
import BreadCrumb from "../../../../../components/BreadCrumb";
import TableRBI from "../../../../../components/TableRBI";
import CardContainer from "../../../../../components/CardContainer";
import ButtonComponent from "../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../assets/Icon/index";
import { useColumnActionPermission } from "../../../../../components/ColumnActionPermission";
import ModalHistory from "../../../../../components/Modal/ModalHistory";
import { ModalConfirm } from "../../../../../components/Modal/ModalPopUp";

// Column Configuration
import { getDeductionColumns } from "./DeductionColumns";

// Redux
import { getPaginateDeduction, getDownloadDeduction, deleteDeduction, getApprovalHistory } from "../../../../../redux/slices/receipt_collection/deduction";

const ViewDeduction = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data, loading, dataApprovalHistory, loadingHistory } = useSelector((state) => state.deduction);
  const searchInput = useRef(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState({});

  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [openModalHistory, setOpenModalHistory] = useState(false);
  const [dataApprovalHistoryFix, setDataApprovalHistoryFix] = useState({});
  const [selectedRecord, setSelectedRecord] = useState(null);

  const routes = [
    {
      path: "",
      breadcrumbName: "Receipt & Collection",
    },
    {
      path: "",
      breadcrumbName: "Payment  Guarantee",
    },
    {
      path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_DEDUCTION,
      breadcrumbName: "Deduction List",
    },
  ];

  useEffect(() => {
    handleRefresh();
  }, [dispatch, page, pageSize, search]);

  useEffect(() => {
    if (dataApprovalHistory && (dataApprovalHistory?.dataApprover || dataApprovalHistory?.dataHistory)) {
      setDataApprovalHistoryFix({
        dataApprover: {
          creation: dataApprovalHistory?.dataApprover?.WARRANTY_DEDUCTION || [],
        },
        dataHistory: {
          creation: dataApprovalHistory?.dataHistory?.WARRANTY_DEDUCTION || [],
        },
      });
    } else {
      setDataApprovalHistoryFix({});
    }
  }, [dataApprovalHistory]);

  const handleChangePage = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const handleDownload = () => {
    dispatch(getDownloadDeduction({ page, pageSize, search: encodeURIComponent(JSON.stringify(search)) }));
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(selectedKeys[0] ? dataIndex : "");
    const shouldResetPage = search[dataIndex] !== selectedKeys[0];
    setSearch((prevState) => {
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
    if (shouldResetPage) {
      setPage(1);
    }
  };

  const handleDelete = (record) => {
    setSelectedRecord(record);
    setOpenModalDelete(true);
  };

  const handleRefresh = () => {
    const reqSearch = encodeURIComponent(JSON.stringify(search));
    dispatch(
      getPaginateDeduction({ search: reqSearch, page, pageSize })
    );
  };

  const handleGlobalSearch = useCallback(
    debounce((value) => {
      setSearchText(value);
      setSearchedColumn(value ? "all" : "");
      setSearch((prevState) => {
        const nextState = { ...prevState };
        if (value) {
          nextState.all = value;
        } else {
          delete nextState.all;
        }
        return nextState;
      });
      setPage(1);
    }, 500),
    []
  );

  useEffect(() => {
    return () => {
      handleGlobalSearch.cancel();
    };
  }, [handleGlobalSearch]);

  const handleAdvanceSearch = (searchData) => {
    const simpleSearch = {};
    if (searchData?.filters && Array.isArray(searchData.filters)) {
      searchData.filters.forEach((rule) => {
        if (rule.column && rule.value !== undefined && rule.value !== null && rule.value !== "") {
          simpleSearch[rule.column] = rule.value;
        }
      });
    }
    setSearch(simpleSearch);
    setPage(1);
  };

  const handleConfirmDelete = () => {
    dispatch(deleteDeduction(selectedRecord.id)).unwrap().then(() => {
      setOpenModalDelete(false);
      handleRefresh();
    });
  };

  const handleHistory = (record) => {
    setSelectedRecord(record);
    dispatch(getApprovalHistory({ id: record.id }));
    setOpenModalHistory(true);
  };

  const handleOptions = () => {
    const dataObj = dataApprovalHistoryFix?.dataApprover || {};
    const keyData = Object.keys(dataObj);
    return keyData.map((item) => ({
      value: item.charAt(0).toUpperCase() + item.slice(1).toLowerCase().replace(/_/g, " "),
    }));
  };

  const moreActionsMenu = (record) => (
    <Menu>
      <Menu.Item
        key="History"
        onClick={() => handleHistory(record)}
      >
        <div className="flex items-center gap-2">
          <SVGIcon name="IconLogHistory" color={"#000000"} width={16} />
          <span>Approval History</span>
        </div>
      </Menu.Item>
      <Menu.Item 
        key="Delete" 
        onClick={() => handleDelete(record)}
      >
        <div className="flex items-center gap-2">
          <SVGIcon name="IconDelete" color={"#BE3036"} width={16} />
          <span className="text-[#BE3036]">Delete</span>
        </div>
      </Menu.Item>
    </Menu>
  );

  const itemActions = [
    {
      action: "Download",
      render: (
        <ButtonComponent
          onClick={handleDownload}
          isPrimary={true}
          icon={<SVGIcon name="IconButtonDownload" width={18} color={"#FFFFFF"} />}
        >
          Download List
        </ButtonComponent>
      ),
    },
    {
      action: "Create",
      render: (
        <NavLink to={RECEIPT_AND_COLLECTION_ROUTES.CREATE_DEDUCTION}>
          <ButtonComponent
            isPrimary={true}
            icon={<SVGIcon name="IconButtonCreate" width={18} color={"#FFFFFF"} />}
            type="submit"
          >
            Create Deduction
          </ButtonComponent>
        </NavLink>
      ),
    },

    // column action
    {
      action: "View",
      type: "table",
      fixed: "right",
      width: 100,
      render: (record) => {
        return (
          <div className="flex justify-center items-center gap-2">
             <Dropdown overlay={moreActionsMenu(record)} trigger={['click']}>
              <div className="cursor-pointer">
                <SVGIcon name="IconActionDropdown" width={20} color={"#0075bf"} />
              </div>
            </Dropdown>
            <Tooltip title={"Detail"}>
              <Link
                to={`${RECEIPT_AND_COLLECTION_ROUTES.DETAIL_DEDUCTION}`}
                state={{ id: record?.id }}
              >
                 <SVGIcon name="IconDetail" width={24} color={"#0075bf"} />
              </Link>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  const actionCols = useColumnActionPermission(
    ["view"],
    itemActions
  );

  const baseColumns = useMemo(() => {
    return getDeductionColumns({
      page,
      pageSize,
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    });
  }, [
    page,
    pageSize,
    searchInput,
    searchedColumn,
    searchText,
  ]);

  return (
    <>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />
        <CardContainer header={
          <div className="flex -my-4 justify-between items-center">
            <p className="mt-[15px] font-bold uppercase text-[#0075BF]">DEDUCTION LIST</p>
            <div className="flex gap-2">
              <ButtonComponent
                onClick={handleDownload}
                isPrimary={true}
                icon={<SVGIcon name="IconButtonDownload" width={18} color={"#FFFFFF"} />}
              >
                Download List
              </ButtonComponent>
              <NavLink to={RECEIPT_AND_COLLECTION_ROUTES.CREATE_DEDUCTION}>
                <ButtonComponent
                  isPrimary={true}
                  icon={<SVGIcon name="IconButtonCreate" width={18} color={"#FFFFFF"} />}
                  type="submit"
                >
                  Create Deduction
                </ButtonComponent>
              </NavLink>
            </div>
          </div>
        }>
          <TableRBI
            columns={[...baseColumns, ...actionCols]}
            dataSource={data?.result?.map((item, index) => ({ ...item, key: index })) || []}
            showExport={true}
            showSearchBar={true}
            showAdvanceSearch={true}
            onSearch={(e) => handleGlobalSearch(e.target.value)}
            onAdvanceSearch={handleAdvanceSearch}
            handleDownload={handleDownload}
            current={page}
            pageSize={pageSize}
            onChange={handleChangePage}
            onSizeChanger={handleChangePage}
            totalData={data?.page?.totalElements || 0}
            tableScrolled={{ x: "max-content", y: 500 }}
          />
        </CardContainer>
      </Spin>

      {/* History Modal */}
      <ModalHistory
        isOpen={openModalHistory}
        handleClose={() => setOpenModalHistory(false)}
        header={
          <div className="flex items-center gap-2">
            <span>Approval History</span>
            {loadingHistory && <Spin size="small" />}
          </div>
        }
        width={850}
        tabOptions={handleOptions()}
        dataApprover={dataApprovalHistoryFix?.dataApprover}
        dataHistory={dataApprovalHistoryFix?.dataHistory}
      />

      {/* Delete Modal */}
      <ModalConfirm
        isOpen={openModalDelete}
        handleCancel={() => setOpenModalDelete(false)}
        handleOk={handleConfirmDelete}
        width={600}
      >
        <div className="flex justify-center gap-[20px] mt-6">
          <WarningOutlined style={{ fontSize: "24px", color: "#BE3036" }} />
          <p className={"text-[18px] font-bold"}>
            Warning! if you delete this data, it will be permanently.
          </p>
        </div>
      </ModalConfirm>
    </>
  );
};

export default ViewDeduction;
