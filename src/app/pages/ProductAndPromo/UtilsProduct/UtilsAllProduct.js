import moment from "moment";
import { dateFormatting, hasValue } from "../../../../utils";
import { columnsTableCriteriaPromo } from "../PromoDiscount/Table/TableCriteriaPromo";

export const lowerCaseCheckedCriteria = (name) => {
  let nameChecked = `${name
    ?.toString()
    ?.toLowerCase()
    ?.replace(/[_\-\s]/g, "")}`;
  switch (nameChecked) {
    case "subdistrict":
      return "subDistrict";
    case "budgettype":
    case "accountbudget":
    case "budget":
      return "budget";
    case "industrialsector":
      return "industrialSector";
    case "servicetype":
      return "serviceType";
    case "costcenter":
    case "area":
      return "area";
    case "customersegment":
      return "customerSegment";
    case "accountcategory":
      return "accountCategory";
    case "accountgrouptype":
      return "accountGroup";
    case "account":
    case "cust":
      return "customer";
    // case "gsizes":
    //   return "gsizes";
    // case "sor":
    //   return "sor";
    default:
      return nameChecked;
  }
};

export const dataDependAdvanced = (dependDataIndex, key, dataEditRecord) => {
  if (dependDataIndex) {
    switch (dependDataIndex) {
      case "fromItem":
        return ![2302, 2301]?.includes(
          dataEditRecord[key + dependDataIndex]?.value,
        ) || // spesific tiering
          !hasValue(dataEditRecord[key + dependDataIndex]?.value)
          ? true
          : false;
      default:
        return dataEditRecord[key + dependDataIndex] ? false : true;
    }
  } else {
    return false;
  }
};

export const dataDepended = (
  dependDataIndex = "",
  dataIndexKey = "",
  recordData = {},
  recordDependedData = {},
) => {
  if (hasValue(dependDataIndex)) {
    switch (dataIndexKey.toLowerCase()) {
      case "tiering":
        return ![2302, 2301]?.includes(
          recordDependedData[recordData?.key + dependDataIndex]?.value,
        );

      default:
        return !hasValue(
          recordDependedData[recordData?.key + dependDataIndex]?.value,
        );
    }
  }
};
export const checkEditableUnCriteria = (dataIndex, dataType = null) => {
  switch (dataIndex) {
    case "adjustmentType":
    case "adjustmentValue":
    case "uom":
    case "maxValueUom":
    case "fromItem":
    case "tiering":
      return dataType === "exist" ? true : false;
    default:
      return false;
  }
};

export const handleDataTypeExist = (
  //for dataType criteria
  status,
  statusApproval,
  dataDetail,
  dataCompare,
  idName = "idPromo",
  idCompare = "idPromo",
) => {
  switch (status) {
    case "ACTIVE":
      if (statusApproval === "DRAFT") {
        return (dataCompare || [])?.some(
          (item) => item[idCompare] === dataDetail[idName],
        )
          ? { dataType: "exist" }
          : null;
      } else {
        return { dataType: "exist" }; // for active & approve
      }
    case "DRAFT":
      return null;
    default:
      return null;
  }
};

export const handleShouldCheckedForDisabled = (
  key,
  idName = "idPromo",
  tableColumn = [],
) => {
  return ![
    idName,
    "id",
    "key",
    "startDate",
    "endDate",
    "description",
    "maxValueUom",
    "adjustmentValue",
    "createdBy",
    "createdDate",
    "updatedBy",
    "updatedDate",
    ...(tableColumn || []),
  ].includes(key);
};

export const handleReturnBasedByType = ({
  data,
  key,
  inputType,
  criteriaValues = [],
  tableCriteria = [],
  forSendData = false, //for send data to backend and checking criteria for others to null
}) => {
  if (inputType?.includes("Date")) {
    return forSendData
      ? moment(data).format(dateFormatting.date)
      : moment(data);
  } else if (
    //all attribute that need for null or value
    [...(tableCriteria || []), ...(criteriaValues || [])].includes(key)
  ) {
    //available criteria table and mandatory column at index 1 or other
    if ([...(criteriaValues || [])].includes(key) || !forSendData) {
      // If needed to return to number or automatically number
      switch (inputType) {
        case "number":
          return forSendData
            ? parseFloat(data?.toString()?.replace(",", ""))
            : data;
        case "select":
          return forSendData ? data?.value : data;
        default:
          return data || null;
      }
    } else {
      return null;
    }
  } else {
    return data;
  }
};

export const handleDdlDisabled = (
  //for dataType criteria
  status,
  statusApproval,
  dataObject, //all data include draft
  dataCompare, //detail
) => {
  switch (status) {
    case "ACTIVE":
      if (statusApproval === "DRAFT") {
        return (
          Object.keys(dataCompare || {})?.includes(dataObject) &&
          hasValue(dataCompare[dataObject]?.label) &&
          hasValue(dataCompare[dataObject]?.value)
        );
      } else {
        return true; // for active & approve
      }
    case "DRAFT":
      return false;
    default:
      return false;
  }
};

