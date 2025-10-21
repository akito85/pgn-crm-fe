import React, { useRef, useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllCostCenter,
  activateCostCenter,
  getCostCenterDetail,
  downloadMasterCostCenter,
} from "../../../../../redux/slices/system_setup/master_data/master_cost_center";
import { Spin, Checkbox, Form, Tooltip } from "antd";
import BaseContainer from "../../../../../components/BaseContainer";
import BreadCrumb from "../../../../../components/BreadCrumb";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import ButtonComponent from "../../../../../components/ButtonComponent";
import { DownloadOutlined } from "@ant-design/icons";
import { NavLink, Link } from "react-router-dom";
import SVGIcon from "../../../../../assets/Icon/index";
import { SYSTEM_SETUP_ROUTES } from "../../../../../routes/system_setup/setup_routes";
import TablePagination from "../../../../../components/TablePagination";
import DetailCostCenter from "./DetailCostCenter";
import { renderColumn } from "../../../../../utils";
import Toolbar from "../../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../../components/ColumnActionPermission";
import { useTryAgainHooks } from "../../../../../utils/useTryAgainHooks";
import ModalApproveOrReject from "../../../../../components/Modal/ModalApproveOrReject";
import { getColumnSearchPropsPaging } from "../../../../../utils/getColumnSearchProps";

