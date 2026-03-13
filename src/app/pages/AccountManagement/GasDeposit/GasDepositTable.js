import { useLocation, useNavigate } from "react-router-dom";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../routes/account_management/customer_account_routes";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";
import Toolbar from "../../../../components/Toolbar";
import NxTable from "../../../../components/Nx/NxTable";
import { useMemo, useState } from "react";
import { getGasDepositColumns } from "./getGasDepositColumns";
import { nxGetAccountActions } from "../../../../components/Nx/NxGetAccountActions";
import { nxApplyFixedColumns } from "../../../../utils/Nx/nxApplyFixedColumns";
import GasDepositDetailTable from "./GasDepositDetailTable";

/**
 * Gas deposit list table (presentational component).
 * Renders the paginated, infinitely-scrolled gas deposit table with
 * expandable rows, toolbar actions, and column-pin support.
 *
 * @param {object}    props
 * @param {"sa"|"ua"} props.moduleType                   - Module context: standalone ("sa") or under-account ("ua")
 * @param {number}    [props.totalElement=0]              - Total record count displayed in the table header
 * @param {Function}  [props.handleInactivateModal]       - Opens the inactivate confirmation modal
 * @param {Function}  [props.handleApprovalHistoryModal]  - Opens the approval history modal
 * @param {Function}  [props.handleApproval]              - Triggers the approval action
 * @param {Function}  [props.handleDownload]              - Triggers export/download
 * @param {Function}  [props.handleLoadMore]              - Loads the next page (infinite scroll)
 * @param {Function}  [props.handleSearch]                - Column search handler
 * @param {Function}  [props.onSort]                      - Column sort handler
 * @param {Function}  [props.handleSelectDetail]          - Row click / select-detail handler
 * @param {object[]}  [props.dataSource=[]]               - Table row data
 * @param {number}    [props.page=0]                      - Current page index
 * @param {boolean}   [props.hasMore=false]               - Whether more pages exist for infinite scroll
 * @param {string}    [props.searchText=""]               - Active search text value
 * @param {object}    [props.search={}]                   - Ant Design column search state map
 * @param {object}    [props.searchedColumn={}]           - Currently searched column key map
 * @param {*}         [props.searchInput=null]            - Ref to the search input element
 * @param {boolean}   [props.loading=false]               - Loading/skeleton state
 */
const GasDepositTable = ({
  moduleType,
  totalElement = 0,
  handleInactivateModal = () => {},
  handleApprovalHistoryModal = () => {},
  handleApproval = () => {},
  handleDownload = () => {},
  handleLoadMore = () => {},
  handleSearch = () => {},
  onSort = () => {},
  handleSelectDetail = () => {},
  dataSource = [],
  page = 0,
  hasMore = false,
  searchText = "",
  search = {},
  searchedColumn = {},
  searchInput = null,
  loading = false,
}) => {
  // --- Hooks ---
  const location = useLocation();
  const navigate = useNavigate();

  // --- Derived values ---
  const isStandAlone = moduleType === "sa";
  const isUnderAccount = moduleType === "ua";

  const isStandard = location.pathname.includes("account-standard");
  const isOneTime = location.pathname.includes("account-onetime");

  // --- State ---
  const [fixedColumns, setFixedColumns] = useState(() => ({
    right: ["statusApproval", "status"],
    left: [],
  }));

  // --- Column configuration ---
  // Toolbar and row-level action definitions (approve, history, download, inactivate)
  const itemActions = nxGetAccountActions({
    handleApproval,
    handleApprovalHistory: (id) => handleApprovalHistoryModal(true, id),
    handleDownload,
    handleInactivate: handleInactivateModal,
  });

  // Filter actions by permission, then normalise width/alignment for action columns
  const actionCols = useColumnActionPermission(["Inactivate", "Update", "History"], itemActions, "View", "table").map(
    (col) => ({
      ...col,
      width: 70,
      align: "center",
    })
  );

  // Base data columns → merge with action columns → apply fixed-pin overlay
  const baseColumns = useMemo(() =>
    getGasDepositColumns(
      search,
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  [search, searchInput, searchText, searchedColumn]);

  const columnDefinitions = useMemo(() => [...baseColumns, ...actionCols], [baseColumns, actionCols]);

  const columns = useMemo(() => {
    return nxApplyFixedColumns(columnDefinitions, fixedColumns);
  }, [columnDefinitions, fixedColumns]);

  /**
   * Renders the expanded child row for a gas deposit record,
   * showing its associated detail entries.
   * @param {object} record - The parent gas deposit row record
   */
  const expandedRowRender = (record) => {
    return (
      <GasDepositDetailTable
        data={record.details}
      />
    );
  };

  return (
    <div className="flex flex-col gap-y-4">
      <Toolbar items={itemActions} type="detail" />
      <NxTable
        idTable="gas-deposit-table"
        dataSource={dataSource}
        totalData={totalElement}
        current={page}
        tableScrolled={{ x: dataSource.length ? "max-content" : 4000 }}
        onSort={onSort}
        columns={columns}
        usePagination={false}
        useInfiniteScroll={true}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
        loadMoreThreshold={20}
        fixedColumns={fixedColumns}
        setFixedColumns={setFixedColumns}
        columnDefinitions={columnDefinitions}
        loading={loading}
        expandable={{ expandedRowRender }}
        onRowClick={handleSelectDetail}
      />
    </div>
  );
};

export default GasDepositTable;
