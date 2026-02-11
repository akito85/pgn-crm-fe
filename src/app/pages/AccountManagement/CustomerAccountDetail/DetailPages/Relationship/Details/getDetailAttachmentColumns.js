import { Tooltip } from "antd";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../../../utils/getColumnSearchProps";
import SVGIcon from "../../../../../../../assets/Icon/index";

const getDetailAttachmentColumns = (
  search,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch,
  handleShow = () => {},
) => [
  {
    key: "no",
    title: "NO",
    align: "center",
    width: 80,
    render: (_, __, index) => index + 1,
  },
  {
    key: "fileCategoryName",
    title: "TYPE",
    dataIndex: "fileCategoryName",
    width: 150,
    sorter: true,
    filteredValue: [search?.fileCategoryName] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "fileCategoryName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "fileName",
    title: "FILE NAME",
    dataIndex: "fileName",
    width: 300,
    sorter: true,
    filteredValue: [search?.fileName] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "fileName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true
    ),
  },
  {
    key: "fileSize",
    title: "FILE SIZE",
    dataIndex: "fileSize",
    width: 100,
    sorter: true,
    align: "center",
    filteredValue: [search?.fileSize] || null,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "fileSize",
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
    render: (_, record) => {
      return (
        <div className="flex w-full justify-center gap-6 py-1">
          <Tooltip title="View">
            <SVGIcon
              name="IconEye"
              color={"#0075bf"}
              width={20}
              onClick={() => {
                handleShow(record);
              }}
            />
          </Tooltip>
        </div>
      );
    },
  },
];

export { getDetailAttachmentColumns };