const CostCenter = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { data, loading, data_detail } = useSelector(
    (state) => state.master_cost_center,
  );
  const { bodyError } = useSelector((state) => state?.general);

  // use state
  const searchInput = useRef(null);
  const dataSource = data?.result;
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [costCenterId, setCostCenterId] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [search, setSearch] = useState({});
  const [sort, setSort] = useState("");
  const [activeOrInactive, setActiveOrInactive] = useState("");
  const [modalDetail, setModalDetail] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [body, setBody] = useState({});
  const [record, setRecord] = useState({});

  // handle fetch
  const handleFetch = useCallback(() => {
    dispatch(
      getAllCostCenter({
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize,
        sort,
      }),
    );
  }, [dispatch, page, pageSize, search, sort]);

  // use effect
  useEffect(() => {
    handleFetch();
  }, [handleFetch]);

  // handle search
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
      dataIndex: "key",
      align: "center",
      width: 60,
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "CODE",
      dataIndex: "code",
      align: "center",
      key: "code",
      // width: 250,
      sorter: true,
      ...getColumnSearchPropsPaging(
        "code",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
      render: (text) =>
        renderColumn(
          "code",
          searchedColumn,
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      title: "COST CENTER NAME",
      dataIndex: "name",
      align: "left",
      key: "name",
      width: 250,
      sorter: true,
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
          false,
          "input",
          search,
        ),
    },
    {
      title: "TYPE",
      dataIndex: "ccType",
      align: "center",
      key: "ccType",
      // width: 250,
      sorter: true,
      ...getColumnSearchPropsPaging(
        "ccType",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
      render: (text) =>
        renderColumn(
          "ccType",
          searchedColumn,
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      title: "VALUE NAME",
      dataIndex: "valName",
      align: "left",
      key: "valName",
      // width: 250,
      ellipsis: {
        showTitle: false,
      },
      sorter: true,
      ...getColumnSearchPropsPaging(
        "valName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
      render: (text) =>
        renderColumn(
          "valName",
          searchedColumn,
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      title: "VALUE CODE",
      dataIndex: "valCode",
      align: "center",
      key: "valCode",
      // width: 250,
      sorter: true,
      ...getColumnSearchPropsPaging(
        "valCode",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
      render: (text) =>
        renderColumn(
          "valCode",
          searchedColumn,
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      align: "left",
      key: "description",
      width: 300,
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
      align: "right",
      width: 100,
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

  // breadcrumb routes
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
      path: SYSTEM_SETUP_ROUTES.VIEW_COST_CENTER,
      breadcrumbName: "Cost Center",
    },
  ];

  // change pagination
  const handleChangePagin = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  // on click activation
  const onClick = (r) => {
    if (r?.status === "ACTIVE") {
      setActiveOrInactive("Inactivate");
    }
    if (r?.status === "INACTIVE") {
      setActiveOrInactive("Activate");
    }
    setModalConfirm(true);
    setCostCenterId(r?.ccId);
    setRecord(r);
  };

  // handle cancel modals
  const handleCancelModal = () => {
    setModalConfirm(false);
    setModalDetail(false);
    form.resetFields();
    handleCancelTryAgain();
    setRecord({});
  };

  // handle confirm activation
  const handleConfirm = async (formValue, handleCancel) => {
    try {
      const data = {
        id: costCenterId,
        remark: formValue?.remark,
        status: activeOrInactive,
      };
      setBody(body);
      handleCancel();
      handleCancelModal();
      await dispatch(activateCostCenter(data))?.unwrap();
      await handleFetch()?.unwrap();
    } catch (error) {
      await handleFetch()?.unwrap();
    }
  };

  // handle detail
  const handleDetail = async (id) => {
    try {
      setBody(id);
      await dispatch(getCostCenterDetail(id))?.unwrap();
      setModalDetail(true);
    } catch (error) {
      setModalDetail(false);
    }
  };

  // sorting
  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  // handle download
  const handleDownlaod = async () => {
    await dispatch(
      downloadMasterCostCenter({
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize,
        sort,
      }),
    )?.unwrap();
  };

  // handle retry modal error
  const handleRetry = () => {
    try {
      if (bodyError?.action === "ACTIVATE_COST_CENTER") {
        dispatch(activateCostCenter({ body: body }));
      } else if (bodyError?.action === "DOWNLOAD_MASTER_COST_CENTER") {
        handleDownlaod();
      } else {
        dispatch(getCostCenterDetail(body));
      }
      handleFetch();
      handleCancelModal();
    } catch (error) {
      handleFetch();
    }
  };

  const { renderModal, handleCancelTryAgain } = useTryAgainHooks(handleRetry);

  // item action
  const itemActions = [
    // toolbar items
    {
      action: "Download",
      render: (
        <ButtonComponent
          icon={<DownloadOutlined style={{ fontSize: "24px" }} />}
          type={"submit"}
          onClick={handleDownlaod}
        >
          Download List
        </ButtonComponent>
      ),
    },
    {
      action: "Create",
      render: (
        <NavLink to={SYSTEM_SETUP_ROUTES.CREATE_COST_CENTER}>
          <ButtonComponent
            icon={<SVGIcon name="IconButtonCreate" width={24} />}
            type="submit"
          >
            Create Cost Center
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
          <Tooltip title="Detail">
            <div
              onClick={() => {
                handleDetail(record?.ccId);
              }}
            >
              <SVGIcon name="IconDetail" width={24} />
            </div>
          </Tooltip>
        );
      },
    },
    {
      action: "Update",
      type: "table",
      render: (record, data_length) => {
        return (
          <Tooltip title="Update">
            <div
              className={`${record?.status?.toLowerCase() === "inactive" && "cursor-not-allowed"}`}
            >
              <Link
                to={
                  record?.status?.toLowerCase() !== "inactive" &&
                  SYSTEM_SETUP_ROUTES.UPDATE_COST_CENTER
                }
                state={
                  record?.status?.toLowerCase() !== "inactive" && {
                    id: record?.ccId,
                  }
                }
              >
                <div>
                  <SVGIcon
                    name="IconEdit"
                    className={`${record?.status?.toLowerCase() === "inactive" && "cursor-not-allowed"}`}
                    color={
                      record?.status?.toLowerCase() === "inactive"
                        ? "#8D91A0"
                        : "#ACC424"
                    }
                    width={24}
                  />
                </div>
              </Link>
            </div>
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
            title={record?.status === "ACTIVE" ? "Inactivate" : "Activate"}
          >
            <div>
              <Checkbox
                onClick={() => {
                  onClick(record);
                }}
                checked={record?.status !== "ACTIVE"}
              />
            </div>
          </Tooltip>
        );
      },
    },
  ];

  return (
    <LayoutMenu>
      <Spin spinning={loading} className="w-full top-20">
        <BreadCrumb routes={routes} />
        <Toolbar items={itemActions} />
        <BaseContainer header={"COST CENTER LIST"}>
          <div className={"w-full"}>
            <TablePagination
              dataSource={dataSource}
              columns={[
                ...columns,
                ...useColumnActionPermission(
                  ["view", "update", "activate"],
                  itemActions,
                ),
              ]}
              current={page}
              pageSize={pageSize}
              totalData={data?.page?.totalElements}
              onChange={handleChangePagin}
              onSort={onSort}
              tableScrolled={{ x: 1700, y: 525 }}
            />
          </div>
        </BaseContainer>
      </Spin>
      {/* Modal Detail */}
      <DetailCostCenter
        data={data_detail?.data}
        openModal={modalDetail}
        closeModal={handleCancelModal}
      />

      {/* Modal Active/Inactive */}
      <ModalApproveOrReject
        isOpen={modalConfirm}
        handleCloseModal={handleCancelModal}
        onFinish={handleConfirm}
        header={activeOrInactive === "INACTIVE" ? "activate" : "inactivate"}
        approveOrReject={
          activeOrInactive === "INACTIVE" ? "activate" : "inactivate"
        }
        menu={"Cost Center"}
        named={record?.name}
        width={800}
      />

      {/* modal try again */}
      {renderModal()}
    </LayoutMenu>
  );
};

export default CostCenter;
