import React, { useState, useEffect, useRef } from "react";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import { Checkbox, Spin, Tooltip } from "antd";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import {
  DownloadOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Link, NavLink } from "react-router-dom";
import BaseContainer from "../../../../../components/BaseContainer";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../routes/account_management/customer_account_routes";
import { useDispatch, useSelector } from "react-redux";
import {
  activeInactiveLateCharge,
  downloadLateCharge,
  getLateChargePaginate,
} from "../../../../../redux/slices/account_management/MasterData/late_charges";
import { getColumnSearchPropsPaging } from "../../../../../utils/getColumnSearchProps";
import SVGIcon from "../../../../../assets/Icon/index";
import TablePaginationNew from "../../../../../components/TablePaginationNew";
import { ModalError } from "../../../../../components/Modal/ModalPopUp";
import { IconModal } from "../../../../../utils/Icon";
import { renderColumn } from "../../../../../utils";
import ModalApproveOrReject from "../../../../../components/Modal/ModalApproveOrReject";
import { getGrantedAccessAccount } from "../../../../../redux/slices/account_management/accountManagement";
import ToolbarAccount from "../../../AccountManagement/ComponentAccount/ToolbarAccount";
import { useColumnActionPermissionAccount } from "../../../AccountManagement/ComponentAccount/ColumnActionPermissionAccount";

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
    path: "",
    breadcrumbName: "Late Charge",
  },
];

