import { memo, useEffect, useMemo, useRef, useState } from "react";
import GasDepositTable from "./GasDepositTable";
import { useDispatch, useSelector } from "react-redux";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import { getGrantedAccessAccount } from "../../../../redux/slices/account_management/accountManagement";
import { getGasDeposit } from "../../../../redux/slices/account_management/detailAccount/GasDepositSlice";
import { useLocation } from "react-router-dom";
import NxBaseContainer from "../../../../components/Nx/NxBaseContainer";
import NxTabs from "../../../../components/Nx/NxTabs";
import NxTable from "../../../../components/Nx/NxTable";
import NxDetailText from "../../../../components/Nx/NxDetailText";
import NxDate from "../../../../components/Nx/NxDatePicker";
import NxStatusComponent from "../../../../components/Nx/NxStatusComponent";
import SummaryBalanceTable from "./SummaryBalanceTable";
import getMutationDetailColumns from "./getMutationDetailColumns";
import SVGIcon from "../../../../assets/Icon/index";
import { Spin } from "antd";

/**
 * Top-level Gas Deposit module container. Renders a Gas Deposit List tab and a
 * Recalculate/Expire History tab. Supports standalone ("sa") and under-account
 * ("ua") contexts; account sub-type is inferred from the URL. Wrapped with `React.memo`.
 *
 * @param {{ accountId?: number; customerId?: number }} props
 */
