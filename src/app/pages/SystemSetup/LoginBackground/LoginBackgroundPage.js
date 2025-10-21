import { DownloadOutlined, PlusOutlined } from "@ant-design/icons";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import { Checkbox, Spin, Tooltip } from "antd";
import SVGIcon from "../../../../assets/Icon/index";
import BaseContainer from "../../../../components/BaseContainer";
import BreadCrumb from "../../../../components/BreadCrumb";
import ButtonComponent from "../../../../components/ButtonComponent";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import TablePaginationNew from "../../../../components/TablePaginationNew";
import {
  getPagingBackground,
  inactiveBackground,
  downloadLoginBackground,
} from "../../../../redux/slices/system_setup/login_background";
import { SYSTEM_SETUP_ROUTES } from "../../../../routes/system_setup/setup_routes";
import { columnsLoginBackground } from "./Table/TableLoginBackground";
import ModalApproveOrReject from "../../../../components/Modal/ModalApproveOrReject";
import { ModalError } from "../../../../components/Modal/ModalPopUp";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";
import Toolbar from "../../../../components/Toolbar";

const LoginBackgroundPage = () => {
  const { data_Background, loading } = useSelector(
    (state) => state.login_background,
  );

  const [activeOrInactive, setActiveOrInactive] = useState(false);
  const [modalInactive, setModalInactive] = useState(false);
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState("");
  const searchInput = useRef(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [search, setSearch] = useState({});
  const [chooseId, setChooseId] = useState();
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});

  const handleFetch = useCallback(() => {
    dispatch(
      getPagingBackground({
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

  const handleConfirm = (e, handleClear) => {
    const body = {
      id: chooseId?.loginBackgroundId,
      remark: e?.remark,
    };
    dispatch(inactiveBackground({ body: body, action: chooseId?.status }))
      .unwrap()
      .then(() => {
        handleClear();
        handleCancel();
        handleFetch();
      })
      .catch((error) => {
        if (Math.floor((error.response.data.code || 0) / 100) === 5) {
          const message =
            (error?.response &&
              error?.response?.data &&
              error?.response?.data?.message) ||
            error?.message ||
            error?.toString();
          setBodyError({ message, value: {} });
          setModalError(true);
          handleCancel();
        }
      });
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(selectedKeys[0] ? dataIndex : "");
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

  const handleCancel = () => {
    setChooseId();
    setModalInactive(false);
  };

  const handleInactive = (data) => {
    setChooseId(data);
    setModalInactive(true);
    setActiveOrInactive(data?.status);
  };

  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  const handleCloseModalError = () => {
    setModalError(false);
    setBodyError({});
  };

  const handleRetry = () => {
    handleConfirm();
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
      downloadLoginBackground({
        page,
        pageSize,
        sort,
        search: tempSearch,
      }),
    );
  };

  const routes = [
    {
      path: "",
      breadcrumbName: "System Setup",
    },
    {
      path: SYSTEM_SETUP_ROUTES.VIEW_LOGIN_BACKGROUND,
      breadcrumbName: "Login Background",
    },
  ];

  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const itemActions = [
    // toolbar items
    {
      action: "Download",
      render: (
        <ButtonComponent
          type={"submit"}
          icon={<DownloadOutlined style={{ fontSize: "24px" }} />}
          onClick={() => handleDownload()}
        >
          Download List
        </ButtonComponent>
      ),
    },
    {
      action: "Create",
      render: (
        <NavLink to={SYSTEM_SETUP_ROUTES.CREATE_LOGIN_BACKGROUND}>
          <ButtonComponent
            icon={<PlusOutlined style={{ fontSize: "24px" }} />}
            type="submit"
          >
            Create Login Background
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
          <Link
            to={SYSTEM_SETUP_ROUTES.DETAIL_LOGIN_BACKGROUND}
            state={{ id: record?.loginBackgroundId }}
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
      render: (record, data_length) => {
        return (
          <Tooltip title="Update">
            {/* <div className="pt-1"> */}
            {record.status === "ACTIVE" ? (
              <Link
                to={SYSTEM_SETUP_ROUTES.UPDATE_LOGIN_BACKGROUND}
                state={{ id: record?.loginBackgroundId }}
              >
                <SVGIcon name="IconEdit" width={24} />
              </Link>
            ) : (
              <div
                className={
                  record.status === "INACTIVE" ? "cursor-not-allowed" : ""
                }
              >
                <SVGIcon
                  name="IconEdit"
                  width={24}
                  color={record.status !== "INACTIVE" ? "#ACC424" : "#8D91A0"}
                  className={
                    record.status === "INACTIVE" ? "disabled" : undefined
                  }
                />
              </div>
            )}
            {/* </div> */}
          </Tooltip>
        );
      },
    },
    {
      action: "Activate",
      type: "table",
      render: (record, data_length) => {
        return (
          <Tooltip
            title={record.status === "ACTIVE" ? "Inactivate" : "Activate"}
          >
            <div className="pt-1">
              <Checkbox
                onClick={() => {
                  handleInactive(record);
                }}
                checked={record.status !== "ACTIVE"}
              />
            </div>
          </Tooltip>
        );
      },
    },
  ];

  const columnAction = useColumnActionPermission(
    ["view", "update", "activate"],
    itemActions,
  );

  return (
    <LayoutMenu>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />
        <Toolbar items={itemActions} />

        <BaseContainer header={"LOGIN BACKGROUND LIST"}>
          <div className={"w-full"}>
            <TablePaginationNew
              dataSource={data_Background?.result}
              columns={[
                ...columnsLoginBackground(
                  search,
                  page,
                  pageSize,
                  searchInput,
                  searchedColumn,
                  searchText,
                  handleSearch,
                  handleInactive,
                ),
                ...columnAction,
              ]}
              current={page}
              pageSize={pageSize}
              onChange={handleChange}
              onSizeChanger={handleChange}
              totalData={data_Background?.page?.totalElements || 0}
              onSort={onSort}
              tableScrolled={{ y: 525, x: 1300 }}
            />
          </div>
        </BaseContainer>

        <ModalApproveOrReject
          isOpen={modalInactive}
          handleCloseModal={handleCancel}
          onFinish={handleConfirm}
          header={activeOrInactive === "INACTIVE" ? "activate" : "inactivate"}
          approveOrReject={
            activeOrInactive === "INACTIVE" ? "activate" : "inactivate"
          }
          menu={"Login Background"}
          named={chooseId?.backgroundName}
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
            <p className="pl-[70px]">{`Your data was not inactivated. ${bodyError.message}.`}</p>
            <p className="pl-[70px]">Please try again.</p>
          </div>
        </ModalError>
      </Spin>
    </LayoutMenu>
  );
};

export default LoginBackgroundPage;
