const symbolOperator = {
  220: "-",
  229: "+",
  235: "*",
  240: "/",
};
export const getFormula = (listDataDetailFormula = []) => {
  return listDataDetailFormula.reduce((prev, current, index) => {
    let val = prev;
    if (index !== 0) {
      if (current?.operation?.value) {
        val += " " + symbolOperator[current.operation.value];
      }
    }
    if (current?.type?.value) {
      val += " ";
      if (current?.type?.value === "CONSTANT") {
        val += current.value;
      } else {
        val += current.variableName.label;
      }
    }
    return val;
  }, "");
};
