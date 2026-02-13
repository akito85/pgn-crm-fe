import {
  Checkbox,
  Form,
  Spin,
  Tooltip,
} from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import CardContainer from "../../../../../components/CardContainer";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import SVGIcon from "../../../../../assets/Icon/index";
import ButtonComponent from "../../../../../components/ButtonComponent";
import TableRBI from "../../../../../components/TableRBI";
import {
  EyeOutlined,
  DownloadOutlined
} from "@ant-design/icons";
import {
  renderColumn,
  renderDateColumn,
} from "../../../../../utils";
import BreadCrumb from "../../../../../components/BreadCrumb";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Link } from "react-router-dom";
import {
  getApprovalHistory,
  getDownloadSetting,
  getPaginateSetting,
  inactiveSetting,
  getAllApprovalList,
  getListApprovalById
} from "../../../../../redux/slices/receipt_collection/setting";
import ModalActiveInactive from "../../../../../components/Modal/ModalActiveInactive";
import ModalHistory from "../../../../../components/Modal/ModalHistory";
import { getColumnSearchPropsPaging } from "../../../../../utils/getColumnSearchProps";
import Toolbar from "../../../../../components/Toolbar";
import { useTryAgainHooks } from "../../../../../utils/useTryAgainHooks";
import { useColumnActionPermission } from "../../../../../components/ColumnActionPermission";
import { disabledActionByStatus } from "../../../../../utils";

