import moment from "moment";
import {
  formMessageRequired,
  hasValue,
  renderColumn,
  renderDateColumn,
} from "../../utils";
import { getColumnSearchPropsUseFilteredValueFE } from "../../utils/getColumnSearchProps";
import { sorterFunction } from "../../utils/sorterFunction";

const endDateValidator = (startDate) => (_, value) => {
  const momentStartDate = moment(startDate);
  const momentEndDate = moment(value);

  if ((value && momentStartDate <= momentEndDate) || !value) {
    return Promise.resolve();
  } else {
    return Promise.reject(new Error("End Date must be after Start Date"));
  }
};

export const CommonTable = (
  form,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch,
  search,
  storedData,
) => {
  return [
    {
      required: true,
      title: "ADJUSTMENT VALUE",
      width: 240,
      dataIndex: "adjustmentValue",
      indexValue: 1,
      //onFilter: (value, record) => //onFilter("adjustmentValue", value, record),
      sorter: (a, b) => sorterFunction("adjustmentValue", a, b),
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
        "input",
        storedData,
      ),
      render: (text) =>
        renderColumn(
          "adjustmentValue",
          hasValue(search["adjustmentValue"]),
          searchText,
          text,
          true,
          "input",
          search,
        ),
    },
    {
      title: "START DATE",
      dataIndex: "startDate",
      dataIndexForm: "startDate",
      indexValue: 1,
      inputType: "startDate",
      align: "center",
      required: true,
      filteredValue: search?.["startDate"] ? [search?.["startDate"]] : null,
      width: 240,
      rules: formMessageRequired("Start Date"),
      sorter: (a, b) => sorterFunction("startDate", a, b, "date"),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "startDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "date",
        storedData,
      ),
      render: (text) =>
        renderDateColumn(
          "startDate",
          hasValue(search["startDate"]),
          searchText,
          text,
          "date",
          search,
        ),
    },
    {
      title: "END DATE",
      dataIndex: "endDate",
      dataIndexForm: "endDate",
      inputType: "endDate",
      align: "center",
      indexValue: 1,
      filteredValue: search?.["endDate"] ? [search?.["endDate"]] : null,
      width: 240,
      rules: [
        {
          validator: (_, value) =>
            endDateValidator(form.getFieldValue().startDate)(_, value),
        },
      ],
      sorter: (a, b) => sorterFunction("endDate", a, b, "date"),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "endDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "date",
        storedData,
      ),
      render: (text) =>
        renderDateColumn(
          "endDate",
          hasValue(search["endDate"]),
          searchText,
          text,
          "date",
          search,
        ),
    },
    {
      title: "DESCRIPTION",
      width: 240,
      inputType: "textarea",
      dataIndex: "description",
      dataIndexForm: "description",
      filteredValue: search?.["description"] ? [search?.["description"]] : null,
      indexValue: 1,
      //onFilter: (value, record) => //onFilter("description", value, record),
      sorter: (a, b) => sorterFunction("description", a, b),
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "description",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input",
        storedData,
      ),
      render: (text) =>
        renderColumn(
          "description",
          hasValue(search["description"]),
          searchText,
          text,
          true,
          "input",
          search,
        ),
    },
  ];
};
