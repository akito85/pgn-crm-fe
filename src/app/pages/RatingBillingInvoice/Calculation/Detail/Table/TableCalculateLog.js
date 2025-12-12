import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TablePaginationNew from "../../../../../../components/TablePaginationNew";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../../utils/getColumnSearchProps";
import { getCalculateLogPaginate } from "../../../../../../redux/slices/rating_billing_invoice/calculation";
import { hasValue, renderColumn } from "../../../../../../utils";

const TableCalculateLog = ({calculationCode}) => {
    const [page, setPage] = useState(1);
    const dispatch = useDispatch();
    const searchInput = useRef(null);
    const [pageSize, setPageSize] = useState(10);
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const [sort, setSort] = useState("");
    const [search, setSearch] = useState({});
    const { list_calculation_log, loading } = useSelector(
        (state) => state.rbi_calculation
    );
    useEffect(() => {
        dispatch(
            getCalculateLogPaginate({
                search: encodeURIComponent(JSON.stringify(search)),
                sort,
                page,
                pageSize,
                calCode: calculationCode,
            })
        );
    }, [
        dispatch,
        calculationCode,
        sort,
        page,
        pageSize,
        search,
    ])
      const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(selectedKeys[0] ? dataIndex : "");
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
    const onSort = (_, __, sort) => {
        const dataSort =
            sort.order !== undefined
            ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
            : "";
        setSort(dataSort);
    };
    const handleChangePage = (page, pageSizeChange) => {
        const tempPage = pageSize !== pageSizeChange ? 1 : page;
        setPage(tempPage);
        setPageSize(pageSize);
    };
    const column = [
        {
        title: "NO",
        width: 60,
        align: "center",
        render: (text, object, index) => index + 1,
        },
        {
            title: "ID CALCULATION JOB",
            dataIndex: "idCalJob",
            sorter: true,
            ...getColumnSearchPropsUseFilteredValue(
                search,
                "idCalJob",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                true
            ),
            render: (text) =>
            renderColumn(
                "idCalJob",
                hasValue(search["idCalJob"]),
                searchText,
                text,
                false,
                "input",
                search
            ),
        },
        {
            title: "CALCULATION CODE",
            dataIndex: "calCode",
            sorter: true,
            ...getColumnSearchPropsUseFilteredValue(
                search,
                "calCode",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                true
            ),
            render: (text) =>
            renderColumn(
                "calCode",
                hasValue(search["calCode"]),
                searchText,
                text,
                false,
                "input",
                search
            ),
        },
        {
            title: "LOG MESSAGE",
            dataIndex: "logMsg",
            sorter: true,
            ...getColumnSearchPropsUseFilteredValue(
                search,
                "logMsg",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                true
            ),
            render: (text) =>
            renderColumn(
                "logMsg",
                hasValue(search["logMsg"]),
                searchText,
                text,
                false,
                "input",
                search
            ),
        },
        {
            title: "PROCESS NAME",
            dataIndex: "procName",
            sorter: true,
            ...getColumnSearchPropsUseFilteredValue(
                search,
                "procName",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                true
            ),
            render: (text) =>
            renderColumn(
                "procName",
                hasValue(search["procName"]),
                searchText,
                text,
                false,
                "input",
                search
            ),
        },
        {
            title: "BILL CYCLE",
            dataIndex: "billCycle",
            sorter: true,
            ...getColumnSearchPropsUseFilteredValue(
                search,
                "billCycle",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                true
            ),
            render: (text) =>
            renderColumn(
                "billCycle",
                hasValue(search["billCycle"]),
                searchText,
                text,
                false,
                "input",
                search
            ),
        },
        {
            title: "BILL PERIOD",
            dataIndex: "billPeriod",
            sorter: true,
            ...getColumnSearchPropsUseFilteredValue(
                search,
                "billPeriod",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                true
            ),
            render: (text) =>
            renderColumn(
                "billPeriod",
                hasValue(search["billPeriod"]),
                searchText,
                text,
                false,
                "input",
                search
            ),
        },
        {
            title: "COUNTER NO",
            dataIndex: "countNo",
            sorter: true,
            ...getColumnSearchPropsUseFilteredValue(
                search,
                "countNo",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                true
            ),
            render: (text) =>
            renderColumn(
                "countNo",
                hasValue(search["countNo"]),
                searchText,
                text,
                false,
                "input",
                search
            ),
        },
        {
            title: "LOG DATE",
            dataIndex: "logDate",
            sorter: true,
            ...getColumnSearchPropsUseFilteredValue(
                search,
                "logDate",
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                true
            ),
            render: (text) =>
            renderColumn(
                "logDate",
                hasValue(search["logDate"]),
                searchText,
                text,
                false,
                "input",
                search
            ),
        },
        {
            title: "CREATED BY",
            dataIndex: "createdBy",
            sorter: true,
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
                text,
                false,
                "input",
                search
            ),
        },
    ]
    return (
        <TablePaginationNew
            columns={column}
            dataSource={list_calculation_log?.result}
            totalData={list_calculation_log?.page?.totalElements || 0}
            current={page}
            pageSize={pageSize}
            tableScrolled={{ x: 2000, y: 600 }}
            onChange={handleChangePage}
            onSort={onSort}
            loading={loading}
        />
    );
}
export default TableCalculateLog;