const ViewLateCharges = () => {
  const { data, loading } = useSelector((state) => state.late_charge);
  const { user } = useSelector((state) => state.auth);
  const { access_account } = useSelector((state) => state.accountManagement);
  const filteredArray = {
    actionList: access_account?.actionList?.filter(
      (action) =>
        action.path.includes("/system-setup/late-charges/") &&
        !action.path.includes("/system-setup/late-charges-rule/"),
    ),
  };
  // Access Action Menu
  const dataArr = user?.data?.actionList;
  const isUpdate = dataArr?.some((element) => element.name === "Update");
  const isInactive = dataArr?.some((element) => element.name === "Inactivate");
  const isCreate = dataArr?.some((element) => element.name === "Create");

  const dispatch = useDispatch();
  // const [form] = Form.useForm();
  // Use State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const searchInput = useRef(null);
  const [modalActive, setModalActive] = useState(false);
  const [dataActivate, setDataActivate] = useState({});
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});

  useEffect(() => {
    dispatch(getGrantedAccessAccount("/system-setup/late-charges"));
  }, [dispatch]);

  // use effect
  useEffect(() => {
    const reqSearch = encodeURIComponent(JSON.stringify(search));
    dispatch(
      getLateChargePaginate({ search: reqSearch, sort, page, pageSize }),
    );
  }, [dispatch, page, pageSize, search, sort]);

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

  const handleChange = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field === "maxAmount" ? "maxAmountReal" : sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const openActiveModal = (data) => {
    setDataActivate(data);
    setModalActive(true);
  };

  // columns
  const columns = (
    page,
    pageSize,
    searchInput,
    searchedColumn,
    searchText,
    handleSearch = () => {},
    handleActiveOrInactive = () => {},
    isInactive,
    isUpdate,
  ) => {
    return [
      {
        title: "NO",
        width: 60,
        align: "center",
        render: (text, object, index) => (page - 1) * pageSize + index + 1,
      },
      {
        title: "LATE CHARGE NAME",
        dataIndex: "name",
        width: 240,
        sorter: true,
        ellipsis: {
          showTitle: false,
        },
        ...getColumnSearchPropsPaging(
          "name",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
        render: (text) =>
          renderColumn(
            "name",
            searchedColumn,
            searchText,
            text,
            true,
            "input",
            search,
          ),
      },
      {
        title: "CURRENCY",
        dataIndex: "currency",
        align: "center",
        width: 140,
        sorter: true,
        ...getColumnSearchPropsPaging(
          "currency",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
        render: (text) =>
          renderColumn(
            "currency",
            searchedColumn,
            searchText,
            text,
            false,
            "input",
            search,
          ),
      },
      {
        title: "CRITERIA",
        dataIndex: "criteria",
        align: "left",
        width: 240,
        sorter: true,
        ellipsis: {
          showTitle: false,
        },
        ...getColumnSearchPropsPaging(
          "criteria",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
        render: (text) =>
          renderColumn(
            "criteria",
            searchedColumn,
            searchText,
            text,
            true,
            "input",
            search,
          ),
      },
      {
        title: "LATE CHARGE MAXIMUM AMOUNT",
        dataIndex: "maxAmount",
        align: "right",
        width: 320,
        sorter: true,
        ...getColumnSearchPropsPaging(
          "maxAmountReal",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
        render: (text) =>
          renderColumn(
            "maxAmount",
            searchedColumn,
            searchText,
            text,
            true,
            "input",
            search,
          ),
      },
      {
        title: "LATE CHARGE RULE FORMULA",
        dataIndex: "formula",
        width: 320,
        sorter: true,
        ellipsis: {
          showTitle: false,
        },
        ...getColumnSearchPropsPaging(
          "formula",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
        render: (text) =>
          renderColumn(
            "formula",
            searchedColumn,
            searchText,
            text,
            true,
            "input",
            search,
          ),
      },
      {
        title: "DESCRIPTION",
        dataIndex: "description",
        width: 240,
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
        ),
        render: (text) =>
          renderColumn(
            "description",
            searchedColumn,
            searchText,
            text,
            true,
            "input",
            search,
          ),
      },
      {
        title: "STATUS",
        dataIndex: "status",
        width: 150,
        sorter: true,
        fixed: "right",
        ...getColumnSearchPropsPaging(
          "status",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
        render: (text) =>
          renderColumn(
            "status",
            searchedColumn,
            searchText,
            text,
            false,
            "status",
            search,
          ),
      },
    ];
  };

  const handleOk = (formValue, handleClear) => {
    const body = {
      lateChargeId: dataActivate.lateChargeId,
      remark: formValue.remark,
    };
    const activeOrInactive =
      dataActivate.status === "ACTIVE" ? "inactivate" : "activate";
    dispatch(activeInactiveLateCharge({ body, activeOrInactive }))
      .unwrap()
      .then(() => {
        handleClear();
        setDataActivate({});
        setModalActive(false);
        const reqSearch = encodeURIComponent(JSON.stringify(search));
        dispatch(
          getLateChargePaginate({ search: reqSearch, sort, page, pageSize }),
        );
      })
      .catch((error) => {
        if (Math.floor((error?.response?.data?.code || 0) / 100) === 5) {
          const message =
            error?.response?.data?.message || error.message || error.toString();
          setBodyError({ message, activeOrInactive });
          setModalError(true);
        }
      });
    // form.resetFields();
  };

  const handleCloseModalError = () => {
    setModalError(false);
    setBodyError({});
  };
  const handleRetry = () => {
    handleOk();
    setModalError(false);
    setBodyError({});
  };

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
      downloadLateCharge({
        search: encodeURIComponent(JSON.stringify(search)),
        sort,
        page,
        pageSize,
      }),
    );
  };

  const handleClose = () => {
    setModalActive(false);
  };

  const itemActions = [
    //action toolbar
    {
      action: "Download",
      render: (
        <ButtonComponent
          icon={<DownloadOutlined style={{ fontSize: "24px" }} />}
          type="submit"
          onClick={handleDownload}
        >
          Download List
        </ButtonComponent>
      ),
    },
    {
      action: "Upload",
      render: (
        <NavLink to={""}>
          <ButtonComponent
            icon={<UploadOutlined style={{ fontSize: "24px" }} />}
            type="submit"
          >
            Upload
          </ButtonComponent>
        </NavLink>
      ),
    },
    {
      action: "Create",
      render: (
        <NavLink to={ACCOUNT_MANAGEMENT_ROUTES.CREATE_LATE_CHARGES}>
          <ButtonComponent
            icon={<PlusOutlined style={{ fontSize: "24px" }} />}
            type="submit"
          >
            Create Late Charge
          </ButtonComponent>
        </NavLink>
      ),
    },

    // Column Action Table
    {
      action: "View",
      type: "table",
      render: (record, data) => {
        return (
          <Tooltip title="Detail">
            <Link
              to={ACCOUNT_MANAGEMENT_ROUTES.DETAIL_LATE_CHARGES}
              state={{ id: record?.lateChargeId }}
            >
              <div>
                <SVGIcon name="IconDetail" width={24} />
              </div>
            </Link>
          </Tooltip>
        );
      },
    },

    {
      action: "Update",
      type: "table",
      render: (record, data) => {
        return (
          <Tooltip title="Update">
            {record?.status === "INACTIVE" ? (
              <div className={"cursor-not-allowed"}>
                <SVGIcon
                  name="IconEdit"
                  width={24}
                  color={"#C0BEC6"}
                  className={"cursor-not-allowed"}
                />
              </div>
            ) : (
              <Link
                to={ACCOUNT_MANAGEMENT_ROUTES.UPDATE_LATE_CHARGES}
                state={{ id: record?.lateChargeId }}
              >
                <div>
                  <SVGIcon name="IconEdit" width={24} />
                </div>
              </Link>
            )}
          </Tooltip>
        );
      },
    },

    {
      action: "Activate",
      type: "table",
      render: (record, data) => {
        return (
          <Tooltip
            title={record.status === "ACTIVE" ? "Inactivate" : "Activate"}
          >
            <div>
              <Checkbox
                onClick={() => {
                  openActiveModal(record);
                }}
                checked={record?.status === "INACTIVE"}
              />
            </div>
          </Tooltip>
        );
      },
    },
  ];

  return (
    <LayoutMenu>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />

        <ToolbarAccount items={itemActions} advancedAccess={filteredArray} />

        <BaseContainer header={"Late Charge List"}>
          <div className="w-full">
            <TablePaginationNew
              dataSource={data?.result}
              columns={[
                ...columns(
                  page,
                  pageSize,
                  searchInput,
                  searchedColumn,
                  searchText,
                  handleSearch,
                  openActiveModal,
                ),
                ...useColumnActionPermissionAccount(
                  ["Activate", "View", "Update"],
                  itemActions,
                  filteredArray,
                ),
              ]}
              current={page}
              pageSize={pageSize}
              onChange={handleChange}
              onSort={onSort}
              totalData={data?.page?.totalElements || 0}
              tableScrolled={{
                x: 1500,
                y: 500,
              }}
            />
          </div>
        </BaseContainer>
      </Spin>

      <ModalApproveOrReject
        isOpen={modalActive}
        handleCloseModal={handleClose}
        onFinish={handleOk}
        header={`${dataActivate?.status === "ACTIVE" ? "Inactivate" : "Activate"}`}
        approveOrReject={`${dataActivate?.status === "ACTIVE" ? "Inactivate" : "Activate"}`}
        menu={"Late Charge"}
        named={dataActivate?.name}
      />

      {/** Modal Retry */}
      <ModalError
        isOpen={modalError}
        handleOk={handleRetry}
        handleCancel={handleCloseModalError}
        customText={"Try Again"}
      >
        <div className="px-5 pt-5 pb-[10px] justify-center">
          <div className="w-full flex gap-[20px]">
            {IconModal.icon_error_inactivate}
            <p className="text-[18px] font-bold">{"Failed"}</p>
          </div>
          <p className="pl-[70px]">{`Your data was not ${bodyError.activeOrInactive}. ${bodyError.message}.`}</p>
          <p className="pl-[70px]">Please try again.</p>
        </div>
      </ModalError>
    </LayoutMenu>
  );
};

export default ViewLateCharges;
