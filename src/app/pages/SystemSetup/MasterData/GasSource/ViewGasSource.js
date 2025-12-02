import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  InfoCircleOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { Spin, Tooltip, Checkbox, Form, Alert } from "antd";
import { Link } from "react-router-dom";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../utils/getColumnSearchProps";
import { NavLink } from "react-router-dom";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../routes/account_management/customer_account_routes";
import SVGIcon from "../../../../../assets/Icon/index";
import {
  activeOrInactiveGasSource,
  downloadGasSource,
  getAllGasSourcePaginate,
} from "../../../../../redux/slices/account_management/MasterData/gasSourceSlice";
import { formMessageRequired, hasValue, renderColumn } from "../../../../../utils";
import { ModalError } from "../../../../../components/Modal/ModalPopUp";
import { clearBodyMessage } from "../../../../../redux/slices/general_slice";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import InputComponent from "../../../../../components/InputComponent";
import Toolbar from "../../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../../components/ColumnActionPermission";
import TableRBI from "../../../../../components/TableRBI";
import { applyFixedColumns } from "../../../../../utils/applyFixedColumns";
import CardContainer from "../../../../../components/CardContainer";

const ViewGasSource = () => {
  // Selector
  const { data, loading } = useSelector((state) => state.gasSource);
  const { bodyError } = useSelector(state => state?.general);
  
  // Declaration
  const searchInput = useRef(null);
  const dispatch = useDispatch();
  const dataSource = data?.result;

  // Use State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [remark, setRemark] = useState("");
  const [activeOrInactive, setActiveOrInactive] = useState();
  const [modalActiveOrInactive, setModalActiveOrInactive] = useState(false);
  const [dataTable, setDataTable] = useState([]);
  const [chooseId, setChooseId] = useState();
  const [modalError, setModalError] = useState(false);
  const [calorieName, setCalorieName] = useState('');
  const [fixedColumns, setFixedColumns] = useState(() => ({
    left: ["no"],
    right: ["status", "action"],
  }));
  const [form] = Form.useForm();

  // Use Effect
  useEffect(() => {
    dispatch(getAllGasSourcePaginate({ 
      search: encodeURIComponent(JSON.stringify(search)), 
      sort, 
      page, 
      pageSize 
    }));
  }, [search, sort, page, pageSize, dispatch]);

  useEffect(() => {
    if (dataSource && dataSource.length > 0) {
      const data = dataSource?.map((a, index) => ({
        ...a,
        key: index + 1,
        criteria: a.criteria.map((b, index) => ({
          ...b,
          key: index + 1,
        })),
      }));
      setDataTable(data);
    }
  }, [data]);

  // trigger modal try again
  useEffect(() => {
    if (bodyError?.response?.data?.code === 500) {
      setModalError(true)
    }
  }, [bodyError]);

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
      path: ACCOUNT_MANAGEMENT_ROUTES.VIEW_GAS_SOURCE,
      breadcrumbName: "Gas Source",
    },
  ];

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

  const handleChangePage = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  const onSort = (_, __, sorter) => {
    const dataSort =
      sorter.order !== undefined
        ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  // Handle Cancel Modal Active/Inactive
  const handleCancel = () => {
    setModalActiveOrInactive(false);
    setRemark("");
  };

  // Handle Confirm Modal Active/Inactive
  const handleConfirm = () => {
    setModalActiveOrInactive(false);

    const data = {
      gasSourceId: chooseId,
      description: remark,
    };

    dispatch(
      activeOrInactiveGasSource({
        body: data,
        activeOrInactive: activeOrInactive,
      })
    )
      .unwrap()
      .then(() => {
        setRemark("");
        dispatch(getAllGasSourcePaginate({ 
          search: encodeURIComponent(JSON.stringify(search)), 
          sort, 
          page, 
          pageSize 
        }));
        form.resetFields()
      })
      .catch(() => {
        setRemark("");
        form.resetFields()
      });
  };

  // Handle Download
  const handleDownload = () => {
    dispatch(downloadGasSource({ 
      search: encodeURIComponent(JSON.stringify(search)), 
      sort, 
      page, 
      pageSize 
    }));
  };

  // Handle Confirmation Active/Inactive
  const handleActiveOrInactive = (record) => {
    setModalActiveOrInactive(true);
    setActiveOrInactive(
      record?.status === "ACTIVE" ? "Inactivate" : "Activate"
    );
    setChooseId(record?.gasSourceId);
    setCalorieName(record?.name);
  };

  // handle confirm try
  const handleConfirmRetry = () => {
    if (bodyError?.action === "ACTIVE_OR_INACTIVE_GAS_SOURCE") {
      const setBodyRemark = {
        gasSourceDetailId: chooseId,
        remark: remark,
      }
      const setStatus = {
        activeOrInactive: activeOrInactive,
      }
      dispatch(activeOrInactiveGasSource({ 
        body: setBodyRemark, 
        activeOrInactive: setStatus 
      }))
      dispatch(getAllGasSourcePaginate({ 
        search: encodeURIComponent(JSON.stringify(search)), 
        sort, 
        page, 
        pageSize 
      }))
    } else {
      dispatch(getAllGasSourcePaginate({ 
        search: encodeURIComponent(JSON.stringify(search)), 
        sort, 
        page, 
        pageSize 
      }))
    }
    dispatch(clearBodyMessage());
  }

  // handle retry
  const handleRetry = () => {
    handleConfirmRetry()
    setModalError(false);
    dispatch(clearBodyMessage());
  };

  // handle close modal
  const handleCloseModalError = () => {
    setModalError(false);
    dispatch(clearBodyMessage());
  };

  // base columns with useMemo
  const baseColumns = useMemo(() => [
    {
      key: "no",
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      key: "calorieCode",
      title: "CALORIE CODE",
      dataIndex: "calorieCode",
      sorter: true,
      filteredValue: [search?.calorieCode] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "calorieCode",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) => renderColumn(
        'calorieCode', 
        hasValue(search["calorieCode"]), 
        searchText, 
        text, 
        false, 
        'input', 
        search
      )
    },
    {
      key: "name",
      title: "NAME",
      dataIndex: "name",
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
      render: (text) => renderColumn(
        'name', 
        hasValue(search["name"]), 
        searchText, 
        text, 
        false, 
        'input', 
        search
      )
    },
    {
      key: "uom",
      title: "UOM",
      dataIndex: "uom",
      align: "center",
      sorter: true,
      filteredValue: [search?.uom] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "uom",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) => renderColumn(
        'uom', 
        hasValue(search["uom"]), 
        searchText, 
        text, 
        false, 
        'input', 
        search
      )
    },
    {
      key: "description",
      title: "DESCRIPTION",
      dataIndex: "description",
      sorter: true,
      filteredValue: [search?.description] || null,
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "description",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) => renderColumn(
        'description', 
        hasValue(search["description"]), 
        searchText, 
        text, 
        true, 
        'input', 
        search
      )
    },
    {
      key: "status",
      title: "STATUS",
      dataIndex: "status",
      sorter: true,
      width: 120,
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
      render: (text) => renderColumn(
        'status', 
        hasValue(search["status"]), 
        searchText, 
        text, 
        false, 
        'status', 
        search
      )
    },
  ], [page, pageSize, search, searchText, searchedColumn]);

  // item toolbar
  const itemActions = [
    //action toolbar
    {
      action: 'Upload',
      render: (
        <NavLink to={ACCOUNT_MANAGEMENT_ROUTES.UPLOAD_GAS_SOURCE}>
          <ButtonComponent
            icon={<UploadOutlined style={{ fontSize: "24px" }} />}
            type="submit"
          >
            Upload
          </ButtonComponent>
        </NavLink>
      )
    },
    {
      action: 'Create',
      render: (
        <NavLink to={ACCOUNT_MANAGEMENT_ROUTES.CREATE_GAS_SOURCE}>
          <ButtonComponent
            icon={<PlusOutlined style={{ fontSize: "24px" }} />}
            type="submit"
          >
            Create Gas Source
          </ButtonComponent>
        </NavLink>
      )
    },

    // Column Action Table
    {
      action: "View",
      type: "table",
      render: (record, data) => {
        return (
          <Tooltip title="Detail">
            <Link
              to={ACCOUNT_MANAGEMENT_ROUTES.DETAIL_GAS_SOURCE}
              state={{ id: record.gasSourceId }}
            >
              <SVGIcon name="IconDetail" width={24} />
            </Link>
          </Tooltip>
        )
      }
    },
    {
      action: "Update",
      type: "table",
      render: (record, data) => {
        return (
          <Tooltip title="Update">
            <div className={`${record?.status?.toLowerCase() === "inactive" && 'cursor-not-allowed'}`}>
              <Link
                to={record?.status?.toLowerCase() !== "inactive" && ACCOUNT_MANAGEMENT_ROUTES.UPDATE_GAS_SOURCE}
                state={record?.status?.toLowerCase() !== "inactive" && { id: record.gasSourceId }}
              >
                <SVGIcon 
                  name="IconEdit" 
                  width={24} 
                  className={`${record?.status?.toLowerCase() === "inactive" && 'cursor-not-allowed'}`}
                  color={record?.status?.toLowerCase() === 'inactive' ? "#8D91A0" : "#ACC424"} 
                /> 
              </Link>
            </div>
          </Tooltip>
        )
      }
    },
    {
      action: "Activate",
      type: "table",
      render: (record, data) => {
        return (
          <Tooltip title={record.status === "ACTIVE" ? "Inactivate" : "Activate"}>
            <div>
              <Checkbox
                onClick={() => { handleActiveOrInactive(record); }}
                checked={record.status === "ACTIVE" ? false : true}
              />
            </div>
          </Tooltip>
        )
      }
    }
  ];

  const actionCols = useColumnActionPermission(
    ["Activate", "View", "Update"],
    itemActions
  );

  const allColumns = useMemo(() => {
    const columnsWithKeys = [...baseColumns, ...actionCols].map(
      (col) => ({
        ...col,
        key: col.key || col.dataIndex || col.title,
      })
    );
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
              <p className="mt-[15px] font-bold">GAS SOURCE INFORMATION</p>
              <div className="mt-[15px] flex gap-[20px]">
                <Toolbar items={itemActions} />
              </div>
            </div>
          }
        >
          <div className="my-5">
            <TableRBI
              dataSource={data?.result && data?.result.length === 0 ? null : dataTable}
              columns={processedColumns}
              current={page}
              pageSize={pageSize}
              onChange={handleChangePage}
              onSizeChanger={handleChangePage}
              totalData={data?.page?.totalElements || 0}
              tableScrolled={{ x: 1500, y: 525 }}
              onSort={onSort}
              columnDefinitions={columnDefinitions}
              handleDownload={handleDownload}
              fixedColumns={fixedColumns}
              setFixedColumns={setFixedColumns}
              loading={loading}
            />
          </div>
        </CardContainer>

        {/* Modal Active/Inactive*/}
        <ModalCustom
          isOpen={modalActiveOrInactive}
          header={`${activeOrInactive} INFORMATION`}
          width={1000}
          type={"confirmation"}
          handleCancel={handleCancel}
          footer={
            <div className="w-full flex justify-end gap-5 px-[4px] pb-[10px]">
              <ButtonComponent onClick={handleCancel} type="default">
                Cancel
              </ButtonComponent>
              <ButtonComponent
                form="inactivateForm"
                type="submit"
                htmlType="submit"
              >
                Confirm
              </ButtonComponent>
            </div>
          }
        >
          <Form
            id="inactivateForm"
            form={form}
            onFinish={handleConfirm}
            layout='vertical'
          >
            <div className="flex flex-col gap-6">
              <Alert
                message={`Are you sure want to ${activeOrInactive} Gas Source named ${calorieName}?`}
                icon={<InfoCircleOutlined />}
                type={"warning"}
                showIcon
                className="inactivate-alert"
              />
              <Form.Item
                name={"remark"}
                label={'Remark'}
                rules={formMessageRequired("remark")}
                className="w-full"
              >
                <InputComponent
                  group
                  rows={1}
                  type="textarea"
                  placeholder={"Type your remark"}
                />
              </Form.Item>
            </div>
          </Form>
        </ModalCustom>

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
            <p className="pl-[70px]">{bodyError?.response?.data?.message?.toString()}</p>
            <p className="pl-[70px]">Please try again.</p>
          </div>
        </ModalError>
      </LayoutMenu>
    </Spin>
  );
};

export default ViewGasSource;