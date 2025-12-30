// folder utils buat bikin library-library custome sendiri

import { Tooltip, notification } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import moment from "moment";
import Highlighter from "react-highlight-words";
import StatusComponent from "../components/StatusComponent";

export const tableNumbering = () => {
  const n = {
    title: "NO.",
    render: (v, r, i) => `${i + 1}.`,
    width: 50,
  };
  return n;
};

export const openNotification = (type, message, description) => {
  const iconMap = {
    success: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
    info: <InfoCircleOutlined style={{ color: "#1890ff" }} />,
    warning: <ExclamationCircleOutlined style={{ color: "#faad14" }} />,
    error: <CloseCircleOutlined style={{ color: "#f5222d" }} />,
  };

  notification[type]({
    message: message,
    description: description,
    icon: iconMap[type],
  });
};

export const dateFormat = "DD MMM YYYY HH:MM:SS";
export const dateFormatting = {
  dateTime: "DD MMM YYYY HH:mm:ss",
  date: "DD MMM YYYY",
  dateCapital: "DD MMM YYYY",
  dateFormal: "YYYY-MM-DD",
  datePeriod: "MMM YYYY",
  meas_date: "DD-MM-YYYY HH:mm:ss",
  hour_format: "HH:mm",
  f_date: "DD-MM-yyyy",
  year_only: "YYYY",
  dateForm: "DD-MM-YYYY",
  period: "YYYY-MM",
  month: "MMM",
  fhour: "HH:mm:ss",
};

export const formMessageRequired = (input, isRequired = true) => {
  return [
    {
      message: `Please input your ${input}!`,
      required: isRequired,
    },
  ];
};

export const requiredMessage = (text) => `Please input your ${text}!`;

export const toTitleCase = (str) =>
  str
    ?.toLowerCase()
    .split(" ")
    .map((word) => word[0]?.toUpperCase() + word?.slice(1))
    .join(" ");

export const hasValue = (value) => {
  if (
    value === "" ||
    value === undefined ||
    value === null ||
    value === "-" ||
    value === "Invalid date"
  ) {
    return false;
  } else {
    return true;
  }
};

export const isEmpty = (value) => {
  if (value === "" || value === null) {
    return false;
  }
  return true;
};

export function convertToTitleCase(inputString) {
  return inputString
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, function (match) {
      return match.toUpperCase();
    });
}

export const renderDateConverter = (data, type = "date") => {
  switch (type) {
    case "datetime":
      return moment(data)?.format(dateFormatting?.dateTime);
    case "dateCapital":
      return moment(data)?.format(dateFormatting?.dateCapital);
    case "datePeriod":
      return moment(data)?.format(dateFormatting?.datePeriod);
    case "year":
      return moment(data)?.format(dateFormatting?.year_only);
    case "month":
      return moment(data)?.format(dateFormatting?.month);
    case "hour":
      return moment(data)?.format(dateFormatting?.hour_format);
    default:
      return moment(data)?.format(dateFormatting?.date);
  }
};

export function roundToTwoDecimal(num) {
  return Math.round((parseFloat(num) + Number.EPSILON) * 100) / 100;
}

export const errorMessage = (error) => {
  let dataError;
  if (
    hasValue(error?.response?.data?.data) &&
    typeof error?.response?.data?.data === "string" &&
    error?.response?.data?.data !== "BAD_REQUEST"
  ) {
    dataError = error?.response?.data?.data;
  } else {
    dataError = null;
  }

  let message =
    dataError ||
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    error?.description ||
    error?.toString();
  return message;
};
export const errorCode = (error) => {
  let code =
    error?.response?.data?.code ||
    error?.response?.status ||
    error?.code ||
    error?.status;
  return code;
};

export const errorBody = (code, status, message) => ({
  code: code,
  message: `Your data was not ${status}. ${errorMessage(message)}.`,
});

