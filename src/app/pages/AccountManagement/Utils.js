import moment from "moment";
import { dateFormatting, hasValue } from "../../../utils";

export const onInputUpperCase = (e) => {
  const { selectionStart, selectionEnd } = e.target;

  // Use Object.assign to update the value property
  Object.assign(e.target, { value: e.target.value.toUpperCase().trimStart() });

  // Set the cursor position using setSelectionRange
  e.target.setSelectionRange(selectionStart, selectionEnd);
};

export const handleDate = (date) => {
  if(date === null || date === "" || date === undefined){
    return ""
  }else {
    return `${moment(date).format(dateFormatting.date)}`;
  }
}

export const dataDependAdvanced = (dependDataIndex, key, dataEditRecord) => {
  if (dependDataIndex) {
    switch (dependDataIndex) {
      case "something":
        return dataEditRecord[key + dependDataIndex]?.value !== 2302 || // spesific index to checked
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