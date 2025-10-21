import { Checkbox, Spin, Tooltip } from "antd";
import { DownloadOutlined, PlusOutlined } from "@ant-design/icons";
import { React, useCallback, useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import { columns } from "./Table/TableAnnouncement";
import { SYSTEM_SETUP_ROUTES } from "../../../../routes/system_setup/setup_routes";
import {
  getAnnouncementList,
  inactiveAnnouncement,
  downloadAnnouncement,
} from "../../../../redux/slices/system_setup/announcement";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";
import BreadCrumb from "../../../../components/BreadCrumb";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import ButtonComponent from "../../../../components/ButtonComponent";
import BaseContainer from "../../../../components/BaseContainer";
import TablePagination from "../../../../components/TablePagination";
import ModalApproveOrReject from "../../../../components/Modal/ModalApproveOrReject";
import SVGIcon from "../../../../assets/Icon/index";
import { useTryAgainHooks } from "../../../../utils/useTryAgainHooks";
import Toolbar from "../../../../components/Toolbar";

const AnnouncementPage = () => {
  // Selector
  const { loading, data_Announcement } = useSelector(
    (state) => state.announcement,
  );
  const { bodyError } = useSelector((state) => state?.general);
  // Declaration
  const dispatch = useDispatch();
  const searchInput = useRef(null);

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});

  const [modalInactive, setModalInactive] = useState(false);
  const [chooseId, setChooseId] = useState();
  const [activeOrInactive, setActiveOrInactive] = useState("");
  const [body, setBody] = useState({});

  const routes = [
    {
      path: "",
      breadcrumbName: "System Setup",
    },
    {
      path: "",
      breadcrumbName: "Announcement",
    },
  ];

  const handleFetch = useCallback(() => {
    const reqSearch = encodeURIComponent(JSON.stringify(search));
    dispatch(getAnnouncementList({ search: reqSearch, page, pageSize, sort }));
  }, [dispatch, page, pageSize, search, sort]);

  useEffect(() => {
    handleFetch();
  }, [handleFetch]);

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

  const handleChange = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  const handleRetry = () => {
    try {
      handleCancelTryAgain();
      if (bodyError?.action === "INACTIVE_ANNOUNCEMENT") {
        dispatch(
          inactiveAnnouncement({ body: body?.body, action: body?.action }),
        );
      } else if (bodyError?.action === "DOWNLOAD_ANNOUNCEMENT") {
        handleDownload();
      }
      handleFetch();
    } catch (error) {
      handleFetch();
    }
  };

  const handleInactive = async (data) => {
    setChooseId(data);
    setModalInactive(true);
    setActiveOrInactive(data?.status);
  };

  const handleCancel = () => {
    setChooseId();
    setModalInactive(false);
  };

  const handleConfirm = async (e, handleClear) => {
    try {
      const body = {
        id: chooseId?.announcementId,
        remark: e?.remark,
      };
      setBody({ body: body, action: chooseId?.status });
      await dispatch(
        inactiveAnnouncement({ body: body, action: chooseId?.status }),
      )?.unwrap();
      await handleFetch()?.unwrap();
      handleClear();
      handleCancel();
    } catch (error) {
      handleClear();
      handleCancel();
    }
  };

  const handleDownload = () => {
    dispatch(
      downloadAnnouncement({
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize,
        sort,
      }),
    );
  };

  const itemActions = [
    {
      action: "Download",
      render: (
        <ButtonComponent
          type="submit"
          icon={<DownloadOutlined style={{ fontSize: "24px" }} />}
          onClick={handleDownload}
        >
          Download List
        </ButtonComponent>
      ),
    },
    {
      action: "Create",
      render: (
        <NavLink to={SYSTEM_SETUP_ROUTES.CREATE_ANNOUNCEMENT}>
          <ButtonComponent
            icon={<PlusOutlined style={{ fontSize: "24px" }} />}
            type="submit"
          >
            Create Announcement
          </ButtonComponent>
        </NavLink>
      ),
    },
    {
      action: "View",
      type: "table",
      render: (record) => (
        <Link
          to={SYSTEM_SETUP_ROUTES.DETAIL_ANNOUNCEMENT}
          state={{ id: record.announcementId }}
        >
          <Tooltip title="Detail">
            <div className="pt-1">
              <SVGIcon name="IconDetail" width={24} />
            </div>
          </Tooltip>
        </Link>
      ),
    },
    {
      action: "Update",
      type: "table",
      render: (record) => (
        <Tooltip title="Update">
          {record.status === "ACTIVE" ? (
            <Link
              to={SYSTEM_SETUP_ROUTES.UPDATE_ANNOUNCEMENT}
              state={{ id: record.announcementId }}
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
        </Tooltip>
      ),
    },
    {
      action: "Activate",
      type: "table",
      render: (record) => (
        <Tooltip title={record.status === "ACTIVE" ? "Inactivate" : "Activate"}>
          <div className="pt-1">
            <Checkbox
              onClick={() => handleInactive(record)}
              checked={record.status !== "ACTIVE"}
            />
          </div>
        </Tooltip>
      ),
    },
  ];

  const columnAction = useColumnActionPermission(
    ["view", "update", "activate"],
    itemActions,
  );

  const { renderModal, handleCancelTryAgain } = useTryAgainHooks(handleRetry);
  return (
    <LayoutMenu>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />
        <Toolbar items={itemActions} />
        <BaseContainer header={"ANNOUNCEMENT LIST"}>
          <div className={"w-full"}>
            <TablePagination
              dataSource={data_Announcement?.result}
              columns={[
                ...columns(
                  search,
                  page,
                  pageSize,
                  searchInput,
                  searchedColumn,
                  searchText,
                  handleSearch,
                ),
                ...columnAction,
              ]}
              current={page}
              pageSize={pageSize}
              onChange={handleChange}
              onSizeChanger={handleChange}
              totalData={data_Announcement?.page?.totalElements || 0}
              onSort={onSort}
              tableScrolled={{ y: 525, x: 1300 }}
            />
          </div>
        </BaseContainer>
      </Spin>

      {/* Modal inactive */}
      <ModalApproveOrReject
        isOpen={modalInactive}
        handleCloseModal={handleCancel}
        onFinish={handleConfirm}
        header={activeOrInactive === "INACTIVE" ? "activate" : "inactivate"}
        approveOrReject={
          activeOrInactive === "INACTIVE" ? "activate" : "inactivate"
        }
        menu={"Announcement"}
        named={chooseId?.annName}
        width={800}
      />

      {/* Modal Error */}
      {renderModal()}
    </LayoutMenu>
  );
};

export default AnnouncementPage;
