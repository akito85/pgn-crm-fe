import moment from "moment";
import { dateFormatting, renderDateConverter } from ".";

export function updatePagination(
  data = [],
  action = "",
  searchedColumn,
  searchedText,
  page,
  pageSize,
  type = "string",
) {
  let result = [...data];
  if (searchedColumn && searchedText) {
    const fixSearchText = searchedText?.toLowerCase();
    result = result.filter((item) => {
      if (type === "datetime") {
        return (
          moment(item[searchedColumn])
            .format(dateFormatting.dateTime)
            ?.toLowerCase() ===
          renderDateConverter(fixSearchText, type)?.toLowerCase()
        );
      } else if (type === "datePeriod") {
        return (
          moment(item[searchedColumn])
            .format(dateFormatting.datePeriod)
            ?.toLowerCase() ===
          renderDateConverter(fixSearchText, type)?.toLowerCase()
        );
      } else if (type === "dateCapital") {
        return (
          moment(item[searchedColumn])
            .format(dateFormatting.date)
            ?.toLowerCase() ===
          renderDateConverter(fixSearchText, type)?.toLowerCase()
        );
      } else if (type === "date") {
        return (
          moment(item[searchedColumn])
            ?.format(dateFormatting?.date)
            ?.toLowerCase() ===
          renderDateConverter(fixSearchText, type)?.toLowerCase()
        );
      } else if (type === "boolean") {
        let result;
        if (fixSearchText === "y") {
          result = item[searchedColumn] === true;
        } else {
          result = item[searchedColumn] === false;
        }
        return result;
      } else if (type === "number") {
        return String(item[searchedColumn]).includes(fixSearchText);
      } else if (type === "status") {
        return (
          item[searchedColumn]?.toString()?.toLowerCase() === fixSearchText
        );
      } else {
        return item[searchedColumn]?.toLowerCase()?.includes(fixSearchText);
      }
    });
  }
  const fix = result.slice((page - 1) * pageSize, page * pageSize);
  return action === "data" ? fix : result.length;
}
