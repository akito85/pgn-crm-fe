import React, { useState, useRef, useCallback } from "react";
import ButtonComponent from "../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../assets/Icon/index";
// import TablePagination from "../../../../../components/TablePagination";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Form, Select, Tooltip } from "antd";
// import Highlighter from "react-highlight-words";
// import StatusComponent from "../../../../../components/StatusComponent";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import InputComponent from "../../../../../components/InputComponent";
import SelectComponent from "../../../../../components/SelectComponent";
import DateComponent from "../../../../../components/DateComponent";
import moment from "moment";
import { useEffect } from "react";
import { PRODUCT_PROMO_ROUTES } from "../../../../../routes/product_promo/pp_routes";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  getListCurrency,
  getListUom,
} from "../../../../../redux/slices/product_promo/pricing";
import { showModalError } from "../../../../../redux/slices/general_slice";
import { hasValue, renderColumn, renderDateColumn, requiredMessage } from "../../../../../utils";
import { getColumnSearchPropsUseFilteredValueFE } from "../../../../../utils/getColumnSearchProps";
import TablePaginationNew from "../../../../../components/TablePaginationNew";
import { separatorCurrency } from "../../UtilsProduct/UtilsAllProduct";
import NxTable from "../../../../../components/Nx/NxTable";

// const onFilter = (dataIndex, value, record) => {
//   const fixSearchText = value.toLowerCase();
//   switch (dataIndex) {
//     case "value":
//       const tempValue = record[dataIndex]
//         ? (record[dataIndex] + "").split(".")
//         : [];
//       const thousandSeparator = ".";
//       const decimalSeparator = ",";
//       const descimal = tempValue[1]
//         ? `${decimalSeparator}${tempValue[1]}`
//         : `${decimalSeparator}00`;
//       const format =
//         tempValue.length > 0
//           ? tempValue[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator) +
//             descimal
//           : "";
//       return format.toLowerCase().includes(fixSearchText);
//     case "startDate":
//     case "endDate":
//       const date = record[dataIndex]
//         ? moment(record[dataIndex]).format("DD MMM YYYY")
//         : "";
//       return date.toLowerCase().includes(fixSearchText);
//     case "status":
//       const endDate = record?.endDate;
//       const value = endDate
//         ? moment(endDate).diff(moment()) >= 0
//           ? "Active"
//           : "Inactive"
//         : "Active";
//       return value.toLowerCase().includes(fixSearchText);
//     default:
//       return record[dataIndex]?.toLowerCase().includes(fixSearchText);
//   }
// };

const sorter = (fieldSort, a, b) => {
  const handleDataSort = (obj) => {
    switch (fieldSort) {
      case "value":
        // const tempValue = obj[fieldSort]
        //   ? (obj[fieldSort] + "").split(".")
        //   : [];
        // const thousandSeparator = ".";
        // const decimalSeparator = ",";
        // const descimal = tempValue[1]
        //   ? `${decimalSeparator}${tempValue[1]}`
        //   : `${decimalSeparator}00`;
        // const format =
        //   tempValue.length > 0
        //     ? tempValue[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator) +
        //       descimal
        //     : "";
            return separatorCurrency(obj[fieldSort])?.replace(/,/g, "");
      case "startDate":
      case "endDate":
        return obj[fieldSort]
          ? moment(obj[fieldSort])
          : "";
        // return date.toLowerCase();
      case "status":
        const endDate = obj?.endDate;
        const value = endDate
          ? moment(endDate).diff(moment()) >= 0
            ? "Active"
            : "Inactive"
          : "Active";
        return value.toLowerCase();
      default:
        return obj[fieldSort]?.toLowerCase();
    }
  };
  let fa = handleDataSort(a);
  let fb = handleDataSort(b);

  const handleCompare = (a, b) => {
    switch (fieldSort) {
      case "startDate":
      case "endDate":
        if (a && b) {
          if (a.isBefore(b)) return -1;
          if (a.isAfter(b)) return 1;
          return 0;
        }
        return 0; // Handle null cases if necessary
      case "value":
        return Math.sign(parseFloat(a) - parseFloat(b));
      default:
        return a.localeCompare(b);
    }
  }
    return handleCompare(fa, fb);
};

