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
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "fileCategoryName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "fileName",
    title: "FILE NAME",
    dataIndex: "fileName",
    width: 300,
    sorter: true,
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "fileName",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
    ),
  },
  {
    key: "fileSize",
    title: "FILE SIZE",
    dataIndex: "fileSize",
    width: 100,
    sorter: true,
    align: "center",
    ...getColumnSearchPropsUseFilteredValue(
      search,
      "fileSize",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
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
