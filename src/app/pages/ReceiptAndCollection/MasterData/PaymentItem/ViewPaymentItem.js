import {
  Checkbox,
  Form,
  Spin,
  Tooltip,
} from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import BaseContainer from "../../../../../components/BaseContainer";
import CardContainer from "../../../../../components/CardContainer";
import SVGIcon from "../../../../../assets/Icon/index";
import ButtonComponent from "../../../../../components/ButtonComponent";
import TablePagination from "../../../../../components/TablePagination";
import TableRBI from "../../../../../components/TableRBI";
import {
  DownloadOutlined,
  EyeOutlined
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import {
  renderColumn,
  renderDateColumn,
} from "../../../../../utils";
import BreadCrumb from "../../../../../components/BreadCrumb";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Link } from "react-router-dom";
import {
  getAllApprovalList,
  getApprovalHistory,
  getDownloadPaymentMethod,
  getListApprovalById,
  getPaginateItem,
  inactivePaymentItem,
} from "../../../../../redux/slices/receipt_collection/paymentItem";
import ModalInactivateWithHierarchy from "../../../../../components/Modal/ModalInactivateWithHierarchy";
import ModalHistory from "../../../../../components/Modal/ModalHistory";
import { getColumnSearchPropsPaging } from "../../../../../utils/getColumnSearchProps";
import Toolbar from "../../../../../components/Toolbar";
import { useTryAgainHooks } from "../../../../../utils/useTryAgainHooks";
import { useColumnActionPermission } from "../../../../../components/ColumnActionPermission";

