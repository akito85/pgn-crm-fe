import moment from "moment";
import { dateFormatting } from "../../../../../../utils";

export const handleDate = (date) => {
  if (date === null || date === "" || date === undefined) {
    return "";
  } else {
    return `${moment(date).format(dateFormatting.date)}`;
  }
};

export const renderDateTime = (date) => {
  if (date === null || date === "" || date === undefined) {
    return "";
  } else {
    return `${moment(date).format(dateFormatting.dateTime)}`;
  }
};

export const handleMandatory = (
  setListSectionInfo = () => {},
  listDataAttachment,
  listDataUploadTemplate,
  errorFields
) => {
  setListSectionInfo((prevState) => {
    const res = prevState.map((item) => {
      let errorBadge = 0;

      switch (item.value) {
        case "Attachment":
          errorBadge = listDataAttachment.length < 1 ? 1 : 0;
          break;
        case "General Template":
          errorBadge =
            (errorFields || []).reduce(
              (current, next) =>
                item.paramValue.includes(next.name[0]) ? current + 1 : current,
              0
            ) + (listDataUploadTemplate.length < 1 ? 1 : 0);
          break;
        default:
          errorBadge = (errorFields || []).reduce(
            (current, next) =>
              item.paramValue.includes(next.name[0]) ? current + 1 : current,
            0
          );
      }
      return {
        value: item.value,
        paramValue: item.paramValue,
        errorBadge,
      };
    });
    return res;
  });
};
