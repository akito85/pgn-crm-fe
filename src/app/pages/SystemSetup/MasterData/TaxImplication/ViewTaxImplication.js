import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {  Checkbox, Form, Spin, Tooltip } from "antd";
import { Link, NavLink } from "react-router-dom";
import { DownloadOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";

import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../routes/account_management/customer_account_routes";
import BaseContainer from "../../../../../components/BaseContainer";
import SVGIcon from "../../../../../assets/Icon/index";
import { getColumnSearchPropsPaging } from "../../../../../utils/getColumnSearchProps";
import TablePaginationNew from "../../../../../components/TablePaginationNew";
import {
  ModalError,
} from "../../../../../components/Modal/ModalPopUp";
import { IconModal } from "../../../../../utils/Icon";
import {
  activeInactiveTaxImplication,
  downloadTaxImplication,
  getTaxImplicationPaginate,
} from "../../../../../redux/slices/account_management/MasterData/tax_implication";
import { toTitleCase, renderColumn } from '../../../../../utils';
import StatusComponent from "../../../../../components/StatusComponent";
import ModalApproveOrReject from "../../../../../components/Modal/ModalApproveOrReject";
import { getGrantedAccessAccount } from "../../../../../redux/slices/account_management/accountManagement";
import ToolbarAccount from "../../../AccountManagement/ComponentAccount/ToolbarAccount";
import { useColumnActionPermissionAccount } from "../../../AccountManagement/ComponentAccount/ColumnActionPermissionAccount";
// columns
const columns = (
  search,
  page,
  pageSize,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  handleActiveOrInactive = () => {}
) => {
  return [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "TAX IMPLICATION NAME",
      dataIndex: "taxImplicationName",
      width: 240,
      sorter: true,
      ...getColumnSearchPropsPaging(
        "taxImplicationName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "CATEGORY",
      dataIndex: "category",
      width: 240,
      sorter: true,
      ...getColumnSearchPropsPaging(
        "category",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "SERVICE TYPE",
      dataIndex: "serviceType",
      width: 240,
      sorter: true,
      ...getColumnSearchPropsPaging(
        "serviceType",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "TRANSACTION CODE",
      dataIndex: "transCodeName",
      width: 240,
      align: "right",
      sorter: true,
      ...getColumnSearchPropsPaging(
        "transCodeName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "CRITERIA",
      dataIndex: "criteria",
      align: "left",
      width: 240,
      sorter: true,
      ellipsis: {
        showTitle:false
      },
      ...getColumnSearchPropsPaging(
        "criteria",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => renderColumn('criteria', searchedColumn, searchText, text, true, 'input', search)
    },
    {
      title: "IMPLICATION TYPE",
      dataIndex: "implicationType",
      width: 240,
      sorter: true,
      ...getColumnSearchPropsPaging(
        "implicationType",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => renderColumn('implicationType', searchedColumn, searchText, text, false, 'input', search)
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      width: 240,
      sorter: true,
      ellipsis: {
        showTitle: false
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
      width: 150,
      sorter: true,
      fixed: "right",
      ...getColumnSearchPropsPaging(
        "status",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (index) => (
        <div className={" flex justify-center"}>
          <StatusComponent colour={index}>{toTitleCase(index)}</StatusComponent>
        </div>
      ),
    },
  ];
};

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
  const { access_account } = useSelector((state) => state.accountManagement);
	const filteredArray = {
		actionList: access_account?.actionList?.filter(action => 
			action.path.includes("/system-setup/tax-implication/") &&
			!action.path.includes("/system-setup/tax-implication-rule/")
		)
	}

  const dispatch = useDispatch();
  const [formModalInactive] = Form.useForm();
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
    dispatch(getGrantedAccessAccount('/system-setup/tax-implication'))
  }, [dispatch])

  // use effect
  useEffect(() => {
    const reqSearch = encodeURIComponent(JSON.stringify(search))
    dispatch(
      getTaxImplicationPaginate({ search: reqSearch, sort, page, pageSize })
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
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const openActiveModal = (data) => {
    setDataActivate(data);
    setModalActive(true);
  };

  {/* ACTION ACTIVE/INACTIVE */}
  const handleOk = (formValue, handleClear) => {
    const body = {
      taxImplicationId: dataActivate.id,
      remark: formValue.remark
    };
    const activeOrInactive =
    dataActivate.status === "ACTIVE" ? "inactivate" : "activate";
    dispatch(activeInactiveTaxImplication({ body, activeOrInactive }))
      .unwrap()
      .then(() => {
        handleClear()
        setDataActivate({});
        setModalActive(false);
        const reqSearch = encodeURIComponent(JSON.stringify(search))
        dispatch(
          getTaxImplicationPaginate({ search: reqSearch, sort, page, pageSize })
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
    formModalInactive.resetFields();
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
    dispatch(downloadTaxImplication({ search: encodeURIComponent(JSON.stringify(search)), sort, page, pageSize }));
  };

  const handleClose = () => {
    setModalActive(false);
  };

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
        <NavLink to={""}>
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
              <div className="pt-1">
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
            {record?.status === "INACTIVE" ? (
              <div className={"cursor-not-allowed pt-1"}>
                <SVGIcon
                  name="IconEdit"
                  width={24}
                  color={"#C0BEC6"}
                  className={"cursor-not-allowed"}
                />
              </div>
            ) : (
              <Link
                to={ACCOUNT_MANAGEMENT_ROUTES.UPDATE_TAX_IMPLICATION}
                state={{ id: record?.id }}
              >
                <div className="pt-1">
                  <SVGIcon name="IconEdit" width={24} />
                </div>
              </Link>
            )}
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
                  openActiveModal(record);
                }}
                checked={record?.status === "INACTIVE"}
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
        <ToolbarAccount items={itemActions} advancedAccess={filteredArray}/>
        <BaseContainer header={"Tax Implication List"}>
          <div className="w-full">
            <TablePaginationNew
              dataSource={data?.result}
              columns={[
                ...columns(
                  search,
                  page,
                  pageSize,
                  searchInput,
                  searchedColumn,
                  searchText,
                  handleSearch,
                  openActiveModal
                ),
                ...useColumnActionPermissionAccount(
                  ["Activate", "View", "Update"],
                  itemActions,
                  filteredArray
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

        <ModalApproveOrReject
          isOpen={modalActive}
          handleCloseModal={handleClose}
          onFinish={handleOk}
          header={`${dataActivate?.status === "ACTIVE" ? "Inactivate" : "Activate"}`}
          approveOrReject={`${dataActivate?.status === "ACTIVE" ? "Inactivate" : "Activate"}`}
          menu={"Tax Implication"}
          named={dataActivate?.taxImplicationName}
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

      </Spin>
    </LayoutMenu>
  );
};

export default ViewTaxImplication;
