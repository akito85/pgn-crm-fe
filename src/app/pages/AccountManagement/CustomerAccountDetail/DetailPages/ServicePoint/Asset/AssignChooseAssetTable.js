import React from "react";
import { Tooltip } from "antd";
import TablePagination from "../../../../../../../components/TablePagination";
import SVGIcon from "../../../../../../../assets/Icon/index";
import { Fragment } from "react";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../../../utils/getColumnSearchProps";
import {
  hasValue,
  renderColumn,
  renderDateColumn,
} from "../../../../../../../utils";

const AssignChooseAssetTable = ({
  data = [],
  handleChange = {},
  handleChangeSize = {},
  totalElement = {},
  page = {},
  pageSize = {},
  onSort = {},
  searchText,
  searchedColumn,
  // getColumnSearchProps = () => {},
  handleChooseAsset = () => {},
  handleSearch = () => {},
  search,
  searchInput,
}) => {
  // const dispatch = useDispatch();
  // const { data_detail, loading } = useSelector(
  //   (state) => state.accountManagement
  // );

  const columns = [
    {
      title: "NO",
      width: 50,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "PRODUCT NAME",
      dataIndex: "productNameValue",
      width: 250,
      sorter: true,
      align: "center",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "productNameValue",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input",
      ),
      render: (text) =>
        renderColumn(
          "productNameValue",
          hasValue(search["productNameValue"]),
          searchText,
          text,
          true,
          "input",
          search,
        ),
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: "SERVICE TYPE",
      dataIndex: "serviceTypeValue",
      width: 250,
      sorter: true,
      align: "center",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "serviceTypeValue",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input",
      ),
      render: (text) =>
        renderColumn(
          "serviceTypeValue",
          hasValue(search["serviceTypeValue"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      title: "ASSET NAME",
      dataIndex: "assetNameValue",
      width: 250,
      sorter: true,
      align: "center",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "assetNameValue",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input",
      ),
      render: (text) =>
        renderColumn(
          "assetNameValue",
          hasValue(search["assetNameValue"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      title: "ASSET TYPE",
      dataIndex: "typeValue",
      width: 250,
      sorter: true,
      align: "center",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "typeValue",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input",
      ),
      render: (text) =>
        renderColumn(
          "typeValue",
          hasValue(search["typeValue"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      title: "SERIAL NUMBER",
      dataIndex: "serialNumber",
      width: 250,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "serialNumber",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input",
      ),
      render: (text) =>
        renderColumn(
          "serialNumber",
          hasValue(search["serialNumber"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      title: "BRAND",
      dataIndex: "brandValue",
      width: 250,
      sorter: true,
      align: "center",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "brandValue",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input",
      ),
      render: (text) =>
        renderColumn(
          "brandValue",
          hasValue(search["brandValue"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      title: "YEAR",
      dataIndex: "year",
      width: 250,
      sorter: true,
      align: "center",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "year",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "year_only",
      ),
      render: (text) =>
        renderDateColumn(
          "year",
          hasValue(search["year"]),
          searchText,
          text?.toString(),
          "year",
          search,
        ),
    },
    {
      title: "CUSTODY TRANSFER",
      dataIndex: "custodyTransfer",
      width: 250,
      sorter: true,
      align: "center",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "custodyTransfer",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input",
      ),
      render: (text) =>
        renderColumn(
          "custodyTransfer",
          hasValue(search["custodyTransfers"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
      // render: (text) => {
      //   const tempText = text === "Y" ? "YES" : "NO";
      //   if (searchedColumn === "custodyTransfer") {
      //     return (
      //       <Highlighter
      //         highlightStyle={{
      //           backgroundColor: "#ffc069",
      //           padding: 0,
      //         }}
      //         searchWords={[searchText]}
      //         autoEscape
      //         textToHighlight={tempText ? tempText.toString() : ""}
      //       />
      //     );
      //   } else {
      //     return tempText;
      //   }
      // <span>{text}</span>
      // },
    },
    {
      title: "INLET DIAMETER",
      dataIndex: "inletDiameter",
      width: 250,
      sorter: true,
      align: "right",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "inletDiameter",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input",
      ),
      render: (text) =>
        renderColumn(
          "inletDiameter",
          hasValue(search["inletDiameter"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      title: "OUTLET DIAMETER",
      dataIndex: "outletDiameter",
      width: 250,
      sorter: true,
      align: "right",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "outletDiameter",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input",
      ),
      render: (text) =>
        renderColumn(
          "outletDiameter",
          hasValue(search["outletDiameter"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      title: "MINIMUM INLET PRESSURE",
      dataIndex: "minimumInletPressure",
      width: 250,
      sorter: true,
      align: "right",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "minimumInletPressure",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input",
      ),
      render: (text) =>
        renderColumn(
          "minimumInletPressure",
          hasValue(search["minimumInletPressure"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      title: "MAXIMUM INLET PRESSURE",
      dataIndex: "maximumInletPressure",
      width: 250,
      sorter: true,
      align: "right",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "maximumInletPressure",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input",
      ),
      render: (text) =>
        renderColumn(
          "maximumInletPressure",
          hasValue(search["maximumInletPressure"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      title: "MINIMUM OUTLET PRESSURE",
      dataIndex: "minimumOutletPressure",
      width: 250,
      sorter: true,
      align: "right",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "minimumOutletPressure",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input",
      ),
      render: (text) =>
        renderColumn(
          "minimumOutletPressure",
          hasValue(search["minimumOutletPressure"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      title: "MAXIMUM OUTLET PRESSURE",
      dataIndex: "maximumOutletPressure",
      width: 250,
      sorter: true,
      align: "right",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "maximumOutletPressure",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input",
      ),
      render: (text) =>
        renderColumn(
          "maximumOutletPressure",
          hasValue(search["maximumOutletPressure"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      title: "MAX FLOW CAPACITY PER STREAM",
      dataIndex: "maxFlowCapacityPerStream",
      width: 250,
      sorter: true,
      align: "right",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "maxFlowCapacityPerStream",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input",
      ),
      render: (text) =>
        renderColumn(
          "maxFlowCapacityPerStream",
          hasValue(search["maxFlowCapacityPerStream"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      title: "STREAM AMOUNT",
      dataIndex: "streamAmount",
      width: 250,
      sorter: true,
      align: "right",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "streamAmount",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input",
      ),
      render: (text) =>
        renderColumn(
          "streamAmount",
          hasValue(search["streamAmount"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      title: "G SIZE",
      dataIndex: "gsize",
      width: 250,
      sorter: true,
      align: "center",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "gSizeValue",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input",
      ),
      render: (text) =>
        renderColumn(
          "gsize",
          hasValue(search["gsize"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      title: "SETTING PRESSURE",
      dataIndex: "settingPressure",
      width: 250,
      sorter: true,
      align: "right",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "settingPressure",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input",
      ),
      render: (text) =>
        renderColumn(
          "settingPressure",
          hasValue(search["settingPressure"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      title: "LENGTH",
      dataIndex: "length",
      width: 250,
      sorter: true,
      align: "right",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "length",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input",
      ),
      render: (text) =>
        renderColumn(
          "length",
          hasValue(search["length"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      title: "BOLT HOLE AMOUNT",
      dataIndex: "boltHoleAmount",
      width: 250,
      sorter: true,
      align: "right",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "boltHoleAmount",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input",
      ),
      render: (text) =>
        renderColumn(
          "boltHoleAmount",
          hasValue(search["boltHoleAmount"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      title: "MINIMUM CAPACITY",
      dataIndex: "minimumCapacity",
      width: 250,
      sorter: true,
      align: "right",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "minimumCapacity",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input",
      ),
      render: (text) =>
        renderColumn(
          "minimumCapacity",
          hasValue(search["minimumCapacity"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      title: "MAXIMUM CAPACITY",
      dataIndex: "maximumCapacity",
      width: 250,
      sorter: true,
      align: "right",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "maximumCapacity",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input",
      ),
      render: (text) =>
        renderColumn(
          "maximumCapacity",
          hasValue(search["maximumCapacity"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      title: "CLASS/ANSI",
      dataIndex: "ansi",
      width: 250,
      sorter: true,
      align: "center",
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "ansi",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input",
      ),
      render: (text) =>
        renderColumn(
          "ansi",
          hasValue(search["ansi"]),
          searchText,
          text,
          false,
          "input",
          search,
        ),
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      width: 250,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "description",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input",
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
      ellipsis: {
        showTitle: false,
      },
    },
    {
      title: "STATUS",
      dataIndex: "status",
      width: 150,
      sorter: true,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "status",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "input",
      ),
      render: (text) =>
        renderColumn(
          "status",
          hasValue(search["status"]),
          searchText,
          text,
          false,
          "status",
          search,
        ),
    },
    {
      title: "ACTIONS",
      align: "center",
      width: 100,
      fixed: "right",
      render: (v, r, i) => {
        return (
          <div className="flex w-full justify-center gap-6">
            <Tooltip title="Choose">
              <div className="pt-1">
                <SVGIcon
                  name="IconActionCreate"
                  color={"#0075bf"}
                  width={24}
                  onClick={() => {
                    handleChooseAsset(r);
                  }}
                />
              </div>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  return (
    <Fragment>
      <TablePagination
        dataSource={data}
        totalData={totalElement}
        current={page}
        pageSize={pageSize}
        onChange={handleChange}
        onSizeChanger={handleChangeSize}
        tableScrolled={{ y: 525, x: 8000 }}
        onSort={onSort}
        columns={columns}
      />
    </Fragment>
  );
};

export default AssignChooseAssetTable;
