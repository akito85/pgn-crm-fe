import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Link } from "react-router-dom";
import CardContainer from "../../../../../components/CardContainer";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";
import SVGIcon from "../../../../../assets/Icon/index";
import Highlighter from "react-highlight-words";
import { DownloadOutlined } from "@ant-design/icons";
import { Checkbox, Spin, Tooltip } from "antd";
import TableRBI from "../../../../../components/TableRBI";
import StatusComponent from "../../../../../components/StatusComponent";
import {
  getAllApprovalList,
  getApprovalHistory,
  getDownloadBank,
  getListApprovalById,
  getPaginateBank,
  inactiveBank,
} from "../../../../../redux/slices/receipt_collection/bankSlice";
import ModalInactivateWithHierarchy from "../../../../../components/Modal/ModalInactivateWithHierarchy";
import { intToNPWP } from "../../../../../utils/npwp";
import { getColumnSearchPropsPaging } from "../../../../../utils/getColumnSearchProps";
import ModalHistory from "../../../../../components/Modal/ModalHistory";
import { useTryAgainHooks } from "../../../../../utils/useTryAgainHooks";
import Toolbar from "../../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../../components/ColumnActionPermission";
import { disabledActionByStatus } from "../../../../../utils";

export const columnsBank = (
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  handleInactive = () => {},
  handleApprovalHistory = () => {},
  search = {}
) => [
  {
    title: "NO",
    width: 60,
    align: "left",
    isClassification: true,
    render: (text, object, index) => (page - 1) * pageSize + index + 1,
  },
  {
    title: "CODE BANK",
    dataIndex: "bankCode",
    key: "bankCode",
    sorter: true,
    align: "right",
    ...getColumnSearchPropsPaging("bankCode", searchInput, searchedColumn, searchText, handleSearch, false, "input", search),
  },
  {
    title: "BANK NAME",
    dataIndex: "bankName",
    key: "bankName",
    sorter: true,
    align: "left",
    ...getColumnSearchPropsPaging("bankName", searchInput, searchedColumn, searchText, handleSearch, false, "input", search),
  },
  {
    title: "SHORT BANK NAME",
    dataIndex: "bankShortName",
    key: "bankShortName",
    sorter: true,
    align: "left",
    ...getColumnSearchPropsPaging("bankShortName", searchInput, searchedColumn, searchText, handleSearch, false, "input", search),
  },
  {
    title: "OFFICE TYPE",
    dataIndex: "isBranch",
    key: "branchName",
    sorter: true,
    align: "center",
    render: (_, record) => {
      const val = record.isBranch;
      return val === true || val === "Y" || val === "BRANCH" ? "BRANCH" : "HEAD OFFICE";
    },
  },
  {
    title: "BRANCH NAME",
    dataIndex: "branchName",
    key: "branchName",
    sorter: true,
    align: "left",
    ...getColumnSearchPropsPaging("branchName", searchInput, searchedColumn, searchText, handleSearch, false, "input", search),
  },
  {
    title: "TAX IDENTIFICATION NUMBER (NPWP)",
    dataIndex: "npwp",
    key: "npwp",
    sorter: (a, b) => a.npwp.length - b.npwp.length,
    align: "right",
    ...getColumnSearchPropsPaging("npwp", searchInput, searchedColumn, searchText, handleSearch, true, "input", search),
    render: (text) =>
      searchedColumn === "npwp" ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? intToNPWP(text) : ""}
        />
      ) : text ? (
        intToNPWP(text)
      ) : (
        "-"
      ),
  },
  {
    title: "TELEPHONE NUMBER",
    dataIndex: "phoneNumber",
    key: "phoneNumber",
    sorter: true,
    align: "right",
    ...getColumnSearchPropsPaging("phoneNumber", searchInput, searchedColumn, searchText, handleSearch, false, "input", search),
  },
  {
    title: "EMAIL",
    dataIndex: "email",
    key: "email",
    sorter: true,
    align: "left",
    ...getColumnSearchPropsPaging("email", searchInput, searchedColumn, searchText, handleSearch, false, "input", search),
  },
  {
    title: "ADDRESS",
    dataIndex: "address",
    key: "address",
    sorter: true,
    align: "left",
    ...getColumnSearchPropsPaging("address", searchInput, searchedColumn, searchText, handleSearch, false, "input", search),
  },
  {
    title: "STATUS",
    dataIndex: "status",
    sorter: true,
    align: "left",
    fixed: "right",
    width: 150,
    ...getColumnSearchPropsPaging("status", searchInput, searchedColumn, searchText, handleSearch, true, "input", search),
    render: (a) => (
      <div className="flex justify-center">
        <StatusComponent colour={a}>{a}</StatusComponent>
      </div>
    ),
  },
  {
    title: "STATUS APPROVAL",
    dataIndex: "statusApproval",
    sorter: true,
    align: "left",
    fixed: "right",
    width: 250,
    ...getColumnSearchPropsPaging("statusApproval", searchInput, searchedColumn, searchText, handleSearch, true, "input", search),
    render: (a) => (
      <div className="flex justify-center">
        <StatusComponent colour={a}>{a}</StatusComponent>
      </div>
    ),
  },
];

