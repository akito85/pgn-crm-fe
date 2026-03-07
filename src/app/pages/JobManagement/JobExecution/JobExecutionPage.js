import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import NxBaseContainer from "../../../../components/Nx/NxBaseContainer";
import NxTable from "../../../../components/Nx/NxTable";
import { getAllJobExecutionPaginate } from "../../../../redux/slices/job_management/jobExecutionSlice";
import { getJobManagementColumns } from "../jobManagementColumns";
import { nxApplyFixedColumns } from "../../../../utils/Nx/nxApplyFixedColumns";

const actionColumn = {
  title: "ACTIONS",
  key: "actions",
  width: 100,
  align: "center",
  fixed: "right",
  render: () => <span>—</span>,
};

const JobExecutionPage = () => {
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.jobExecution);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search] = useState({});
  const [sort, setSort] = useState("");

  const [fixedColumns, setFixedColumns] = useState({ left: [], right: ["actions"] });

  const handleFetch = useCallback(() => {
    dispatch(
      getAllJobExecutionPaginate({
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize,
        sort,
      })
    );
  }, [dispatch, page, pageSize, search, sort]);

  useEffect(() => {
    handleFetch();
  }, [handleFetch]);

  const handleChange = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  const onSort = (_, __, sorter) => {
    setSort(
      sorter.order
        ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
        : ""
    );
  };

  const baseColumns = useMemo(
    () => [...getJobManagementColumns(page, pageSize), actionColumn],
    [page, pageSize]
  );

  const allColumns = useMemo(
    () =>
      baseColumns.map((col) => ({
        ...col,
        key: col.key || col.dataIndex || col.title,
      })),
    [baseColumns]
  );

  const processedColumns = useMemo(
    () => nxApplyFixedColumns(allColumns, fixedColumns),
    [allColumns, fixedColumns]
  );

  const columnDefinitions = useMemo(
    () =>
      allColumns.map((col) => ({
        key: col.key || col.dataIndex || col.title,
        title: col.title,
      })),
    [allColumns]
  );

  return (
    <LayoutMenu>
      <NxCardContainer header="JOB SCHEDULER MANAGEMENT">
        <NxBaseContainer border header="JOB EXECUTION LIST" className="overflow-hidden">
          <NxTable
            idTable="job-execution-list-table"
            dataSource={data?.result}
            totalData={data?.page?.totalElements}
            current={page}
            pageSize={pageSize}
            loading={loading}
            columns={processedColumns}
            columnDefinitions={columnDefinitions}
            fixedColumns={fixedColumns}
            setFixedColumns={setFixedColumns}
            tableScrolled={{ y: 500, x: "max-content" }}
            onChange={handleChange}
            onSizeChanger={handleChange}
            onSort={onSort}
            onRefresh={handleFetch}
            showRefresh={true}
          />
        </NxBaseContainer>
      </NxCardContainer>
    </LayoutMenu>
  );
};

export default JobExecutionPage;
