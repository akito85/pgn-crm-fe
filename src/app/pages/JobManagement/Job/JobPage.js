import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DownloadOutlined, PlusOutlined } from "@ant-design/icons";
import { JOB_MGMT_ROUTES } from "../../../../routes/job_management/job_routes";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import NxTable from "../../../../components/Nx/NxTable";
import BreadCrumb from "../../../../components/BreadCrumb";
import ButtonComponent from "../../../../components/ButtonComponent";
import { getAllJobPaginate } from "../../../../redux/slices/job_management/jobSlice";
import { getJobManagementColumns } from "../jobManagementColumns";
import { nxApplyFixedColumns } from "../../../../utils/Nx/nxApplyFixedColumns";

const PAGE_SIZE = 20;

const actionColumn = {
  title: "ACTIONS",
  key: "actions",
  width: 100,
  align: "center",
  fixed: "right",
  render: () => <span>—</span>,
};

const JobPage = () => {
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.jobManagement);

  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("");
  const [accumulatedData, setAccumulatedData] = useState([]);

  const [fixedColumns, setFixedColumns] = useState({ left: [], right: ["actions"] });

  const handleFetch = useCallback(() => {
    dispatch(
      getAllJobPaginate({
        search: encodeURIComponent(JSON.stringify({})),
        page,
        pageSize: PAGE_SIZE,
        sort,
      })
    );
  }, [dispatch, page, sort]);

  useEffect(() => {
    handleFetch();
  }, [handleFetch]);

  // Append new data when page increments, replace on reset (page 1)
  useEffect(() => {
    if (!data?.result) return;
    if (page === 1) {
      setAccumulatedData(data.result);
    } else {
      setAccumulatedData((prev) => {
        const existingIds = new Set(prev.map((item) => item.id));
        const newItems = data.result.filter((item) => !existingIds.has(item.id));
        return [...prev, ...newItems];
      });
    }
  }, [data?.result]);

  const handleRefresh = () => {
    setPage(1);
    setAccumulatedData([]);
  };

  const handleLoadMore = async () => {
    const totalPages = data?.page?.totalPages || 0;
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const hasMore = accumulatedData.length < (data?.page?.totalElements || 0);

  const onSort = (_, __, sorter) => {
    setSort(
      sorter.order
        ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
        : ""
    );
    setPage(1);
    setAccumulatedData([]);
  };

  const baseColumns = useMemo(
    () => [...getJobManagementColumns(1, PAGE_SIZE), actionColumn],
    []
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

  // Toolbar buttons
  const downloadListHandler = () => {
    // Add download functionality here
    console.log('Download List clicked');
  };

  const createHandler = () => {
    // Add create functionality here
    console.log('Create clicked');
  };

  const routes = [
    {
      path: JOB_MGMT_ROUTES.VIEW_JOB_SCHEDULER_MANAGEMENT,
      breadcrumbName: "Job Scheduler Management",
    },
    {
      path: "",
      breadcrumbName: "Job List",
    },
  ];

  return (
    <LayoutMenu>
      <BreadCrumb routes={routes} />
      <NxCardContainer 
        header="JOB LIST"
        actionElement={
          <div className="flex gap-2">
            <ButtonComponent
              type="primary"
              icon={<DownloadOutlined />}
              onClick={downloadListHandler}
              isPrimary={true}
              className="px-2 py-2 rounded-lg min-h-[32px]"
            >
              <span className="text-xs font-medium tracking-tight">Download List</span>
            </ButtonComponent>
            <ButtonComponent
              type="primary"
              icon={<PlusOutlined />}
              onClick={createHandler}
              isPrimary={true}
              className="px-2 py-2 rounded-lg min-h-[32px]"
            >
              <span className="text-xs font-medium tracking-tight">Create</span>
            </ButtonComponent>
          </div>
        }
      >
        <NxTable
          idTable="job-list-table"
          dataSource={accumulatedData}
          totalData={data?.page?.totalElements}
          current={page}
          loading={loading}
          columns={processedColumns}
          columnDefinitions={columnDefinitions}
          fixedColumns={fixedColumns}
          setFixedColumns={setFixedColumns}
          tableScrolled={{ y: 500, x: "max-content" }}
          onSort={onSort}
          usePagination={false}
          useInfiniteScroll={true}
          hasMore={hasMore}
          onLoadMore={handleLoadMore}
          loadMoreThreshold={20}
          onRefresh={handleRefresh}
          showRefresh={true}
        />
      </NxCardContainer>
    </LayoutMenu>
  );
};

export default JobPage;
