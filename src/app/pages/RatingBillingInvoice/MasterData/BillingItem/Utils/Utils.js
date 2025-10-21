import moment from "moment";
import { dateFormatting } from "../../../../../../utils";

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

export const renderDateTime = (date) => {
  if (date === null || date === "" || date === undefined) {
    return "";
  } else {
    return `${moment(date).format(dateFormatting.dateTime)}`;
  }
};
