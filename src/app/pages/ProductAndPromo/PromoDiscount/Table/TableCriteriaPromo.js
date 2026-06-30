import moment from "moment";
import {
  hasValue,
  renderColumn,
  renderDateColumn,
} from "../../../../../utils";
import { getColumnSearchPropsUseFilteredValueFE } from "../../../../../utils/getColumnSearchProps";
import { separatorCurrency } from "../../UtilsProduct/UtilsAllProduct";
import StatusComponent from "../../../../../components/StatusComponent";

const sorter = (fieldSort, a, b) => {
  const handleDataSort = (obj) => {
    switch (fieldSort) {
      case "maxValueUom":
      case "adjustmentValue":
        return separatorCurrency(obj[fieldSort])?.replace(/,/g, "");
      case "adjustmentType":
        return obj[fieldSort]?.label.toLowerCase();
      case "startDate":
      case "endDate":
        return obj[fieldSort] ? moment(obj[fieldSort]) : null;
      // return date.toLowerCase();
      default:
        return obj[fieldSort].label?.toLowerCase();
    }
  };
  let fa = handleDataSort(a);
  let fb = handleDataSort(b);
  
  const handleCompare = (a, b) => {
    switch (fieldSort) {
      case "startDate":
      case "endDate":
      if (a === null && b === null) return 0; // Both are null, consider equal
      if (a === null) return 1; // `a` is null, place it as greater (bottom)
      if (b === null) return -1; // `b` is null, place it as greater (bottom)
        if (a && b) {
          if (a.isBefore(b)) return -1;
          if (a.isAfter(b)) return 1;
          return 0;
        }
        return 0; // Handle null cases if necessary
      case "maxValueUom":
      case "adjustmentValue":
        return Math.sign(parseFloat(a) - parseFloat(b));
      default:
        return a.localeCompare(b);
    }
  }
    return handleCompare(fa, fb);
};

