import React, { useCallback, useEffect, useRef } from "react";
import BreadCrumb from "../../../../components/BreadCrumb";
import { useSelector, useDispatch } from "react-redux";
import BaseContainer from "../../../../components/BaseContainer";
import {
  Spin,
  Checkbox,
  Tooltip,
} from "antd";
import ButtonComponent from "../../../../components/ButtonComponent";
import ModalCustom from "../../../../components/Modal/ModalCustom";
import {
  DownloadOutlined,
  PlusOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import TablePagination from "../../../../components/TablePagination";
import { SYSTEM_SETUP_ROUTES } from "../../../../routes/system_setup/setup_routes";
import {
  downloadMenu,
  getAllMenuPaginate,
  getMenuDetail,
  inactiveMenu,
} from "../../../../redux/slices/system_setup/menu";
import SVGIcon from "../../../../assets/Icon/index";
import DetailMenuLayout from "./DetailMenuLayout";
import {
  ModalConfirm,
} from "../../../../components/Modal/ModalPopUp";
import { renderColumn } from "../../../../utils";
import Toolbar from "../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";
import { useTryAgainHooks } from "../../../../utils/useTryAgainHooks";
import { getColumnSearchPropsPaging } from "../../../../utils/getColumnSearchProps";

const Menu = () => {
  const dispatch = useDispatch();
  const { data, data_detail, loading } = useSelector(
    (state) => state.main_Menu
  );
  const { bodyError } = useSelector(state => state?.general);

  // state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [modalInactive, setModalInactive] = useState(false);
  const [modalDetail, setModalDetail] = useState(false);
  const [modalType, setModalType] = useState("");
  const [id, setId] = useState("");
  const [status, setStatus] = useState();
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [body, setBody] = useState({});

  // handle fetch
  const handleFetch = useCallback(() => {
    dispatch(
      getAllMenuPaginate({ search: encodeURIComponent(JSON?.stringify(search)), page, pageSize, sort })
    );
  }, [dispatch, page, pageSize, search, sort]);


  useEffect(() => {
    handleFetch()
  }, [handleFetch]);


  // handle detail
  const handleDetail = async (id) => {
    try {
      setBody(id)
      await dispatch(getMenuDetail(id))?.unwrap();
      setModalDetail(true);
    } catch (error) {
      setModalDetail(false);
    }
  };


  const handleChange = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
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

  // onsort
  const onSort = (_, __, sort) => {
    const dataSort = sort.order
      ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
      : "";
    setSort(dataSort);
  };


  // handle download 
  const handleDownload = () => {
    dispatch(
      downloadMenu({
        page,
        pageSize,
        sort,
        search: encodeURIComponent(JSON?.stringify(search)),
      })
    );
  }

  const handleCancel = () => {
    setModalInactive(false);

  }
  const columns = [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "MENU NAME",
      dataIndex: "name",
      sorter: true,
      width: 240,
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsPaging(
        "name",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => renderColumn('name', searchedColumn, searchText, text, true, 'input', search)
    },
    {
      title: "PATH",
      dataIndex: "path",
      width: 240,
      sorter: true,
      align: "left",
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsPaging(
        "path",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => renderColumn('path', searchedColumn, searchText, text, true, 'input', search)

    },
    {
      title: "MENU TYPE",
      dataIndex: "menuType",
      align: "center",
      sorter: true,
      ...getColumnSearchPropsPaging(
        "menuType",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => renderColumn('menuType', searchedColumn, searchText, text, false, 'input', search)
    },
    {
      title: "PARENT",
      dataIndex: "parentName",
      // width: 125,
      sorter: true,
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsPaging(
        "parentName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => renderColumn('parentName', searchedColumn, searchText, text, true, 'input', search)

    },
    {
      title: "IS PAGE",
      dataIndex: "isPage",
      // width: 120,
      align: "center",
      sorter: true,
      ...getColumnSearchPropsPaging(
        "isPage",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => renderColumn('isPage', searchedColumn, searchText, text, false, 'input', search)
    },
    {
      title: "ORDER",
      dataIndex: "menuOrder",
      width: 100,
      align: "center",
      sorter: true,
      ...getColumnSearchPropsPaging(
        "menuOrder",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => renderColumn('menuOrder', searchedColumn, searchText, text, false, 'input', search)
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      width: 270,
      align: "left",
      sorter: true,
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsPaging(
        "description",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => renderColumn('menuOrder', searchedColumn, searchText, text, true, 'input', search)
    },
    {
      title: "STATUS",
      dataIndex: "status",
      width: 120,
      sorter: true,
      fixed: "right",
      ...getColumnSearchPropsPaging(
        "status",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => renderColumn('menuOrder', searchedColumn, searchText, text, false, 'status', search)
    },
  ];

  const routes = [
    {
      path: "",
      breadcrumbName: "System Setup",
    },
    {
      path: SYSTEM_SETUP_ROUTES.VIEW_MENU,
      breadcrumbName: "Menu",
    },
  ];

  const handleOk = async () => {
    try {
      const payload = { id: id, status: status };
      setBody(payload)
      handleCancel()
      await dispatch(inactiveMenu(payload))?.unwrap();
      await handleFetch()?.unwrap()
    } catch (error) {
      await handleFetch()?.unwrap()
      handleCancel()
    }
  };

  // item actions
  const itemActions = [
    // toolbar items
    {
      action: 'Download',
      render: (
        <ButtonComponent
          icon={<DownloadOutlined style={{ fontSize: "24px" }} />}
          type={"submit"}
          onClick={handleDownload}
        >
          Download List
        </ButtonComponent>
      )
    },
    {
      action: 'Create',
      render: (
        <NavLink to={SYSTEM_SETUP_ROUTES.CREATE_MENU} state={{ x: 1 }}>
          <ButtonComponent
            icon={<PlusOutlined style={{ fontSize: "24px" }} />}
            type="submit"
          >
            Create Menu
          </ButtonComponent>
        </NavLink>
      )
    },

    // column action
    {
      action: 'View',
      type: 'table',
      render: (record, data_length) => {
        return (
          <Tooltip title="Detail">
            <div
              onClick={() => {
                handleDetail(record?.menuId);
                setModalType("detail");
              }}
            >
              <SVGIcon name="IconDetail" width={24} />
            </div>
          </Tooltip>
        )
      }
    },
    {
      action: 'Update',
      type: 'table',
      render: (record, data_length) => {
        return (
          <Tooltip title="Update">
            <div className={`${record?.status?.toLowerCase() === "inactive" && 'cursor-not-allowed'}`}>
              <Link
                to={record?.status?.toLowerCase() !== "inactive" && SYSTEM_SETUP_ROUTES.UPDATE_MENU}
                state={record?.status?.toLowerCase() !== "inactive" && { id: record?.menuId }}
              >
                <div border={false}>
                  <SVGIcon
                    name="IconEdit"
                    width={24}
                    className={`${record?.status?.toLowerCase() === "inactive" && 'cursor-not-allowed'}`}
                    color={record?.status?.toLowerCase() === 'inactive' ? "#8D91A0" : "#ACC424"} />
                </div>
              </Link>
            </div>
          </Tooltip>
        )
      }
    },
    {
      action: 'Activate',
      type: 'table',
      render: (record, data_length) => {
        return (
          <Tooltip
            title={record?.status === "ACTIVE" ? "Inactivate" : "Activate"}
          >
            <div>
              <Checkbox
                border={false}
                onClick={() => {
                  setModalInactive(true);
                  setId(record?.menuId);
                  setStatus(record?.status);
                }}
                checked={record?.status !== "ACTIVE"}
              />
            </div>
          </Tooltip>
        )
      }
    }
  ];

  // handle retry modal error
  const handleRetry = () => {
    try {
      handleCancelTryAgain();
      if (bodyError?.action === "INACTIVE_MENU") {
        dispatch(inactiveMenu(body));
      } else if (bodyError?.action === "GET_MENU_DETAIL") {
        dispatch(getMenuDetail(body))
      } else if (bodyError?.action === "DOWNLOAD_MENU") {
        handleDownload()
      }
      handleFetch();
    } catch (error) {
      handleFetch();
    }
  };

  // use hooks handle retry
  const { renderModal, handleCancelTryAgain } = useTryAgainHooks(handleRetry);
  return (
    <LayoutMenu>
      <Spin spinning={loading} className={"w-full top-20"}>
        <BreadCrumb routes={routes} />
        <Toolbar items={itemActions} />
        <BreadCrumb pageName={["System Setup", "Menu"]} />
        <BaseContainer header={"MENU LIST"}>
          <div className={"w-full"}>
            <TablePagination
              dataSource={data?.result}
              totalData={data?.page?.totalElements}
              current={page}
              pageSize={pageSize}
              onChange={handleChange}
              tableScrolled={{ y: 525, x: 1800 }}
              columns={[...columns, ...useColumnActionPermission(['view', 'update', 'activate'], itemActions)]}
              onSort={onSort}
            />
          </div>
        </BaseContainer>
      </Spin>

      <ModalCustom
        isOpen={modalDetail}
        header={"MENU DETAIL"}
        width={modalType === "detail" ? 1000 : 500}
        type={"detail"}
        handleCancel={() => setModalDetail(false)}
      >
        <DetailMenuLayout data_detail={data_detail} />
        <div className="flex justify-end mt-8">
          <ButtonComponent onClick={() => setModalDetail(false)} border={true}>
            Back
          </ButtonComponent>
        </div>
      </ModalCustom>

      <ModalConfirm
        isOpen={modalInactive}
        handleCancel={() => setModalInactive(false)}
        handleOk={handleOk}
        width={500}
        useOk={true}
      >
        <div className="w-full flex flex-col mt-10 justify-end">
          <div className={"w-full flex flex-row items-center px-10"}>
            <WarningOutlined style={{ color: "red" }} className={"text-4xl"} />
            <span className={"text-lg text-black font-bold h-auto mx-auto"}>
              {`Are you sure want to ${status === "ACTIVE" ? "inactivate" : "activate"
                }?`}
            </span>
          </div>
        </div>
      </ModalConfirm>

      {/* modal try again */}
      {renderModal()}
    </LayoutMenu>
  );
};

export default Menu;
