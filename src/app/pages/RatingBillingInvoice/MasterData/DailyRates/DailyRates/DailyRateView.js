import React, { useEffect, useRef, useState } from "react";
import { Checkbox, Spin, Tooltip } from "antd";
import moment from "moment";
import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import BaseContainer from "../../../../../../components/BaseContainer";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../../utils/getColumnSearchProps";
import SVGIcon from "../../../../../../assets/Icon/index";
import { RBI_ROUTES } from "../../../../../../routes/rating_billing/rbi_routes";
import ModalInactivateWithHierarchy from "../../../../../../components/Modal/ModalInactivateWithHierarchy";
import ModalHistory from "../../../../../../components/Modal/ModalHistory";
import {
  getAllApprovalList,
  getApprovalHistory,
  getDailyRatePaginate,
  getDowloadDailyRate,
  getListApprovalById,
  inactiveDailyRates,
} from "../../../../../../redux/slices/rating_billing_invoice/MasterData/dailyrate";
import { hasValue, renderColumn, renderDateColumn } from "../../../../../../utils";
import TablePaginationNew from "../../../../../../components/TablePaginationNew";
import Toolbar from "../../../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../../../components/ColumnActionPermission";

export const columnDailyRate = (
  search,
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => { },
 
) => [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "TYPE",
      dataIndex: "rateType",
      key: "rateType",
      sorter: true,
      align: "left",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "rateType",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => renderColumn('rateType', hasValue(search['rateType']), searchText, text, false, 'input', search)
    },
    {
      title: "FROM CURRENCY",
      dataIndex: "fromCurrencyName",
      key: "fromCurrencyName",
      sorter: true,
      align: "center",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "fromCurrencyName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => renderColumn('fromCurrencyName', hasValue(search['fromCurrencyName']), searchText, text, false, 'input', search)
    },
    {
      title: "TO CURRENCY",
      dataIndex: "toCurrencyName",
      key: "toCurrencyName",
      sorter: true,
      align: "center",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "toCurrencyName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => renderColumn('toCurrencyName', hasValue(search['toCurrencyName']), searchText, text, false, 'input', search)
    },
    {
      title: "RATE DATE",
      dataIndex: "rateDate",
      key: "rateDate",
      sorter: true,
      align: "center",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "rateDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "date"
      ),
      render: (text) => renderDateColumn('rateDate', hasValue(search['rateDate']), searchText, text, 'date', search)
    },
    {
      title: "CONVERTED RATE",
      dataIndex: "convertedRate",
      key: "convertedRate",
      sorter: true,
      align: "right",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "convertedRate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      ellipsis: {
        showTitle: false,
      },
      render: (text, record) => {
        // const currency = record.currencyIds || 244;
        const tempValue = text ? (text + "").split(".") : [];
        const thousandSeparator = ",";
        const decimalSeparator = ".";
        const descimal = tempValue[1]
          ? `${decimalSeparator}${tempValue[1]}`
          : `${decimalSeparator}00`;
        const value =
          tempValue.length > 0
            ? tempValue[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator) +
            descimal
            : "";

        return renderColumn('convertedRate', hasValue(search['convertedRate']), searchText, value, true, 'input', search)

        // if (searchedColumn === "convertedRate") {
        //   const highlight = (
        //     <Highlighter
        //       highlightStyle={{
        //         backgroundColor: "#ffc069",
        //         padding: 0,
        //       }}
        //       searchWords={[searchText]}
        //       autoEscape
        //       textToHighlight={value || ""}
        //     />
        //   );
        //   if (value) {
        //     return (
        //       <Tooltip placement="topLeft" title={value}>
        //         {highlight}
        //       </Tooltip>
        //     );
        //   }
        //   return highlight;
        // } else {
        //   if (value) {
        //     return (
        //       <Tooltip placement="topLeft" title={value}>
        //         {value}
        //       </Tooltip>
        //     );
        //   }
        //   return "";
        // }
      },
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      key: "description",
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "description",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      ellipsis: {
        showTitle: false,
      },
      render: (text) => renderColumn('description', hasValue(search['description']), searchText, text, true, 'input', search)
    },

    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      fixed: "right",
      width: 150,
      sorter: true,
      align: "left",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "status",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (a) => {
        let text;
        switch (a) {
          case "ACTIVE":
            text = "Active";
            break;
          case "INACTIVE":
            text = "Inactive";
            break;
          case "DRAFT":
            text = "Draft";
            break;
          default:
            text = a ? a.charAt(0).toUpperCase() + a.slice(1).toLowerCase() : a;
            break;
        }
        return renderColumn('status', hasValue(search['status']), searchText, text, false, 'status', search)

      },
    },
    {
      title: "STATUS APPROVAL",
      dataIndex: "statusApproval",
      key: "statusApproval",
      fixed: "right",
      width: 200,
      sorter: true,
      align: "right",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "statusApproval",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (a) => {
        let text;
        switch (a) {
          case "WAITING APPROVAL":
            text = "Waiting Approval";
            break;
          case "DRAFT":
            text = "Draft";
            break;
          case "APPROVAL":
            text = "Approval";
            break;
          default:
            text = a ? a.charAt(0).toUpperCase() + a.slice(1).toLowerCase() : a;
            break;
        }
        return renderColumn('status', hasValue(search['status']), searchText, text, false, 'status', search)
      },
    },
  ];

