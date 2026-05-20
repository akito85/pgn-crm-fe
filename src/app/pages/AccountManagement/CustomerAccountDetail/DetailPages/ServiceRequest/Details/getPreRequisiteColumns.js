import { getColumnSearchPropsUseFilteredValue } from "../../../../../../../utils/getColumnSearchProps";
import NxDate from "../../../../../../../components/Nx/NxDatePicker";
import NxStatusComponent from "../../../../../../../components/Nx/NxStatusComponent";

const getPreRequisiteColumns = ({
  search,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch,
}) => [
  {
    key: "no",
    title: "NO",
    align: "center",
    width: 60,
    render: (_, __, index) => index + 1,
  },
  {
    key: "type",
    title: "TYPE",
    dataIndex: "type",
    width: 300,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "type",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    key: "name",
    title: "NAME",
    dataIndex: "name",
    width: 300,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "name",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
  },
  {
    key: "completedDate",
    title: "COMPLETED DATE",
    dataIndex: "completedDate",
    width: 300,
    sorter: true,
    align: "center",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "completedDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      false,
      "dateFormal"
    ),
    render: (v) => NxDate.formatDate(v, "DD MMM YYYY"),
  },
  {
    key: "status",
    title: "STATUS",
    dataIndex: "status",
    width: 100,
    fixed: "right",
    render: (v) => v ? (
      <div className="flex justify-center">
        <NxStatusComponent colour={v}>
          {v}
        </NxStatusComponent>
      </div>
    ) : "-",
  },
];

export { getPreRequisiteColumns };