const ViewBank = () => {
  const { data, dataApprovalHistory, loading } = useSelector((state) => state.bank);
  const { bodyError } = useSelector((state) => state?.general);
  const dispatch = useDispatch();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [status, setStatus] = useState("");
  const [bankId, setBankId] = useState("");
  const [bankNames, setBankNames] = useState("");
  const [openModalInactivate, setOpenModalInactivate] = useState(false);
  const [openModalHistory, setOpenModalHistory] = useState(false);
  const [dataApprovalHistoryFix, setDataApprovalHistoryFix] = useState({});
  const [body, setBody] = useState({});

  const handleFetch = useCallback(() => {
    dispatch(
      getPaginateBank({
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize,
        sort,
      })
    );
  }, [dispatch, page, pageSize, search, sort]);

  useEffect(() => {
    handleFetch();
  }, [handleFetch]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    if (dataIndex !== "isBranch") {
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
    } else {
      if (selectedKeys[0]) {
        const tempSearchedText = "BRANCH".includes(selectedKeys[0] || "") ? "Y" : "N";
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
        setSearch((prevState) => {
          if (prevState[dataIndex] !== selectedKeys[0]) {
            setPage(1);
          }
          return {
            ...prevState,
            [dataIndex]: tempSearchedText[0],
          };
        });
      } else {
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
        const temp = { ...search };
        delete temp[dataIndex];

        setSearch((prevState) => {
          if (prevState[dataIndex] !== selectedKeys[0]) {
            setPage(1);
          }
          return temp;
        });
      }
    }
  };

  const handleChange = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const handleInactive = (r) => {
    setOpenModalInactivate(true);
    setBankId(r?.id);
    setBankNames(r?.bankName);
    setStatus(r?.status);
  };

  const routes = [
    { path: "", breadcrumbName: "System Setup" },
    { path: "", breadcrumbName: "Master Data" },
    { path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_MASTER_BANK, breadcrumbName: "Bank" },
  ];

  const onSort = (_, __, sort) => {
    const dataSort = sort.order !== undefined ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}` : "";
    setSort(dataSort);
  };

  const handleSubmitModalInactivate = (res, handleClear) => {
    const bodyPayload = {
      bankId: bankId,
      appHierId: res.approvalHierarchy,
      remark: res.remark,
      status: status === "Inactive" ? "Active" : "Inactive",
    };
    setBody({ body: bodyPayload });
    dispatch(inactiveBank({ body: bodyPayload }))
      .unwrap()
      .then(() => {
        handleClear();
        handleCancelModalInactivate();
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
        dispatch(getPaginateBank({ search: tempSearch, page, pageSize, sort }));
      });
  };

  const handleCancelModalInactivate = () => {
    setOpenModalInactivate(false);
  };

  useEffect(() => {
    if (dataApprovalHistory && dataApprovalHistory?.dataApprover) {
      const temp = {
        dataApprover: {
          create: dataApprovalHistory?.dataApprover?.BANK || [],
          inactive: dataApprovalHistory?.dataApprover?.INACTIVE_BANK || [],
        },
        dataHistory: {
          create: dataApprovalHistory?.dataHistory?.BANK || [],
          inactive: dataApprovalHistory?.dataHistory?.INACTIVE_BANK || [],
        },
      };
      setDataApprovalHistoryFix(temp);
    } else {
      setDataApprovalHistoryFix({});
    }
  }, [dataApprovalHistory]);

  const handleOptions = () => {
    const historyData = dataApprovalHistoryFix?.dataApprover || {};
    const keyData = Object.keys(historyData);
    return keyData.map((item) => ({
      value: item.charAt(0).toUpperCase() + item.slice(1).toLowerCase(),
    }));
  };

  const handleApprovalHistory = async (recordData) => {
    try {
      setBody(recordData);
      await dispatch(getApprovalHistory(recordData.id))?.unwrap();
      setOpenModalHistory(true);
    } catch (error) {
      setOpenModalHistory(false);
    }
  };

  const handleDownload = () => {
    dispatch(
      getDownloadBank({
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize,
        sort,
      })
    );
  };

  const itemActions = [
    {
      action: "Download",
      render: (
        <ButtonComponent
          onClick={handleDownload}
          type="submit"
          border={false}
          icon={<DownloadOutlined style={{ fontSize: "24px" }} />}
        >
          Download List
        </ButtonComponent>
      ),
    },
    {
      action: "Create",
      render: (
        <NavLink to={RECEIPT_AND_COLLECTION_ROUTES.CREATE_MASTER_BANK}>
          <ButtonComponent icon={<SVGIcon name="IconButtonCreate" width={24} />} type="submit">
            Create
          </ButtonComponent>
        </NavLink>
      ),
    },
    {
      action: "View",
      type: "table",
      render: (record) => {
        return (
          <Link to={RECEIPT_AND_COLLECTION_ROUTES.DETAIL_MASTER_BANK} state={{ id: record?.id }}>
            <Tooltip title="Detail">
              <div className="pt-0">
                <SVGIcon name="IconDetail" width={24} />
              </div>
            </Tooltip>
          </Link>
        );
      },
    },
    {
      action: "Update",
      type: "table",
      render: (record, data) => {
        const isDisabled = disabledActionByStatus("update", record?.status, record?.statusApproval);
        const linkContent = data > 3 ? (
          <ButtonComponent
            icon={<SVGIcon name="IconEdit" color={isDisabled ? "#8D91A0" : "#0075bf"} width={24} />}
            type={"action"}
            border={false}
            disabled={isDisabled}
          >
            <span className={`ml-0 ${isDisabled ? "text-[#8D91A0]" : "text-black"}`}> Update</span>
          </ButtonComponent>
        ) : (
          <Tooltip title="Update">
            <div className="pt-0">
              <SVGIcon
                name="IconEdit"
                width={24}
                color={isDisabled ? "#8D91A0" : "#ACC424"}
                className={isDisabled ? "cursor-not-allowed" : undefined}
              />
            </div>
          </Tooltip>
        );
        return isDisabled ? (
          <div>{linkContent}</div>
        ) : (
          <Link to={RECEIPT_AND_COLLECTION_ROUTES.UPDATE_MASTER_BANK} state={{ id: record?.id }}>
            {linkContent}
          </Link>
        );
      },
    },
    {
      action: "Activate",
      type: "table",
      render: (record, data) => {
        const statusLowerCase = record?.status?.toLowerCase();
        const isDisabled = disabledActionByStatus("activate", record?.status, record?.statusApproval);
        const Content = data > 3 ? (
          <ButtonComponent
            icon={
              <Checkbox
                className="inactive-check"
                onClick={() => handleInactive(record)}
                disabled={isDisabled}
                checked={record?.status !== "Active"}
              />
            }
            type={"action"}
            border={false}
            disabled={isDisabled}
            onClick={() => handleInactive(record)}
          >
            <span className="text-black ml-1">
              {record?.status === "Active" ? "Inactivate" : "Activate"}
            </span>
          </ButtonComponent>
        ) : (
          <Tooltip title={statusLowerCase === "active" || statusLowerCase === "draft" ? "Inactivate" : "Activate"}>
            <div className="pt-1">
              <Checkbox
                className="inactive-check"
                onClick={() => handleInactive(record)}
                checked={record?.status !== "Active"}
                disabled={isDisabled}
              />
            </div>
          </Tooltip>
        );
        return Content;
      },
    },
    {
      action: "history",
      type: "table",
      render: (record, data) => {
        return data > 3 ? (
          <ButtonComponent
            icon={<SVGIcon name="IconLogHistory" color={"#0075bf"} width={24} />}
            type={"action"}
            border={false}
            onClick={() => handleApprovalHistory(record)}
          >
            <span className={"text-black ml-0"}>Approval History</span>
          </ButtonComponent>
        ) : (
          <Tooltip title="Approval History">
            <div className="pt-1">
              <SVGIcon
                name="IconLogHistory"
                color={"#0075bf"}
                width={24}
                onClick={() => handleApprovalHistory(record)}
              />
            </div>
          </Tooltip>
        );
      },
    },
  ];

  const handleRetry = () => {
    try {
      handleCancelTryAgain();
      if (bodyError?.action === "INACTIVE_MASTER_BNAK") {
        dispatch(inactiveBank(body));
      } else if (bodyError?.action === "GET_APPROVAL_BANK") {
        dispatch(getApprovalHistory(body));
      } else if (bodyError?.action === "DOWNLOAD_MASTER_BANK") {
        handleDownload();
      }
      handleFetch();
    } catch (error) {
      handleFetch();
    }
  };

  const { renderModal, handleCancelTryAgain } = useTryAgainHooks(handleRetry);

  return (
    <>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />
        <CardContainer
          header={
            <div className="flex -my-4 justify-between items-center">
              <p className="mt-[15px] font-bold">BANK LIST</p>

              <Toolbar items={itemActions} />
            </div>
          }
        >
          <TableRBI
            dataSource={data?.result}
            pageSize={pageSize}
            showExport={true}
            handleDownload={handleDownload}
            columns={[
              ...columnsBank(
                page,
                pageSize,
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                handleInactive,
                handleApprovalHistory,
                search
              ),
              ...useColumnActionPermission(["view", "history", "update", "activate"], itemActions),
            ]}
            current={page}
            onChange={handleChange}
            onSizeChanger={handleChange}
            totalData={data?.page?.totalElements}
            onSort={onSort}
            tableScrolled={{ x: "max-content", y: 525 }}
          />
        </CardContainer>

        <ModalInactivateWithHierarchy
          dispatch={dispatch}
          getAPIOption={getAllApprovalList}
          getAPIDetail={getListApprovalById}
          selector="bank"
          alertMessage={`Are you sure you want to inactivate this Bank with the name ${bankNames || ""}?`}
          openModalInactivate={openModalInactivate}
          handleCloseModalInactivate={handleCancelModalInactivate}
          onFinish={handleSubmitModalInactivate}
        />

        <ModalHistory
          isOpen={openModalHistory && dataApprovalHistoryFix}
          handleClose={() => setOpenModalHistory(false)}
          header="Approval History"
          width={850}
          tabOptions={handleOptions()}
          dataApprover={dataApprovalHistoryFix?.dataApprover}
          dataHistory={dataApprovalHistoryFix?.dataHistory}
        />

        {renderModal()}
      </Spin>
    </>
  );
};

export default ViewBank;