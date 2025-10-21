import React, { useEffect, useRef, useState } from "react";
import LayoutMenu from "../../../../../../components/SidebarMenu/LayoutMenu";
import BreadCrumb from "../../../../../../components/BreadCrumb";
import SVGIcon from "../../../../../../assets/Icon";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import { Link, NavLink } from "react-router-dom";
import { RBI_ROUTES } from "../../../../../../routes/rating_billing/rbi_routes";
import { useDispatch, useSelector } from "react-redux";
import {
  getBillingCycleList,
  downloadBillingCycle,
  getApprovalHierarchy,
  getDetailApproval,
  inactiveBillingCycle,
} from "../../../../../../redux/slices/rating_billing_invoice/MasterData/billingCycle";
import { Checkbox, Form, Spin, Tooltip } from "antd";
import BaseContainer from "../../../../../../components/BaseContainer";
import TablePaginationNew from "../../../../../../components/TablePaginationNew";
import ModalInactivateWithHierarchy from "../../../../../../components/Modal/ModalInactivateWithHierarchy";
import { ModalError } from "../../../../../../components/Modal/ModalPopUp";
import { columnsBillingCycleList } from "../Table/TableBillingCycleList";
import ModalHistory from "../../../../../../components/Modal/ModalHistory";
import { getApprovalHistory } from "../../../../../../redux/slices/rating_billing_invoice/MasterData/billingCycle";
import Toolbar from "../../../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../../../components/ColumnActionPermission";

