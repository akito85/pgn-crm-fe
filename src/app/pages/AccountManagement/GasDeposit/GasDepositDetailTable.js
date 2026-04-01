import { useLocation, useNavigate } from "react-router-dom";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../routes/account_management/customer_account_routes";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";
import NxTable from "../../../../components/Nx/NxTable";
import { useMemo, useRef, useState } from "react";
import { nxGetAccountActions } from "../../../../components/Nx/NxGetAccountActions";
import { nxApplyFixedColumns } from "../../../../utils/Nx/nxApplyFixedColumns";
import { getGasDepositDetailColumns } from "./getGasDepositDetailColumns";

const GasDepositDetailTable = ({
  dataSource = [],
  handleView = () => {},
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  
  const itemActions = nxGetAccountActions({
    handleView, 
  }).filter((item) => item.action === "View");

  const [fixedColumns, setFixedColumns] = useState(() => ({
    right: ["statusApproval", "status", "action"],
    left: [],
  }));

  const actionCols = [{
    key: "action",
    title: "ACTION",
    dataIndex: "action",
    width: 70,
    render: (_, record) => (
      <div className="w-full flex justify-center gap-4 py-1 items-center">
        {itemActions.map((item, index) => item.render(record, 1, index))}
      </div>
    )
  }];

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

  const columnDefinitions = useMemo(() => [...baseColumns, ...actionCols], [baseColumns, actionCols]);

  const columns = useMemo(() => {
    return nxApplyFixedColumns(columnDefinitions, fixedColumns);
  }, [columnDefinitions, fixedColumns]);

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
        idTable="gas-deposit-detail-table"
        dataSource={dataSource}
        totalData={dataSource.length}
        tableScrolled={{ x: dataSource.length ? "max-content" : 4000 }}
        onSort={onSort}
        columns={columns}
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
