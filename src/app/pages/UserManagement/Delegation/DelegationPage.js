import { Spin, Tooltip } from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import { USER_ROUTES } from "../../../../routes/user_management/user_routes";
import BaseContainer from "../../../../components/BaseContainer";
import BreadCrumb from "../../../../components/BreadCrumb";
import ButtonComponent from "../../../../components/ButtonComponent";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import RadioTabs from "../../../../components/RadioTabs";
import TablePagination from "../../../../components/TablePagination";
import SVGIcon from "../../../../assets/Icon/index";
import { getDelegationList } from "../../../../redux/slices/user_management/delegation";
import { approvalDelegation } from "./Table/TableApprovalDelegation";
import { delegationRequest } from "./Table/TableDelegationRequest";
import Toolbar from "../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";
import { useTryAgainHooks } from "../../../../utils/useTryAgainHooks";

const DelegationPage = () => {
  // Selector
  const { loading, data_Delegation } = useSelector((state) => state.delegation);

  // Declaration
  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const searchInputRequest = useRef(null);

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [pageRequest, setPageRequest] = useState(1);
  const [pageSizeRequest, setPageSizeRequest] = useState(10);
  const [searchTextRequest, setSearchTextRequest] = useState("");
  const [searchedColumnRequest, setSearchedColumnRequest] = useState("");
  const [sortRequest, setSortRequest] = useState("");
  const [searchRequest, setSearchRequest] = useState({});

  const [listSectionInfo, setListSectionInfo] = useState([
    { value: "Approval Delegation" },
    { value: "Delegation Request" },
  ]);

  const [valuePage, setValuePage] = useState(listSectionInfo[0].value);

  const routes = [
    {
      path: "",
      breadcrumbName: "User Management",
    },
    {
      path: "",
      breadcrumbName: "Delegation",
    },
    {
      path: "",
      breadcrumbName: valuePage,
    },
  ];

  const handleFetch = useCallback(() => {
    const reqSearch = encodeURIComponent(
      JSON.stringify(
        valuePage === "Approval Delegation" ? search : searchRequest,
      ),
    );
    const sortValue = valuePage === "Approval Delegation" ? sort : sortRequest;
    dispatch(
      getDelegationList({ search: reqSearch, page, pageSize, sortValue }),
    );
  }, [
    dispatch,
    page,
    pageSize,
    search,
    searchRequest,
    sort,
    sortRequest,
    valuePage,
  ]);

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
  const onSortRequest = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSortRequest(dataSort);
  };

  const onChange = (e) => {
    setPage(1);
    setPageSize(10);
    setSearch({});
    setSort("");
    setSearchText("");
    setSearchedColumn("");
    setPageRequest(1);
    setPageSizeRequest(10);
    setSearchRequest({});
    setSortRequest("");
    setSearchTextRequest("");
    setSearchedColumn("");
    setValuePage(e.target.value);
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
  const handleSearchRequest = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchTextRequest(selectedKeys[0]);
    setSearchedColumnRequest(dataIndex);
    setSearchRequest((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setPageRequest(1);
      }
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
  };

  const handleChange = (page, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : page;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };
  const handleChangeRequest = (page, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : page;
    setPageRequest(tempPage);
    setPageSizeRequest(pageSizeChange);
  };

  const itemActions = [
    // toolbar items
    {
      action: "Create",
      render: (
        <NavLink to={USER_ROUTES.CREATE_DELEGATION}>
          <ButtonComponent
            icon={<SVGIcon name="IconButtonCreate" width={24} />}
            type="submit"
          >
            Create Delegation
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
          <Link to={USER_ROUTES.DETAIL_DELEGATION} state={{ id: record?.id }}>
            <Tooltip title="Detail">
              <div className="pt-1">
                <SVGIcon name="IconDetail" width={24} />
              </div>
            </Tooltip>
          </Link>
        );
      },
    },
  ];

  // hooks column action
  const columnAction = useColumnActionPermission(["view"], itemActions);

  const handleRetry = () => {
    handleCancelTryAgain();
  };

  const { renderModal, handleCancelTryAgain } = useTryAgainHooks(handleRetry);
  return (
    <LayoutMenu>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />
        <RadioTabs
          data={listSectionInfo}
          onChange={onChange}
          currentPosition={valuePage}
        />
        {valuePage === "Delegation Request" && <Toolbar items={itemActions} />}
        <BaseContainer header={valuePage + " list"}>
          {valuePage === "Approval Delegation" ? (
            <div className={"w-full"}>
              <TablePagination
                dataSource={data_Delegation?.result}
                columns={[
                  ...approvalDelegation(
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
                totalData={data_Delegation?.page?.totalElements || 0}
                onSort={onSort}
                tableScrolled={{ y: 525, x: 1700 }}
              />
            </div>
          ) : (
            <div className={"w-full"}>
              <TablePagination
                dataSource={data_Delegation?.result}
                columns={[
                  ...delegationRequest(
                    searchRequest,
                    pageRequest,
                    pageSizeRequest,
                    searchInputRequest,
                    searchedColumnRequest,
                    searchTextRequest,
                    handleSearchRequest,
                  ),
                ]}
                current={pageRequest}
                pageSize={pageSizeRequest}
                onChange={handleChangeRequest}
                onSizeChanger={handleChangeRequest}
                totalData={data_Delegation?.page?.totalElements || 0}
                onSort={onSortRequest}
                tableScrolled={{ y: 525, x: 1700 }}
              />
            </div>
          )}

          {/* render modal */}
          {renderModal()}
        </BaseContainer>
      </Spin>
    </LayoutMenu>
  );
};

export default DelegationPage;
