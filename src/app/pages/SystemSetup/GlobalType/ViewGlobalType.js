import React, { useState, useEffect, useRef, useCallback } from "react";
import { Spin, Tooltip } from "antd";
import { NavLink, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import BreadCrumb from "../../../../components/BreadCrumb";
import ButtonComponent from "../../../../components/ButtonComponent";
import SVGIcon from "../../../../assets/Icon/index";
import { SYSTEM_SETUP_ROUTES } from "../../../../routes/system_setup/setup_routes";
import {
  downloadExcelGlobalType,
  getAllGlobalTypesPaginate,
} from "../../../../redux/slices/system_setup/globalTypes";
import BaseContainer from "../../../../components/BaseContainer";
import TablePagination from "../../../../components/TablePagination";
import Toolbar from "../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";
import { useTryAgainHooks } from "../../../../utils/useTryAgainHooks";
import { getColumnSearchPropsPaging } from "../../../../utils/getColumnSearchProps";
import { renderColumn } from "../../../../utils";

const ViewGlobalType = () => {
  // Selector
  const { data, loading } = useSelector((state) => state.globalTypes);
  const { bodyError } = useSelector(state => state?.general);
  // Declaration
  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const dataSource = data?.result;

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});

  // handle fetch
  const handleFetch = useCallback(() => {
    dispatch(
      getAllGlobalTypesPaginate({ search: encodeURIComponent(JSON?.stringify(search)), page, pageSize, sort })
    );
  }, [dispatch, page, pageSize, search, sort]);


  // Use Effect
  useEffect(() => {
    handleFetch()
  }, [handleFetch]);

  // Breadcrumbs
  const routes = [
    {
      path: "",
      breadcrumbName: "System Setup",
    },
    {
      path: SYSTEM_SETUP_ROUTES.VIEW_GLOBAL_TYPE,
      breadcrumbName: "Global Type",
    },
  ];


  // Function Search Column
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

  // Function Change Pagination
  const handleChange = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };

  // Column
  const columns = [
    {
      title: "NO",
      align: "center",
      width: 60,
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "GROUP NAME",
      dataIndex: "groupName",
      ...getColumnSearchPropsPaging(
        "groupName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      sorter: true,
      render: (text) => renderColumn('groupName', searchedColumn, searchText, text, false, 'input', search)
    },
    {
      title: "SORT BY",
      dataIndex: "sortBy",
      ...getColumnSearchPropsPaging(
        "sortBy",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      sorter: true,
      render: (text) => renderColumn('sortBy', searchedColumn, searchText, text, false, 'input', search)
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      ...getColumnSearchPropsPaging(
        "description",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      sorter: true,
      ellipsis: {
        showTitle: false,
      },
      render: (text) => renderColumn('description', searchedColumn, searchText, text, true, 'input', search)
    },
  ];

  // handle download
  const handleDownload = () => {
    dispatch(downloadExcelGlobalType({
      search: encodeURIComponent(JSON?.stringify(search)),
      page,
      pageSize,
      sort,
    }));
  };


  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  // item actions
  const itemActions = [
    // toolbar items
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
    {
      action: 'Create',
      render: (
        <NavLink to={SYSTEM_SETUP_ROUTES.CREATE_GLOBAL_TYPE}>
          <ButtonComponent
            icon={<SVGIcon name="IconButtonCreate" width={24} />}
            type="submit"
          >
            Create Global Type
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
            <Link
              to={SYSTEM_SETUP_ROUTES.DETAIL_GLOBAL_TYPE}
              state={{ id: record?.glbTypeId }}
            >
              <SVGIcon name="IconDetail" width={24} />
            </Link>
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
            <Link
              to={SYSTEM_SETUP_ROUTES.UPDATE_GLOBAL_TYPE}
              state={{ id: record?.glbTypeId }}
            >
              <SVGIcon name="IconEdit" width={24} />
            </Link>
          </Tooltip>
        )
      }
    }
  ];

  // handle retry modal error
  const handleRetry = () => {
    try {
      handleCancelTryAgain();
      if (bodyError?.action === "DOWNLOAD_GLOBAL_PROPERTIES_EXCEL") {
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
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />
        <Toolbar items={itemActions} />

        <BaseContainer header={"global type list"}>
          <div className="w-full">
            <TablePagination
              // loading={loading}
              dataSource={dataSource}
              columns={[...columns, ...useColumnActionPermission(['update', 'view'], itemActions)]}
              current={page}
              pageSize={pageSize}
              onChange={handleChange}
              totalData={data?.page?.totalElements}
              tableScrolled={{ x: 1200 }}
              onSort={onSort}
            />
          </div>
        </BaseContainer>
      </Spin>

      {/* modal try again */}
      {renderModal()}
    </LayoutMenu>
  );
};

export default ViewGlobalType;
