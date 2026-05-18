import { getColumnSearchPropsUseFilteredValue } from "../../../../../../../utils/getColumnSearchProps";
import StatusComponent from "../../../../../../../components/StatusComponent";
import NxStatusComponent from "../../../../../../../components/Nx/NxStatusComponent";

const getContactColumns = ({ search, searchInput, searchedColumn, searchText, handleSearch }) => [
  {
    key: "no",
    title: "NO",
    align: "center",
    width: 50,
    render: (_, __, index) => index + 1,
  },
  {
    key: "primary",
    title: "PRIMARY",
    dataIndex: "primary",
    width: 200,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(search, "primary", searchInput, searchedColumn, searchText, handleSearch),
    render: (v) => v === "Y" ? "Primary" : "Non-Primary",
  },
  {
    key: "contactName",
    title: "CONTACT NAME",
    dataIndex: "contactName",
    width: 200,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(search, "contactName", searchInput, searchedColumn, searchText, handleSearch),
  },
  {
    key: "job",
    title: "JOB",
    dataIndex: "job",
    width: 200,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(search, "job", searchInput, searchedColumn, searchText, handleSearch),
  },
  {
    key: "position",
    title: "POSITION",
    dataIndex: "position",
    width: 200,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(search, "position", searchInput, searchedColumn, searchText, handleSearch),
  },
  {
    key: "address",
    title: "ADDRESS",
    dataIndex: "address",
    width: 200,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(search, "address", searchInput, searchedColumn, searchText, handleSearch),
  },
  {
    key: "additionalNote",
    title: "ADDITIONAL NOTE",
    dataIndex: "additionalNote",
    width: 200,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(search, "additionalNote", searchInput, searchedColumn, searchText, handleSearch),
  },
  {
    key: "description",
    title: "DESCRIPTION",
    dataIndex: "description",
    width: 200,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(search, "description", searchInput, searchedColumn, searchText, handleSearch),
  },
  {
    key: "status",
    title: "STATUS",
    dataIndex: "status",
    width: 100,
    fixed: "right",
    align: "center",
    render: (v) => (
      <div className={" flex justify-center"}>
        <NxStatusComponent colour={(v || "").toLowerCase()} margin={false}>
          {v}
        </NxStatusComponent>
      </div>
    ),
  },
];

export { getContactColumns };