export const handleDisabledEachColumnCriteria = ({
  dataDetail = [],
  dataCompare = [],
  status,
  statusApproval,
  columnsTable = [...(columnsTableCriteriaPromo() || [])],
  criteriaValues = [],
  dataListCriteria = [],
  //can ignore this if not use disabled each column
  useDisabled = false,
  idName = "idPromo",
  idCompare = "idPromo",
}) => {
  return dataDetail?.map((item, index) => {
    return {
      ...Object.keys(item).reduce((acc, key) => {
        if (key !== "allCriteria") {
          // Exclude 'allCriteria'

          // Check if dataIndex exists and apply 'disabled' conditionally
          acc[key] = item[key]
            ? handleReturnBasedByType({
                data: item[key],
                key: key,
                inputType: columnsTable?.filter(
                  (item) => item?.dataIndex === key,
                )[0]?.inputType,
                criteriaValues: columnsTable
                  .filter((item) =>
                    [...(criteriaValues || []), 1].includes(item?.indexValue),
                  )
                  ?.map((item) => item?.dataIndex),
                tableCriteria: [
                  ...(dataListCriteria || []).map((item) =>
                    lowerCaseCheckedCriteria(item?.name),
                  ),
                ],
              })
            : null;
        }
        return acc;
      }, {}),
      key: index + 1,
      ...handleDataTypeExist(
        status,
        statusApproval,
        item,
        dataCompare,
        idName,
        idCompare,
      ),
    };
  });
};

export const handleMappingCriteriaGeneral = ({
  item,
  index,
  columnsTable = [...(columnsTableCriteriaPromo() || [])],
  criteriaValues = [],
  dataListCriteria = [],
}) => {
  return {
    ...Object.keys(item).reduce((acc, key) => {
      if (key !== "allCriteria") {
        // Exclude 'allCriteria'
        acc[key] = item[key]
          ? handleReturnBasedByType({
              data: item[key],
              key: key,
              inputType: columnsTable?.filter(
                (item) => item?.dataIndex === key,
              )[0]?.inputType,
              criteriaValues: columnsTable
                .filter((item) =>
                  [...(criteriaValues || []), 1].includes(item?.indexValue),
                )
                ?.map((item) => item?.dataIndex),
              tableCriteria: [
                ...(dataListCriteria || []).map((item) =>
                  lowerCaseCheckedCriteria(item?.name || item?.text),
                ),
              ],
              forSendData: true,
            })
          : null;
      }
      return acc;
    }, {}),
    key: index + 1,
  };
};

export const handleCheckCriteriaMissingValidation = (
  criteriaOptions,
  dataCriteria,
  listDataCriteria = [],
  setMissingColumn = () => {},
  minimumData = 0,
) => {
  let missingColumn = [];
  const tempArray = criteriaOptions.filter((item) =>
    dataCriteria?.includes(item.value),
  );
  const tempNameCriteria = tempArray.map((data) => data.code);

  listDataCriteria?.map((item) => {
    tempNameCriteria?.forEach((criteriaName) => {
      if (
        !item[lowerCaseCheckedCriteria(criteriaName)] || //no column
        !hasValueCriteria(item[lowerCaseCheckedCriteria(criteriaName)]) //no value at object
      ) {
        missingColumn.push(criteriaName);
      }
    });
  });
  const uniqueMissingColumn =
    missingColumn
      .filter((item, index) => {
        return missingColumn.indexOf(item) === index;
      })
      ?.filter((item) => item !== "All") || [];
  setMissingColumn(uniqueMissingColumn);
  return uniqueMissingColumn?.length > 0 ||
    !((listDataCriteria?.length || 0) >= minimumData)
    ? true
    : false;
};

export const hasValueCriteria = (value) => {
  if (
    value === "" ||
    value === undefined ||
    value === null ||
    value === "-" ||
    value === "Invalid date"
  ) {
    return false;
  } else if (typeof value === "object") {
    return (
      value.hasOwnProperty("value") &&
      value.value !== null &&
      value.value !== undefined &&
      value.hasOwnProperty("label") &&
      value.label !== null &&
      value.label !== undefined
    );
  } else {
    return true;
  }
};

export const handleMappingBodyTiering = ({
  key = "",
  editDataRecord = {},
  columnsTable = [...(columnsTableCriteriaPromo() || [])],
  dataCriteria = [],
}) => {
  const criteria = columnsTable
    .filter((item) => [...(dataCriteria || [])].includes(item?.indexValue))
    ?.map((item) => item?.dataIndex);

  const getName = (name) => {
    switch (name) {
      case "accountCategory":
        return "accCategory";
      case "customer":
        return "account";
      case "gsizes":
        return "gSizes";
      default:
        return name;
    }
  };

  return {
    ...Object.keys(editDataRecord)
      .filter((keys) => keys.startsWith(key))
      .reduce((obj, keys) => {
        // Remove the specific leading number using replace and looping every key or index
        const newKey = keys.replace(key, "");
        if (criteria.includes(newKey)) {
          obj[getName(newKey)] = editDataRecord[keys]?.value;
          return obj;
        }
        return obj;
      }, {}),
    isAllCriteria: dataCriteria?.includes(37) ? true : false,
  };
};

export const separatorCurrency = (text) => {
  const tempValue = text ? (text + "").split(".") : [];
  const thousandSeparator = ",";
  const decimalSeparator = ".";
  const descimal = tempValue[1]
    ? `${decimalSeparator}${tempValue[1]}`
    : `${decimalSeparator}00`;
  return tempValue.length > 0
    ? tempValue[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator) +
        descimal
    : "";
};
