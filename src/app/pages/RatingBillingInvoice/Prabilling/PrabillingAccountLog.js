import React, { useEffect, useState, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Tag, Statistic, Row, Col } from "antd";
import CardContainer from "../../../../components/CardContainer";
import TableRBI from "../../../../components/TableRBI";
import { getColumnSearchPropsUseFilteredValue } from "../../../../utils/getColumnSearchProps";
import { getPrabillingAccountLog } from "../../../../redux/slices/rating_billing_invoice/praBilling";
import { applyFixedColumns } from "../../../../utils/applyFixedColumns";
import { hasValue, renderColumn, renderDateColumn } from "../../../../utils";
import moment from "moment";

const PrabillingAccountLog = ({ data, tabHeader }) => {
  const { account_log_data, loading_account_log } = useSelector(
    (state) => state.rbi_prabilling
  );

  const dispatch = useDispatch();
  const searchInput = useRef(null);

  const prabillData = data?.prabillInitPopulate || {};

  const [page, setPage] = useState(1);
  const [loadMoreSize] = useState(20);
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");

  const [fixedColumns, setFixedColumns] = useState(() => ({
    left: ["no"],
    right: ["status"],
  }));

  // Initial fetch
  useEffect(() => {
    if (tabHeader === "Prabilling Account Log" && prabillData?.initCode) {
      dispatch(
        getPrabillingAccountLog({
          initCode: prabillData.initCode,
          page: 0,
          size: 100,
          sort: sort || "createdDate~desc",
          search: Object.keys(search).length > 0 ? JSON.stringify(search) : "",
          isLoadMore: false,
        })
      );
      setPage(1);
    }
  }, [tabHeader, dispatch, prabillData?.initCode, sort, search]);

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

  // Load more handler
  const handleLoadMore = async () => {
    const nextPage = page + 1;
    const totalPages = account_log_data?.listAccountResult?.page?.totalPages || 0;

    if (nextPage <= totalPages) {
      await dispatch(
        getPrabillingAccountLog({
          initCode: prabillData.initCode,
          page: nextPage - 1,
          size: loadMoreSize,
          sort: sort || "createdDate~desc",
          search: Object.keys(search).length > 0 ? JSON.stringify(search) : "",
          isLoadMore: true,
        })
      );
      setPage(nextPage);
    }
  };

  const onSort = (_, __, sorter) => {
    const dataSort =
      sorter && sorter.order !== undefined
        ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
        : "";

    setSort(dataSort);
  };

  const baseColumns = useMemo(
    () => [
      {
        key: "no",
        title: "NO",
        width: 60,
        align: "center",
        render: (text, object, index) => index + 1,
      },
      {
        key: "createdBy",
        title: "CREATED BY",
        dataIndex: "createdBy",
        width: 120,
        align: "center",
        sorter: true,
        filteredValue: [search?.createdBy] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "createdBy",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "createdBy",
            hasValue(search["createdBy"]),
            searchText,
            text || "",
            false,
            "input",
            search
          ),
      },
      {
        key: "createdDate",
        title: "CREATED DATE",
        dataIndex: "createdDate",
        width: 150,
        align: "center",
        sorter: true,
        filteredValue: [search?.createdDate] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "createdDate",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
          "datetime"
        ),
        render: (text) => {
          const formattedDate = text
            ? moment(text).format("DD MMM YYYY")
            : "-";
          return renderDateColumn(
            "createdDate",
            hasValue(search["createdDate"]),
            searchText,
            formattedDate,
            "datetime",
            search
          );
        },
      },
      {
        key: "accountNumber",
        title: "ACCOUNT NUMBER",
        dataIndex: "accountNumber",
        width: 180,
        sorter: true,
        filteredValue: [search?.accountNumber] || null,
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "accountNumber",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "accountNumber",
            hasValue(search["accountNumber"]),
            searchText,
            text || "",
            false,
            "input",
            search
          ),
      },
      {
        key: "status",
        title: "STATUS",
        dataIndex: "status",
        width: 120,
        align: "center",
        sorter: true,
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
        render: (status) => {
          const statusUpper = status ? status.toUpperCase() : "INFO";

          const statusConfig = {
            SUCCESS: { text: "Success", type: "status" },
            ERROR: { text: "Failed", type: "status" },
            FAILED: { text: "Failed", type: "status" },
            WARNING: { text: "In Progress", type: "status" },
            PROCESSING: { text: "In Progress", type: "status" },
            IN_PROGRESS: { text: "In Progress", type: "status" },
            "IN PROGRESS": { text: "In Progress", type: "status" },
            INFO: { text: "Open", type: "status" },
          };

          const config = statusConfig[statusUpper] || {
            text: "Unknown",
            type: "status",
          };

          const displayText = config.text;

          return renderColumn(
            "status",
            hasValue(search["status"]),
            searchText,
            displayText,
            false,
            "status",
            search
          );
        },
      },
      {
        key: "message",
        title: "MESSAGE",
        dataIndex: "message",
        width: 280,
        sorter: true,
        filteredValue: [search?.message] || null,
        ellipsis: {
          showTitle: false,
        },
        ...getColumnSearchPropsUseFilteredValue(
          search,
          "message",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true
        ),
        render: (text) =>
          renderColumn(
            "message",
            hasValue(search["message"]),
            searchText,
            text || "-",
            true,
            "input",
            search
          ),
      },
    ],
    [search, searchText, searchedColumn]
  );

  const allColumns = useMemo(() => {
    const columnsWithKeys = baseColumns.map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
    return columnsWithKeys;
  }, [baseColumns]);

  const processedColumns = useMemo(() => {
    return applyFixedColumns(allColumns, fixedColumns);
  }, [allColumns, fixedColumns]);

  const columnDefinitions = useMemo(() => {
    return allColumns.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [allColumns]);

  const logData = Array.isArray(account_log_data?.listAccountResult?.result)
    ? account_log_data.listAccountResult.result
    : [];
  const totalElements = account_log_data?.listAccountResult?.page?.totalElements || 0;
  const summary = account_log_data?.summary || {};

  const hasMore = logData.length < totalElements;

  return (
    <div className="-mt-6">
      <CardContainer
        header={
          <div className="flex -my-4 justify-between items-center">
            <p className="mt-[15px]">PRABILLING ACCOUNT LOG</p>
          </div>
        }
      >
        {/* Status Summary - Match CardContainer Style */}
        <div className="drop-shadow-lg bg-white rounded-lg mb-4">
          <div 
            className="flex flex-col bg-[#F9F9F9] p-3 rounded-t-lg uppercase"
            style={{ borderBottom: "1px solid #BDBDBD" }}
          >
            <div className="text-[16px] text-primary">SUMMARY</div>
          </div>
          <Row style={{ margin: 0 }}>
            <Col span={8} style={{ 
              padding: '16px', 
              borderRight: '1px solid #BDBDBD' 
            }}>
              <div style={{ color: '#8c8c8c', fontSize: '14px', marginBottom: '4px' }}>
                Total
              </div>
              <div style={{ fontSize: '30px', fontWeight: 'bold', color: '#262626' }}>
                {totalElements || 0}
              </div>
            </Col>
            <Col span={8} style={{ 
              padding: '16px', 
              borderRight: '1px solid #BDBDBD' 
            }}>
              <div style={{ color: '#8c8c8c', fontSize: '14px', marginBottom: '4px' }}>
                Success
              </div>
              <div style={{ fontSize: '30px', fontWeight: 'bold', color: '#262626' }}>
                {summary.success || 0}
              </div>
            </Col>
            <Col span={8} style={{ padding: '16px' }}>
              <div style={{ color: '#8c8c8c', fontSize: '14px', marginBottom: '4px' }}>
                Failed
              </div>
              <div style={{ fontSize: '30px', fontWeight: 'bold', color: '#262626' }}>
                {summary.failed || 0}
              </div>
            </Col>
          </Row>
        </div>

        <div className="my-0">
          <TableRBI
            idTable="prabilling-account-log-table"
            dataSource={logData}
            columns={processedColumns}
            totalData={totalElements}
            tableScrolled={{ x: 700, y: 600 }}
            onSort={onSort}
            showExport={false}
            columnDefinitions={columnDefinitions}
            fixedColumns={fixedColumns}
            setFixedColumns={setFixedColumns}
            loading={loading_account_log}
            usePagination={false}
            useInfiniteScroll={true}
            onLoadMore={handleLoadMore}
            hasMore={hasMore}
            loadMoreThreshold={20}
            rowKey={(record) => record.id}
          />
          
          {/* Footer text like in Figma */}
          {logData.length > 0 && (
            <div className="text-center text-gray-500 text-sm mt-3">
              Showing {logData.length} of {totalElements} entries
              {!hasMore && " | All data loaded"}
            </div>
          )}
        </div>
      </CardContainer>
    </div>
  );
};

export default PrabillingAccountLog;