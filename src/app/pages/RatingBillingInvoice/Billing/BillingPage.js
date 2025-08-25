import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spin, Radio, Tooltip } from "antd";
import BreadCrumb from "../../../../components/BreadCrumb";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import ButtonComponent from "../../../../components/ButtonComponent";
import { RBI_ROUTES } from "../../../../routes/rating_billing/rbi_routes";
import SVGIcon from "../../../../assets/Icon/index";
import BaseContainer from "../../../../components/BaseContainer";
import ModalHistory from "../../../../components/Modal/ModalHistory";
import {
  downloadBillingList,
  getAllBillingApprovePaginate,
  getAllBillingPaginate,
  getAllBillingRequestPaginate,
  getApprovalHistory,
} from "../../../../redux/slices/rating_billing_invoice/billing";
import { columnsBilling } from "./Table/TableViewBilling";
import BillingDetail from "./Detail/BillingDetail";
import ModalRequestApproval from "./ModalRequestApproval";
import ModalApprovalBilling from "./ModalApprovalBilling";
import TablePaginationNew from "../../../../components/TablePaginationNew";
import Toolbar from "../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";

const BillingPage = () => {
  // Selector
  const { data, loading, data_approval_history } = useSelector(
    (state) => state.billing
  );

  // Declaration
  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const dataSource = data?.result;

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});

  const [valueTab, setValueTab] = useState("Billing Gas");
  const [pageDetail, setPageDetail] = useState(false);
  const [modalRequest, setModalRequest] = useState(false);
  const [modalApprovalHistory, setModalApprovalHistory] = useState(false);
  const [modalApproval, setModalApproval] = useState(false);
  const [dataApprovalHistory, setDataApprovalHistory] = useState({});
  const [billingCode, setBillingCode] = useState("");
  const [ratingCode, setRatingCode] = useState("");
  const [saNumberId, setSANumberId] = useState("");
  const [calculationCodeId, setCalculationCodeId] = useState("");
  const [accountNumberId, setAccountNumberId] = useState("");

  // Use Effect
  useEffect(() => {
    dispatch(
      getAllBillingPaginate({
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize,
        sort,
      })
    );
  }, [search, page, pageSize, sort, dispatch]);

  useEffect(() => {
    if (data_approval_history?.dataApprover) {
      const temp = {
        dataApprover: data_approval_history?.dataApprover?.BILLING || [],
        dataHistory: data_approval_history?.dataHistory?.BILLING || [],
      };
      setDataApprovalHistory(temp);
    } else {
      setDataApprovalHistory({});
    }
  }, [data_approval_history]);

  // Breadcrumbs
  const routes = [
    {
      path: "",
      breadcrumbName: "Rating & Billing",
    },
    {
      path: RBI_ROUTES.BILLING_VIEW,
      breadcrumbName: "Billing",
    },
  ];

  // Value Tab
  const tabBilling = [
    {
      label: "Billing Gas",
      value: "Billing Gas",
    },
    {
      label: "Billing Non Gas",
      value: "Billing Non Gas",
      disabled: true,
    },
    {
      label: "All",
      value: "All",
      disabled: true,
    },
  ];

  // Function Search API
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

  // Handle Change Page
  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  // Sort Table
  const onSortApi = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  // Handle Download
  const handleDownload = () => {
    let tempSearch = "";
    for (const dataIndex in search) {
      if (Object.hasOwnProperty.call(search, dataIndex)) {
        const tempSearchText = search[dataIndex];
        if (tempSearchText) {
          tempSearch += `${dataIndex}~${tempSearchText},`;
        }
      }
    }
    tempSearch = tempSearch ? tempSearch.slice(0, -1) : "";
    dispatch(
      downloadBillingList({
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize,
        sort,
      })
    );
  };

  // Handle Detail
  const handleDetail = (record) => {
    setPageDetail(true);
    setBillingCode(record.billingCode);
    setRatingCode(record.ratingCode);
    setAccountNumberId(record.accountNumber);
    setSANumberId(record.saNumber);
    setCalculationCodeId(record.calculationCode);
  };

  // Handle Approval History
  const handleApprovalHistory = (record) => {
    dispatch(getApprovalHistory(record.billingCode));
    setModalApprovalHistory(true);
  };

  // Handle Value Tab
  const onChangeTab = ({ target: { value } }) => {
    setValueTab(value);
  };

  // Handle Refresh
  const handleRefresh = () => {
    let tempSearch = "";
    for (const dataIndex in search) {
      if (Object.hasOwnProperty.call(search, dataIndex)) {
        const tempSearchText = search[dataIndex];
        if (tempSearchText) {
          tempSearch += `${dataIndex}~${tempSearchText},`;
        }
      }
    }
    tempSearch = tempSearch ? tempSearch.slice(0, -1) : "";
    const reqSearch = encodeURIComponent(JSON.stringify(search));
    dispatch(
      getAllBillingPaginate({ search: reqSearch, page, pageSize, sort })
    );
    dispatch(getAllBillingRequestPaginate());
    dispatch(getAllBillingApprovePaginate());
  };

  const itemGrantAccess = [
    {
      action: "Download",
      render: (
        <ButtonComponent
          icon={<SVGIcon name="IconButtonDownload" width={24} />}
          type="submit"
          onClick={handleDownload}
        >
          Download List
        </ButtonComponent>
      ),
    },
    {
      action: "Approval",
      render: (
        <ButtonComponent
          icon={<SVGIcon name="IconRequestApproval" width={24} color="#FFF" />}
          type="submit"
          onClick={() => setModalApproval(true)}
        >
          Approval
        </ButtonComponent>
      ),
    },
    {
      action: "Request",
      render: (
        <ButtonComponent
          icon={<SVGIcon name="IconButtonCreate" width={24} />}
          type="submit"
          onClick={() => setModalRequest(true)}
        >
          Request Approval
        </ButtonComponent>
      ),
    },

    // Column Action Table
    {
      action: "View",
      type: "table",
      render: (record) => {
        return (
          <Tooltip title="Detail">
            <div className="pt-1">
              <SVGIcon
                name="IconDetail"
                width={24}
                onClick={() => handleDetail(record)}
              />
            </div>
          </Tooltip>
        );
      },
    },
    {
      action: "History",
      type: "table",
      render: (record) => {
        return (
          <Tooltip title="Approval Hierarchy">
            <div className="pt-1">
              <SVGIcon
                name="IconLogHistory"
                color={"#0075bf"}
                width={24}
                onClick={() => handleApprovalHistory(record)}
              />
            </div>
          </Tooltip>
        );
      },
    },
  ];

  return (
    <LayoutMenu>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />

        <div className="w-full flex justify-end gap-[20px]">
          <Toolbar items={itemGrantAccess} />
        </div>

        <BaseContainer
          header={"Billing List"}
          type="tabs"
          element={
            <Radio.Group
              options={tabBilling}
              onChange={onChangeTab}
              value={valueTab}
              optionType="button"
              buttonStyle="solid"
              style={{ gap: 12, display: "flex" }}
            />
          }
        >
          <div className="w-full">
            <TablePaginationNew
              dataSource={dataSource}
              columns={[
                ...columnsBilling(
                  page,
                  pageSize,
                  searchInput,
                  searchedColumn,
                  searchText,
                  handleSearch,
                  search,
                  // handleDetail,
                  // handleApprovalHistory
                ),
                ...useColumnActionPermission(
                  ["view", "history"],
                  itemGrantAccess
                ),
              ]}
              current={page}
              pageSize={pageSize}
              onChange={handleChange}
              onSizeChanger={handleChange}
              totalData={data?.page?.totalElements || 0}
              onSort={onSortApi}
              tableScrolled={{ y: 525, x: 16000 }}
            />
          </div>
        </BaseContainer>

        {/* Detail Billing */}
        {pageDetail === true ? (
          <BillingDetail
            billingCodeId={billingCode}
            ratingCodeId={ratingCode}
            saNumberId={saNumberId}
            accountNumberId={accountNumberId}
            calculationCodeId={calculationCodeId}
          />
        ) : null}

        {/* Modal Approval History */}
        <ModalHistory
          isOpen={modalApprovalHistory && dataApprovalHistory}
          handleClose={() => setModalApprovalHistory(false)}
          header={"Approval History"}
          width={1000}
          dataApprover={dataApprovalHistory?.dataApprover}
          dataHistory={dataApprovalHistory?.dataHistory}
        />

        {/* Modal Request Approval */}
        <ModalRequestApproval
          isOpen={modalRequest}
          handleCancel={() => setModalRequest(false)}
          handleRefresh={handleRefresh}
          handleOpenModal={() => setModalRequest(true)}
        />

        {/* Modal Approval */}
        <ModalApprovalBilling
          isOpen={modalApproval}
          handleCancel={() => setModalApproval(false)}
          handleRefresh={handleRefresh}
          handleOpenModal={() => setModalApproval(true)}
        />
      </Spin>
    </LayoutMenu>
  );
};

export default BillingPage;
