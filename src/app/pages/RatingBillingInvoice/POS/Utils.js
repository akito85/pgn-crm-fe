import moment from "moment";
import { dateFormatting } from "../../../../utils";

export const renderDate = (date) => {
  if (date) {
    return moment(date).format(dateFormatting.date);
  } else {
    return "";
  }
};

export const urlLink = (id) => `/v1/dbs/api/pos/download-attachment/${id}`;

export const isDateString = (value) => {
  // console.log("moment is string date", moment(value, dateFormatting.date, true).isValid())
  return moment(value, dateFormatting.date, true).isValid();
};

export const handleMandatory = (
  setListSectionInfo = () => {},
  listDataAttachment,
  errorFields,
) => {
  setListSectionInfo((prevState) => {
    const res = prevState.map((item) => {
      const errorBadge =
        item.value !== "Attachment"
          ? (errorFields || []).reduce(
              (current, next) =>
                item.paramValue.includes(next.name[0]) ? current + 1 : current,
              0,
            )
          : listDataAttachment.length < 1
            ? 1
            : 0;
      return {
        value: item.value,
        paramValue: item.paramValue,
        errorBadge,
      };
    });
    return res;
  });
};

export const formatToTwoDecimalPlaces = (number) => {
  return number.length < 2 ? `${number}0` : number;
};

export const separatorCurrency = (text) => {
  const tempValue = text ? (text + "").split(".") : [];
  const thousandSeparator = ",";
  const decimalSeparator = ".";
  const descimal = tempValue[1]
    ? `${decimalSeparator}${formatToTwoDecimalPlaces(tempValue[1])}`
    : `${decimalSeparator}00`;
  return tempValue.length > 0
    ? tempValue[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator) +
        descimal
    : "";
};
