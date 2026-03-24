import {
  Spin,
  Checkbox,
  Tooltip,
} from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import CardContainer from "../../../../../components/CardContainer";
import SVGIcon from "../../../../../assets/Icon/index";
import ButtonComponent from "../../../../../components/ButtonComponent";
import TableRBI from "../../../../../components/TableRBI";
import {
  EyeOutlined,
  DownloadOutlined,
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
  getDownloadPartner,
  getPaginatePartner,
  inactivePartnerCa,
  getAllApprovalList,
  getListApprovalById,
} from "../../../../../redux/slices/receipt_collection/partnerCa";
import ModalActiveInactive from "../../../../../components/Modal/ModalActiveInactive";
import ModalHistory from "../../../../../components/Modal/ModalHistory";
import { getColumnSearchPropsPaging } from "../../../../../utils/getColumnSearchProps";
import Toolbar from "../../../../../components/Toolbar";
import { useTryAgainHooks } from "../../../../../utils/useTryAgainHooks";
import { useColumnActionPermission } from "../../../../../components/ColumnActionPermission";

const ViewPartnerCa = () => {
  // Selector
  const { loading, data, dataApprovalHistory } = useSelector(
    (state) => state.partnerCa
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
  const [nameModalActiveOrInactivate, setNameModalActiveOrInactivate] = useState("");
  const [openModalInactivate, setOpenModalInactivate] = useState(false);

  const handleFetch = useCallback(() => {
    dispatch(
      getPaginatePartner({
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
      path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_PARTNER_CA,
      breadcrumbName: "Partner Collecting Agent Mapping",
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
          create: dataApprovalHistory?.dataApprover?.PARTNER_CA || [],
          inactive:
            dataApprovalHistory?.dataApprover?.INACTIVE_PARTNER_CA || [],
        },
        dataHistory: {
          create: dataApprovalHistory?.dataHistory?.PARTNER_CA || [],
          inactive:
            dataApprovalHistory?.dataHistory?.INACTIVE_PARTNER_CA || [],
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

  const handleInactive = (r) => {
    setOpenModalInactivate(true);
    setId(r?.id);
    setNameModalActiveOrInactivate(
      r?.partnerCode
    );
    setStatus(r?.status);
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
    dispatch(inactivePartnerCa({ body }))
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
        dispatch(getPaginatePartner({ search: tempSearch, page, pageSize, sort }));
      });
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
      sorter: true,
      key: "partnerCode",
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
      title: "PARTNER Name",
      dataIndex: ["partner", "partnerName"],
      sorter: true,
      key: "partnerName",
      ...getColumnSearchPropsPaging(
        "partner.partnerName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "partner.partnerName",
          searchedColumn,
          searchText,
          text,
          true,
          "input",
          search
        ),
    },
    {
      title: "Ca Code",
      dataIndex: "caCode",
      key: "caCode",
      align: "",
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
      title: "Ca Name",
      dataIndex: ["ca", "name"],
      key: "caName",
      align: "",
      sorter: true,
      ...getColumnSearchPropsPaging(
        "ca.name",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "ca.name",
          searchedColumn,
          searchText,
          text,
          true,
          "input",
          search
        ),
    },
    {
      title: "SETTLEMENT BANK",
      dataIndex: "settlementBank",
      key: "settlementBank",
      sorter: true,
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsPaging(
        "settlementBank",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        false
      ),
      render: (text) =>
        renderColumn(
          "settlementBank",
          searchedColumn,
          searchText,
          text,
          true,
          "input",
          search
        ),
    },
    {
      title: "START DATE",
      sorter: true,
      align: "center",
      key: "effStartDate",
      dataIndex: "effStartDate",
      ...getColumnSearchPropsPaging(
        "effStartDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        false,
        "date"
      ),
      render: (v) =>
        renderDateColumn(
          "effStartDate",
          searchedColumn,
          searchText,
          v,
          "date",
          search
        ),
    },
    {
      title: "END DATE",
      sorter: true,
      align: "center",
      key: "effEndDate",
      dataIndex: "effEndDate",
      ...getColumnSearchPropsPaging(
        "effEndDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        false,
        "date"
      ),
      render: (v) =>
        renderDateColumn(
          "effEndDate",
          searchedColumn,
          searchText,
          v,
          "date",
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
        renderColumn(
          "status",
          searchedColumn,
          searchText,
          text,
          false,
          "status"
        ),
    },
    {
      title: "STATUS APPROVAL",
      dataIndex: "statusApproval",
      key: "statusApproval",
      sorter: true,
      width: 200,
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
        renderColumn(
          "status",
          searchedColumn,
          searchText,
          text,
          false,
          "status"
        ),
    },
  ];

  const [fixedColumns, setFixedColumns] = useState(() => ({
    left: ["no"],
    right: ["status", "statusApproval", "action"],
  }));

  const onSort = (_, __, sort) => {
    const field = Array.isArray(sort.field)
      ? sort.field.join(".")
      : sort.field;

    const dataSort =
      sort.order !== undefined
        ? `${field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };





  // handle download
  const handleDownload = () => {
    dispatch(
      getDownloadPartner({
        search: encodeURIComponent(JSON.stringify(search)),
        // search: tempSearch,
        page,
        pageSize,
        sort,
      })
    );
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
        <NavLink to={RECEIPT_AND_COLLECTION_ROUTES.CREATE_PARTNER_CA}>
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
              to={RECEIPT_AND_COLLECTION_ROUTES.DETAIL_PARTNER_CA}
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
        const isEditable = record.statusApproval === "Rejected"
        // (record.statusApproval === "Waiting Approval" && record.status === "Draft") ||
        // (record.status !== "Active" && record.statusApproval !== "Approved") 

        return (
          data_length > 3 ? (
            <Link
              to={RECEIPT_AND_COLLECTION_ROUTES.UPDATE_PARTNER_CA}
              state={{ id: record?.id }}
            >
              <ButtonComponent
                className="gap-5 w-full"
                icon={
                  <SVGIcon name="IconEdit" width={24} color={isEditable ? "#0075bf" : "#8D91A0"} />
                }
                border={false}
                disabled={!isEditable}

              >
                <span
                  className={"text-black gap-2 text-xl text-center w-full"}
                >
                  Update
                </span>
              </ButtonComponent>
            </Link>
          ) : (
            <Tooltip title="Update" >
              <div
                onClick={(e) => {
                  if (!isEditable) e.preventDefault();
                }}
                className={!isEditable ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
              >
                {isEditable ? (
                  <Link
                    to={RECEIPT_AND_COLLECTION_ROUTES.UPDATE_PARTNER_CA}
                    state={{ id: record?.id }}
                  >
                    <SVGIcon name="IconEdit" color="#ACC424" width={24} />
                  </Link>
                ) : (
                  <SVGIcon name="IconEdit" color="#8D91A0" width={24} className={"cursor-not-allowed"} />
                )}
              </div>
            </Tooltip>
          )
        );
      },
    },
    {
      action: "Activate",
      type: "table",
      render: (record, data_length) => {
        // const statusLowerCase = record?.status?.toLowerCase()

        return (
          data_length > 3 ?
            <div className="w-full">
              <ButtonComponent
                border={false}
                className={'gap-5 w-full'}
                onClick={() => handleInactive(record)}
              // disabled={
              //   disabledActionByStatus('activate', record?.status, record?.statusApproval)
              // }
              >
                <Checkbox
                  onClick={() => handleInactive(record)}
                  checked={record?.status !== "Active"}
                // disabled={disabledActionByStatus('activate', record?.status, record?.statusApproval)}
                />
                <span
                  className={"text-black ml-6 gap-2 text-xl text-center w-full"}
                >
                  {record?.status === "Active" ? "Inactivate" : "Activate"}
                </span>
              </ButtonComponent>
            </div>
            :
            <Tooltip title={record?.status === "Active" ? "Inactivate" : "Activate"}>
              <div >
                <Checkbox
                  border={false}
                  onClick={() => handleInactive(record)}
                  checked={record?.status !== "Active"}
                // disabled={disabledActionByStatus('activate', record?.status, record?.statusApproval)}
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

  // handle retry modal error
  const handleRetry = () => {
    try {
      handleCancelTryAgain();
      if (bodyError?.action === "GET_APPROVAL_PARTNER_CA") {
        dispatch(getApprovalHistory(body));
      } else if (bodyError?.action === "DOWNLOAD_PARTNER_CA") {
        handleDownload();
      } else if (bodyError?.action === "INACTIVE_PARTNER_CA") {
        dispatch(inactivePartnerCa(body));
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
        {/* <Toolbar items={itemActions} /> */}
        <CardContainer header={
          <div className="flex -my-4 justify-between items-center">
            <p className="mt-[15px] font-bold">PARTNER COLLECTING AGENT MAPPING List</p>
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



        <ModalHistory
          isOpen={openModalHistory && dataApprovalHistoryFix}
          handleClose={() => setOpenModalHistory(false)}
          header={"Approval History"}
          width={850}
          tabOptions={handleOptions()}
          dataApprover={dataApprovalHistoryFix?.dataApprover}
          dataHistory={dataApprovalHistoryFix?.dataHistory}
        />

        <ModalActiveInactive
          dispatch={dispatch}
          getAPIOption={getAllApprovalList}
          getAPIDetail={getListApprovalById}
          selector={"partnerCa"}
          alertMessage={`Are you sure you want to inactivate this Partner CA with Partner Code ${nameModalActiveOrInactivate}?`}
          openModalInactivate={openModalInactivate}
          handleCloseModalInactivate={handleCancelModalInactivate}
          onFinish={handleSubmitModalInactivate}
        />
      </Spin>
      {/* modal try again */}
      {renderModal()}
    </>
  );
};

export default ViewPartnerCa;
