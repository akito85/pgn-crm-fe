import { Checkbox, Tooltip } from "antd";
import StatusComponent from "../../../../../components/StatusComponent";
import { getColumnSearchProps } from "../../../../../utils/getColumnSearchProps";
import { Link } from "react-router-dom";
import SVGIcon from "../../../../../assets/Icon/index";

const useSelectedColumnList = (
  value,
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  handleActiveOrInactive = () => {},
) => {
  let selectedColumn;
  if (value === "ALL") {
    selectedColumn = [
      {
        title: "NO",
        width: 60,
        align: "center",
        render: (text, object, index) => (page - 1) * pageSize + index + 1,
      },
      {
        title: "CODE",
        dataIndex: "code",
        sorter: true,
        ...getColumnSearchProps(
          "code",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
      },
      {
        title: "COUNTRY",
        dataIndex: "country",
        sorter: true,
        ...getColumnSearchProps(
          "country",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
      },
      {
        title: "PROVICE",
        dataIndex: "province",
        sorter: true,
        ...getColumnSearchProps(
          "province",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
      },
      {
        title: "CITY",
        dataIndex: "city",
        sorter: true,
        ...getColumnSearchProps(
          "city",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
      },
      {
        title: "DISTRICT",
        dataIndex: "district",
        sorter: true,
        ...getColumnSearchProps(
          "district",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
      },
      {
        title: "SUB DISTRICT",
        dataIndex: "subDistrict",
        sorter: true,
        ...getColumnSearchProps(
          "subDistrict",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
      },
      {
        title: "LOCATION REFERENCE",
        dataIndex: "locationReference",
        sorter: true,
        ...getColumnSearchProps(
          "locationReference",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
      },
      {
        title: "STATUS",
        dataIndex: "status",
        sorter: true,
        ...getColumnSearchProps(
          "status",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
        render: (text) => (
          <StatusComponent colour={text}>{text}</StatusComponent>
        ),
      },
      {
        title: "ACTION",
        width: 120,
        fixed: "right",
        render: (text, record, i) => {
          return (
            <div className="w-full flex justify-center gap-4 mt-1 items-start">
              {/* {access?.actions?.includes("View") && ( */}
              <Tooltip title="Detail">
                <Link>
                  <div
                    onClick={() => {
                      // setOpenModal(true);
                      // handleDetail(r?.appHierId);
                      // setModalType("detail");
                    }}
                  >
                    <SVGIcon name="IconDetail" width={24} />
                  </div>
                </Link>
              </Tooltip>
              {/* )} */}

              {/* {access?.actions?.includes("Update") && ( */}
              <Tooltip title="Update">
                {record?.status === "INACTIVE" ? (
                  <Link>
                    <div className={"cursor-not-allowed"}>
                      <SVGIcon
                        name="IconEdit"
                        width={24}
                        color={"#C0BEC6"}
                        className={"cursor-not-allowed"}
                      />
                    </div>
                  </Link>
                ) : (
                  <Link to={""} state={{ id: record?.appHierId }}>
                    <div>
                      <SVGIcon name="IconEdit" width={24} />
                    </div>
                  </Link>
                )}
              </Tooltip>
              {/* )} */}
              {/* {access?.actions?.includes("Activate") && ( */}
              <Tooltip
                title={record.status === "ACTIVE" ? "INACTIVATE" : "ACTIVATE"}
              >
                <Link>
                  <div>
                    <Checkbox
                      onClick={() => {
                        // setOpenModal(true);
                        // setModalType("inactive");
                        // setStatus(r?.status);
                        // setAppHierId(r?.appHierId);
                      }}
                      checked={record?.status === "ACTIVE" ? true : false}
                    />
                  </div>
                </Link>
              </Tooltip>
              {/* )} */}
            </div>
          );
        },
      },
    ];
  } else {
    selectedColumn = [
      {
        title: "NO",
        width: 60,
        align: "center",
        render: (text, object, index) => (page - 1) * pageSize + index + 1,
      },
      {
        title: "CODE",
        dataIndex: "code",
        sorter: true,
        ...getColumnSearchProps(
          "code",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
      },
      {
        title: "LOCATION NAME",
        dataIndex: "locationName",
        sorter: true,
        ...getColumnSearchProps(
          "locationName",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
      },
      {
        title: "LOCATION PARENT",
        dataIndex: "locationParent",
        sorter: true,
        ...getColumnSearchProps(
          "locationParent",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
      },
      {
        title: "LOCATION REFERENCE",
        dataIndex: "locationReference",
        sorter: true,
        ...getColumnSearchProps(
          "locationReference",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
      },
      {
        title: "STATUS",
        dataIndex: "status",
        sorter: true,
        ...getColumnSearchProps(
          "status",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
        render: (text) => (
          <StatusComponent colour={text}>{text}</StatusComponent>
        ),
      },
      {
        title: "ACTION",
        width: 120,
        fixed: "right",
        render: (text, record, i) => {
          return (
            <div className="w-full flex justify-center gap-4 mt-1 items-start">
              {/* {access?.actions?.includes("View") && ( */}
              <Tooltip title="Detail">
                <Link>
                  <div
                    onClick={() => {
                      // setOpenModal(true);
                      // handleDetail(r?.appHierId);
                      // setModalType("detail");
                    }}
                  >
                    <SVGIcon name="IconDetail" width={24} />
                  </div>
                </Link>
              </Tooltip>
              {/* )} */}

              {/* {access?.actions?.includes("Update") && ( */}
              <Tooltip title="Update">
                {record?.status === "INACTIVE" ? (
                  <Link>
                    <div className={"cursor-not-allowed"}>
                      <SVGIcon
                        name="IconEdit"
                        width={24}
                        color={"#C0BEC6"}
                        className={"cursor-not-allowed"}
                      />
                    </div>
                  </Link>
                ) : (
                  <Link to={""} state={{ id: record?.appHierId }}>
                    <div>
                      <SVGIcon name="IconEdit" width={24} />
                    </div>
                  </Link>
                )}
              </Tooltip>
              {/* )} */}
              {/* {access?.actions?.includes("Activate") && ( */}
              <Tooltip
                title={record.status === "ACTIVE" ? "INACTIVATE" : "ACTIVATE"}
              >
                <Link>
                  <div>
                    <Checkbox
                      onClick={() => {
                        // setOpenModal(true);
                        // setModalType("inactive");
                        // setStatus(r?.status);
                        // setAppHierId(r?.appHierId);
                      }}
                      checked={record?.status === "ACTIVE" ? true : false}
                    />
                  </div>
                </Link>
              </Tooltip>
              {/* )} */}
            </div>
          );
        },
      },
    ];
  }

  return { selectedColumn };
};

export default useSelectedColumnList;
