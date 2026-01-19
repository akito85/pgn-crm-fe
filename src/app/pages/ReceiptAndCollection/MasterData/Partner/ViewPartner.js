import {
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
} from "../../../../../redux/slices/receipt_collection/partner";
import ModalHistory from "../../../../../components/Modal/ModalHistory";
import { getColumnSearchPropsPaging } from "../../../../../utils/getColumnSearchProps";
import Toolbar from "../../../../../components/Toolbar";
import { useTryAgainHooks } from "../../../../../utils/useTryAgainHooks";
import { useColumnActionPermission } from "../../../../../components/ColumnActionPermission";

const ViewPartner = () => {
  // Selector
  const { loading, data, dataApprovalHistory } = useSelector(
    (state) => state.partner
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
      breadcrumbName: "Receipt & Collection",
    },
    {
      path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_PARTNER,
      breadcrumbName: "Partner",
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
          create: dataApprovalHistory?.dataApprover?.PARTNER || [],
          // inactive:
          //   dataApprovalHistory?.dataApprover?.INACTIVE_PAYMENT_METHOD || [],
        },
        dataHistory: {
          create: dataApprovalHistory?.dataHistory?.PARTNER || [],
          // inactive:
          //   dataApprovalHistory?.dataHistory?.INACTIVE_PAYMENT_METHOD || [],
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
      title: "PARTNER NAME",
      dataIndex: "partnerName",
      key: "partnerName",
      align: "",
      sorter: true,
      ...getColumnSearchPropsPaging(
        "partnerName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        renderColumn(
          "partnerName",
          searchedColumn,
          searchText,
          text,
          true,
          "input",
          search
        ),
    },
    {
      title: "EFF START DATE",
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
      title: "EFF END DATE",
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
      title: "SEC KEY SIGNATURE",
      dataIndex: "secKeySignature",
      key: "secKeySignature",
      sorter: true,
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsPaging(
        "secKeySignature",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        false
      ),
      render: (text) =>
        renderColumn(
          "secKeySignature",
          searchedColumn,
          searchText,
          text,
          true,
          "input",
          search
        ),
    },
    {
      title: "TOKEN EXPIRATION TIME",
      dataIndex: "tokenExpirationTime",
      key: "tokenExpirationTime",
      sorter: true,
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsPaging(
        "tokenExpirationTime",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        false
      ),
      render: (text) =>
        renderColumn(
          "tokenExpirationTime",
          searchedColumn,
          searchText,
          text,
          true,
          "input",
          search
        ),
    },
    {
      title: "TYPE",
      dataIndex: "type",
      key: "type",
      sorter: true,
      ellipsis: {
        showTitle: false,
      },
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
    right: ["statusApproval", "action"],
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
      action: "Create",
      render: (
        <NavLink to={RECEIPT_AND_COLLECTION_ROUTES.CREATE_PARTNER}>
          <ButtonComponent
            icon={<SVGIcon name="IconButtonCreate" width={24} />}
            type="submit"
          >
            Create Partner
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
              to={RECEIPT_AND_COLLECTION_ROUTES.DETAIL_PARTNER}
              state={{ id: record?.id }}
            >
              {/* <ButtonComponent
                  className="gap-5"
                  icon={<SVGIcon name="IconDetail" width={24} />}
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
              to={RECEIPT_AND_COLLECTION_ROUTES.UPDATE_PARTNER}
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
                    to={RECEIPT_AND_COLLECTION_ROUTES.UPDATE_PARTNER}
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
      if (bodyError?.action === "GET_APPROVAL_PARTNER") {
        dispatch(getApprovalHistory(body));
      } else if (bodyError?.action === "DOWNLOAD_PARTNER") {
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
        {/* <Toolbar items={itemActions} /> */}
        <CardContainer header={
          <div className="flex -my-4 justify-between items-center">
            <p className="mt-[15px] font-bold">PARTNER LIST</p>
            <div className="flex gap-2">
              <Toolbar items={itemActions} />
            </div>
          </div>
        }>
          <TableRBI
            showExport={true}
            handleDownload={handleDownload}
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
              x: 2500,
              y: 525,
            }}
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
      </Spin>
      {/* modal try again */}
      {renderModal()}
    </LayoutMenu>
  );
};

export default ViewPartner;
