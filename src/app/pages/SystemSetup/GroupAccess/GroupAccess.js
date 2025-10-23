import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import {
  Spin,
  Tree,
  Alert,
  Tooltip,
  Checkbox,
} from "antd";
import BreadCrumb from "../../../../components/BreadCrumb";
import BaseContainer from "../../../../components/BaseContainer";
import ButtonComponent from "../../../../components/ButtonComponent";
import {
  DownloadOutlined,
  PlusOutlined,
  WarningOutlined,

} from "@ant-design/icons";
import { Link, NavLink } from "react-router-dom";
import SVGIcon from "../../../../assets/Icon/index";
import React, { useCallback, useEffect, useRef, useState } from "react";
import DetailText from "../../../../components/DetailText";
import ModalCustom from "../../../../components/Modal/ModalCustom";
import { useDispatch, useSelector } from "react-redux";
import {
  activeAndInactiveGroupAccess,
  detailGroupAccess,
  downloadGroupAccess,
  getAllGroupAccessPaginate,
} from "../../../../redux/slices/system_setup/group_access";
import { SYSTEM_SETUP_ROUTES } from "../../../../routes/system_setup/setup_routes";
import moment from "moment";
import {
  ModalConfirm,
  ModalSuccess,
} from "../../../../components/Modal/ModalPopUp";
import TablePagination from "../../../../components/TablePagination";
import { transformGaMenuDetail } from "./util";
import CardComponent from "../../../../components/Card/CardComponent";
import { hasValue, renderColumn } from "../../../../utils";
import Toolbar from "../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";
import { useTryAgainHooks } from "../../../../utils/useTryAgainHooks";
import { getColumnSearchPropsPaging } from "../../../../utils/getColumnSearchProps";

