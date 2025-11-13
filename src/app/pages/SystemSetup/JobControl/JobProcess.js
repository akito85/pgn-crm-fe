import React, { useState, useRef, useMemo } from "react";
import { Tooltip } from "antd";
import SVGIcon from "../../../../assets/Icon/index";
import ButtonComponent from "../../../../components/ButtonComponent";
import { hasValue, renderColumn, renderDateColumn } from "../../../../utils";
import { getColumnSearchPropsUseFilteredValue } from "../../../../utils/getColumnSearchProps";
import TablePaginationNew from "../../../../components/TablePaginationNew";

const JobProcess = ({
  data,
  page,
  pageSize,
  onChangePage,
  onSort,
  selectedRowKeys = [],
  setSelectedRowKeys,
  dataTableSelect = [],
  setDataTableSelect,
  handleForceSubmit,
  handleSubmitJob,
  handleCancelLastJob,
  handleCancelAllJob,
  handleLogProcessJob,
  showLogProcess,
  logProcessData,
  selectedJobId,
  setShowLogProcess,
  setSelectedJobId,
  setLogProcessData,
  logSectionRef,
}) => {
  const searchInput = useRef(null);
  const [search, setSearch] = useState({});
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");

  function smoothScrollTo(target, duration) {
    const start = window.pageYOffset;
    const distance = target - start;
    let startTime = null;

    function animation(currentTime) {
      if (!startTime) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = easeInOutQuad(timeElapsed, start, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function easeInOutQuad(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t + b;
      t--;
      return (-c / 2) * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
  }

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch((prevState) => ({ ...prevState, [dataIndex]: selectedKeys[0] }));
  };

  const columns = useMemo(
    () => [
      {
        title: "NO",
        width: 60,
        align: "center",
        render: (text, object, index) => (page - 1) * pageSize + index + 1,
      },
      {
        title: "ID",
        dataIndex: "key",
        sorter: true,
        align: "center",
        width: 150,
        filteredValue: [search?.key] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "key",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "key",
            hasValue(search["key"]),
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
        sorter: true,
        align: "left",
        filteredValue: [search?.procedureName] || null,
        ellipsis: { showTitle: false },
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
        title: "STATUS",
        dataIndex: "status",
        sorter: true,
        align: "center",
        width: 150,
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
        render: (text) =>
          renderColumn(
            "status",
            hasValue(search["status"]),
            searchText,
            text,
            false,
            "status",
            search
          ),
      },
      {
        title: "PERCENTAGE PROGRESS",
        dataIndex: "percentageProgress",
        sorter: true,
        align: "right",
        width: 180,
        filteredValue: [search?.percentageProgress] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "percentageProgress",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "percentageProgress",
            hasValue(search["percentageProgress"]),
            searchText,
            text,
            false,
            "input",
            search
          ),
      },
      {
        title: "START PROCESS TIME",
        dataIndex: "startProcessTime",
        sorter: true,
        align: "center",
        width: 200,
        filteredValue: [search?.startProcessTime] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "startProcessTime",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
          "datetime"
        ),
        render: (text) =>
          renderDateColumn(
            "startProcessTime",
            hasValue(search["startProcessTime"]),
            searchText,
            text,
            "datetime",
            search
          ),
      },
      {
        title: "END PROCESS TIME",
        dataIndex: "endProcessTime",
        sorter: true,
        align: "center",
        width: 200,
        filteredValue: [search?.endProcessTime] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "endProcessTime",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
          "datetime"
        ),
        render: (text) =>
          text === "-"
            ? text
            : renderDateColumn(
                "endProcessTime",
                hasValue(search["endProcessTime"]),
                searchText,
                text,
                "datetime",
                search
              ),
      },
      {
        title: "USER",
        dataIndex: "user",
        sorter: true,
        align: "left",
        width: 120,
        filteredValue: [search?.user] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "user",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "user",
            hasValue(search["user"]),
            searchText,
            text,
            false,
            "input",
            search
          ),
      },
      {
        title: "TOTAL RECORD",
        dataIndex: "totalRecord",
        sorter: true,
        align: "right",
        width: 150,
        filteredValue: [search?.totalRecord] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "totalRecord",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "totalRecord",
            hasValue(search["totalRecord"]),
            searchText,
            text,
            false,
            "input",
            search
          ),
      },
      {
        title: "TOTAL RECORD PROCESSED",
        dataIndex: "totalRecordProcessed",
        sorter: true,
        align: "right",
        width: 200,
        filteredValue: [search?.totalRecordProcessed] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "totalRecordProcessed",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "totalRecordProcessed",
            hasValue(search["totalRecordProcessed"]),
            searchText,
            text,
            false,
            "input",
            search
          ),
      },
      {
        title: "ACTION",
        align: "center",
        fixed: "right",
        key: "action",
        width: 100,
        render: (v, r) => {
          return (
            <Tooltip title="Log Process Job">
              <div className="pt-1 cursor-pointer">
                <SVGIcon
                  name="IconDetail"
                  width={24}
                  onClick={() => handleLogProcessJob(r)}
                />
              </div>
            </Tooltip>
          );
        },
      },
    ],
    [page, pageSize, search, searchText, searchedColumn]
  );

  const logProcessColumns = [
    {
      title: "JOB CONTROL ID",
      dataIndex: "jobControlId",
      align: "center",
      width: 150,
    },
    { title: "COUNTER", dataIndex: "counter", align: "center", width: 100 },
    {
      title: "LOG DATE",
      dataIndex: "logDate",
      align: "center",
      width: 200,
      render: (text) =>
        renderDateColumn("logDate", false, "", text, "datetime", {}),
    },
    {
      title: "LOG MESSAGE",
      dataIndex: "logMessage",
      align: "left",
      ellipsis: { showTitle: false },
      render: (text) => (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      ),
    },
  ];

  const onSelectChange = (newSelectedRowKeys, newSelectedRows) => {
    setDataTableSelect(newSelectedRows);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    fixed: true,
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const anySelected = (selectedRowKeys && selectedRowKeys.length > 0) || false;

  return (
    <>
      <div className="flex gap-3 mb-4 mt-4">
        <ButtonComponent
          onClick={handleForceSubmit}
          disabled={!anySelected}
          fontSizeClassname="text-[14px]"
          style={{
            backgroundColor: !anySelected ? "#d9d9d9" : "#1890ff",
            color: "#fff",
            border: "none",
            opacity: !anySelected ? 0.6 : 1,
            cursor: !anySelected ? "not-allowed" : "pointer",
            height: "36px",
            minWidth: "110px",
          }}
        >
          Force Submit
        </ButtonComponent>

        <ButtonComponent
          onClick={handleSubmitJob}
          disabled={!anySelected}
          fontSizeClassname="text-[14px]"
          style={{
            backgroundColor: !anySelected ? "#d9d9d9" : "#1890ff",
            color: "#fff",
            border: "none",
            opacity: !anySelected ? 0.6 : 1,
            cursor: !anySelected ? "not-allowed" : "pointer",
            height: "36px",
            minWidth: "110px",
          }}
        >
          Submit Job
        </ButtonComponent>

        <ButtonComponent
          onClick={handleCancelLastJob}
          fontSizeClassname="text-[14px]"
          style={{
            backgroundColor: !anySelected ? "#d9d9d9" : "#1890ff",
            color: "#fff",
            border: "none",
            opacity: !anySelected ? 0.6 : 1,
            cursor: !anySelected ? "not-allowed" : "pointer",
            height: "36px",
            minWidth: "130px",
          }}
        >
          Cancel Last Job
        </ButtonComponent>

        <ButtonComponent
          onClick={handleCancelAllJob}
          fontSizeClassname="text-[14px]"
          style={{
            backgroundColor: "#ff4d4f",
            color: "#fff",
            border: "none",
            height: "36px",
            minWidth: "130px",
          }}
        >
          Cancel All Job
        </ButtonComponent>
      </div>

      <div className="my-5">
        <TablePaginationNew
          columns={columns}
          dataSource={data.result || []}
          totalData={data?.page?.totalElements || 0}
          current={page}
          pageSize={pageSize}
          onChange={onChangePage}
          onSort={onSort}
          rowSelection={rowSelection}
          tableScrolled={{ x: 2000, y: 600 }}
        />
      </div>

      {showLogProcess && (
        <div className="mt-8" ref={logSectionRef}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              Log Process Job - ID: {selectedJobId}
            </h3>
            <ButtonComponent
              onClick={() => {
                if (logSectionRef.current) {
                  const targetTop =
                    document.body.getBoundingClientRect().top +
                    window.pageYOffset +
                    120;
                  smoothScrollTo(targetTop, 600);

                  setTimeout(() => {
                    setShowLogProcess(false);
                    setSelectedJobId(null);
                    setLogProcessData([]);
                  }, 600);
                } else {
                  setShowLogProcess(false);
                  setSelectedJobId(null);
                  setLogProcessData([]);
                }
              }}
              style={{
                backgroundColor: "#ff4d4f",
                color: "#fff",
                border: "none",
              }}
            >
              Close Log
            </ButtonComponent>
          </div>

          <TablePaginationNew
            columns={logProcessColumns}
            dataSource={logProcessData}
            pagination={false}
            tableScrolled={{ x: 1000 }}
            rowKey={(record) => `${record.jobControlId}-${record.counter}`}
          />
        </div>
      )}
    </>
  );
};

export default JobProcess;