export const columnsTableCriteriaPromo = (
  listOption = {},
  searchInput,
  searchedColumn,
  searchText,
  handleSearch,
  search,
  storedData,
  countryCriteriaId
) => [
  {
    required: true,
    title: "PRODUCT",
    key: "product",
    width: 240,
    //onFilter: (value, record) => //onFilter("accountCategory", value, record),
    sorter: (a, b) => sorter("product", a, b),
    dataIndex: "product",
    dataIndexForm: "data_product",
    indexValue: 38,
    inputType: "select",
    filteredValue: search?.["product"] ? [search?.["product"]] : null,
    option: listOption["data_product"],
    url: "getProductList",
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "product",
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
        "product",
        hasValue(search["product"]),
        searchText,
        text?.label,
        false,
        "input",
        search
      ),
  },
  {
    required: true,
    title: "PRODUCT VERSION",
    key: "productVersion",
    width: 240,
    //onFilter: (value, record) => //onFilter("accountCategory", value, record),
    sorter: (a, b) => sorter("productVersion", a, b),
    dataIndex: "productVersion",
    dataIndexForm: "data_version",
    indexValue: 38,
    inputType: "select",
    filteredValue: search?.["productVersion"] ? [search?.["productVersion"]] : null,
    option: listOption["data_product_version"],
    url: "getProductVersionList",
    dependDataIndex: "product",
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "version",
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
        "version",
        hasValue(search["version"]),
        searchText,
        text?.label,
        false,
        "input",
        search
      ),
  },
  {
    required: true,
    title: "ACCOUNT CATEGORY",
    key: "accountCategory",
    width: 240,
    //onFilter: (value, record) => //onFilter("accountCategory", value, record),
    sorter: (a, b) => sorter("accountCategory", a, b),
    dataIndex: "accountCategory",
    dataIndexForm: "data_account_Category",
    indexValue: 35,
    inputType: "select",
    filteredValue: search?.["accountCategory "]
      ? [search?.["accountCategory "]]
      : null,
    option: listOption["data_account_Category"],
    url: "getAccountCategoryList",
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "accountCategory",
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
        "accountCategory",
        hasValue(search["accountCategory"]),
        searchText,
        text?.label,
        false,
        "input",
        search
      ),
  },
  {
    required: true,
    title: "SERVICE TYPE",
    key: "serviceType",
    width: 240,
    //onFilter: (value, record) => //onFilter("serviceType", value, record),
    sorter: (a, b) => sorter("serviceType", a, b),
    dataIndex: "serviceType",
    dataIndexForm: "data_service_type",
    indexValue: 34,
    inputType: "select",
    filteredValue: search?.["serviceType"] ? [search?.["serviceType"]] : null,
    option: listOption["data_service_type"],
    url: "getServiceTypeList",
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "serviceType",
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
        "serviceType",
        hasValue(search["serviceType"]),
        searchText,
        text?.label,
        false,
        "input",
        search
      ),
  },
  {
    required: true,
    title: "CUSTOMER SEGMENT",
    key: "customerSegment",
    width: 240,
    //onFilter: (value, record) => //onFilter("customerSegment", value, record),
    sorter: (a, b) => sorter("customerSegment", a, b),
    dataIndex: "customerSegment",
    dataIndexForm: "data_customerSegment",
    indexValue: 32,
    inputType: "select",
    filteredValue: search?.["customerSegment"]
      ? [search?.["customerSegment"]]
      : null,
    option: listOption["data_customerSegment"],
    url: "getCustomerSegmentList",
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "customerSegment",
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
        "customerSegment",
        hasValue(search["customerSegment"]),
        searchText,
        text?.label,
        false,
        "input",
        search
      ),
  },
  {
    required: true,
    title: "ACCOUNT GROUP TYPE",
    key: "accountGroup",
    width: 240,
    //onFilter: (value, record) => //onFilter("accountGroup", value, record),
    sorter: (a, b) => sorter("accountGroup", a, b),
    dataIndex: "accountGroup",
    dataIndexForm: "data_account_group",
    indexValue: 33,
    inputType: "select",
    filteredValue: search?.["accountGroup"] ? [search?.["accountGroup"]] : null,
    option: listOption["data_account_group"],
    url: "getAccountGroupList",
    dependDataIndex: "customerSegment",
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "accountGroup",
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
        "accountGroup",
        hasValue(search["accountGroup"]),
        searchText,
        text?.label,
        false,
        "input",
        search
      ),
  },
  {
    required: true,
    title: "INDUSTRIAL SECTOR",
    key: "industrialSector",
    width: 240,
    //onFilter: (value, record) => //onFilter("industrialSector", value, record),
    sorter: (a, b) => sorter("industrialSector", a, b),
    dataIndex: "industrialSector",
    dataIndexForm: "data_industrial_sector",
    indexValue: 31,
    inputType: "select",
    filteredValue: search?.["industrialSector"]
      ? [search?.["industrialSector"]]
      : null,
    option: listOption["data_industrial_sector"],
    url: "getIndustrialSectorList",
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "industrialSector",
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
        "industrialSector",
        hasValue(search["industrialSector"]),
        searchText,
        text?.label,
        false,
        "input",
        search
      ),
  },
  {
    required: true,
    title: "BUDGET",
    key: "budget",
    width: 240,
    //onFilter: (value, record) => //onFilter("budget", value, record),
    sorter: (a, b) => sorter("budget", a, b),
    dataIndex: "budget",
    dataIndexForm: "data_budget",
    indexValue: 30,
    inputType: "select",
    filteredValue: search?.["budget"] ? [search?.["budget"]] : null,
    option: listOption["data_budget"],
    url: "getBudgetList",
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "budget",
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
        "budget",
        hasValue(search["budget"]),
        searchText,
        text?.label,
        false,
        "input",
        search
      ),
  },
  {
    required: true,
    title: "SOR",
    key: "sor",
    width: 240,
    //onFilter: (value, record) => //onFilter("sor", value, record),
    sorter: (a, b) => sorter("sor", a, b),
    dataIndex: "sor",
    dataIndexForm: "data_sor",
    indexValue: 2321,
    inputType: "select",
    filteredValue: search?.["sor"] ? [search?.["sor"]] : null,
    option: listOption["data_sor"],
    url: "getSorList",
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "sor",
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
        "sor",
        hasValue(search["sor"]),
        searchText,
        text?.label,
        false,
        "input",
        search
      ),
  },
  {
    required: true,
    title: "COST CENTER",
    key: "costCenter",
    width: 240,
    //onFilter: (value, record) => //onFilter("area", value, record),
    sorter: (a, b) => sorter("area", a, b),
    dataIndex: "area",
    dataIndexForm: "data_cost_center",
    indexValue: 29,
    inputType: "select",
    filteredValue: search?.["area"] ? [search?.["area"]] : null,
    option: listOption["data_cost_center"],
    url: "getCostCenterList",
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "area",
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
        "area",
        hasValue(search["area"]),
        searchText,
        text?.label,
        false,
        "input",
        search
      ),
  },
  {
    required: true,
    title: "COUNTRY",
    key: "country",
    width: 240,
    //onFilter: (value, record) => //onFilter("province", value, record),
    sorter: (a, b) => sorter("country", a, b),
    dataIndex: "country",
    dataIndexForm: "data_country",
    indexValue: countryCriteriaId,
    inputType: "select",
    filteredValue: search?.["country"] ? [search?.["country"]] : null,
    option: listOption["data_country"],
    url: "getCountryList",
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "country",
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
        "country",
        hasValue(search["country"]),
        searchText,
        text?.label,
        false,
        "input",
        search
      ),
  },
  {
    required: true,
    title: "PROVINCE",
    key: "province",
    width: 240,
    //onFilter: (value, record) => //onFilter("province", value, record),
    sorter: (a, b) => sorter("province", a, b),
    dataIndex: "province",
    dataIndexForm: "data_province",
    indexValue: 28,
    inputType: "select",
    filteredValue: search?.["province"] ? [search?.["province"]] : null,
    option: listOption["data_province"],
    url: "getProvinceList",
    dependDataIndex: "country",
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "province",
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
        "province",
        hasValue(search["province"]),
        searchText,
        text?.label,
        false,
        "input",
        search
      ),
  },
  {
    required: true,
    title: "CITY",
    key: "city",
    width: 240,
    //onFilter: (value, record) => //onFilter("city", value, record),
    sorter: (a, b) => sorter("city", a, b),
    dataIndex: "city",
    dataIndexForm: "data_city",
    indexValue: 139,
    inputType: "select",
    filteredValue: search?.["city"] ? [search?.["city"]] : null,
    option: listOption["data_city"],
    url: "getCity",
    dependDataIndex: "province",
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "city",
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
        "city",
        hasValue(search["city"]),
        searchText,
        text?.label,
        false,
        "input",
        search
      ),
  },
  {
    required: true,
    title: "DISTRICT",
    key: "district",
    width: 240,
    //onFilter: (value, record) => //onFilter("district", value, record),
    sorter: (a, b) => sorter("district", a, b),
    dataIndex: "district",
    dataIndexForm: "data_district",
    indexValue: 27,
    inputType: "select",
    filteredValue: search?.["district"] ? [search?.["district"]] : null,
    option: listOption["data_district"],
    url: "getDistrict",
    dependDataIndex: "city",
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "district",
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
        "district",
        hasValue(search["district"]),
        searchText,
        text?.label,
        false,
        "input",
        search
      ),
  },
  {
    required: true,
    title: "SUB-DISTRICT",
    key: "subDistrict",
    width: 240,
    //onFilter: (value, record) => //onFilter("subDistrict", value, record),
    sorter: (a, b) => sorter("subDistrict", a, b),
    dataIndex: "subDistrict",
    dataIndexForm: "data_sub_district",
    indexValue: 26,
    inputType: "select",
    filteredValue: search?.["subDistrict"] ? [search?.["subDistrict"]] : null,
    option: listOption["data_sub_district"],
    url: "getSubDistrict",
    dependDataIndex: "district",
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "subDistrict",
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
        "subDistrict",
        hasValue(search["subDistrict"]),
        searchText,
        text?.label,
        false,
        "input",
        search
      ),
  },
  {
    required: true,
    title: "ACCOUNT",
    key: "account",
    width: 240,
    //onFilter: (value, record) => //onFilter("customer", value, record),
    sorter: (a, b) => sorter("customer", a, b),
    dataIndex: "customer",
    dataIndexForm: "data_customer",
    indexValue: 25,
    inputType: "select",
    filteredValue: search?.["customer"] ? [search?.["customer"]] : null,
    option: listOption["data_customer"],
    url: "getCustomerList",
    ellipsis: {
      showTitle: false,
    },
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "customer",
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
        "customer",
        hasValue(search["customer"]),
        searchText,
        text?.label,
        true,
        "input",
        search
      ),
  },
  {
    required: true,
    title: "G-SIZES",
    key: "gSizes",
    width: 240,
    //onFilter: (value, record) => //onFilter("gsizes", value, record),
    sorter: (a, b) => sorter("gsizes", a, b),
    dataIndex: "gsizes",
    dataIndexForm: "data_Gsizes",
    indexValue: 36,
    inputType: "select",
    filteredValue: search?.["gsizes"] ? [search?.["gsizes"]] : null,
    option: listOption["data_Gsizes"],
    url: "getGsizesList",
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "gsizes",
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
        "gsizes",
        hasValue(search["gsizes"]),
        searchText,
        text?.label,
        false,
        "input",
        search
      ),
  },
  {
    required: true,
    title: "ADJUSTMENT TYPE",
    key: "adjustmentType",
    width: 240,
    //onFilter: (value, record) => //onFilter("adjustmentType", value, record),
    sorter: (a, b) => sorter("adjustmentType", a, b),
    dataIndex: "adjustmentType",
    dataIndexForm: "data_adjustment_type",
    indexValue: 1,
    inputType: "select",
    filteredValue: search?.["adjustmentType"]
      ? [search?.["adjustmentType"]]
      : null,
    option: listOption["data_adjustment_type"],
    url: "getAdjustmentTypeList",
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "adjustmentType",
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
        "adjustmentType",
        hasValue(search["adjustmentType"]),
        searchText,
        text?.label,
        false,
        "input",
        search
      ),
  },
  {
    required: true,
    title: "ADJUSTMENT VALUE",
    key: "adjustmentValue",
    width: 240,
    dataIndex: "adjustmentValue",
    indexValue: 1,
    //onFilter: (value, record) => //onFilter("adjustmentValue", value, record),
    sorter: (a, b) => sorter("adjustmentValue", a, b),
    inputType: "number",
    filteredValue: search?.["adjustmentValue"]
      ? [search?.["adjustmentValue"]]
      : null,
    align: "right",
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "adjustmentValue",
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
        "adjustmentValue",
        hasValue(search["adjustmentValue"]),
        searchText,
        separatorCurrency(text),
        true,
        "input",
        search
      ),

    // ellipsis: {
    //   showTitle: false,
    // },
    // render: (text) => {
    //   if (searchedColumn === "adjustmentValue") {
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
    required: true,
    title: "UOM",
    key: "uom",
    width: 240,
    //onFilter: (value, record) => //onFilter("uom", value, record),
    sorter: (a, b) => sorter("uom", a, b),
    dataIndex: "uom",
    dataIndexForm: "data_uom",
    indexValue: 1,
    inputType: "select",
    filteredValue: search?.["uom"] ? [search?.["uom"]] : null,
    option: listOption["data_uom"],
    url: "getUomList",
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
        text?.label,
        false,
        "input",
        search
      ),
  },
  {
    required: false,
    title: "MAX VALUE UOM",
    key: "maxValueUom",
    width: 240,
    //onFilter: (value, record) => //onFilter("maxValueUom", value, record),
    sorter: (a, b) => sorter("maxValueUom", a, b),
    dataIndex: "maxValueUom",
    indexValue: 1,
    inputType: "number",
    filteredValue: search?.["maxValueUom"] ? [search?.["maxValueUom"]] : null,
    align: "right",
    // option: listOption["maxValueUom"],
    // url: "get",
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "maxValueUom",
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
        "maxValueUom",
        hasValue(search["maxValueUom"]),
        searchText,
        separatorCurrency(text),
        false,
        "input",
        search
      ),
    // ellipsis: {
    //   showTitle: false,
    // },
    // render: (text) => {
    //   if (searchedColumn === "maxValueUom") {
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
    required: true,
    title: "FROM ITEM",
    key: "fromItem",
    width: 240,
    //onFilter: (value, record) => //onFilter("fromItem", value, record),
    sorter: (a, b) => sorter("fromItem", a, b),
    dataIndex: "fromItem",
    dataIndexForm: "data_from_item",
    indexValue: 1,
    inputType: "select",
    filteredValue: search?.["fromItem"] ? [search?.["fromItem"]] : null,
    option: listOption["data_from_item"],
    url: "getFromItemList",
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "fromItem",
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
        "fromItem",
        hasValue(search["fromItem"]),
        searchText,
        text?.label,
        false,
        "input",
        search
      ),
  },
  {
    title: "TIERING",
    key: "tiering",
    width: 240,
    //onFilter: (value, record) => //onFilter("tiering", value, record),
    sorter: (a, b) => sorter("tiering", a, b),
    dataIndex: "tiering",
    dataIndexForm: "data_tiering",
    inputType: "select",
    indexValue: 1,
    filteredValue: search?.["tiering"] ? [search?.["tiering"]] : null,
    option: listOption["data_tiering"],
    url: "getTieringList",
    dependDataIndex: "fromItem",
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "tiering",
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
        "tiering",
        hasValue(search["tiering"]),
        searchText,
        text?.label,
        false,
        "input",
        search
      ),
  },
  {
    title: "START DATE",
    key: "startDate",
    dataIndex: "startDate",
    dataIndexForm: "startDate",
    indexValue: 1,
    inputType: "startDate",
    align: "center",
    required: true,
    filteredValue: search?.["startDate"] ? [search?.["startDate"]] : null,
    width: 240,
    //onFilter: (value, record) => //onFilter("startDate", value, record),
    sorter: (a, b) => sorter("startDate", a, b),
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
    dataIndex: "endDate",
    dataIndexForm: "endDate",
    inputType: "endDate",
    align: "center",
    indexValue: 1,
    filteredValue: search?.["endDate"] ? [search?.["endDate"]] : null,
    width: 240,
    //onFilter: (value, record) => //onFilter("endDate", value, record),
    sorter: (a, b) => sorter("endDate", a, b),
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
    title: "DESCRIPTION",
    key: "description",
    width: 240,
    inputType: "textarea",
    dataIndex: "description",
    dataIndexForm: "description",
    filteredValue: search?.["description"] ? [search?.["description"]] : null,
    indexValue: 1,
    //onFilter: (value, record) => //onFilter("description", value, record),
    sorter: (a, b) => sorter("description", a, b),
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
    title: "STATUS",
    key: "status",
    dataIndex: "status",
    width: 180,
    align: "center",
    indexValue: -1,
    filteredValue: search?.["status"] ? [search?.["status"]] : null,
    sorter: (a, b) => {
      const statusA = (a.status || "").toLowerCase();
      const statusB = (b.status || "").toLowerCase();
      return statusA.localeCompare(statusB);
    },
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "status",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "input",
      storedData
    ),
    render: (text) => {
      if (!text) return "-";
      return (
        <div className={" flex justify-center"}>
          <StatusComponent colour={text}>
            {text}
          </StatusComponent>
        </div>
      );
    },
  },
];
