import React, { useEffect, useRef, useState } from "react";
import { Spin, Tooltip } from "antd";
import { Link, NavLink } from "react-router-dom";
import BreadCrumb from "../../../../../components/BreadCrumb";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../routes/account_management/customer_account_routes";
import ButtonComponent from "../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../assets/Icon/index";
import BaseContainer from "../../../../../components/BaseContainer";
import TablePagination from "../../../../../components/TablePagination";
import { useDispatch, useSelector } from "react-redux";
import { downloadAccountOneTime, getAllAccountOneTimePaginate } from "../../../../../redux/slices/account_management/Account/accountSlice";
import { columnsAccountOneTime } from "./TableAccountOneTime";
import { useColumnActionPermission } from "../../../../../components/ColumnActionPermission";
import Toolbar from "../../../../../components/Toolbar";

const AccountOnetime = () => {
  // Selector
  const { data_accountOneTime, loading } = useSelector(
    (state) => state.account
  );

  // Declaration
  const dispatch = useDispatch();
  const searchInput = useRef(null);

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});

  // Use Effect
  useEffect(() => {
    const reqSearch = encodeURIComponent(JSON.stringify(search));
    dispatch(getAllAccountOneTimePaginate({ page, pageSize, sort, search: reqSearch }));
  }, [page, pageSize, sort, search, dispatch]);

  // Breadcrumbs
  const routes = [
    {
      path: "",
      breadcrumbName: "Account Management",
    },
    {
      path: ACCOUNT_MANAGEMENT_ROUTES.VIEW_ACCOUNT_ONETIME,
      breadcrumbName: "Account - One Time",
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
    dispatch(downloadAccountOneTime({ page, pageSize, sort, search: tempSearch }));
  };


  const itemActions = [
    //action toolbar
    {
      action: 'Download',
      render: (
        <ButtonComponent
          icon={<SVGIcon name="IconButtonDownload" width={24} />}
          type="submit"
          onClick={handleDownload}
        >
          Download List
        </ButtonComponent>
      )
    },
    // {
    //   action: 'Upload',
    //   render: (
    //     <NavLink to={ACCOUNT_MANAGEMENT_ROUTES.UPLOAD_GAS_SOURCE}>
    //       <ButtonComponent
    //         icon={<UploadOutlined style={{ fontSize: "24px" }} />}
    //         type="submit"
    //       >
    //         Upload
    //       </ButtonComponent>
    //     </NavLink>

    //   )
    // },
    {
      action: 'Create',
      render: (
        <NavLink to={ACCOUNT_MANAGEMENT_ROUTES.CREATE_ACCOUNT_ONETIME}>
          <ButtonComponent
            icon={<SVGIcon name="IconButtonCreate" width={24} />}
            type="submit"
          >
            Create Account One Time
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
              to={ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_ONETIME}
              state={{ idAccount: record?.accountId, idCustomer: record?.customerId }}
            >
              <SVGIcon name="IconDetail" width={24} />
            </Link>
          </Tooltip>
        )
      }
    },

  ]
  return (
    <LayoutMenu>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />

        <Toolbar items={itemActions}/>

        {/* <div className="w-full flex justify-end gap-[20px]">
          <ButtonComponent
            icon={<SVGIcon name="IconButtonDownload" width={24} />}
            type="submit"
            onClick={handleDownload}
          >
            Download List
          </ButtonComponent>

          <NavLink to={ACCOUNT_MANAGEMENT_ROUTES.CREATE_ACCOUNT_ONETIME}>
            <ButtonComponent
              icon={<SVGIcon name="IconButtonCreate" width={24} />}
              type="submit"
            >
              Create Account One Time
            </ButtonComponent>
          </NavLink>
        </div> */}

        <BaseContainer header={"ACCOUNT - ONE TIME LIST"}>
          <div className="w-full">
            <TablePagination
              dataSource={data_accountOneTime?.result}
              columns={[
                ...columnsAccountOneTime(
                  page,
                  pageSize,
                  searchInput,
                  searchedColumn,
                  searchText,
                  handleSearch
                ),
                ...useColumnActionPermission(
                  ["Activate", "View", "Update"],
                  itemActions
                )
              ]}
              current={page}
              pageSize={pageSize}
              onChange={handleChange}
              onShowSizeChange={handleChange}
              onSort={onSort}
              totalData={data_accountOneTime?.page?.totalElements}
              tableScrolled={{
                x: 9000,
                y: 500,
              }}
            />
          </div>
        </BaseContainer>
      </Spin>
    </LayoutMenu>
  );
};

export default AccountOnetime;