export const renderDateColumn = (
  dataIndex,
  searchedColumn,
  searchText,
  text,
  typeDate = "date",
  search
) => {
  if (searchedColumn) {
    return (
      <Highlighter
        highlightStyle={{
          backgroundColor: "#ffc069",
          padding: 0,
        }}
        searchWords={[
          Object.values(search)?.includes(searchText)
            ? renderDateConverter(search[dataIndex], typeDate)
            : "",
        ]}
        autoEscape
        textToHighlight={
          hasValue(text) ? renderDateConverter(text, typeDate) : ""
        }
      />
    );
  } else {
    return hasValue(text) && renderDateConverter(text, typeDate);
  }
};

export const renderColumn = (
  dataIndex,
  searchedColumn,
  searchText,
  text,
  useTooltip = false,
  type,
  search = {}
) => {
  // console.log(dataIndex, ' data index');

  if (searchedColumn) {
    if (type === "status") {
      return (
        <div className={"flex px-0 my-0"}>
          <StatusComponent colour={text}>{toTitleCase(text)}</StatusComponent>
        </div>
      );
    } else if (useTooltip && type !== "status") {
      return (
        <Tooltip
          placement="topLeft"
          title={
            <Highlighter
              highlightStyle={{
                backgroundColor: "#ffc069",
                padding: 0,
              }}
              searchWords={
                Object.values(search)?.includes(searchText)
                  ? [search[dataIndex]]
                  : []
              }
              autoEscape
              textToHighlight={text ? text.toString() : ""}
            />
          }
        >
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={
              Object.values(search)?.includes(searchText)
                ? [search[dataIndex]]
                : []
            }
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        </Tooltip>
      );
    } else {
      return (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={
            Object.values(search)?.includes(searchText)
              ? [search[dataIndex]]
              : []
          }
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      );
    }
  } else {
    if (useTooltip) {
      return (
        <Tooltip placement="topLeft" title={text}>
          {text}
        </Tooltip>
      );
    } else if (type === "status") {
      return (
        <div className={" flex justify-center"}>
          <StatusComponent colour={text}>{toTitleCase(text)}</StatusComponent>
        </div>
      );
    } else {
      return text;
    }
  }
};

export const deletePrefixNumber = (numb, prefix) => {
  let regex = new RegExp(prefix, "g");
  let numbWithout62 = numb?.replace(regex, "");
  let result = parseInt(numbWithout62);
  return result;
};

export const disabledActionByStatus = (action, status, statusApproval) => {
  const lowerStatusApproval = statusApproval?.toLowerCase();
  const lowerStatus = status?.toLowerCase();
  const lowerAction = action?.toLowerCase();
  switch (lowerAction) {
    case "activate":
      if (
        lowerStatusApproval === "waiting approval" ||
        lowerStatus === "inactive" ||
        lowerStatus === "draft"
      ) {
        return true;
      } else {
        return false;
      }

    default:
      if (lowerStatusApproval === "waiting approval") {
        return true;
      } else {
        return false;
      }
  }
};

export const countBadgeFieldsErrorMandatory = (
  setListSectionInfo = () => {},
  listDataAttachment,
  errorFields
) => {
  setListSectionInfo((prevState) => {
    const res = prevState.map((item) => {
      const errorBadge =
        item.value !== "Attachment"
          ? (errorFields || []).reduce(
              (current, next) =>
                item.paramValue.includes(next.name[0]) ? current + 1 : current,
              0
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

export const convertToCamelCase = (str) => {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (match, chr) => chr.toUpperCase());
};

export const convertToPascalCase = (str) => {
  return str
    .toLowerCase()
    .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) =>
      match.toUpperCase().replace(/\s+/g, "")
    );
};
export const convertToSnakeCase = (str) => {
  return str.toLowerCase().replace(/\s+/g, "_");
};

export const separatorNumber = (text) => {
  const thousandSeparator = ",";
  return text?.toString()?.length > 0
    ? text?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator)
    : "";
};
