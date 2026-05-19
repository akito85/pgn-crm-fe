import { Tooltip } from "antd";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../../../../../utils/getColumnSearchProps";
import SVGIcon from "../../../../../../../../../assets/Icon/index";
import StatusComponent from "../../../../../../../../../components/StatusComponent";
import NxDate from "../../../../../../../../../components/Nx/NxDatePicker";
import { toTitleCase } from "../../../../../../../../../utils";

const getSrRefColumns = (
  search,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch,
  setServiceRequestRef = () => {},
  setIsOpen = () => {}
) => [
  {
    key: "no",
    title: "NO",
    width: 50,
    align: "center",
    render: (_, __, index) => index + 1
  },
  {
    key: "requestNumber",
    title: "SR NUMBER",
    dataIndex: "requestNumber",
    width: 150,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "requestNumber",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    )
  },
  {
    key: "reference",
    title: "SR REFERENCE",
    dataIndex: "reference",
    width: 150,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "reference",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    )
  },
  {
    key: "type",
    title: "TYPE",
    dataIndex: "type",
    width: 150,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "type",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    )
  },
  {
    key: "category",
    title: "CATEGORY",
    dataIndex: "category",
    width: 150,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "category",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    )
  },
  {
    key: "subCategory",
    title: "SUB-CATEGORY",
    dataIndex: "subCategory",
    width: 150,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "subCategory",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    )
  },
  {
    key: "channel",
    title: "CHANNEL",
    dataIndex: "channel",
    width: 140,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "channel",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    )
  },
  {
    key: "priority",
    title: "PRIORITY",
    dataIndex: "priority",
    width: 150,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "priority",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    )
  },
  {
    key: "source",
    title: "REQUEST SOURCE",
    dataIndex: "source",
    width: 150,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "source",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    )
  },
  {
    key: "requestDate",
    title: "REQUEST DATE",
    dataIndex: "requestDate",
    width: 140,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "requestDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (date) => NxDate.formatDate(date, "DD MMM YYYY")
  },
  {
    key: "openDate",
    title: "OPEN DATE",
    dataIndex: "openDate",
    width: 140,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "openDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (date) => NxDate.formatDate(date, "DD MMM YYYY")
  },
  {
    key: "resolvedDate",
    title: "RESOLVED DATE",
    dataIndex: "resolvedDate",
    width: 140,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "resolvedDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (date) => NxDate.formatDate(date, "DD MMM YYYY")
  },
  {
    key: "closedDate",
    title: "CLOSED DATE",
    dataIndex: "closedDate",
    width: 140,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "closedDate",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (date) => NxDate.formatDate(date, "DD MMM YYYY")
  },
  {
    key: "age",
    title: "AGE (HOUR)",
    dataIndex: "age",
    width: 150,
    sorter: true,
    align: "center",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "age",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    ),
    render: (age) => age || "0"
  },
  {
    key: "description",
    title: "DESCRIPTION",
    dataIndex: "description",
    width: 200,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "description",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    )
  },
  {
    key: "escalation",
    title: "ESCALATION",
    dataIndex: "escalation",
    width: 150,
    sorter: true,
    align: "center",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "escalation",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "action",
    title: "ACTION",
    align: "center",
    width: 100,
    fixed: "right",
    render: (_, record) => (
      <div className="flex w-full justify-center gap-4">
        <Tooltip title="Select">
          <div className="pt-1 cursor-pointer">
            <SVGIcon
              name="IconActionCreate"
              color={"#0075bf"}
              width={20}
              onClick={() => {
                setServiceRequestRef(record.requestNumber);
                setIsOpen(false);
              }}
            />
          </div>
        </Tooltip>
      </div>
    )
  }
];

export { getSrRefColumns };
