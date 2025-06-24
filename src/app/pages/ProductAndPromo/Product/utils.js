export const listSectionInfoProductDetail = (type) => {
  let data = [
    { value: "Product Detail" },
    { value: "Calculation Rule" },
    { value: "Target Account Selling" },
    { value: "Pricing" },
    { value: "Term Of Service" },
  ];
  if (type === 245) {
    return data;
  }
  if (type === 246) {
    return data;
  }
  data = [
    ...data,
    { value: type === 286 ? "Product Bundling" : "Eligibility Product" },
  ];
  return data;
};

export const lowerCaseStatus = (status) => {
  let text ;
  switch (status) {
    case "WAITING_FOR_APPROVAL":
    case "WAITING FOR APPROVAL":
      return text = "Waiting Approval";
    default:
      return text = status
        ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
        : status;
  }
}

export const handleMandatory = (setListSectionInfo = () => {}, listDataAttachment, errorFields) => {
    setListSectionInfo((prevState) => {
      const res = prevState.map((item) => {
        const errorBadge = item.value !== "Attachment" ? (errorFields || []).reduce(
          (current, next) =>
            item.paramValue.includes(next.name[0]) ? current + 1 : current,
          0
        ) : listDataAttachment.length < 1 ? 1 : 0;
        return {
          value: item.value,
          paramValue: item.paramValue,
          errorBadge,
        };
      });
      return res;
    });
};