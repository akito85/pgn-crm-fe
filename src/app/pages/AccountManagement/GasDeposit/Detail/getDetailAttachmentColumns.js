import { Tooltip } from "antd";
import SVGIcon from "../../../../../../../../assets/Icon/index";
import { getColumnSearchPropsUseFilteredValueFE } from "../../../../../utils/getColumnSearchProps";
import { sorterFunction } from "../../../../../utils/sorterFunction";

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
    width: 75,
    sorter: (a, b) => sorterFunction("fileCategoryName", a, b),
    ...getColumnSearchPropsUseFilteredValueFE(
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
    title: "FILE NAME",
    dataIndex: "fileName",
    width: 300,
    sorter: (a, b) => sorterFunction("fileName", a, b),
    ...getColumnSearchPropsUseFilteredValueFE(
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
    title: "FILE SIZE",
    dataIndex: "fileSize",
    width: 100,
    align: "center",
    sorter: (a, b) => sorterFunction("fileSize", a, b),
    ...getColumnSearchPropsUseFilteredValueFE(
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