import React, { useState, useEffect, useRef, useCallback } from "react";
import { Tooltip, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import BreadCrumb from "../../../../components/BreadCrumb";
import ButtonComponent from "../../../../components/ButtonComponent";
import { SYSTEM_SETUP_ROUTES } from "../../../../routes/system_setup/setup_routes";
import SVGIcon from "../../../../assets/Icon/index";
import BaseContainer from "../../../../components/BaseContainer";
import TablePagination from "../../../../components/TablePagination";
import {
  downloadExcelGlobalProperties,
  getAllGlobalPropertiesPaginate,
} from "../../../../redux/slices/system_setup/globalProperties";
import { renderColumn } from "../../../../utils";
import Toolbar from "../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";
import { useTryAgainHooks } from "../../../../utils/useTryAgainHooks";
import { getColumnSearchPropsPaging } from "../../../../utils/getColumnSearchProps";

const GlobalProperties = () => {
  // Selector
  const { data, loading } = useSelector((state) => state.globalProperties);
  const { bodyError } = useSelector(state => state?.general)

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
      getAllGlobalPropertiesPaginate({
        search: encodeURIComponent(JSON?.stringify(search)),
        page,
        pageSize,
        sort,
      })
    );
  }, [dispatch, page, pageSize, search, sort]);

  // useEffect
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
      path: SYSTEM_SETUP_ROUTES.VIEW_GLOBAL_PROPERTIES,
      breadcrumbName: "Global Properties",
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
  const handleChange = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
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
      title: "TYPE",
      dataIndex: "gpType",
      align: "center",
      sorter: true,
      ...getColumnSearchPropsPaging(
        "gpType",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => renderColumn('gpType', searchedColumn, searchText, text, false, 'input', search)
    },
    {
      title: "PROPERTIES NAME",
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
      title: "DESCRIPTION",
      dataIndex: "description",
      sorter: true,
      ellipsis: {
        showTitle: false,
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
      sorter: true,
      fixed: "right",
      ...getColumnSearchPropsPaging(
        "status",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      width: 120,
      render: (text) => renderColumn('status', searchedColumn, searchText, text, false, 'status', search)
    }
  ];

  const handleDownload = () => {
    dispatch(
      downloadExcelGlobalProperties({
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize,
        sort,
      })
    );
  };

  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const itemActions = [
    // toolbar items
    {
      action: 'Download',
      render: (
        <ButtonComponent
          icon={<SVGIcon name="IconButtonDownload" width={24} />}
          type="submit"
          onClick={() => {
            let tempSearch = "";
            for (const dataIndex in search) {
              if (Object.hasOwnProperty.call(search, dataIndex)) {
                const tempSearchText = search[dataIndex];
                if (tempSearchText) {
                  tempSearch += `${dataIndex}~${tempSearchText},`;
                }
              }
            }
            dispatch(
              downloadExcelGlobalProperties({
                search: tempSearch,
                page,
                pageSize,
                sort,
              })
            );
          }}
        >
          Download List
        </ButtonComponent>
      )
    },
    {
      action: 'Create',
      render: (
        <NavLink to={SYSTEM_SETUP_ROUTES.CREATE_GLOBAL_PROPERTIES}>
          <ButtonComponent
            icon={<SVGIcon name="IconButtonCreate" width={24} />}
            type="submit"
          >
            Create Global Properties
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
              to={SYSTEM_SETUP_ROUTES.DETAIL_GLOBAL_PROPERTIES}
              state={{ id: record?.gpId }}
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
      action: 'Update',
      type: 'table',
      render: (record, data_length) => {
        return (
          <Tooltip title="Update">
            <Link
              to={SYSTEM_SETUP_ROUTES.UPDATE_GLOBAL_PROPERTIES}
              state={{ id: record?.gpId }}
            >
              <div>
                <SVGIcon name="IconEdit" width={24} />
              </div>
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
        <BaseContainer header={"global properties list"}>
          <div className="w-full">
            <TablePagination
              dataSource={dataSource}
              columns={[...columns, ...useColumnActionPermission(['view', 'update'], itemActions)]}
              current={page}
              pageSize={pageSize}
              onChange={handleChange}
              totalData={data?.page?.totalElements}
              onSort={onSort}
              tableScrolled={{
                x: 1200,
                y: 500,
              }}
            />
          </div>
        </BaseContainer>
      </Spin>

      {/* modal try again */}
      {renderModal()}
    </LayoutMenu>
  );
};

export default GlobalProperties;
