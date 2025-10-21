import React, { useEffect, useState, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spin, Tooltip } from "antd";
import { Link, NavLink } from "react-router-dom";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import BreadCrumb from "../../../../components/BreadCrumb";
import BaseContainer from "../../../../components/BaseContainer";
import ButtonComponent from "../../../../components/ButtonComponent";
import SVGIcon from "../../../../assets/Icon/index";
import { SYSTEM_SETUP_ROUTES } from "../../../../routes/system_setup/setup_routes";
import { getJobs } from "../../../../redux/slices/system_setup/jobSlice";
import { hasValue, renderColumn } from "../../../../utils";
import { getColumnSearchPropsUseFilteredValue } from "../../../../utils/getColumnSearchProps";
import TablePaginationNew from "../../../../components/TablePaginationNew";
import Toolbar from "../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";

const ListJob = () => {
  const { jobs, loading, pagination } = useSelector((state) => state.job);

  const dispatch = useDispatch();
  const searchInput = useRef(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    dispatch(getJobs());
  }, [dispatch]);

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

  const column = useMemo(
    () => [
      {
        title: "NO",
        width: 60,
        align: "center",
        render: (text, object, index) => (page - 1) * pageSize + index + 1,
      },
      {
        title: "CODE",
        dataIndex: "code",
        sorter: true,
        align: "left",
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
        title: "PROCEDURE NAME",
        dataIndex: "procedureName",
        align: "left",
        sorter: true,
        filteredValue: [search?.procedureName] || null,
        ellipsis: {
          showTitle: false,
        },
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "procedureName",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "procedureName",
            hasValue(search["procedureName"]),
            searchText,
            text,
            true,
            "input",
            search
          ),
      },
      {
        title: "LISTING NO",
        dataIndex: "listingNo",
        align: "center",
        sorter: true,
        filteredValue: [search?.listingNo] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "listingNo",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "listingNo",
            hasValue(search["listingNo"]),
            searchText,
            text,
            false,
            "input",
            search
          ),
      },
      {
        title: "IS PARALLEL",
        dataIndex: "isParallel",
        align: "center",
        sorter: true,
        filteredValue: [search?.isParallel] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "isParallel",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "isParallel",
            hasValue(search["isParallel"]),
            searchText,
            text === "Y" ? "Yes" : "No",
            false,
            "status",
            search
          ),
      },
      {
        title: "PARALLEL DEGREE",
        dataIndex: "parallelDegree",
        align: "center",
        sorter: true,
        filteredValue: [search?.parallelDegree] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "parallelDegree",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "parallelDegree",
            hasValue(search["parallelDegree"]),
            searchText,
            text,
            false,
            "input",
            search
          ),
      },
      {
        title: "IS FINISH",
        dataIndex: "isFinish",
        align: "center",
        sorter: true,
        filteredValue: [search?.isFinish] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "isFinish",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "isFinish",
            hasValue(search["isFinish"]),
            searchText,
            text === "Y" ? "Yes" : "No",
            false,
            "status",
            search
          ),
      },
      {
        title: "JOB TYPE ID",
        dataIndex: "pjobTypeId",
        align: "center",
        sorter: true,
        filteredValue: [search?.pjobTypeId] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "pjobTypeId",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "pjobTypeId",
            hasValue(search["pjobTypeId"]),
            searchText,
            text,
            false,
            "input",
            search
          ),
      },
      {
        title: "CONTROL TABLE NAME",
        dataIndex: "controlTableName",
        align: "left",
        sorter: true,
        filteredValue: [search?.controlTableName] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "controlTableName",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "controlTableName",
            hasValue(search["controlTableName"]),
            searchText,
            text,
            false,
            "input",
            search
          ),
      },
      {
        title: "DESCRIPTION",
        dataIndex: "description",
        align: "left",
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
        title: "UPDATE BY",
        dataIndex: "updateBy",
        align: "center",
        sorter: true,
        filteredValue: [search?.updateBy] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "updateBy",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "updateBy",
            hasValue(search["updateBy"]),
            searchText,
            text,
            false,
            "input",
            search
          ),
      },
    ],
    [page, pageSize, search, searchText, searchedColumn]
  );

  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const routes = [
    {
      path: "",
      breadcrumbName: "System Setup",
    },
    {
      path: "",
      breadcrumbName: "Job Management",
    },
  ];

  const handleChangePage = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  const itemGrantAccess = [
    {
      action: "Create",
      render: (
        <NavLink to={SYSTEM_SETUP_ROUTES.JOB_CREATE_MENU}>
          <ButtonComponent
            icon={<SVGIcon name="IconButtonCreate" width={24} />}
            type={"submit"}
            border={false}
          >
            Create Job
          </ButtonComponent>
        </NavLink>
      ),
    },
    {
      action: "View",
      type: "table",
      render: (record) => {
        return (
          <Link
            to={SYSTEM_SETUP_ROUTES.JOB_DETAIL_MENU}
            state={{ id: record?.pjobid }}
          >
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

  const columnActionPermission = useColumnActionPermission(
    ["view"],
    itemGrantAccess
  );

  const columns = useMemo(() => {
    return [...column, ...columnActionPermission];
  }, [column, columnActionPermission]);

  console.log("Jobs Data:", jobs);

  return (
    <Spin spinning={loading}>
      <LayoutMenu>
        <BreadCrumb routes={routes} />

        <div className="w-full justify-end flex gap-2">
          <Toolbar items={itemGrantAccess} />
        </div>

        <BaseContainer header={"JOB LIST"}>
          <div className="my-5">
            <TablePaginationNew
              columns={columns}
              dataSource={jobs}
              totalData={pagination?.totalElements || jobs.length}
              current={page}
              pageSize={pageSize}
              onChange={handleChangePage}
              tableScrolled={{ x: 2000, y: 600 }}
              onSort={onSort}
              rowKey="pjobid"
            />
          </div>
        </BaseContainer>
      </LayoutMenu>
    </Spin>
  );
};

export default ListJob;