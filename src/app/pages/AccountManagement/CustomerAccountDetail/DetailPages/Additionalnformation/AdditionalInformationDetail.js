import moment from "moment";
import {
  hasValue,
  renderColumn,
} from "../../../../../../utils";
import { getColumnSearchPropsUseFilteredValueFE } from "../../../../../../utils/getColumnSearchProps";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import { Tooltip } from "antd";
import SVGIcon from "../../../../../../assets/Icon/index";
import { getCategoryAdditionalInfoList, getValueAdditionalInfoList } from "../../../../../../redux/slices/account_management/detailAccount/additionalInformation";

const sorter = (fieldSort, a, b) => {
  const handleDataSort = (obj) => {
    switch (fieldSort) {
      case "adjustmentType":
        return obj[fieldSort]?.label.toLowerCase();
      case "startDate":
      case "endDate":
        const date = obj[fieldSort]
          ? moment(obj[fieldSort]).format("DD MMM YYYY")
          : "";
        return date.toLowerCase();
      default:
        return obj[fieldSort].label?.toLowerCase();
    }
  };
  let fa = handleDataSort(a);
  let fb = handleDataSort(b);
  return fa.localeCompare(fb);
};

export const additionalInformationTable = (
  listOption = {},
  searchInput,
  searchedColumn,
  searchText,
  handleSearch,
  search,
  storedData
) => [
  {
    required: true,
    title: "CATEGORY",
    width: 240,
    sorter: (a, b) => sorter("category", a, b),
    dataIndex: "category",
    dataIndexForm: "data_category",
    inputType: "select",
    filteredValue: search?.["category"] ? [search?.["category"]] : null,
    option: listOption["data_category"],
    url: getCategoryAdditionalInfoList(),
    ellipsis: {
      showTitle: false,
    },
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "category",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "input",
      storedData
    ),
    render: (text) =>
      renderColumn(
        "category",
        hasValue(search["category"]),
        searchText,
        text?.label,
        true,
        "input",
        search
      ),
  },
  {
    title: "VALUE",
    width: 240,
    //onFilter: (value, record) => //onFilter("tiering", value, record),
    sorter: (a, b) => sorter("value", a, b),
    dataIndex: "value",
    dataIndexForm: "data_value",
    inputType: "dynamic",
    filteredValue: search?.["value"] ? [search?.["value"]] : null,
    option: listOption["data_value"],
    dependDataIndex: "category",
    url: getValueAdditionalInfoList(),
    ellipsis: {
      showTitle: false,
    },
    ...getColumnSearchPropsUseFilteredValueFE(
      search,
      "value",
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      true,
      "input",
      storedData
    ),
    render: (text) =>
      renderColumn(
        "value",
        hasValue(search["value"]),
        searchText,
        text?.label || text,
        true,
        "input",
        search
      ),
  },
];

export const itemActionViewAdditionalInfoTable = ({
  editingKey,
  handleDetailHistory = () => {},
  addRow = () => {},
  edit = () => {},
  deleteRow = () => {},
  storedData,
  startDate,
  setModalRequired,
  checkStartDate = false,
}) => [
  {
    action: "Create",
    render: (
      <ButtonComponent
      icon={<SVGIcon name="IconButtonCreate" width={24} />}
      type="submit"
      onClick={() => {
        if (!storedData && (hasValue(startDate) || !checkStartDate)) {
          addRow();
        } else {
          if (!hasValue(startDate)) {
            setModalRequired(true);
          }
        }
      }}
    >
      Create
    </ButtonComponent>
    )
  },

  //table
  {
    action: "view",
    type: "table",
    render: (record, data_length) => {
      return (data_length || 0) > 3 ? (
        <ButtonComponent
          icon={<SVGIcon name="IconDetail"  width={24} />}
          border={false}
          disabled={editingKey}
          onClick={!editingKey ? () => handleDetailHistory(record) : undefined}
        >
          {data_length > 3 && (
            <span className="text-black ml-3"> Detail</span>
          )}
        </ButtonComponent>
      ) : (
        <Tooltip title="Detail">
          <SVGIcon
            name="IconDetail"
            color={editingKey ? "#8D91A0" : "#0075BF"}
            width={24}
            className={editingKey ? "cursor-not-allowed" : undefined}
            onClick={() => handleDetailHistory(record)}
          />
      </Tooltip>
      );
    }
  },
  {
    action: "Update",
    type: "table",
    render: (record, data_length) => {
      return (data_length || 0) > 3 ? (
        <ButtonComponent
          icon={<SVGIcon name="IconEdit" color="#0075bf" width={24} />}
          border={false}
          disabled={editingKey}
          onClick={!editingKey ? () => edit(record) : undefined}
        >
          {data_length > 3 && (
            <span className="text-black ml-3"> Update</span>
          )}
        </ButtonComponent>
      ) : (
        <Tooltip title="Update">
          <div>
            <SVGIcon
              name="IconEdit"
              color={editingKey ? "#8D91A0" : "#ACC424"}
              className={editingKey ? "cursor-not-allowed" : undefined}
              width={24}
              onClick={!editingKey ? () => edit(record) : undefined}
            />
          </div>
        </Tooltip>
      );
    }
  },
  {
    action: "delete",
    type: "table",
    render: (record, data_length) => (
      <Tooltip title="Delete">
        <div>
          <SVGIcon
            name="IconDelete"
            color={!editingKey ? "#D90000" : "#8D91A0"}
            width={24}
            className={
              !editingKey ? undefined : "disabled cursor-not-allowed"
            }
            onClick={!editingKey ? () => deleteRow(record) : undefined}
          />
        </div>
      </Tooltip>
    )
  }
];