const GasDeposit = ({ accountId, customerId }) => {
  // --- Hooks ---
  const location = useLocation();
  const dispatch = useDispatch();
  const {
    detail_gasDeposit,
    loading_detailGd,
  } = useSelector((state) => state.gasDeposit);

  // --- State ---
  const [activeKey, setActiveKey] = useState(0);
  const [refreshSignal, setRefreshSignal] = useState(0);
  const [collapsed, setCollapsed] = useState({ detail: false, mutation: false, history: false });

  // --- Mutation table search state ---
  const mutationSearchInput = useRef(null);
  const [mutationSearchedColumn, setMutationSearchedColumn] = useState("");
  const [mutationSearchText, setMutationSearchText] = useState("");
  const [mutationSearch, setMutationSearch] = useState({});

  // --- Derived values ---
  const isStandard = location.pathname.includes("account-standard");
  const isOneTime = location.pathname.includes("account-onetime");
  const hasDetail = !!detail_gasDeposit?.id;

  const {
    id,
    termsEarn,
    termsRedeem,
    periodEarn,
    redeemPeriodStart,
    redeemPeriodEnd,
    billingPeriod,
    timeUnit,
    currency,
    uom,
    quantity,
    amount,
    cashBalance,
    type,
    accountType: gdAccountType,
    classificationType,
    source,
    sapCustId,
    description,
    status,
    statusApproval,
    mutationDetails = [],
    createdDate,
    createdBy,
    updatedDate,
    updatedBy,
  } = detail_gasDeposit;

  // --- Handlers ---
  const triggerRefresh = () => setRefreshSignal((prev) => prev + 1);

  const toggleCollapse = (key) =>
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleMutationSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setMutationSearchText(selectedKeys[0]);
    setMutationSearchedColumn(dataIndex);
    setMutationSearch((prev) => ({ ...prev, [dataIndex]: selectedKeys[0] }));
  };

  const handleViewDetail = (gdId) => {
    setCollapsed({ detail: false, mutation: false, history: false });
    dispatch(getGasDeposit({
      id: gdId,
      body: { page: 0, size: 10, sort: "createdDtm~desc", searchs: {}, filters: [], filterRules: [] },
    }));
  };

  // --- Effects ---
  useEffect(() => {
    let path;
    if (isStandard)
      path = "/account-management/account-standard/gas-deposit";
    else if (isOneTime)
      path = "/account-management/account-onetime/gas-deposit";

    if (path)
      dispatch(getGrantedAccessAccount(path));
  }, []);

  const mutationColumns = useMemo(() =>
    getMutationDetailColumns({
      search: mutationSearch,
      searchInput: mutationSearchInput,
      searchedColumn: mutationSearchedColumn,
      searchText: mutationSearchText,
      handleSearch: handleMutationSearch,
    }),
  [mutationSearch, mutationSearchInput, mutationSearchedColumn, mutationSearchText]);

  const tabOptions = [
    {
      key: 0,
      label: "Gas Deposit",
      children: (
        <NxBaseContainer border>
          <GasDepositTable
            accountId={accountId}
            customerId={customerId}
            onViewDetail={handleViewDetail}
            refreshSignal={refreshSignal}
          />
        </NxBaseContainer>
      )
    },
    {
      key: 1,
      label: "Summary Balance",
      children: (
        <NxBaseContainer border>
          <SummaryBalanceTable
            accountId={accountId}
            customerId={customerId}
            refreshSignal={refreshSignal}
          />
        </NxBaseContainer>
      )
    },
    {
      key: 2,
      label: "History",
      children: (
        <NxBaseContainer border>
          <GasDepositTable
            accountId={accountId}
            customerId={customerId}
            onViewDetail={handleViewDetail}
            refreshSignal={refreshSignal}
          />
        </NxBaseContainer>
      )
    },
  ];

  const collapseBtn = (key) => (
    <button
      onClick={() => toggleCollapse(key)}
      className="flex items-center justify-center p-1 bg-transparent border-0"
    >
      <SVGIcon
        name="IconChevronDown"
        width={24}
        className={`transition-transform duration-200 ${collapsed[key] ? "-rotate-180" : ""}`}
      />
    </button>
  );

  return (
    <div className="flex flex-col gap-y-4">
      <NxCardContainer header="GAS DEPOSIT LIST" withoutPadding>
        <NxTabs
          activeKey={activeKey}
          onChange={setActiveKey}
          items={tabOptions}
        />
      </NxCardContainer>

      {hasDetail && (
        <Spin spinning={loading_detailGd}>
          <div className="flex flex-col gap-y-4">
            <NxCardContainer
              header="GAS DEPOSIT DETAIL"
              withoutPadding
              hideChildren={collapsed.detail}
              actionElement={collapseBtn("detail")}
            >
              <div className="p-4">
                <NxBaseContainer border>
                  <div className="w-full grid grid-cols-4 gap-4">
                    <NxDetailText label="Record Id">{id}</NxDetailText>
                    <NxDetailText label="Billing Period">{billingPeriod}</NxDetailText>
                    <NxDetailText label="Time Unit">{timeUnit}</NxDetailText>
                    <NxDetailText label="Currency">{currency}</NxDetailText>
                    <NxDetailText label="UOM">{uom}</NxDetailText>
                    <NxDetailText label="Quantity">{quantity}</NxDetailText>
                    <NxDetailText label="Amount">{amount}</NxDetailText>
                    <NxDetailText label="Cash Balance">{cashBalance}</NxDetailText>
                    <NxDetailText label="Terms Earn">{termsEarn}</NxDetailText>
                    <NxDetailText label="Terms Redeem">{termsRedeem}</NxDetailText>
                    <NxDetailText label="Period Earn">{NxDate.formatDate(periodEarn, "DD MMM YYYY")}</NxDetailText>
                    <NxDetailText label="Redeem Period Start">{NxDate.formatDate(redeemPeriodStart, "DD MMM YYYY")}</NxDetailText>
                    <NxDetailText label="Redeem Period End">{NxDate.formatDate(redeemPeriodEnd, "DD MMM YYYY")}</NxDetailText>
                    <NxDetailText label="Type">{type}</NxDetailText>
                    <NxDetailText label="Account Type">{gdAccountType}</NxDetailText>
                    <NxDetailText label="Classification">{classificationType}</NxDetailText>
                    <NxDetailText label="Source">{source}</NxDetailText>
                    <NxDetailText label="SAP Cust ID">{sapCustId}</NxDetailText>
                    <NxDetailText label="Status">
                      <NxStatusComponent colour={status} margin={false}>{status}</NxStatusComponent>
                    </NxDetailText>
                    <NxDetailText label="Status Approval">
                      <NxStatusComponent colour={statusApproval} margin={false}>{statusApproval}</NxStatusComponent>
                    </NxDetailText>
                  </div>
                  <div className="w-full mt-4">
                    <NxDetailText label="Description">{description}</NxDetailText>
                  </div>
                </NxBaseContainer>
              </div>
            </NxCardContainer>

            <NxCardContainer
              header="MUTATION DETAIL"
              withoutPadding
              hideChildren={collapsed.mutation}
              actionElement={collapseBtn("mutation")}
            >
              <div className="p-4">
                <NxBaseContainer border>
                  <NxTable
                    idTable="gas-deposit-mutation-detail-table"
                    dataSource={mutationDetails}
                    totalData={mutationDetails.length}
                    columns={mutationColumns}
                    tableScrolled={{ x: "max-content" }}
                    usePagination={false}
                    useInfiniteScroll={true}
                  />
                </NxBaseContainer>
              </div>
            </NxCardContainer>

            <NxCardContainer header="HISTORY LOG INFORMATION" withoutPadding>
              <div className="p-4">
                <NxBaseContainer border>
                  <div className="w-full grid grid-cols-5 gap-4">
                    <NxDetailText label="Record Id">{id}</NxDetailText>
                    <NxDetailText label="Created Date">{NxDate.formatDate(createdDate)}</NxDetailText>
                    <NxDetailText label="Created By">{createdBy}</NxDetailText>
                    <NxDetailText label="Updated Date">{NxDate.formatDate(updatedDate)}</NxDetailText>
                    <NxDetailText label="Updated By">{updatedBy}</NxDetailText>
                  </div>
                </NxBaseContainer>
              </div>
            </NxCardContainer>
          </div>
        </Spin>
      )}
    </div>
  );
};

export default memo(GasDeposit);