const BillingCycleView = ({ type }) => {
  const searchInput = useRef(null);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [modalInactive, setModalInactive] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [modalApprovalHistory, setModalApprovalHistory] = useState(false);
  const [dataApprovalHistoryFix, setDataApprovalHistoryFix] = useState({});
  const [bodyError, setBodyError] = useState({});
  const [chooseId, setChooseId] = useState();
  const { data_list_billing_cycle, loading, dataApprovalHistory } = useSelector(
    (state) => state.billingCycle,
  );
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
      path: "",
      breadcrumbName: "Billing Cycle",
    },
  ];

  const handleDownload = () => {
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
    dispatch(
      downloadBillingCycle({ search: tempSearch, page, pageSize, sort }),
    );
  };

  const handleApprovalHistory = (r) => {
    dispatch(getApprovalHistory(r));
    setModalApprovalHistory(true);
  };

  const handleChangePage = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

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

  useEffect(() => {
    dispatch(
      getBillingCycleList({
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize,
        sort,
      }),
    );
  }, [dispatch, search, page, pageSize, sort]);

  useEffect(() => {
    if (dataApprovalHistory && dataApprovalHistory?.dataApprover) {
      const temp = {
        dataApprover: {
          create: dataApprovalHistory?.dataApprover?.BILLING_CYCLE || [],
          inactive:
            dataApprovalHistory?.dataApprover?.INACTIVE_BILLING_CYCLE || [],
        },
        dataHistory: {
          create: dataApprovalHistory?.dataHistory?.BILLING_CYCLE || [],
          inactive:
            dataApprovalHistory?.dataHistory?.INACTIVE_BILLING_CYCLE || [],
        },
      };
      setDataApprovalHistoryFix(temp);
    } else {
      setDataApprovalHistoryFix({});
    }
  }, [dataApprovalHistory]);

  const handleInactive = (data) => {
    setChooseId(data);
    setModalInactive(true);
  };

  const handleCancel = () => {
    setChooseId();
    setModalInactive(false);
  };

  const handleRetry = () => {
    handleOk();
    setModalError(false);
    setBodyError({});
  };

  const handleCloseModalError = () => {
    setModalError(false);
    setBodyError({});
  };

  const handleOptions = () => {
    const data = dataApprovalHistoryFix?.dataApprover || {};
    const keyData = Object.keys(data);
    return keyData.map((item) => ({
      value: item.charAt(0).toUpperCase() + item.slice(1).toLowerCase(),
    }));
  };

  const handleOk = (res, handleClear) => {
    const dataValue = {
      billingCycleId: chooseId.billingCycleId,
      appHierId: res.approvalHierarchy,
      remark: res.remark,
    };
    dispatch(inactiveBillingCycle(dataValue))
      .unwrap()
      .then(() => {
        handleClear();
        handleCancel();
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
        dispatch(
          getBillingCycleList({
            search: tempSearch,
            page,
            pageSize,
            sort,
          }),
        );
      })
      .catch((error) => {
        if (Math.floor((error.response.data.code || 0) / 100) === 5) {
          const message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          setBodyError({ body: { ...res }, handleClear, message });
          setModalError(true);
        }
      });
  };

  // Grant Access Item
  const itemGrantAccess = [
    {
      action: "Download",
      render: (
        <ButtonComponent
          type={"submit"}
          border={false}
          icon={<SVGIcon name="IconButtonDownload" width={24} />}
          onClick={() => {
            handleDownload();
          }}
        >
          Download List
        </ButtonComponent>
      ),
    },
    {
      action: "Create",
      render: (
        <NavLink to={RBI_ROUTES.BILLING_CYCLE_CREATE}>
          <ButtonComponent
            icon={<SVGIcon name="IconButtonCreate" width={24} />}
            type={"submit"}
            border={false}
          >
            Create Billing Cycle
          </ButtonComponent>
        </NavLink>
      ),
    },

    // Column Action Table
    {
      action: "View",
      type: "table",
      render: (record) => {
        return (
          <Link
            to={RBI_ROUTES.BILLING_CYCLE_DETAIL}
            state={{
              id: record.billingCycleId,
              action: record.status,
              statusApproval: record.statusApproval,
            }}
          >
            <Tooltip title="Detail">
              <div className="pt-1">
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
        const isEditable =
          record.statusApproval === "DRAFT" ||
          record.statusApproval === "REJECTED" ||
          (record.status === "ACTIVE" && record.statusApproval === "APPROVED");

        const linkContent =
          data > 3 ? (
            <ButtonComponent
              icon={
                <SVGIcon
                  name="IconEdit"
                  color={isEditable ? "#0075bf" : "#8D91A0"}
                  width={24}
                />
              }
              border={false}
              disabled={!isEditable}
            >
              <span
                className={`ml-3 ${isEditable ? "text-black " : "text-[#8D91A0]"}`}
              >
                {" "}
                Update
              </span>
            </ButtonComponent>
          ) : (
            <Tooltip title="Update">
              <div className="pt-1">
                <SVGIcon
                  name="IconEdit"
                  width={24}
                  color={!isEditable ? "#8D91A0" : "#ACC424"}
                  className={!isEditable ? "cursor-not-allowed" : undefined}
                />
              </div>
            </Tooltip>
          );

        return isEditable ? (
          <Link
            to={RBI_ROUTES.BILLING_CYCLE_UPDATE}
            state={{
              status: record?.status,
              statusApproval: record?.statusApproval,
              id: record?.billingCycleId,
            }}
          >
            {linkContent}
          </Link>
        ) : (
          <div>{linkContent}</div>
        );
      },
    },
    {
      action: "Activate",
      type: "table",
      render: (record, data) => {
        const isActivateOrInactivate =
          (record.statusApproval === "APPROVED" &&
            record.status === "ACTIVE") ||
          (record.statusApproval === "DRAFT" && record.status === "ACTIVE") ||
          (record.statusApproval === "REJECTED" &&
            record.status === "ACTIVE") ||
          (record.statusApproval === "WAITING APPROVAL" &&
            record.status === "ACTIVE");

        const Content =
          data > 3 ? (
            <ButtonComponent
              icon={
                <Checkbox
                  className="inactive-check"
                  onClick={() => handleInactive(record)}
                  disabled={record.status === "ACTIVE" ? false : true}
                  checked={record.status === "ACTIVE" ? false : true}
                />
              }
              border={false}
              disabled={!isActivateOrInactivate}
              onClick={() => handleInactive(record)}
            >
              <span className="text-black ml-5">
                {record.status !== "ACTIVE" ? "Activate" : "Inactivate"}
              </span>
            </ButtonComponent>
          ) : (
            <Tooltip
              title={record.status === "ACTIVE" ? "Inactivate" : "Activate"}
            >
              <div className="pt-1">
                <Checkbox
                  className="inactive-check"
                  onClick={() => handleInactive(record)}
                  disabled={record.status === "ACTIVE" ? false : true}
                  checked={record.status === "ACTIVE" ? false : true}
                />
              </div>
            </Tooltip>
          );

        return Content;
      },
    },
    {
      action: "History",
      type: "table",
      render: (record, data) => {
        const Content =
          data > 3 ? (
            <ButtonComponent
              icon={
                <SVGIcon name="IconLogHistory" color={"#0075bf"} width={24} />
              }
              border={false}
              onClick={() => handleApprovalHistory(record.billingCycleId)}
            >
              <span className={"text-black ml-3"}>Approval History</span>
            </ButtonComponent>
          ) : (
            <Tooltip title="Approval History">
              <div className="pt-1">
                <SVGIcon
                  name="IconLogHistory"
                  color={"#0075bf"}
                  width={24}
                  onClick={() => handleApprovalHistory(record.billingCycleId)}
                />
              </div>
            </Tooltip>
          );

        return Content;
      },
    },
  ];

  return (
    <LayoutMenu>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />
        <div className={"w-full flex justify-end gap-2"}>
          <Toolbar items={itemGrantAccess} />
        </div>

        <BaseContainer header={"BILLING CYCLE LIST"}>
          <div className="w-full">
            <TablePaginationNew
              dataSource={data_list_billing_cycle?.result}
              totalData={data_list_billing_cycle?.page?.totalElements}
              current={page}
              pageSize={pageSize}
              onChange={handleChangePage}
              onSort={onSort}
              columns={[
                ...columnsBillingCycleList(
                  search,
                  page,
                  pageSize,
                  searchInput,
                  searchedColumn,
                  searchText,
                  handleSearch,
                  handleApprovalHistory,
                  handleInactive,
                ),
                ...useColumnActionPermission(
                  ["activate", "view", "update", "history"],
                  itemGrantAccess,
                ),
              ]}
              tableScrolled={{ y: 525, x: 2200 }}
            />
          </div>
        </BaseContainer>

        {/* Modal approval history */}
        <ModalHistory
          isOpen={modalApprovalHistory && dataApprovalHistoryFix}
          handleClose={() => setModalApprovalHistory(false)}
          header={"Approval History"}
          width={850}
          tabOptions={handleOptions()}
          dataApprover={dataApprovalHistoryFix?.dataApprover}
          dataHistory={dataApprovalHistoryFix?.dataHistory}
        />

        <ModalInactivateWithHierarchy
          selector={"billingCycle"}
          dispatch={dispatch}
          getAPIOption={getApprovalHierarchy}
          getAPIDetail={getDetailApproval}
          alertMessage={`Are you sure you want to inactivate this Billing Cycle with Begin Cycle ${
            chooseId?.beginCycle || ""
          }?`}
          openModalInactivate={modalInactive}
          handleCloseModalInactivate={handleCancel}
          onFinish={handleOk}
        />

        <ModalError
          isOpen={modalError}
          handleOk={handleRetry}
          handleCancel={handleCloseModalError}
          customText={"Try Again"}
        >
          <div className="px-5 pt-5 pb-[10px] justify-center">
            <div className="w-full flex gap-[20px]">
              <SVGIcon name="IconFailed" width={48} />
              <p className="text-[18px] font-bold">{"Failed"}</p>
            </div>
            <p className="pl-[70px]">{`Your data was not inactivate. ${bodyError.message}.`}</p>
            <p className="pl-[70px]">Please try again.</p>
          </div>
        </ModalError>
      </Spin>
    </LayoutMenu>
  );
};

export default BillingCycleView;
