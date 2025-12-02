import { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Checkbox, Form, Spin, Tooltip } from "antd";
import { Link, NavLink } from "react-router-dom";
import { InfoCircleOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";

import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../routes/account_management/customer_account_routes";
import SVGIcon from "../../../../../assets/Icon/index";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../utils/getColumnSearchProps";
import { ModalError } from "../../../../../components/Modal/ModalPopUp";
import {
  activeInactiveTaxImplication,
  downloadTaxImplication,
  getTaxImplicationPaginate,
} from "../../../../../redux/slices/account_management/MasterData/tax_implication";
import { formMessageRequired, hasValue, renderColumn } from "../../../../../utils";
import { clearBodyMessage } from '../../../../../redux/slices/general_slice';
import { useColumnActionPermission } from '../../../../../components/ColumnActionPermission';
import Toolbar from '../../../../../components/Toolbar';
import TableRBI from '../../../../../components/TableRBI';
import { applyFixedColumns } from '../../../../../utils/applyFixedColumns';
import CardContainer from '../../../../../components/CardContainer';
import ModalCustom from '../../../../../components/Modal/ModalCustom';
import InputComponent from '../../../../../components/InputComponent';

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
    breadcrumbName: "Tax Implication",
  },
];

const ViewTaxImplication = () => {
  const { data, loading } = useSelector((state) => state.tax_implication);
  const { bodyError } = useSelector((state) => state?.general);
  const dispatch = useDispatch();

  // Use State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [openModalActivation, setOpenModalActivation] = useState(false);
  const [typeStatus, setTypeStatus] = useState('');
  const [taxImplicationId, setTaxImplicationId] = useState(null);
  const [taxImplicationName, setTaxImplicationName] = useState('');
  const [modalError, setModalError] = useState(false);
  const [fixedColumns, setFixedColumns] = useState(() => ({
    left: ["no"],
    right: ["status", "action"],
  }));
  const searchInput = useRef(null);
  const [form] = Form.useForm();

  // use effect
  useEffect(() => {
    const reqSearch = encodeURIComponent(JSON.stringify(search));
    dispatch(getTaxImplicationPaginate({ search: reqSearch, sort, page, pageSize }));
  }, [dispatch, page, pageSize, search, sort]);

  // trigger modal try again
  useEffect(() => {
    if (bodyError?.response?.data?.code === 500) {
      setModalError(true);
    }
  }, [bodyError]);

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

  // handle activation
  const handleActiveOrInactive = (record) => {
    setOpenModalActivation(true);
    setTypeStatus(record?.status);
    setTaxImplicationId(record?.id);
    setTaxImplicationName(record?.taxImplicationName);
  };

  // handle cancel modal
  const handleCancel = () => {
    setOpenModalActivation(false);
    form.resetFields();
  };

  // handle save activation
  const handleSaveActivation = async (formValue) => {
    const body = {
      ...formValue,
      taxImplicationId: taxImplicationId
    };
    const activeOrInactive = typeStatus === "ACTIVE" ? "inactivate" : "activate";
    await dispatch(activeInactiveTaxImplication({ body, activeOrInactive })).unwrap();
    setOpenModalActivation(false);
    const reqSearch = encodeURIComponent(JSON.stringify(search));
    await dispatch(getTaxImplicationPaginate({ page, pageSize, sort, search: reqSearch })).unwrap();
    form.resetFields();
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
      key: "taxImplicationName",
      title: "TAX IMPLICATION NAME",
      dataIndex: "taxImplicationName",
      sorter: true,
      width: 240,
      filteredValue: [search?.taxImplicationName] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "taxImplicationName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) => renderColumn(
        'taxImplicationName',
        hasValue(search["taxImplicationName"]),
        searchText,
        text,
        false,
        'input',
        search
      )
    },
    {
      key: "category",
      title: "CATEGORY",
      dataIndex: "category",
      sorter: true,
      width: 240,
      filteredValue: [search?.category] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "category",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) => renderColumn(
        'category',
        hasValue(search["category"]),
        searchText,
        text,
        false,
        'input',
        search
      )
    },
    {
      key: "serviceType",
      title: "SERVICE TYPE",
      dataIndex: "serviceType",
      sorter: true,
      width: 240,
      filteredValue: [search?.serviceType] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "serviceType",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) => renderColumn(
        'serviceType',
        hasValue(search["serviceType"]),
        searchText,
        text,
        false,
        'input',
        search
      )
    },
    {
      key: "transCodeName",
      title: "TRANSACTION CODE",
      dataIndex: "transCodeName",
      align: "right",
      sorter: true,
      width: 240,
      filteredValue: [search?.transCodeName] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "transCodeName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) => renderColumn(
        'transCodeName',
        hasValue(search["transCodeName"]),
        searchText,
        text,
        false,
        'input',
        search
      )
    },
    {
      key: "criteria",
      title: "CRITERIA",
      dataIndex: "criteria",
      align: "left",
      sorter: true,
      width: 240,
      ellipsis: {
        showTitle: false,
      },
      filteredValue: [search?.criteria] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "criteria",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) => renderColumn(
        'criteria',
        hasValue(search["criteria"]),
        searchText,
        text,
        true,
        'input',
        search
      )
    },
    {
      key: "implicationType",
      title: "IMPLICATION TYPE",
      dataIndex: "implicationType",
      sorter: true,
      width: 240,
      filteredValue: [search?.implicationType] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "implicationType",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) => renderColumn(
        'implicationType',
        hasValue(search["implicationType"]),
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
      width: 240,
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

  const handleChangePage = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  // onsort
  const onSort = (_, __, sorter) => {
    const dataSort =
      sorter.order !== undefined
        ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  // handle download
  const handleDownload = () => {
    const reqSearch = encodeURIComponent(JSON.stringify(search));
    dispatch(downloadTaxImplication({ search: reqSearch, sort, page, pageSize }));
  };

  // handle confirm retry
  const handleConfirm = () => {
    if (bodyError?.action === "GET_TAX_IMPLICATION_PAGINATE") {
      const reqSearch = encodeURIComponent(JSON.stringify(search));
      dispatch(getTaxImplicationPaginate({ search: reqSearch, sort, page, pageSize }));
    } else if (bodyError?.action === "DOWNLOAD_TAX_IMPLICATION") {
      handleDownload();
    } else {
      handleSaveActivation();
    }
    dispatch(clearBodyMessage());
  };

  // handle retry
  const handleRetry = () => {
    handleConfirm();
    setModalError(false);
    dispatch(clearBodyMessage());
  };

  // handle close modal
  const handleCloseModalError = () => {
    setModalError(false);
    dispatch(clearBodyMessage());
  };

  const itemActions = [
    //action toolbar
    {
      action: 'Upload',
      render: (
        <NavLink to={ACCOUNT_MANAGEMENT_ROUTES.UPLOAD_TAX_IMPLICATION}>
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
        <NavLink to={ACCOUNT_MANAGEMENT_ROUTES.CREATE_TAX_IMPLICATION}>
          <ButtonComponent
            icon={<PlusOutlined style={{ fontSize: "24px" }} />}
            type="submit"
          >
            Create Tax Implication
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
              to={ACCOUNT_MANAGEMENT_ROUTES.DETAIL_TAX_IMPLICATION}
              state={{ id: record?.id }}
            >
              <div>
                <SVGIcon name="IconDetail" width={24} />
              </div>
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
            {record?.status === "INACTIVE" ?
              <div className={"cursor-not-allowed"}>
                <SVGIcon name="IconEdit" width={24} color={"#C0BEC6"} className={"cursor-not-allowed"} />
              </div>
              :
              <Link
                to={ACCOUNT_MANAGEMENT_ROUTES.UPDATE_TAX_IMPLICATION}
                state={{ id: record?.id }}
              >
                <div>
                  <SVGIcon name="IconEdit" width={24} />
                </div>
              </Link>
            }
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
                onClick={() => { handleActiveOrInactive(record) }}
                checked={record?.status === "ACTIVE" ? false : true}
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
              <p className="mt-[15px] font-bold">TAX IMPLICATION LIST</p>
              <div className="mt-[15px] flex gap-[20px]">
                <Toolbar items={itemActions} />
              </div>
            </div>
          }
        >
          <div className="my-5">
            <TableRBI
              dataSource={data?.result}
              columns={processedColumns}
              current={page}
              pageSize={pageSize}
              onChange={handleChangePage}
              onSizeChanger={handleChangePage}
              totalData={data?.page?.totalElements || 0}
              tableScrolled={{ x: 2000, y: 525 }}
              onSort={onSort}
              columnDefinitions={columnDefinitions}
              handleDownload={handleDownload}
              fixedColumns={fixedColumns}
              setFixedColumns={setFixedColumns}
              loading={loading}
            />
          </div>
        </CardContainer>

        <ModalCustom
          isOpen={openModalActivation}
          header={`${typeStatus === "ACTIVE" ? "INACTIVATE" : "ACTIVATE"} INFORMATION`}
          width={700}
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
            onFinish={handleSaveActivation}
            layout='vertical'
          >
            <div className="flex flex-col gap-6">
              <Alert
                message={`Are you sure want to ${typeStatus === "ACTIVE" ? "inactivate" : "activate"} tax implication named ${taxImplicationName}?`}
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

export default ViewTaxImplication;