const GroupAccess = () => {
  const {
    data: listGA,
    loading,
    data_detail,
  } = useSelector((state) => state.groupAccess);
  const { bodyError } = useSelector(state => state?.general);
  const dispatch = useDispatch();

  // use state
  const [modalInactive, setModalInactive] = useState(false);
  const [modalDetail, setModalDetail] = useState(false);
  const [gaId, setGaId] = useState("");
  const [status, setStatus] = useState("");
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [modalSuccess, setModalSuccess] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [body, setBody] = useState({});

  // handle fetch
  const handleFetch = useCallback(() => {
    dispatch(
      getAllGroupAccessPaginate({ search: encodeURIComponent(JSON?.stringify(search)), page, pageSize, sort })
    );
  }, [dispatch, page, pageSize, search, sort])

  // use effect
  useEffect(() => {
    handleFetch()
  }, [handleFetch]);

  // Search Column Table
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

  // column
  const columns = [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "GROUP ACCESS NAME",
      dataIndex: "name",
      sorter: true,
      ellipsis: {
        showTitle: false
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
      title: "USER LEVEL",
      dataIndex: "userLevel",
      sorter: true,
      align: "center",
      width: 200,
      ...getColumnSearchPropsPaging(
        "userLevel",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => renderColumn('userLevel', searchedColumn, searchText, text, false, 'input', search)
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      sorter: true,
      width: 300,
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
      render: (text) => renderColumn('description', searchedColumn, searchText, text, true, 'input', search)

    },
    {
      title: "STATUS",
      dataIndex: "status",
      sorter: true,
      width: 120,
      fixed: "right",
      ...getColumnSearchPropsPaging(
        "status",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => renderColumn('status', searchedColumn, searchText, text, false, 'status', search)
    },
  ];

  // handle cancel modal
  const handleCancel = () => {
    setModalInactive(false);
  };

  const handleChange = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };
  // handle download
  const handleDownload = () => {
    dispatch(
      downloadGroupAccess({
        page,
        pageSize,
        sort,
        search: encodeURIComponent(JSON?.stringify(search)),
      })
    );
  }


  // handle detail
  const handleDetail = async (id) => {
    try {
      setBody(id);
      await dispatch(detailGroupAccess(id))?.unwrap();
      setModalDetail(true);
    } catch (error) {
      setModalDetail(false);
    }
  };

  //handle active/inactive
  const handleOk = async () => {
    try {
      const payload = { id: gaId, status };
      setBody(payload);
      handleCancel();
      await dispatch(activeAndInactiveGroupAccess(payload)).unwrap();
      await handleFetch()?.unwrap();
    } catch (error) {
      await handleFetch()?.unwrap();
      handleCancel()
    }
  };

  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  // Breadcrumbs
  const routes = [
    {
      path: "",
      breadcrumbName: "System Setup",
    },
    {
      path: SYSTEM_SETUP_ROUTES.VIEW_GROUP_ACCESS,
      breadcrumbName: "Group Access",
    },
  ];


  // item actions
  const itemActions = [
    // toolbar items
    {
      action: 'Download',
      render: (
        <ButtonComponent
          type={"submit"}
          icon={<DownloadOutlined style={{ fontSize: "24px" }} />}
          onClick={handleDownload}
        >
          Download List
        </ButtonComponent>
      )
    },
    {
      action: 'Create',
      render: (
        <NavLink
          to={SYSTEM_SETUP_ROUTES.CREATE_GROUP_ACCESS}
          state={{ x: 1 }}
        >
          <ButtonComponent
            icon={<PlusOutlined style={{ fontSize: "24px" }} />}
            type="submit"
          >
            Create Group Access
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
                handleDetail(record?.gaId);
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
                to={record?.status?.toLowerCase() !== "inactive" && SYSTEM_SETUP_ROUTES.UPDATE_GROUP_ACCESS}
                state={record?.status?.toLowerCase() !== "inactive" && { id: record?.gaId }}
              >
                <div>
                  <SVGIcon
                    className={`${record?.status?.toLowerCase() === "inactive" && 'cursor-not-allowed'}`}
                    color={record?.status?.toLowerCase() === 'inactive' ? "#8D91A0" : "#ACC424"}
                    name="IconEdit" width={24} />
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
            title={record.status === "ACTIVE" ? "Inactivate" : "Activate"}
          >
            <div>
              <Checkbox
                onClick={() => {
                  setModalInactive(true);
                  setGaId(record?.gaId);
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
      if (bodyError?.action === "ACTIVE_GROUP_ACCESS") {
        dispatch(activeAndInactiveGroupAccess(body));
      } else if (bodyError?.action === "GET_GROUP_ACCESS_DETAIL") {
        dispatch(detailGroupAccess(body))
      } else if (bodyError?.action === "DOWNLOAD_ACTION") {
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
      <BreadCrumb routes={routes} />
      <Spin spinning={loading} className={"w-full top-20"}>
        <Toolbar items={itemActions} />
        <BaseContainer header={"GROUP ACCESS LIST"}>
          <div className={"w-full"}>
            <div className={"w-full flex mb-5 gap-2 justify-between"}></div>
            <TablePagination
              dataSource={listGA?.result}
              totalData={listGA?.page?.totalElements}
              current={page}
              pageSize={pageSize}
              onChange={handleChange}
              columns={[...columns, ...useColumnActionPermission(['view', 'update', 'activate'], itemActions)]}
              onSort={onSort}
              tableScrolled={{
                x: 1200,
                y: 425,
              }}
            />
          </div>
        </BaseContainer>
      </Spin>

      <ModalCustom
        isOpen={modalDetail}
        width={1000}
        handleCancel={() => setModalDetail(false)}
        header={"DETAIL GROUP ACCESS"}
        footer={
          <div className="w-full flex justify-end gap-5">
            <ButtonComponent
              onClick={() => setModalDetail(false)}
              border={true}
            >
              Back
            </ButtonComponent>
          </div>
        }
      >
        <CardComponent header={"GROUP ACCESS INFORMATION"} cols={4}>
          <DetailText label={"Group Access Name"}>
            {data_detail?.name}
          </DetailText>
          <DetailText label={"User Level"}>
            {data_detail?.userLevelName}
          </DetailText>
          <DetailText label={"Description"}>
            {data_detail?.description}
          </DetailText>
          <DetailText label={"Status"}>{data_detail?.status}</DetailText>
        </CardComponent>

        <CardComponent header={" HISTORY LOG INFORMATION"} cols={5}>
          <DetailText label={"Record Id"}>
            {data_detail?.gaId}
          </DetailText>
          <DetailText label={"Created Date"}>
            {hasValue(data_detail?.createdDate) && moment(data_detail?.createdDate).format("DD MMM YYYY HH:mm:ss")}
          </DetailText>
          <DetailText label={"Created By"}>{data_detail?.createdBy}</DetailText>
          <DetailText label={"Updated Date"}>
            {hasValue(data_detail?.updatedDate) && moment(data_detail?.updatedDate).format("DD MMM YYYY HH:mm:ss")}
          </DetailText>
          <DetailText label={"Updated By"}>{data_detail?.updatedBy}</DetailText>
        </CardComponent>

        {/* <span className="text-dg-blue text-xs">Menu Access</span> */}
        <CardComponent header={"MENU ACCESS"}>
          {transformGaMenuDetail(data_detail).map((res) => (
            <div key={res.title}>
              <Tree
                treeData={[res]}
                rootStyle={{ backgroundColor: "#e6f1f9" }}
              />
            </div>
          ))}
        </CardComponent>
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
            <WarningOutlined
              style={{ color: "red" }}
              className={"text-4xl"}
            />
            <span className={"text-lg text-black font-bold h-auto mx-auto"}>
              {`Are you sure want to ${status === "ACTIVE" ? "inactivate" : "activate"
                }?`}
            </span>
          </div>
        </div>
      </ModalConfirm>

      {/* Modal Success */}
      <ModalSuccess
        isOpen={modalSuccess}
        handleOk={() => setModalSuccess(false)}
        handleCancel={() => setModalSuccess(false)}
      >
        <div className="px-8 py-8 justify-center">
          <div className="w-full flex gap-[20px]">
            <SVGIcon name="IconSuccess" width={48} />
            <p className="text-[18px] font-bold">Successful</p>
          </div>
          <p className="pl-11">Your data has been Updated.</p>
        </div>
      </ModalSuccess>

      {/* Modal Error*/}
      <ModalSuccess
        isOpen={modalError}
        handleOk={() => setModalError(false)}
        handleCancel={() => setModalError(false)}
      >
        <div className="px-8 py-8 justify-center">
          <div className="w-full flex gap-[20px]">
            <SVGIcon name="IconFailed" width={48} />
            <p className="text-[18px] font-bold">Failed</p>
          </div>
          <p className="pl-11">Your data was not created. Please try again.</p>
        </div>
      </ModalSuccess>

      {/* modal try again */}
      {renderModal()}
    </LayoutMenu>
  );
};

export default GroupAccess;
