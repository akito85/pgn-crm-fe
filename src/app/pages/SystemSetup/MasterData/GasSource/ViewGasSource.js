import React, { useState, useRef, useEffect } from "react";
import {
  DownloadOutlined,
  InfoCircleOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { Spin, Tooltip, Checkbox, Form, Alert } from "antd";
import { Link } from "react-router-dom";
import { getColumnSearchPropsPaging } from "../../../../../utils/getColumnSearchProps";
import Highlighter from "react-highlight-words";
import { NavLink } from "react-router-dom";
import BaseContainer from "../../../../../components/BaseContainer";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import TablePagination from "../../../../../components/TablePagination";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../routes/account_management/customer_account_routes";
import moment from "moment";
import SVGIcon from "../../../../../assets/Icon/index";
import {
  activeOrInactiveGasSource,
  downloadGasSource,
  getAllGasSourcePaginate,
} from "../../../../../redux/slices/account_management/MasterData/gasSourceSlice";
import { dateFormatting, formMessageRequired, renderColumn } from "../../../../../utils";
import { ModalError } from "../../../../../components/Modal/ModalPopUp";
import { clearBodyMessage } from "../../../../../redux/slices/general_slice";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import InputComponent from "../../../../../components/InputComponent";
import Toolbar from "../../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../../components/ColumnActionPermission";



// Column Approval Expand
const expandedRowRender = (record) => {
  const columns = (
    page = 1,
    pageSize = 10,
    searchInput,
    searchedColumn,
    searchText,
    handleSearch = () => { }
  ) => {
    return [
      {
        title: "NO",
        width: 60,
        align: "center",
        render: (text, object, index) => (page - 1) * pageSize + index + 1,
      },
      {
        title: "COST CENTER",
        dataIndex: "costCenter",
        sorter: true,
        ...getColumnSearchPropsPaging(
          "costCenter",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch
        ),
      },
      {
        title: "START DATE",
        dataIndex: "startDate",
        align: "center",
        sorter: true,
        ...getColumnSearchPropsPaging(
          "startDate",
          "date",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch
        ),
        render: (text) =>
          searchedColumn === "startDate" ? (
            <Highlighter
              highlightStyle={{
                backgroundColor: "#ffc069",
                padding: 0,
              }}
              searchWords={[
                searchText
                  ? moment(searchText, "YYYY-MM-DD").format("DD MMM YYYY")
                  : "",
              ]}
              autoEscape
              textToHighlight={text ? text.toString() : ""}
            />
          ) : (
            text || ""
          ),
      },
      {
        title: "END DATE",
        dataIndex: "endDate",
        align: "center",
        sorter: true,
        ...getColumnSearchPropsPaging(
          "endDate",
          "date",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch
        ),
        render: (endDate) => moment(endDate).format(dateFormatting.date),
      },
      {
        title: "DESCRIPTION",
        dataIndex: "description",
        sorter: true,
        ...getColumnSearchPropsPaging(
          "description",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch
        ),
        render: (description) => (
          <Tooltip placement="topLeft" title={description}>
            <p className="overflow-hidden truncate">{description}</p>
          </Tooltip>
        ),
      },
    ];
  };
  return (
    <div>
      <p className="text-primary text-xs font-bold uppercase pt-4">
        CRITERIA INFORMATION
      </p>
      <TablePagination
        useSelect={false}
        usePagination={false}
        dataSource={record?.criteria}
        columns={columns()}
        className={"mb-4"}
      />
    </div>
  );
};

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
  const [form] = Form.useForm();


  // Use Effect
  useEffect(() => {

    dispatch(getAllGasSourcePaginate({ search: encodeURIComponent(JSON.stringify(search)), sort, page, pageSize }));
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

  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
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
        dispatch(getAllGasSourcePaginate({ search: encodeURIComponent(JSON.stringify(search)), sort, page, pageSize }));
        form.resetFields()
      })
      .catch(() => {
        setRemark("");
        form.resetFields()
      });
  };

  // Handle Download
  const handleDownload = () => {
    dispatch(downloadGasSource({ search: encodeURIComponent(JSON.stringify(search)), sort, page, pageSize }));
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
      dispatch(activeOrInactiveGasSource({ body: setBodyRemark, activeOrInactive: setStatus }))
      dispatch(getAllGasSourcePaginate({ search: encodeURIComponent(JSON.stringify(search)), sort, page, pageSize }))
    } else {

      dispatch(getAllGasSourcePaginate({ search: encodeURIComponent(JSON.stringify(search)), sort, page, pageSize }))
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
    // setBodyError({});
  };

  // column
  const columns = (
    page = 1,
    pageSize = 10,
    searchInput,
    searchedColumn,
    searchText,
    handleSearch = () => { },
    handleActiveOrInactive = () => { }
  ) => {
    return [
      {
        title: "NO",
        width: 60,
        align: "center",
        render: (text, object, index) => (page - 1) * pageSize + index + 1,
      },
      {
        title: "CALORIE CODE",
        dataIndex: "calorieCode",
        sorter: true,
        ...getColumnSearchPropsPaging(
          "calorieCode",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch
        ),
        render: (text) => renderColumn('calorieCode', searchedColumn, searchText, text, false, 'input', search)
      },
      {
        title: "NAME",
        dataIndex: "name",
        sorter: true,
        ...getColumnSearchPropsPaging(
          "name",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch
        ),
        render: (text) => renderColumn('name', searchedColumn, searchText, text, false, 'input', search)
      },
      {
        title: "UOM",
        dataIndex: "uom",
        align: "center",
        sorter: true,
        ...getColumnSearchPropsPaging(
          "uom",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch
        ),
        render: (text) => renderColumn('uom', searchedColumn, searchText, text, false, 'input', search)
      },

      {
        title: "DESCRIPTION",
        dataIndex: "description",
        sorter: true,
        ...getColumnSearchPropsPaging(
          "description",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch
        ),
        ellipsis: {
          showTitle: false,
        },
        render: (text) => renderColumn('description', searchedColumn, searchText, text, true, 'input', search)
      },
      {
        title: "STATUS",
        dataIndex: "status",
        sorter: true,
        width: 120,
        fixed: 'right',
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
  };

  // item toolbar
  const itemActions = [
    //action toolbar
    {
      action: 'Download',
      render: (
        <ButtonComponent
          icon={<DownloadOutlined style={{ fontSize: "24px" }} />}
          type="submit"
          onClick={handleDownload}
        >
          Download List
        </ButtonComponent>

      )
    },
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
            <div className="pt-1">
              <Link
                to={ACCOUNT_MANAGEMENT_ROUTES.DETAIL_GAS_SOURCE}
                state={{ id: record.gasSourceId }}
              >
                <SVGIcon name="IconDetail" width={24} />
              </Link>
            </div>
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
            <div className={`pt-1 ${record?.status?.toLowerCase() === "inactive" && 'cursor-not-allowed'}`}>
              <Link
                to={record?.status?.toLowerCase() !== "inactive" && ACCOUNT_MANAGEMENT_ROUTES.UPDATE_GAS_SOURCE}
                state={record?.status?.toLowerCase() !== "inactive" && { id: record.gasSourceId }}
              >
                <SVGIcon name="IconEdit" width={24} className={`${record?.status?.toLowerCase() === "inactive" && 'cursor-not-allowed'}`}
                  color={record?.status?.toLowerCase() === 'inactive' ? "#8D91A0" : "#ACC424"} /> 
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
          <Tooltip
            title={record.status === "ACTIVE" ? "Inactivate" : "Activate"}
          >
            <div className="pt-1">
              <Checkbox
                onClick={() => {
                  handleActiveOrInactive(record);
                }}
                checked={record.status === "ACTIVE" ? false : true}
              />
            </div>
          </Tooltip>
        )
      }
    }
  ]

  return (
    <LayoutMenu>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />

        <Toolbar items={itemActions} />

        <BaseContainer header={"GAS SOURCE INFORMATION"}>
          <div className="w-full">
            <TablePagination
              dataSource={
                data?.result && data?.result.length === 0 ? null : dataTable
              }
              columns={[
                ...columns(
                  page,
                  pageSize,
                  searchInput,
                  searchedColumn,
                  searchText,
                  handleSearch,
                ),
                ...useColumnActionPermission(
                  ["Activate", "View", "Update"],
                  itemActions
                ),
              ]}
              current={page}
              pageSize={pageSize}
              onChange={handleChange}
              onSizeChanger={handleChange}
              onSort={onSort}
              totalData={data?.page?.totalElements}
              tableScrolled={{
                x: 1500,
                y: 500,
              }}
            />
          </div>
        </BaseContainer>

        {/* Modal Active/Inactive*/}
        <ModalCustom
          isOpen={modalActiveOrInactive}
          header={`${activeOrInactive} INFORMATION`}
          width={1000}
          type={"confirmation"}
          handleCancel={handleCancel}
          footer={
            <div className="w-full flex justify-end gap-5 px-[4px] pb-[10px]">
              <ButtonComponent
                onClick={handleCancel}
                type="default"
              >
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

      </Spin>
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
  );
};

export default ViewGasSource;
