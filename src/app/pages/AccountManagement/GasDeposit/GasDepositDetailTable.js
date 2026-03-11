import { useLocation, useNavigate } from "react-router-dom";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../routes/account_management/customer_account_routes";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";
import NxTable from "../../../../components/Nx/NxTable";
import { useMemo, useRef, useState } from "react";
import { nxGetAccountActions } from "../../../../components/Nx/NxGetAccountActions";
import { nxApplyFixedColumns } from "../../../../utils/Nx/nxApplyFixedColumns";
import { getGasDepositDetailColumns } from "./getGasDepositDetailColumns";

const GasDepositDetailTable = ({
  data = [],
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  
  const itemActions = nxGetAccountActions({
    idKey: "idGd",
  });

  const [fixedColumns, setFixedColumns] = useState(() => ({
    right: ["statusApproval", "status", "action"],
    left: [],
  }));

  const actionCols = useColumnActionPermission(["Inactivate", "Update", "History"], itemActions, "View", "table").map(
    (col) => ({
      ...col,
      width: 70,
      align: "center",
    })
  );

  /**
   * @param {string[]} selectedKeys
   * @param {() => {}} confirm
   * @param {string} dataIndex
   */
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch((prevState) => {
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0]
      };
    });
  };

  const baseColumns = useMemo(() =>
    getGasDepositDetailColumns(
      search,
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  [search, searchText, searchedColumn]);

  const allColumns = useMemo(() => {
    const columnsWithKeys = [...baseColumns, ...actionCols].map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
    return columnsWithKeys;
  }, [baseColumns, actionCols]);

  const processedColumns = useMemo(() => {
    return nxApplyFixedColumns(allColumns, fixedColumns);
  }, [allColumns, fixedColumns]);

  const columnDefinitions = useMemo(() => {
    return allColumns.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [allColumns]);

  /**
   * @param {*} _
   * @param {*} __
   * @param {import("antd/lib/table/interface").SorterResult} sort
   */
  const onSort = (_, __, sort) => {
    const dataSort = sort.order
      ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
      : "";
    setSort(dataSort);
  };

  return (
    <div className="flex flex-col gap-y-4">
      <NxTable
        idTable="gas-deposit-table"
        dataSource={data}
        totalData={data.length}
        tableScrolled={{ x: data.length ? "max-content" : 4000 }}
        onSort={onSort}
        columns={processedColumns}
        usePagination={false}
        loadMoreThreshold={20}
        fixedColumns={fixedColumns}
        setFixedColumns={setFixedColumns}
        columnDefinitions={columnDefinitions}
      />
    </div>
  );
};

export default GasDepositDetailTable;