const ViewSettings = () => {
  // Selector
  const { loading, data, dataApprovalHistory } = useSelector(
    (state) => state.receiptSetting
  );
  const { bodyError } = useSelector((state) => state?.general);

  // Declaration
  const dispatch = useDispatch();
  const searchInput = useRef(null);
  // const dataSource = data?.result;

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [search, setSearch] = useState({});
  const [sort, setSort] = useState("");
  const [openModalHistory, setOpenModalHistory] = useState(false);
  const [dataApprovalHistoryFix, setDataApprovalHistoryFix] = useState({});
  const [body, setBody] = useState({});
  const [status, setStatus] = useState("");
  const [id, setId] = useState("");
  const [settingNameCombined, setSettingNameCombined] = useState("");
  const [openModalInactivate, setOpenModalInactivate] = useState(false);


  const handleFetch = useCallback(() => {
    dispatch(
      getPaginateSetting({
        page,
        pageSize,
        sort,
        search: encodeURIComponent(JSON.stringify(search)),
      })
    );
  }, [dispatch, page, pageSize, search, sort]);

  useEffect(() => {
    handleFetch();
  }, [handleFetch]);


  // Breadcrumbs
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
      path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_SETTINGS,
      breadcrumbName: "Payment Channel Configuration",
    },
  ];

  const handleOptions = () => {
    const data = dataApprovalHistoryFix?.dataApprover || {};
    const keyData = Object.keys(data);
    return keyData.map((item) => ({
      value: item.charAt(0).toUpperCase() + item.slice(1).toLowerCase(),
    }));
  };

  // Function Search Column
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch((prevState) => {
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
  };

  const handleChange = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };

  useEffect(() => {
    if (dataApprovalHistory && dataApprovalHistory?.dataApprover) {
      const temp = {
        dataApprover: {
          create: dataApprovalHistory?.dataApprover?.RECEIPT_SETTING || [],
          inactive:
            dataApprovalHistory?.dataApprover?.INACTIVE_RECEIPT_SETTING || [],
        },
        dataHistory: {
          create: dataApprovalHistory?.dataHistory?.RECEIPT_SETTING || [],
          inactive:
            dataApprovalHistory?.dataHistory?.INACTIVE_RECEIPT_SETTING || [],
        },
      };
      setDataApprovalHistoryFix(temp);
    } else {
      setDataApprovalHistoryFix({});
    }
  }, [dataApprovalHistory]);

  const handleApprovalHistory = async (data) => {
    try {
      setBody(data);
      await dispatch(getApprovalHistory(data))?.unwrap();
      setOpenModalHistory(true);

    } catch (error) {
      setOpenModalHistory(false);

    }
  };

  const columns = [
    {
      title: "NO",
      width: 60,
      key: "no",
      align: "center",
      isClassification: true,
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "PARTNER CODE",
      dataIndex: "partnerCode",
      key: "partnerCode",
      sorter: true,
      ...getColumnSearchPropsPaging(
        "partnerCode",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "partnerCode",
          searchedColumn,
          searchText,
          text,
          true,
          "input",
          search
        ),
    },

    {
      title: "Collection Agent CODE",
      dataIndex: "caCode",
      key: "partnerCode",
      sorter: true,
      ...getColumnSearchPropsPaging(
        "caCode",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "caCode",
          searchedColumn,
          searchText,
          text,
          true,
          "input",
          search
        ),
    },

    {
      title: "Payment Channel CODE",
      dataIndex: "ciCode",
      key: "ciCode",
      sorter: true,
      ...getColumnSearchPropsPaging(
        "ciCode",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "ciCode",
          searchedColumn,
          searchText,
          text,
          true,
          "input",
          search
        ),
    },

    {
      title: "DATE START",
      dataIndex: "dateStart",
      align: "center",
      key: "dateStart",
      isNumber: true,
      sorter: true,
      ...getColumnSearchPropsPaging(
        "dateStart",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        false
      ),
      render: (text) => renderColumn("dateStart", searchedColumn, searchText, text),
    },

    {
      title: "DATE END",
      dataIndex: "dateEnd",
      align: "center",
      isNumber: true,
      key: "dateEnd",
      sorter: true,
      ...getColumnSearchPropsPaging(
        "dateEnd",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        false
      ),
      render: (text) => renderColumn("dateEnd", searchedColumn, searchText, text),
    },

    {
      title: "HOUR START",
      dataIndex: "hourStart",
      sorter: true,
      isNumber: true,
      align: "center",
      key: "hourStart",
      ...getColumnSearchPropsPaging(
        "hourStart",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        false
      ),
      render: (text) => text ?? "-",
    },

    {
      title: "HOUR END",
      dataIndex: "hourEnd",
      sorter: true,
      isNumber: true,
      align: "center",
      key: "hourEnd",
      ...getColumnSearchPropsPaging(
        "hourEnd",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        false
      ),
      render: (text) => text ?? "-",
    },

    {
      title: "MINUTE START",
      dataIndex: "minuteStart",
      sorter: true,
      isNumber: true,
      align: "center",
      key: "minuteStart",
      ...getColumnSearchPropsPaging(
        "minuteStart",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        false
      ),
      render: (text) => text ?? "-",
    },

    {
      title: "MINUTE END",
      dataIndex: "minuteEnd",
      sorter: true,
      isNumber: true,
      align: "center",
      key: "minuteEnd",
      ...getColumnSearchPropsPaging(
        "minuteEnd",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        false
      ),
      render: (text) => text ?? "-",
    },

    {
      title: "TYPE",
      dataIndex: "type",
      sorter: true,
      key: "type",
      ellipsis: { showTitle: false },
      ...getColumnSearchPropsPaging(
        "type",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        false
      ),
      render: (text) =>
        renderColumn(
          "type",
          searchedColumn,
          searchText,
          text,
          true,
          "input",
          search
        ),
    },

    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      sorter: true,
      width: 100,
      fixed: "right",
      ...getColumnSearchPropsPaging(
        "status",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        false
      ),
      render: (text) =>
        renderColumn("status", searchedColumn, searchText, text, false, "status"),
    },
    {
      title: "STATUS APPROVAL",
      dataIndex: "statusApproval",
      key: "statusApproval",
      sorter: true,
      width: 150,
      fixed: "right",
      ...getColumnSearchPropsPaging(
        "statusApproval",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        false
      ),
      render: (text) =>
        renderColumn("status", searchedColumn, searchText, text, false, "status"),
    },
  ];

  const [fixedColumns, setFixedColumns] = useState(() => ({
    left: ["no"],
    right: ["status", "statusApproval", "action"],
  }));

  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };





  // handle download
  const handleDownload = () => {
    dispatch(
      getDownloadSetting({
        search: encodeURIComponent(JSON.stringify(search)),
        // search: tempSearch,
        page,
        pageSize,
        sort,
      })
    );
  };

  const combineSettingName = (pCode, ci, ca, typeVal) => {
    return `${pCode || ""}-${ci || ""}-${ca || ""}-${typeVal || ""}`;
  };

  const itemActions = [
    // toolbar items
    {
      action: "Download",
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
      render: (
        <NavLink to={RECEIPT_AND_COLLECTION_ROUTES.CREATE_SETTINGS}>
          <ButtonComponent
            icon={<SVGIcon name="IconButtonCreate" width={24} />}
            type="submit"
          >
            Create
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
              to={RECEIPT_AND_COLLECTION_ROUTES.DETAIL_SETTINGS}
              state={{ id: record?.id }}
            >
              {/* <ButtonComponent
                  className="gap-5"
                  icon={<EyeOutlined />}
                  border={false}
                /> */}
              <EyeOutlined style={{ color: "#1890ff", fontSize: "18px" }} />
            </Link>
          </Tooltip>
        );
      },
    },
    {
      action: "Update",
      type: "table",
      render: (record, data_length) => {

        // console.log({
        //   disabled: disabledActionByStatus('update', record?.status, record?.statusApproval),
        //   to: !disabledActionByStatus('update', record?.status, record?.statusApproval) ? RECEIPT_AND_COLLECTION_ROUTES.UPDATE_SETTINGS : undefined
        // });
        const isDisabled = disabledActionByStatus('update', record?.status, record?.statusApproval);
        return (
          data_length > 3 ? (
            <Link
              to={!isDisabled ? RECEIPT_AND_COLLECTION_ROUTES.UPDATE_SETTINGS : undefined}
              state={!isDisabled ? { id: record?.id } : undefined}
            >
              <ButtonComponent
                className="gap-5 w-full"
                icon={
                  <SVGIcon name="IconEdit" width={24} color={"#0075BF"} />
                }
                border={false}
              >
                <span
                  className={"text-black gap-2 text-xl text-center w-full"}
                >
                  Update
                </span>
              </ButtonComponent>
            </Link>
          ) : (
            <Tooltip title="Update" className={
              disabledActionByStatus('update', record?.status, record?.statusApproval) ? "cursor-not-allowed" : "cursor-pointer"
            }>
              <Link
                to={
                  disabledActionByStatus('update', record?.status, record?.statusApproval) === false &&
                  RECEIPT_AND_COLLECTION_ROUTES.UPDATE_SETTINGS}
                state={
                  disabledActionByStatus('update', record?.status, record?.statusApproval) === false &&
                  { id: record?.id }
                }
              >
                <div border={false}>
                  <SVGIcon name="IconEdit"
                    color={disabledActionByStatus('update', record?.status, record?.statusApproval) ? "#d3d3d3" : "#ACC424"} width={24}
                    className={
                      disabledActionByStatus('update', record?.status, record?.statusApproval) ? "cursor-not-allowed" : "cursor-pointer"
                    } />
                </div>
              </Link>
            </Tooltip>
          )
        );
      },
    },

    {
      action: "Activate",
      type: "table",
      render: (record, data_length) => {
        const statusLowerCase = record?.status?.toLowerCase()

        return (
          data_length > 3 ?
            <div className="w-full">
              <ButtonComponent
                border={false}
                className={'gap-5 w-full'}
                onClick={() => handleInactive(record)}
                disabled={
                  disabledActionByStatus('activate', record?.status, record?.statusApproval)
                }
              >
                <Checkbox
                  onClick={() => handleInactive(record)}
                  checked={record?.status !== "Active"}
                  disabled={disabledActionByStatus('activate', record?.status, record?.statusApproval)}
                />
                <span
                  className={"text-black ml-6 gap-2 text-xl text-center w-full"}
                >
                  {record?.status === "Active" ? "Inactivate" : "Activate"}
                </span>
              </ButtonComponent>
            </div>
            :
            <Tooltip title={statusLowerCase === "active" || statusLowerCase === 'draft' ? "Inactivate" : "Activate"}>
              <div >
                <Checkbox
                  border={false}
                  onClick={() => handleInactive(record)}
                  checked={record?.status !== "Active"}
                  disabled={disabledActionByStatus('activate', record?.status, record?.statusApproval)}
                />
              </div>
            </Tooltip>
        );
      }
    },
    {
      action: "history",
      type: "table",
      render: (record, data_length) => {
        return (
          data_length > 3 ?
            <ButtonComponent
              className="gap-5"
              icon={
                <SVGIcon name="IconLogHistory" color={"#0075bf"} width={24} />
              }
              border={false}
              onClick={() => handleApprovalHistory(record?.id)}
            >
              <span className={"text-black gap-2 text-xl text-center"}>
                Approval History
              </span>
            </ButtonComponent>
            :
            <Tooltip title={'Approval History'}>
              <div border={false}
                onClick={() => handleApprovalHistory(record?.id)}
              >
                <SVGIcon name="IconLogHistory" color={"#0075bf"} width={24} />
              </div>
            </Tooltip>
        );
      },
    },
  ];

  const handleInactive = (r) => {
    setOpenModalInactivate(true);
    setId(r?.id);
    setSettingNameCombined(
      combineSettingName(
        r?.partnerCode,
        r?.ciCode,
        r?.caCode,
        r?.type
      )
    );
    setStatus(r?.status);
  };

  // handle retry modal error
  const handleRetry = () => {
    try {
      handleCancelTryAgain();
      if (bodyError?.action === "INACTIVE_RECEIPT_SETTING") {
        dispatch(inactiveSetting(body));
      } else if (bodyError?.action === "GET_APPROVAL_SETTINGS") {
        dispatch(getApprovalHistory(body));
      } else if (bodyError?.action === "DOWNLOAD_SETTINGS") {
        handleDownload();
      }
      handleFetch();
    } catch (error) {
      handleFetch();
    }
  };

  const handleCancelModalInactivate = () => {
    setOpenModalInactivate(false);
  };

  const handleSubmitModalInactivate = (res, handleClear) => {
    const body = {
      id: id,
      appHierId: res.approvalHierarchy,
      status: status === "Inactive" ? "Active" : "Inactive",
      remark: res.remark,
    };
    setBody({ body });
    dispatch(inactiveSetting({ body }))
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
        dispatch(getPaginateSetting({ search: tempSearch, page, pageSize, sort }));
      });
  };

  const { renderModal, handleCancelTryAgain } = useTryAgainHooks(handleRetry);

  return (
    <LayoutMenu>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />
        {/* <Toolbar items={itemActions} /> */}
        <CardContainer header={
          <div className="flex -my-4 justify-between items-center">
            <p className="mt-[15px] font-bold uppercase">Payment Channel Configuration List</p>
            <div className="flex gap-2">
              <Toolbar items={itemActions} />
            </div>
          </div>
        }>
          <TableRBI
            dataSource={data?.result}
            pageSize={pageSize}
            // columns={columns}
            columns={[
              ...columns,
              ...useColumnActionPermission(
                ["view", "history", "update", 'activate'],
                itemActions
              ),
            ]}
            current={page}
            onChange={handleChange}
            onSizeChanger={handleChange}
            totalData={data?.page?.totalElements}
            onSort={onSort}
            tableScrolled={{
              x: "max-content",
              y: 525,
            }}
            showExport={true}
            handleDownload={handleDownload}
            fixedColumns={fixedColumns}
            setFixedColumns={setFixedColumns}
          />
        </CardContainer>

        <ModalActiveInactive
          dispatch={dispatch}
          getAPIOption={getAllApprovalList}
          getAPIDetail={getListApprovalById}
          selector={"receiptSetting"}
          alertMessage={`Are you sure you want to inactivate this Setting with Setting Code ${settingNameCombined}?`}
          openModalInactivate={openModalInactivate}
          handleCloseModalInactivate={handleCancelModalInactivate}
          onFinish={handleSubmitModalInactivate}
        />

        {/* <ModalInactivate
          alertMessage={`Are you sure you want to inactivate this Setting with Setting Code ${settingNameCombined}?`}
          openModalInactivate={openModalInactivate}
          handleCloseModalInactivate={handleCancelModalInactivate}
          onFinish={handleSubmitModalInactivate}
        /> */}

        <ModalHistory
          isOpen={openModalHistory && dataApprovalHistoryFix}
          handleClose={() => setOpenModalHistory(false)}
          header={"Approval History"}
          width={850}
          tabOptions={handleOptions()}
          dataApprover={dataApprovalHistoryFix?.dataApprover}
          dataHistory={dataApprovalHistoryFix?.dataHistory}
        />
      </Spin>
      {/* modal try again */}
      {renderModal()}
    </LayoutMenu>
  );
};

export default ViewSettings;