const columns = (
  search,
  storedData,
  page,
  pageSize,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch,
  type,
  handleUpdate,
  handleDelete,
  updateSelectedData,
  updateHistoryEndDate,
  selectPriceCodeAdjust
) => {
  const result = [
    {
      title: "NO",
      key: "no",
      width: 60,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "CURRENCY",
      key: "currency",
      width: 160,
      align: "center",
      dataIndex: "currency",
      filteredValue: search?.["currency"] ? [search?.["currency"]] : null,
      // onFilter: (value, record) => onFilter("currency", value, record),
      sorter: (a, b) => sorter("currency", a, b),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "currency",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input",
        storedData
      ),
      render: (text) =>
        renderColumn(
          "currency",
          hasValue(search["currency"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
      // ...getColumnSearchPropsPaging(
      //   "currency",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
    },
    {
      title: "VALUE",
      key: "value",
      width: 160,
      align: "right",
      dataIndex: "value",
      filteredValue: search?.["value"] ? [search?.["value"]] : null,
      // onFilter: (value, record) => onFilter("value", value, record),
      sorter: (a, b) => sorter("value", a, b),
      // ...getColumnSearchPropsPaging(
      //   "value",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch,
      //   true
      // ),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "value",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "currency",
        storedData
      ),
      render: (text) =>
        renderColumn(
          "value",
          hasValue(search["value"]),
          searchText,
          separatorCurrency(text), //text to search
          false,
          "input",
          search
        ),

      // render: (text, record) => {
      //   // const currency = record.currencyIds || 244;
      //   const tempValue = text ? (text + "").split(".") : [];
      //   const thousandSeparator = ".";
      //   const decimalSeparator = ",";
      //   const descimal = tempValue[1]
      //     ? `${decimalSeparator}${tempValue[1]}`
      //     : `${decimalSeparator}00`;
      //   const value =
      //     tempValue.length > 0
      //       ? tempValue[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator) +
      //         descimal
      //       : "";
      //   if (searchedColumn === "value") {
      //     const highlight = (
      //       <Highlighter
      //         highlightStyle={{
      //           backgroundColor: "#ffc069",
      //           padding: 0,
      //         }}
      //         searchWords={[searchText]}
      //         autoEscape
      //         textToHighlight={value || ""}
      //       />
      //     );
      //     if (value) {
      //       return (
      //         <Tooltip placement="topLeft" title={value}>
      //           {highlight}
      //         </Tooltip>
      //       );
      //     }
      //     return highlight;
      //   } else {
      //     if (value) {
      //       return (
      //         <Tooltip placement="topLeft" title={value}>
      //           {value}
      //         </Tooltip>
      //       );
      //     }
      //     return "";
      //   }
      // },
    },
    {
      title: "UOM",
      key: "uom",
      width: 160,
      align: "center",
      dataIndex: "uom",
      filteredValue: search?.["uom"] ? [search?.["uom"]] : null,
      // onFilter: (value, record) => onFilter("uom", value, record),
      sorter: (a, b) => sorter("uom", a, b),
      // ...getColumnSearchPropsPaging(
      //   "uom",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch
      // ),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "uom",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input",
        storedData
      ),
      render: (text) =>
        renderColumn(
          "uom",
          hasValue(search["uom"]),
          searchText,
          text,
          false,
          "input",
          search
        ),
    },
    {
      title: "START DATE",
      key: "startDate",
      width: 160,
      align: "center",
      dataIndex: "startDate",
      filteredValue: search?.["startDate"] ? [search?.["startDate"]] : null,
      // onFilter: (value, record) => onFilter("startDate", value, record),
      sorter: (a, b) => sorter("startDate", a, b),
      // ...getColumnSearchPropsPaging(
      //   "startDate",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch,
      //   true
      // ),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "startDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "date",
        storedData
      ),
      render: (text) =>
        renderDateColumn(
          "startDate",
          hasValue(search["startDate"]),
          searchText,
          text,
          "date",
          search
        ),
      // render: (index) => {
      //   const text = index ? moment(index).format("DD MMM YYYY") : "";
      //   if (searchedColumn === "startDate") {
      //     return (
      //       <Highlighter
      //         highlightStyle={{
      //           backgroundColor: "#ffc069",
      //           padding: 0,
      //         }}
      //         searchWords={[searchText]}
      //         autoEscape
      //         textToHighlight={text ? text.toString() : ""}
      //       />
      //     );
      //   } else {
      //     return text || "";
      //   }
      // },
    },
    {
      title: "END DATE",
      key: "endDate",
      width: 160,
      align: "center",
      dataIndex: "endDate",
      filteredValue: search?.["endDate"] ? [search?.["endDate"]] : null,
      // onFilter: (value, record) => onFilter("endDate", value, record),
      sorter: (a, b) => sorter("endDate", a, b),
      // ...getColumnSearchPropsPaging(
      //   "endDate",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch,
      //   true
      // ),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "endDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "date",
        storedData
      ),
      render: (text) =>
        renderDateColumn(
          "endDate",
          hasValue(search["endDate"]),
          searchText,
          text,
          "date",
          search
        ),
      // render: (index) => {
      //   const text = index ? moment(index).format("DD MMM YYYY") : "";
      //   if (searchedColumn === "endDate") {
      //     return (
      //       <Highlighter
      //         highlightStyle={{
      //           backgroundColor: "#ffc069",
      //           padding: 0,
      //         }}
      //         searchWords={[searchText]}
      //         autoEscape
      //         textToHighlight={text ? text.toString() : ""}
      //       />
      //     );
      //   } else {
      //     return text || "";
      //   }
      // },
    },
    {
      title: "STATUS",
      key: "status",
      width: 160,
      filteredValue: search?.["status"] ? [search?.["status"]] : null,
      // onFilter: (value, record) => onFilter("status", value, record),
      sorter: (a, b) => sorter("status", a, b),
      // ...getColumnSearchPropsPaging(
      //   "status",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch,
      //   true
      // ),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "status",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (index, record) => {
        const valueStatus = () => {
          if (!record.endDate) {
            if (moment(record.startDate) > moment()) {
              return "Inactive";
            }
            return "Active";
          } else {
            if (
              moment(record.startDate) <= moment() &&
              moment() <= moment(record.endDate)
            ) {
              return "Active";
            }
            return "Inactive";
          }
        };
        const value = valueStatus();
        return renderColumn(
          "status",
          hasValue(search["status"]),
          searchText,
          value,
          false,
          "status",
          search
        );
      },
      // render: (index, record) => {
      //   const valueStatus = () => {
      //     if (!record.endDate) {
      //       if (moment(record.startDate) > moment()) {
      //         return "Inactive";
      //       }
      //       return "Active";
      //     } else {
      //       if (
      //         moment(record.startDate) <= moment() &&
      //         moment() <= moment(record.endDate)
      //       ) {
      //         return "Active";
      //       }
      //       return "Inactive";
      //     }
      //   };
      //   const value = valueStatus();
      //   return (
      //     <div className={" flex justify-center"}>
      //       <StatusComponent colour={value}>{value}</StatusComponent>
      //     </div>
      //   );
      // },
    },
    {
      title: "DESCRIPTION",
      key: "description",
      width: 180,
      dataIndex: "description",
      filteredValue: search?.["description"] ? [search?.["description"]] : null,
      // onFilter: (value, record) => onFilter("description", value, record),
      sorter: (a, b) => sorter("description", a, b),
      // ...getColumnSearchPropsPaging(
      //   "description",
      //   searchInput,
      //   searchedColumn,
      //   searchText,
      //   handleSearch,
      //   true
      // ),
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "description",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input",
        storedData
      ),
      render: (text) =>
        renderColumn(
          "description",
          hasValue(search["description"]),
          searchText,
          text,
          true,
          "input",
          search
        ),
      // render: (text) => {
      //   if (searchedColumn === "description") {
      //     return (
      //       <Tooltip placement="topLeft" title={text}>
      //         <Highlighter
      //           highlightStyle={{
      //             backgroundColor: "#ffc069",
      //             padding: 0,
      //           }}
      //           searchWords={[searchText]}
      //           autoEscape
      //           textToHighlight={text ? text.toString() : ""}
      //         />
      //       </Tooltip>
      //     );
      //   } else {
      //     if (text) {
      //       return (
      //         <Tooltip placement="topLeft" title={text}>
      //           {text}
      //         </Tooltip>
      //       );
      //     }
      //     return "";
      //   }
      // },
    },
    {
      title: "ACTION",
      key: "action",
      width: 120,
      align: "center",
      fixed: "right",
      render: (v, r, i) => {
        return (
          <div className="flex w-full justify-center align-middle gap-2">
            {type !== "detail" ? (
              <>
                <Tooltip title="Edit">
                  <span className="flex justify-center">
                    <SVGIcon
                      name="IconEdit"
                      width={24}
                      onClick={() => handleUpdate(r)}
                    />
                  </span>
                </Tooltip>
                <Tooltip title="Delete">
                  <span
                    className={`flex justify-center${
                      r.type === "exist" ? " cursor-not-allowed" : ""
                    }`}
                  >
                    <SVGIcon
                      name="IconDelete"
                      color={r.type !== "exist" ? "#D90000" : "#8D91A0"}
                      width={24}
                      className={r.type === "exist" ? "disabled" : undefined}
                      onClick={
                        r.type !== "exist" ? () => handleDelete(r) : undefined
                      }
                    />
                  </span>
                </Tooltip>
              </>
            ) : selectPriceCodeAdjust === undefined ? (
              <>
                <Tooltip title="Detail">
                  <span
                    className={`flex justify-center${
                      r.id ? "" : " cursor-not-allowed"
                    }`}
                  >
                    <SVGIcon
                      name="IconDetail"
                      width={24}
                      onClick={r.id ? () => updateSelectedData(r) : undefined}
                      color={r.id ? "#0075BF" : "#8D91A0"}
                    />
                  </span>
                </Tooltip>
                <Tooltip title="Create Price Adjustment">
                  {r.id ? (
                    <Link
                      to={PRODUCT_PROMO_ROUTES.CREATE_PRICING_ADJUSTMENT}
                      state={{ id: r.id, prevPage: "detail-pricing" }}
                    >
                      <SVGIcon
                        name="IconActionCreate"
                        color={"#0075bf"}
                        width={24}
                      />
                    </Link>
                  ) : (
                    <span className={"flex justify-center cursor-not-allowed"}>
                      <SVGIcon
                        name="IconActionCreate"
                        color={"#8D91A0"}
                        width={24}
                      />
                    </span>
                  )}
                </Tooltip>
                <Tooltip title={"End Date History"}>
                  <span
                    className={`flex justify-center${
                      r.id ? "" : " cursor-not-allowed"
                    }`}
                  >
                    <SVGIcon
                      name="IconCalendarEvent"
                      color={r.id ? "#0075bf" : "#8D91A0"}
                      width={24}
                      onClick={r.id ? () => updateHistoryEndDate(r) : undefined}
                    />
                  </span>
                </Tooltip>
              </>
            ) : (
              <Tooltip title="Choose Detail">
                <span className="flex justify-center">
                  <PlusCircleOutlined
                    width={24}
                    onClick={() => selectPriceCodeAdjust(r)}
                    style={{ color: "#0075bf" }}
                  />
                </span>
              </Tooltip>
            )}
          </div>
        );
      },
      key: "action",
    },
  ];

  if (type === "preview") {
    return result.filter(
      (col) => col.title !== "STATUS" && col.title !== "ACTION"
    );
  }

  return type === "detail" && selectPriceCodeAdjust === undefined
    ? result
    : result.filter((col) => col.title !== "STATUS");
};
const typeFormList = ["create", "update"];
const PricingDetailTableDetail = ({
  type,
  data = [],
  priceCode = "-",
  updateData = () => {},
  updateSelectedData = () => {},
  updateHistoryEndDate = () => {},
  selectPriceCodeAdjust,
  dispatch,
  status,
}) => {
  const [form] = Form.useForm();
  const searchInput = useRef(null);
  const [search, setSearch] = useState({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [modalForm, setModalForm] = useState(false);
  const [descriptionDetail, setDescriptionDetail] = useState("");
  const [typeForm, setTypeForm] = useState(typeFormList[0]);
  const [dataEdit, setDataEdit] = useState();
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [uomOptions, setUomOptions] = useState([]);
  const [startDate, setStartDate] = useState();
  const { dataListCurrency, dataListUom } = useSelector(
    (state) => state.pricing
  );
  const { data: dataUser = {} } = useSelector((state) => state.profile);
  useEffect(() => {
    if (dataListCurrency && dataListCurrency.length > 0) {
      const tempCurrency = dataListCurrency.map((currency) => ({
        id: currency.id,
        value: currency.text,
      }));
      setCurrencyOptions(tempCurrency);
    }
  }, [dataListCurrency]);
  useEffect(() => {
    if (dataListUom && dataListUom.length > 0) {
      const tempUom = dataListUom.map((uom) => ({
        id: uom.id,
        value: uom.text,
      }));
      setUomOptions(tempUom);
    }
  }, [dataListUom]);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    const tempSearchColumn = selectedKeys[0] ? dataIndex : "";
    if (searchedColumn !== tempSearchColumn) {
      setPage(1);
    }
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

  const handleChangeSize = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };
  const handleCancelModalForm = useCallback(() => {
    setModalForm(false);
    form.resetFields();
    setStartDate(null);
    setDataEdit({});
  }, [form]);
  const safetyConflictDate = useCallback(
    (value) => {
      let valid = true;
      let tempData = [...data];
      if (typeForm === typeFormList[1]) {
        tempData = tempData.filter((item) => item.key !== dataEdit.key);
      }
      const dataFormatted = tempData.map((item) => ({
        // key: `${item.currency}-${item.uom}`,
        key: `${item.uom}`,
        startDate: item.startDate,
        endDate: item.endDate || undefined,
      }));
      const valueFormatted = {
        // key: `${value.currency.label}-${value.uom.label}`,
        key: `${value.uom.label}`,
        startDate: moment(value.startDate).format("YYYY-MM-DD"),
        endDate: value.endDate
          ? moment(value.endDate).format("YYYY-MM-DD")
          : undefined,
      };
      const filteredDataFormat = dataFormatted.filter(
        (item) => item.key === valueFormatted.key
      );
      filteredDataFormat.forEach((item) => {
        const startData = moment(item.startDate);
        const endData = item.endDate ? moment(item.endDate) : undefined;
        const startValue = moment(valueFormatted.startDate);
        const endValue = valueFormatted.endDate
          ? moment(valueFormatted.endDate)
          : undefined;
        if (
          startData <= startValue &&
          ((!!endData && startValue <= endData) || !endData)
        ) {
          valid = false; // b starts in a
        }
        if (
          ((!!endValue && startData <= endValue) || !endValue) &&
          !!endData &&
          !!endValue &&
          endValue <= endData
        ) {
          valid = false; // b ends in a
        }
        if (
          startValue < startData &&
          ((!!endData && !!endValue && endData < endValue) ||
            (!endData && !!endValue && endValue >= startData) ||
            (!!endData && !endValue && true))
        ) {
          valid = false; // a in b
        }
      });
      return valid;
    },
    [data, typeForm, dataEdit]
  );
  const handleSaveModalPricingForm = useCallback(
    (value) => {
      if (safetyConflictDate(value)) {
        if (typeForm === typeFormList[0]) {
          updateData((prevState) => {
            const key = prevState.reduce((current, next) => {
              const nextKey = next.key || 0;
              return current > nextKey
                ? parseInt(current) + 1
                : parseInt(nextKey) + 1;
            }, 1);
            const res = {
              ...value,
              uom: value.uom.label,
              uomIds: value.uom.value,
              currency: value.currency.label,
              currencyIds: value.currency.value,
              startDate: moment(value.startDate).format("YYYY-MM-DD"),
              endDate: value.endDate
                ? moment(value.endDate).format("YYYY-MM-DD")
                : undefined,
              key,
              type: "new",
            };
            return [...prevState, res];
          });
        } else {
          updateData((prevState) => {
            const index = prevState.findIndex(
              (detail) => detail.key === dataEdit.key
            );
            let temp = [...prevState];
            temp[index] = {
              ...temp[index],
              uom: value.uom.label,
              uomIds: value.uom.value,
              currency: value.currency.label,
              currencyIds: value.currency.value,
              description: value.description,
              startDate: moment(value.startDate).format("YYYY-MM-DD"),
              endDate: value.endDate
                ? moment(value.endDate).format("YYYY-MM-DD")
                : undefined,
              key: dataEdit.key,
              type: dataEdit.type,
            };
            return temp;
          });
        }
        handleCancelModalForm();
      } else {
        const errorBody = {
          title: "Failed",
          // description: `Currency, UOM or effective date is overlapping!. Please try again.`,
          description: `UOM or effective date is overlapping!. Please try again.`,
        };
        dispatch(showModalError(errorBody));
      }
    },
    [
      dispatch,
      typeForm,
      dataEdit,
      handleCancelModalForm,
      safetyConflictDate,
      updateData,
    ]
  );
  const handleCreate = () => {
    setTypeForm(typeFormList[0]);
    dispatch(getListCurrency());
    dispatch(getListUom());
    setModalForm(true);
  };
  const handleUpdate = (record) => {
    setDataEdit(record);
    setTypeForm(typeFormList[1]);
    setModalForm(true);
    dispatch(getListCurrency());
    dispatch(getListUom());
    setStartDate(record.startDate);
    form.setFieldsValue({
      uom: { value: record.uomIds, label: record.uom },
      currency: { value: record.currencyIds, label: record.currency },
      value: record.value,
      description: record.description,
      startDate: moment(record.startDate),
      endDate: record.endDate ? moment(record.endDate) : undefined,
      type: record.type || undefined,
    });
  };
  const handleDelete = (record) => {
    updateData((prevState) => {
      const temp = prevState.filter((detail) => detail.key !== record.key);
      return temp;
    });
  };

  const handleStartDate = (value) => {
    setStartDate(value);
    form.resetFields(["endDate"])
    return value;
  };

  const handleDisableEndDate = (current) => {
    if (startDate !== null) {
      return typeForm === typeFormList[0]
        ? moment(startDate) >= current
        : moment(startDate) > current;
    }
    return moment().add(-1, "days") >= current;
  };

  const handleDisableDate = (current) => {
    return false;
  };

  return (
    <div className="flex flex-col w-full gap-3">
      {type !== "detail" && type !== "preview" ? (
        <div className="flex w-full justify-end">
          <ButtonComponent
            icon={<SVGIcon name="IconButtonCreate" width={24} />}
            type="submit"
            onClick={handleCreate}
          >
            Create
          </ButtonComponent>
        </div>
      ) : null}
      <NxTable
        idTable={"pricing-detail-table"}
        userId={dataUser?.data?.username}
        showAdvanceSearch={false}
        showSearchBar={false}
        usePagination={false}
        type="FE"
        dataSource={data}
        totalData={data.length}
        current={page}
        pageSize={pageSize}
        tableScrolled={{ y: 525, x: 2300 }}
        onChange={handleChangeSize}
        columns={columns(
          search,
          hasValue(dataEdit?.["key"]),
          page,
          pageSize,
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          type,
          handleUpdate,
          handleDelete,
          updateSelectedData,
          updateHistoryEndDate,
          selectPriceCodeAdjust
        )}
      />
      <ModalCustom
        isOpen={
          modalForm && currencyOptions.length > 0 && uomOptions.length > 0
        }
        handleCancel={handleCancelModalForm}
        header={`${
          typeForm === typeFormList[1] ? "UPDATE" : "CREATE"
        } PRICING DETAIL`}
        width={1000}
        type={"confirmation"}
        footer={
          <div className="w-full flex justify-end gap-5 p-4">
            <ButtonComponent onClick={handleCancelModalForm} type="default">
              Cancel
            </ButtonComponent>
            <ButtonComponent
              form="detailPricingForm"
              type="submit"
              htmlType="submit"
            >
              Save
            </ButtonComponent>
          </div>
        }
      >
        <Form
          id="detailPricingForm"
          form={form}
          layout="vertical"
          onFinish={handleSaveModalPricingForm}
        >
          <div className="flex flex-col w-full py-4 pt-2 gap-3">
            <div className="flex align-middle gap-2">
              <p className="text-[15px] font-semibold text-text-color-semibold">
                Price Code:
              </p>
              <p className="text-[15px] font-semibold text-primary">
                {priceCode}
              </p>
            </div>
            <div className="w-full grid grid-cols-3 gap-3">
              <Form.Item
                name={"currency"}
                rules={[
                  { message: requiredMessage("Currency"), required: true },
                ]}
                className="no-margin-form"
                label={"Currency"}
                required
              >
                {currencyOptions && currencyOptions.length > 0 && (
                  <SelectComponent
                    labelInValue
                    disabled={dataEdit?.type === "exist"}
                  >
                    {currencyOptions.map((currency) => (
                      <Select.Option key={currency.id} value={currency.id}>
                        {currency.value}
                      </Select.Option>
                    ))}
                  </SelectComponent>
                )}
              </Form.Item>
              <Form.Item
                name={"value"}
                rules={[{ message: requiredMessage("Value"), required: true }]}
                className={"w-full no-margin-form"}
                getValueFromEvent={(e) => {
                  return e.floatValue;
                }}
                label={"Value"}
                required
              >
                <InputComponent
                  decimalScale={2}
                  thousandSeparator={","}
                  decimalSeparator={"."}
                  type="numeric"
                  disabled={dataEdit?.type === "exist"}
                />
              </Form.Item>
              <Form.Item
                name={"uom"}
                rules={[{ message: requiredMessage("UOM"), required: true }]}
                className="no-margin-form"
                label={"UOM"}
                required
              >
                {uomOptions && uomOptions.length > 0 && (
                  <SelectComponent
                    labelInValue
                    disabled={dataEdit?.type === "exist"}
                  >
                    {uomOptions.map((uom) => (
                      <Select.Option key={uom.id} value={uom.id}>
                        {uom.value}
                      </Select.Option>
                    ))}
                  </SelectComponent>
                )}
              </Form.Item>
            </div>
            <div className="w-full grid grid-cols-2 gap-3">
              <Form.Item
                name={"startDate"}
                rules={[
                  { message: requiredMessage("Start Date"), required: true },
                ]}
                className="no-margin-form"
                getValueFromEvent={handleStartDate}
                label={"Start Date"}
                required
              >
                <DateComponent
                  disabled={
                    typeForm === typeFormList[1] &&
                    dataEdit?.id &&
                    status !== "DRAFT"
                  }
                  dateDisable={handleDisableDate}
                />
              </Form.Item>
              <Form.Item
                name={"endDate"}
                className="no-margin-form"
                rules={[
                  {
                    validator: (_, value) =>
                      (value &&
                        ((typeForm === typeFormList[0] &&
                          moment(startDate) < moment(value)) ||
                          (typeForm === typeFormList[1] &&
                            moment(startDate) <= moment(value)))) ||
                      !value
                        ? Promise.resolve()
                        : Promise.reject(
                            new Error("End date must before Start date")
                          ),
                  },
                ]}
                label="End Date"
              >
                <DateComponent
                  dateDisable={handleDisableEndDate}
                  disabled={startDate === null}
                />
              </Form.Item>
            </div>
            <div className="w-full">
              <Form.Item
                name={"description"}
                className="w-full"
                label={"Description"}
              >
                <InputComponent
                  type="textarea"
                  value={descriptionDetail}
                  onChange={(e) => setDescriptionDetail(e.target.value)}
                />
              </Form.Item>
            </div>
          </div>
        </Form>
      </ModalCustom>
    </div>
  );
};

export default PricingDetailTableDetail;
