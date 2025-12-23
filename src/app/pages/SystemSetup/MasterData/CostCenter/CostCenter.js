import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllCostCenter,
  activateCostCenter,
  getCostCenterDetail,
  downloadMasterCostCenter,
} from "../../../../../redux/slices/system_setup/master_data/master_cost_center";
import { Spin, Checkbox, Form, Tooltip } from "antd";
import BreadCrumb from "../../../../../components/BreadCrumb";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import ButtonComponent from "../../../../../components/ButtonComponent";
import { NavLink, Link } from "react-router-dom";
import SVGIcon from "../../../../../assets/Icon/index";
import { SYSTEM_SETUP_ROUTES } from "../../../../../routes/system_setup/setup_routes";
import DetailCostCenter from "./DetailCostCenter";
import { hasValue, renderColumn } from "../../../../../utils";
import Toolbar from "../../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../../components/ColumnActionPermission";
import { useTryAgainHooks } from "../../../../../utils/useTryAgainHooks";
import ModalApproveOrReject from "../../../../../components/Modal/ModalApproveOrReject";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../utils/getColumnSearchProps";
import TableRBI from "../../../../../components/TableRBI";
import { applyFixedColumns } from "../../../../../utils/applyFixedColumns";
import CardContainer from "../../../../../components/CardContainer";

const CostCenter = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { data, loading, data_detail } = useSelector(
    (state) => state.master_cost_center
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
  const [fixedColumns, setFixedColumns] = useState(() => ({
    left: ["no"],
    right: ["status", "action"],
  }));

  // handle fetch
  const handleFetch = useCallback(() => {
    dispatch(
      getAllCostCenter({
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize,
        sort,
      })
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

  // base columns
  const baseColumns = useMemo(
    () => [
      {
        key: "no",
        title: "NO",
        dataIndex: "key",
        align: "center",
        width: 60,
        render: (text, object, index) => (page - 1) * pageSize + index + 1,
      },
      {
        key: "code",
        title: "CODE",
        dataIndex: "code",
        align: "center",
        sorter: true,
        filteredValue: [search?.code] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "code",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "code",
            hasValue(search["code"]),
            searchText,
            text,
            false,
            "input",
            search
          ),
      },
      {
        key: "name",
        title: "COST CENTER NAME",
        dataIndex: "name",
        align: "left",
        width: 250,
        sorter: true,
        filteredValue: [search?.name] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
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
            hasValue(search["name"]),
            searchText,
            text,
            false,
            "input",
            search
          ),
      },
      {
        key: "ccType",
        title: "TYPE",
        dataIndex: "ccType",
        align: "center",
        sorter: true,
        filteredValue: [search?.ccType] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "ccType",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "ccType",
            hasValue(search["ccType"]),
            searchText,
            text,
            false,
            "input",
            search
          ),
      },
      {
        key: "valName",
        title: "VALUE NAME",
        dataIndex: "valName",
        align: "left",
        ellipsis: {
          showTitle: false,
        },
        sorter: true,
        filteredValue: [search?.valName] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "valName",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "valName",
            hasValue(search["valName"]),
            searchText,
            text,
            true,
            "input",
            search
          ),
      },
      {
        key: "valCode",
        title: "VALUE CODE",
        dataIndex: "valCode",
        align: "center",
        sorter: true,
        filteredValue: [search?.valCode] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "valCode",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "valCode",
            hasValue(search["valCode"]),
            searchText,
            text,
            false,
            "input",
            search
          ),
      },
      {
        key: "description",
        title: "DESCRIPTION",
        dataIndex: "description",
        align: "left",
        width: 300,
        sorter: true,
        ellipsis: {
          showTitle: false,
        },
        filteredValue: [search?.description] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "description",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "description",
            hasValue(search["description"]),
            searchText,
            text,
            true,
            "input",
            search
          ),
      },
      {
        key: "status",
        title: "STATUS",
        dataIndex: "status",
        align: "center",
        width: 100,
        sorter: true,
        filteredValue: [search?.status] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "status",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "status",
            hasValue(search["status"]),
            searchText,
            text,
            false,
            "status",
            search
          ),
      },
    ],
    [page, pageSize, search, searchText, searchedColumn]
  );

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
  const handleChangePage = (pageChange, pageSizeChange) => {
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
  const onSort = (_, __, sorter) => {
    const dataSort =
      sorter.order !== undefined
        ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  // handle download
  const handleDownload = () => {
    dispatch(
      downloadMasterCostCenter({
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize,
        sort,
      })
    );
  };

  // handle retry modal error
  const handleRetry = () => {
    try {
      if (bodyError?.action === "ACTIVATE_COST_CENTER") {
        dispatch(activateCostCenter({ body: body }));
      } else if (bodyError?.action === "DOWNLOAD_MASTER_COST_CENTER") {
        handleDownload();
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
              className={`${
                record?.status?.toLowerCase() === "inactive" &&
                "cursor-not-allowed"
              }`}
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
                    className={`${
                      record?.status?.toLowerCase() === "inactive" &&
                      "cursor-not-allowed"
                    }`}
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

  const actionCols = useColumnActionPermission(
    ["view", "update", "activate"],
    itemActions
  );

  const allColumns = useMemo(() => {
    const columnsWithKeys = [...baseColumns, ...actionCols].map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
    return columnsWithKeys;
  }, [baseColumns, actionCols]);

  const processedColumns = useMemo(() => {
    return applyFixedColumns(allColumns, fixedColumns);
  }, [allColumns, fixedColumns]);

  const columnDefinitions = useMemo(() => {
    return allColumns.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [allColumns]);

  return (
    <Spin spinning={loading}>
      <LayoutMenu>
        <BreadCrumb routes={routes} />

        <CardContainer
          header={
            <div className="flex -my-4 justify-between items-center">
              <p className="mt-[15px] font-bold">COST CENTER LIST</p>
              <div className="mt-[15px] flex gap-[20px]">
                <Toolbar items={itemActions} />
              </div>
            </div>
          }
        >
          <div className="my-0">
            <TableRBI
              dataSource={dataSource}
              columns={processedColumns}
              current={page}
              pageSize={pageSize}
              onChange={handleChangePage}
              onSizeChanger={handleChangePage}
              totalData={data?.page?.totalElements || 0}
              tableScrolled={{ x: 1700, y: 525 }}
              onSort={onSort}
              columnDefinitions={columnDefinitions}
              handleDownload={handleDownload}
              fixedColumns={fixedColumns}
              setFixedColumns={setFixedColumns}
              loading={loading}
            />
          </div>
        </CardContainer>

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
    </Spin>
  );
};

export default CostCenter;
