import { renderColumn } from "../../../../../../../utils";
import { getColumnSearchPropsUseFilteredValueFE } from "../../../../../../../utils/getColumnSearchProps";

const getContactDetailColumns = ({ search, searchInput, searchedColumn, searchText, handleSearch }) => [
  {
    key: "no",
    title: "NO",
    width: 50,
    align: "center",
    render: (_, __, index) => index + 1,
  },
  {
    key: "type",
    title: "TYPE",
    dataIndex: "type",
    width: 200,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValueFE(search, "type", searchInput, searchedColumn, searchText, handleSearch, true),
    render: (text) => renderColumn("type", searchedColumn, searchText, text, false, "input", search),
  },
  {
    key: "inputType",
    title: "INPUT TYPE",
    dataIndex: "inputType",
    width: 200,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValueFE(search, "inputType", searchInput, searchedColumn, searchText, handleSearch, true),
    render: (text) => renderColumn("inputType", searchedColumn, searchText, text, false, "input", search),
  },
  {
    key: "value",
    title: "VALUE",
    dataIndex: "value",
    width: 590,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValueFE(search, "value", searchInput, searchedColumn, searchText, handleSearch, true),
    render: (text) => renderColumn("value", searchedColumn, searchText, text, false, "input", search),
  },
];

export { getContactDetailColumns };
