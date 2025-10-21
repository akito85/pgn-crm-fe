import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Link, json } from "react-router-dom";
import BaseContainer from "../../../../../components/BaseContainer";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";
import SVGIcon from "../../../../../assets/Icon/index";

import Highlighter from "react-highlight-words";
import { DownloadOutlined } from "@ant-design/icons";
import { Checkbox, Form, Spin, Tooltip } from "antd";
import TablePagination from "../../../../../components/TablePagination";
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
import TablePaginationNew from "../../../../../components/TablePaginationNew";
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
) => [
  {
    title: "NO",
    width: 60,
    align: "center",
    render: (text, object, index) => (page - 1) * pageSize + index + 1,
  },
  {
    title: "BANK CODE",
    dataIndex: "bankCode",
    key: "bankCode",
    sorter: true,
    align: "center",
    ...getColumnSearchPropsPaging(
      "bankCode",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    title: "BANK NAME",
    dataIndex: "bankName",
    key: "bankName",
    sorter: true,
    align: "left",
    ...getColumnSearchPropsPaging(
      "bankName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    title: "BANK SHORT NAME",
    dataIndex: "bankShortName",
    key: "bankShortName",
    sorter: true,
    align: "left",
    ...getColumnSearchPropsPaging(
      "bankShortName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    title: "BRANCH NAME",
    dataIndex: "branchName",
    key: "branchName",
    sorter: true,
    align: "left",
    ...getColumnSearchPropsPaging(
      "branchName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    title: "TAX IDENTIFICATION NUMBER (NPWP)",
    dataIndex: "npwp",
    key: "npwp",
    sorter: (a, b) => a.npwp.length - b.npwp.length,
    align: "left",
    ...getColumnSearchPropsPaging(
      "npwp",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) =>
      searchedColumn === "npwp" ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
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
    title: "PHONE NUMBER",
    dataIndex: "phoneNumber",
    key: "phoneNumber",
    sorter: true,
    align: "left",
    ...getColumnSearchPropsPaging(
      "phoneNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    title: "IS BRANCH",
    dataIndex: "isBranch",
    key: "isBranch",
    sorter: true,
    align: "left",
    ...getColumnSearchPropsPaging(
      "isBranch",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (text) => {
      if (searchedColumn === "isBranch") {
        return (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        );
      } else {
        return <div>{text}</div>;
      }
    },
  },

  {
    title: "EMAIL",
    dataIndex: "email",
    key: "email",
    sorter: true,
    align: "left",
    ...getColumnSearchPropsPaging(
      "email",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    title: "ADDRESS",
    dataIndex: "address",
    key: "address",
    sorter: true,
    align: "left",
    ...getColumnSearchPropsPaging(
      "address",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    title: "STATUS",
    dataIndex: "status",
    sorter: true,
    align: "left",
    fixed: "right",
    width: 150,
    ...getColumnSearchPropsPaging(
      "status",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
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
    ...getColumnSearchPropsPaging(
      "statusApproval",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
    ),
    render: (a) => (
      <div className="flex justify-center">
        <StatusComponent colour={a}>{a}</StatusComponent>
      </div>
    ),
  },
];
const ViewBank = () => {
  // selector
  const { data, dataApprovalHistory, loading } = useSelector(
    (state) => state.bank,
  );
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
  const [form] = Form.useForm();
  const [modalActiveInactive, setModalActiveInactive] = useState(false);
  const [dataInactivate, setDataInactivate] = useState({});
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
      }),
    );
  }, [dispatch, page, pageSize, search, sort]);

  useEffect(() => {
    handleFetch();
  }, [handleFetch]);

  //search TIDAK BOLEH DI UBAH
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
        const tempSearchedText = "BRANCH".includes(selectedKeys[0] || "")
          ? "Y"
          : "N";
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
        // setSearch(
        //   selectedKeys.length === 0 ? "" : `${dataIndex}~${tempSearchedText}`
        // );
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
        const temp = search;
        delete temp[dataIndex];

        setSearch((prevState) => {
          if (prevState[dataIndex] !== selectedKeys[0]) {
            setPage(1);
          }
          return {
            ...temp,
          };
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
    {
      path: "",
      breadcrumbName: "System Setup",
    },
    {
      path: "",
      breadcrumbName: "Master Data",
    },
    {
      path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_MASTER_BANK,
      breadcrumbName: "Bank",
    },
  ];

  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const handleSubmitModalInactivate = (res, handleClear) => {
    const body = {
      bankId: bankId,
      appHierId: res.approvalHierarchy, // Anda dapat menghapus ini jika tidak perlu
      remark: res.remark, // Anda dapat menghapus ini jika tidak perlu
      status: status === "Inactive" ? "Active" : "Inactive",
    };
    setBody({ body });
    dispatch(inactiveBank({ body }))
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
    setDataInactivate({});
    setOpenModalInactivate(false);
  };

  //modla approver

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
    const data = dataApprovalHistoryFix?.dataApprover || {};
    const keyData = Object.keys(data);
    return keyData.map((item) => ({
      value: item.charAt(0).toUpperCase() + item.slice(1).toLowerCase(),
    }));
  };

  const handleApprovalHistory = async (data) => {
    try {
      setBody(data);
      await dispatch(getApprovalHistory(data.id))?.unwrap();
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
      }),
    );
  };

  const itemActions = [
    // toolbar items
    {
      action: "Download",
      type: "table",
      render: (
        <ButtonComponent
          onClick={handleDownload}
          type={"submit"}
          border={false}
          icon={<DownloadOutlined style={{ fontSize: "24px" }} />}
        >
          Download List
        </ButtonComponent>
      ),
    },
    {
      action: "Create",
      type: "table",

      render: (
        <NavLink to={RECEIPT_AND_COLLECTION_ROUTES.CREATE_MASTER_BANK}>
          <ButtonComponent
            icon={<SVGIcon name="IconButtonCreate" width={24} />}
            type="submit"
          >
            Create Bank
          </ButtonComponent>
        </NavLink>
      ),
    },

    // column action
    {
      action: "View",
      type: "table",
      render: (record, data_length) => {
        return (
          <Tooltip title={"Detail"}>
            <Link
              to={RECEIPT_AND_COLLECTION_ROUTES.DETAIL_MASTER_BANK}
              state={{ id: record?.id }}
            >
              {/* <ButtonComponent
                  className="gap-5"
                  icon={<SVGIcon name="IconDetail" width={24} />}
                  border={falsFe}
                /> */}
              <SVGIcon name="IconDetail" width={24} />
            </Link>
          </Tooltip>
        );
      },
    },
    {
      action: "Update",
      type: "table",

      render: (record, data_length) => {
        return data_length > 3 ? (
          <Link
            to={
              disabledActionByStatus(
                "update",
                record?.status,
                record?.statusApproval,
              ) === false && RECEIPT_AND_COLLECTION_ROUTES.UPDATE_MASTER_BANK
            }
            state={
              disabledActionByStatus(
                "update",
                record?.status,
                record?.statusApproval,
              ) === false && { id: record?.id }
            }
          >
            <ButtonComponent
              className="gap-5 w-full"
              icon={<SVGIcon name="IconEdit" width={24} color={"#0075BF"} />}
              border={false}
            >
              <span className={"text-black gap-2 text-xl text-center w-full"}>
                Update
              </span>
            </ButtonComponent>
          </Link>
        ) : (
          <Tooltip
            title="Update"
            className={
              disabledActionByStatus(
                "update",
                record?.status,
                record?.statusApproval,
              )
                ? "cursor-not-allowed"
                : "cursor-pointer"
            }
          >
            <Link
              to={
                disabledActionByStatus(
                  "update",
                  record?.status,
                  record?.statusApproval,
                ) === false && RECEIPT_AND_COLLECTION_ROUTES.UPDATE_MASTER_BANK
              }
              state={
                disabledActionByStatus(
                  "update",
                  record?.status,
                  record?.statusApproval,
                ) === false && { id: record?.id }
              }
            >
              <div border={false}>
                <SVGIcon
                  name="IconEdit"
                  color={
                    disabledActionByStatus(
                      "update",
                      record?.status,
                      record?.statusApproval,
                    )
                      ? "#d3d3d3"
                      : "#ACC424"
                  }
                  width={24}
                  className={
                    disabledActionByStatus(
                      "update",
                      record?.status,
                      record?.statusApproval,
                    )
                      ? "cursor-not-allowed"
                      : "cursor-pointer"
                  }
                />
              </div>
            </Link>
          </Tooltip>
        );
      },
    },
    {
      action: "Activate",
      type: "table",

      render: (record, data_length) => {
        const statusLowerCase = record?.status?.toLowerCase();
        return data_length > 3 ? (
          <div className="w-full">
            <ButtonComponent
              border={false}
              className={"gap-5 w-full"}
              onClick={() => handleInactive(record)}
              disabled={disabledActionByStatus(
                "activate",
                record?.status,
                record?.statusApproval,
              )}
            >
              <Checkbox
                onClick={() => handleInactive(record)}
                checked={record?.status !== "Active"}
                disabled={disabledActionByStatus(
                  "activate",
                  record?.status,
                  record?.statusApproval,
                )}
              />
              <span
                className={"text-black ml-6 gap-2 text-xl text-center w-full"}
              >
                {record?.status === "Active" ? "Inactivate" : "Activate"}
              </span>
            </ButtonComponent>
          </div>
        ) : (
          <Tooltip
            title={
              statusLowerCase === "active" || statusLowerCase === "draft"
                ? "Inactivate"
                : "Activate"
            }
          >
            <div>
              <Checkbox
                border={false}
                onClick={() => handleInactive(record)}
                checked={record?.status !== "Active"}
                disabled={disabledActionByStatus(
                  "activate",
                  record?.status,
                  record?.statusApproval,
                )}
              />
            </div>
          </Tooltip>
        );
      },
    },
    {
      action: "history",
      type: "table",
      render: (record, data_length) => {
        return data_length > 3 ? (
          <ButtonComponent
            className="gap-5"
            icon={
              <SVGIcon name="IconLogHistory" color={"#0075bf"} width={24} />
            }
            border={false}
            onClick={() => handleApprovalHistory(record)}
          >
            <span className={"text-black gap-2 text-xl text-center"}>
              Approval History
            </span>
          </ButtonComponent>
        ) : (
          <Tooltip title={"Approval History"}>
            <div border={false} onClick={() => handleApprovalHistory(record)}>
              <SVGIcon name="IconLogHistory" color={"#0075bf"} width={24} />
            </div>
          </Tooltip>
        );
      },
    },
  ];

  // handle retry modal error
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
    <LayoutMenu>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />
        <Toolbar items={itemActions} />
        <BaseContainer header={"BANK LIST"}>
          <TablePagination
            dataSource={data?.result}
            pageSize={pageSize}
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
              ),
              ...useColumnActionPermission(
                ["view", "history", "update", "activate"],
                itemActions,
              ),
            ]}
            // columns={[...columns]}
            current={page}
            onChange={handleChange}
            onSizeChanger={handleChange}
            totalData={data?.page?.totalElements}
            onSort={onSort}
            tableScrolled={{
              x: 3800,
              y: 525,
            }}
          />
        </BaseContainer>

        <ModalInactivateWithHierarchy
          dispatch={dispatch}
          getAPIOption={getAllApprovalList}
          getAPIDetail={getListApprovalById}
          selector={"bank"}
          alertMessage={`Are you sure you want to inactivate this Bank with the name ${
            bankNames || ""
          }?`}
          openModalInactivate={openModalInactivate}
          handleCloseModalInactivate={handleCancelModalInactivate}
          onFinish={handleSubmitModalInactivate}
        />

        <ModalHistory
          isOpen={openModalHistory && dataApprovalHistoryFix}
          handleClose={() => setOpenModalHistory(false)}
          header={"Approval History"}
          width={850}
          tabOptions={handleOptions()}
          dataApprover={dataApprovalHistoryFix?.dataApprover}
          dataHistory={dataApprovalHistoryFix?.dataHistory}
        />

        {/* modal try again */}
        {renderModal()}
      </Spin>
    </LayoutMenu>
  );
};

export default ViewBank;