const ViewPaymentItem = () => {
  // Selector
  const { loading, data, dataApprovalHistory } = useSelector(
    (state) => state.item
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
  const [openModalInactivate, setOpenModalInactivate] = useState(false);
  const [form] = Form.useForm();
  const [status, setStatus] = useState("");
  const [paymentItemId, setPaymentItemId] = useState("");
  const [dataInactivate, setDataInactivate] = useState({});
  const [appHierID, setAppHierID] = useState("");
  const [paymentItemName, setPaymentItemName] = useState();
  const [openModalHistory, setOpenModalHistory] = useState(false);
  const [dataApprovalHistoryFix, setDataApprovalHistoryFix] = useState({});
  const [remark, setRemark] = useState();
  const [body, setBody] = useState({});

  const handleFetch = useCallback(() => {
    dispatch(
      getPaginateItem({
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

  // // Use Effect
  // useEffect(() => {
  //   let tempSearch = "";
  //   for (const dataIndex in search) {
  //     if (Object.hasOwnProperty.call(search, dataIndex)) {
  //       const tempSearchText = search[dataIndex];
  //       if (tempSearchText) {
  //         tempSearch += `${dataIndex}~${tempSearchText},`;
  //       }
  //     }
  //   }
  //   tempSearch = tempSearch ? tempSearch.slice(0, -1) : "";
  //   dispatch(getPaginateItem({ search: tempSearch, page, pageSize, sort }));
  // }, [search, page, pageSize, sort, dispatch]);

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
      path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_PAYMENT_ITEM,
      breadcrumbName: "Payment Method",
    },
  ];

  // // useEffect;
  // useEffect(() => {
  //   dispatch(getPaginateItem({ search, page, pageSize, sort }));
  // }, [search, page, pageSize, sort]);

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
          create: dataApprovalHistory?.dataApprover?.PAYMENT_METHOD || [],
          inactive:
            dataApprovalHistory?.dataApprover?.INACTIVE_PAYMENT_METHOD || [],
        },
        dataHistory: {
          create: dataApprovalHistory?.dataHistory?.PAYMENT_METHOD || [],
          inactive:
            dataApprovalHistory?.dataHistory?.INACTIVE_PAYMENT_METHOD || [],
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
      align: "center",
      isClassification: true,
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "PAYMENT METHOD CODE",
      dataIndex: "paymentItemCode",
      sorter: true,
      ...getColumnSearchPropsPaging(
        "paymentItemCode",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "paymentItemCode",
          searchedColumn,
          searchText,
          text,
          true,
          "input",
          search
        ),
    },
    {
      title: "PAYMENT METHOD NAME",
      dataIndex: "name",
      key: "name",
      align: "",
      sorter: true,
      ...getColumnSearchPropsPaging(
        "name",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "name",
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
      dataIndex: "startDate",
      ...getColumnSearchPropsPaging(
        "startDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        false,
        "date"
      ),
      render: (v) =>
        renderDateColumn(
          "startDate",
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
      dataIndex: "endDate",
      ...getColumnSearchPropsPaging(
        "endDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        false,
        "date"
      ),
      render: (v) =>
        renderDateColumn(
          "endDate",
          searchedColumn,
          searchText,
          v,
          "date",
          search
        ),
    },
    {
      title: "IS BANK METHOD",
      dataIndex: "isBankMethod",
      sorter: true,
      ...getColumnSearchPropsPaging("isBankMethod"),
      ellipsis: {
        showTitle: false,
      },
      render: (text) => {
        if (searchedColumn === "isBankMethod") {
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
      title: "DESCRIPTION",
      dataIndex: "description",
      key: "description",
      sorter: true,
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsPaging(
        "description",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        false
      ),
      render: (text) =>
        renderColumn(
          "description",
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
      width: 150,
      sorter: true,
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

  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const handleCancelModalInactivate = () => {
    setDataInactivate({});
    setOpenModalInactivate(false);
  };

  const handleSubmitModalInactivate = (res, handleClear) => {
    const body = {
      paymentItemId: paymentItemId,
      appHierId: res.approvalHierarchy,
      status: status === "Inactive" ? "Active" : "Inactive",
      remark: res.remark,
    };
    setBody({ body });
    dispatch(inactivePaymentItem({ body }))
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
        dispatch(getPaginateItem({ search: tempSearch, page, pageSize, sort }));
      });
  };

  // handle download
  const handleDownload = () => {
    dispatch(
      getDownloadPaymentMethod({
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
        <NavLink to={RECEIPT_AND_COLLECTION_ROUTES.CREATE_PAYMENT_ITEM}>
          <ButtonComponent
            icon={<SVGIcon name="IconButtonCreate" width={24} />}
            type="submit"
          >
            Create Payment Method
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
              to={RECEIPT_AND_COLLECTION_ROUTES.DETAIL_PAYMENT_ITEM}
              state={{ id: record?.id }}
            >
              {/* <ButtonComponent
                  className="gap-5"
                  icon={<SVGIcon name="IconDetail" width={24} />}
                  border={false}
                /> */}
              <EyeOutlined width={24} />
            </Link>
          </Tooltip>
        );
      },
    },
    {
      action: "Update",
      type: "table",
      render: (record, data_length) => {
        const isEditable =
          record.status === "Draft" && record.statusApproval === "Rejected"
        // (record.statusApproval === "Waiting Approval" && record.status === "Draft") ||
        // (record.status !== "Active" && record.statusApproval !== "Approved") 

        return (
          data_length > 3 ? (
            <Link
              to={RECEIPT_AND_COLLECTION_ROUTES.UPDATE_PAYMENT_ITEM}
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
              <Link
                to={RECEIPT_AND_COLLECTION_ROUTES.UPDATE_PAYMENT_ITEM}
                state={{ id: record?.id }}
              >
                <div border={false}>
                  <SVGIcon name="IconEdit"
                    color={!isEditable ? "#8D91A0" : "#ACC424"} width={24}
                    className={!isEditable ? "cursor-not-allowed" : undefined} />
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
        const isActivateOrInactivate =
          (record.statusApproval === "Approved" &&
            record.status === "Active") ||
          (record.statusApproval === "Draft" && record.status === "Active") ||
          (record.statusApproval === "Rejected" &&
            record.status === "Active") ||
          (record.statusApproval === "Waiting Approval" &&
            record.status === "Active");
        return (
          data_length > 3 ?
            <ButtonComponent
              border={false}
              onClick={() => {
                setOpenModalInactivate(true);
                setStatus(record?.status);
                setPaymentItemId(record?.id);
                setPaymentItemName(record?.name);
                setAppHierID(record?.appHierId);
                setRemark(record?.remark);
              }}
              disabled={
                !isActivateOrInactivate
                // disabledActionByStatus('paymentActivate', record?.status, record?.statusApproval)
              }
            >
              <Checkbox
                border={false}
                onClick={() => {
                  setOpenModalInactivate(true);
                  setStatus(record?.status);
                  setPaymentItemId(record?.id);
                  setPaymentItemName(record?.name);
                  setAppHierID(record?.appHierId);
                  setRemark(record?.remark);
                }}
                checked={record?.status !== "Active"}
                disabled={record?.status !== "Active"
                  // disabledActionByStatus('paymentActivate', record?.status, record?.statusApproval)
                }
              />
              <span className={"text-black ml-6 gap-2 text-xl text-center"}>
                {record?.status === "Active" ? "Inactivate" : "Activate"}
              </span>
            </ButtonComponent>
            :
            <Tooltip title={statusLowerCase === "active" || statusLowerCase === 'draft' ? "Inactivate" : "Activate"}>
              <div >
                <Checkbox
                  border={false}
                  onClick={() => {
                    setOpenModalInactivate(true);
                    setStatus(record?.status);
                    setPaymentItemId(record?.id);
                    setPaymentItemName(record?.name);
                    setAppHierID(record?.appHierId);
                    setRemark(record?.remark);
                  }}
                  checked={record?.status !== "Active"}
                  disabled={record?.status !== "Active"}
                // disabled={disabledActionByStatus('paymentActivate', record?.status, record?.statusApproval)}
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
      if (bodyError?.action === "INACTIVE_PAYMENT_METHOD") {
        dispatch(inactivePaymentItem(body));
      } else if (bodyError?.action === "GET_APPROVAL_ITEM") {
        dispatch(getApprovalHistory(body));
      } else if (bodyError?.action === "DOWNLOAD_PAYMENT_METHOD") {
        handleDownload();
      }
      handleFetch();
    } catch (error) {
      handleFetch();
    }
  };

  const { renderModal, handleCancelTryAgain } = useTryAgainHooks(handleRetry);

  return (
    <div>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />
        <CardContainer header={
          <div className="flex -my-4 justify-between items-center">
            <p className="mt-[15px] font-bold">PAYMENT METHOD LIST</p>
            <div className="flex gap-2">
              <Toolbar items={itemActions} />
            </div>
          </div>
        }>
          <TableRBI
            dataSource={data?.result}
            pageSize={pageSize}
            showExport={true}
            handleDownload={handleDownload}
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
          />
        </CardContainer>

        <ModalInactivateWithHierarchy
          dispatch={dispatch}
          getAPIOption={getAllApprovalList}
          getAPIDetail={getListApprovalById}
          selector={"item"}
          alertMessage={`Are you sure you want to inactivate this Payment Item with the name ${paymentItemName || ""
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
      </Spin>
      {/* modal try again */}
      {renderModal()}
    </div>
  );
};

export default ViewPaymentItem;