const DailyRateView = ({ dispatch }) => {
  const { data_list, dataApprovalHistory, loading } = useSelector(
    (state) => state.daily_rate
  );

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const searchInput = useRef(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [search, setSearch] = useState({});
  const [sort, setSort] = useState("");

  const [openModalInactivate, setOpenModalInactivate] = useState(false);
  const [openModalHistory, setOpenModalHistory] = useState(false);
  const [dataInactivate, setDataInactivate] = useState({});
  const [dataApprovalHistoryFix, setDataApprovalHistoryFix] = useState({});
  const [ratesId, setRatesId] = useState("");

  const formatRupiah = (nilai) => {
    // Separate integer and decimal parts
    const parts = nilai.toString().split(".");
    // Format integer part with commas
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    // Join integer and decimal parts with a dot
    return parts.join(".");
  };

  // validasi tanggal
  const disabledDate = (current) => {
    return moment(current).isBefore(moment(), "day");
  };

  // Use Effect
  useEffect(() => {
    dispatch(
      getDailyRatePaginate({
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize,
        sort,
      })
    );
  }, [search, page, pageSize, sort, dispatch]);

  // Function Search Column
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

  //handleApproval history
  useEffect(() => {
    if (dataApprovalHistory && dataApprovalHistory?.dataApprover) {
      const temp = {
        dataApprover: {
          create: dataApprovalHistory?.dataApprover?.DAILY_RATES || [],
          inactive:
            dataApprovalHistory?.dataApprover?.INACTIVE_DAILY_RATES || [],
        },
        dataHistory: {
          create: dataApprovalHistory?.dataHistory?.DAILY_RATES || [],
          inactive:
            dataApprovalHistory?.dataHistory?.INACTIVE_DAILY_RATES || [],
        },
      };
      setDataApprovalHistoryFix(temp);
    } else {
      setDataApprovalHistoryFix({});
    }
  }, [dataApprovalHistory]);

  const handleOptions = () => {
    const data = dataApprovalHistoryFix?.dataApprover || {};
    const keyData = Object.keys(data);
    return keyData.map((item) => ({
      value: item.charAt(0).toUpperCase() + item.slice(1).toLowerCase(),
    }));
  };

  const handleApprovalHistory = (data) => {
    dispatch(getApprovalHistory(data.ratesId));
    setOpenModalHistory(true);
  };

  //handle inactive
  const handleInactive = (r) => {
    setRatesId(r?.ratesId);
    setOpenModalInactivate(true);
  };
  const handleCancelModalInactivate = () => {
    setDataInactivate({});
    setOpenModalInactivate(false);
  };

  const handleChange = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const handleSubmitModalInactivate = (res, handleClear) => {
    const body = {
      ratesId: ratesId,
      appHierId: res.approvalHierarchy, // Anda dapat menghapus ini jika tidak perlu
      remark: res.remark, // Anda dapat menghapus ini jika tidak perlu
      // status: status === "Inactive" ? "Active" : "Inactive",
    };
    dispatch(inactiveDailyRates({ body }))
      .unwrap()
      .then(() => {
        handleClear();
        handleCancelModalInactivate();
        dispatch(
          getDailyRatePaginate({
            search: encodeURIComponent(JSON.stringify(search)),
            page,
            pageSize,
            sort,
          })
        );
      });
  };

  // Grant Access Item
  const itemGrantAccess = [
    {
      action: "Download",
      render: (
        <ButtonComponent
          icon={<SVGIcon name="IconButtonDownload" width={24} />}
          type="submit"
          onClick={() => {
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
              getDowloadDailyRate({
                search: tempSearch,
                page,
                pageSize,
                sort,
              })
            );
          }}
        >
          Download List
        </ButtonComponent>
      ),
    },
    {
      action: "Create",
      render: (
        <NavLink to={RBI_ROUTES.DAILY_RATE_CREATE}>
          <ButtonComponent
            icon={<SVGIcon name="IconButtonCreate" width={24} />}
            type="submit"
          >
            Create Daily Rates
          </ButtonComponent>
        </NavLink>
      ),
    },

    // Column Action Table
    {
      action: "View",
      type: "table",
      render: (record) => {
        return (
          <Link
            to={RBI_ROUTES.DAILY_RATE_DETAIL}
            state={{ id: record?.ratesId }}
          >
            <Tooltip title="Detail">
              <div className="pt-1">
                <SVGIcon name="IconDetail" width={24} />
              </div>
            </Tooltip>
          </Link>
        );
      },
    },
    {
      action: "Update",
      type: "table",
      render: (record, data) => {
        const isEditable =
          record.status === "DRAFT" ||
          (record.status === "ACTIVE" &&
            !moment(record?.rateDate).isBefore(moment(), "day") &&
            !moment(record?.rateDate).isSame(moment(), "day"));

        const linkContent =
          data > 3 ? (
            <ButtonComponent
              icon={<SVGIcon name="IconEdit" color={isEditable ? "#0075bf" : "#8D91A0"} width={24} />}
              border={false}
              disabled={!isEditable}
            >
              <span className={`ml-3 ${isEditable ? "text-black " : "text-[#8D91A0]"}`}> Update</span>
            </ButtonComponent>
          ) : (
            <Tooltip title="Update">
              <div className="pt-1">
                <SVGIcon
                  name="IconEdit"
                  width={24}
                  color={!isEditable ? "#8D91A0" : "#ACC424"}
                  className={!isEditable ? "cursor-not-allowed" : undefined}
                />
              </div>
            </Tooltip>
          );

        return isEditable ? (
          <Link
            to={RBI_ROUTES.DAILY_RATE_UPDATE}
            state={{
              id: record.ratesId,
              status: record.status,
              statusApproval: record.statusApproval,
            }}
          >
            {linkContent}
          </Link>
        ) : (
          <div>{linkContent}</div>
        );
      },
    },
    {
      action: "Activate",
      type: "table",
      render: (record, data) => {
        const isActivateOrInactivate =
          (record.statusApproval === "APPROVED" &&
            record.status === "ACTIVE") ||
          (record.statusApproval === "DRAFT" && record.status === "ACTIVE") ||
          (record.statusApproval === "REJECTED" &&
            record.status === "ACTIVE") ||
          (record.statusApproval === "WAITING APPROVAL" &&
            record.status === "ACTIVE") ||
          moment(record?.rateDate).isBefore(moment(), "day");

        const Content =
          data > 3 ? (
            <ButtonComponent
              icon={
                <Checkbox
                  className="inactive-check"
                  onClick={() => handleInactive(record)}
                  disabled={record.status === "ACTIVE" ? false : true}
                  checked={record.status === "ACTIVE" ? false : true}
                />
              }
              border={false}
              disabled={!isActivateOrInactivate}
              onClick={() => handleInactive(record)}
            >
              <span className="text-black ml-5">
                {record.status !== "ACTIVE" ? "Activate" : "Inactivate"}
              </span>
            </ButtonComponent>
          ) : (
            <Tooltip
              title={record.status === "ACTIVE" ? "Inactivate" : "Activate"}
            >
              <div className="pt-1">
                <Checkbox
                  className="inactive-check"
                  onClick={() => handleInactive(record)}
                  disabled={record.status === "ACTIVE" ? false : true}
                  checked={record.status === "ACTIVE" ? false : true}
                />
              </div>
            </Tooltip>
          );

        return Content;
      },
    },
    {
      action: "History",
      type: "table",
      render: (record, data) => {
        const Content =
          data > 3 ? (
            <ButtonComponent
              icon={
                <SVGIcon name="IconLogHistory" color={"#0075bf"} width={24} />
              }
              border={false}
              onClick={() => handleApprovalHistory(record)}
            >
              <span className={"text-black ml-3"}>Approval History</span>
            </ButtonComponent>
          ) : (
            <Tooltip title="Approval History">
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

        return Content;
      },
    },
  ];

  return (
    <div>
      <Spin spinning={loading}>
        <div className="w-full flex justify-end gap-[20px]">
          <Toolbar items={itemGrantAccess} />
        </div>
        <BaseContainer header={"DAILY RATES LIST"}>
          <TablePaginationNew
            dataSource={data_list?.result}
            pageSize={pageSize}
            columns={[
              ...columnDailyRate(
                search,
                page,
                pageSize,
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
                handleInactive,
                handleApprovalHistory,
                formatRupiah,
                disabledDate
              ),
              ...useColumnActionPermission(
                ["view", "activate", "update", "history"],
                itemGrantAccess
              ),
            ]}
            current={page}
            onChange={handleChange}
            onSizeChanger={handleChange}
            totalData={data_list?.page?.totalElements || 0}
            onSort={onSort}
            tableScrolled={{
              x: 2500,
              y: 525,
            }}
          />
        </BaseContainer>

        <ModalInactivateWithHierarchy
          dispatch={dispatch}
          getAPIOption={getAllApprovalList}
          getAPIDetail={getListApprovalById}
          selector={"daily_rate"}
          alertMessage={`Are you sure you want to inactivate `}
          openModalInactivate={openModalInactivate}
          handleCloseModalInactivate={handleCancelModalInactivate}
          onFinish={handleSubmitModalInactivate}
        />

        <ModalHistory
          isOpen={openModalHistory && dataApprovalHistoryFix}
          handleClose={() => setOpenModalHistory(false)}
          header={"Approval History"}
          width={850}
          tabOptions={handleOptions()}
          dataApprover={dataApprovalHistoryFix?.dataApprover}
          dataHistory={dataApprovalHistoryFix?.dataHistory}
        />
      </Spin>
    </div>
  );
};

export default DailyRateView;
