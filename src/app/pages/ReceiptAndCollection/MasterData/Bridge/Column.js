
import { getColumnSearchPropsUseFilteredValue} from "../../../../../utils/getColumnSearchProps";
import { hasValue, renderColumn } from "../../../../../utils";
import { key } from "localforage";

export const columns = (
  search,
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  handleOpenDelete= () => {},
  dataUser = {}
)  => {
    return [
        {
            key: "no",
            title: "NO",
            dataIndex: 'no',
            width: 60,
            align: "center",
            render: (text, object, index) => (page - 1) * pageSize + index + 1,
        },
        {
            key: "seqNum",
            title: "SEQ NUM",
            sorter: true,
            align: "left",
            dataIndex: "seqNum",
            ...getColumnSearchPropsUseFilteredValue(
            search,
            "seqNum",
            searchInput,
            searchedColumn,
            searchText,
            handleSearch,
            true
            ),
            render: (text) =>
            renderColumn(
                "seqNum",
                hasValue(search["seqNum"]),
                searchText,
                text,
                false,
                "input",
                search
            ),
        },
        {
            key: "paymentCode",
            title: "PAYMENT CODE",
            sorter: true,
            dataIndex: "paymentCode",
            ellipsis: {
            showTitle: false,
            },
            ...getColumnSearchPropsUseFilteredValue(
            search,
            "paymentCode",
            searchInput,
            searchedColumn,
            searchText,
            handleSearch,
            true
            ),
            render: (text) =>
            renderColumn(
                "paymentCode",
                hasValue(search["paymentCode"]),
                searchText,
                text,
                true,
                "input",
                search
            ),
        },
        {
            key: "transDate",
            title: "TRANS DATE",
            sorter: true,
            dataIndex: "transDate",
            ...getColumnSearchPropsUseFilteredValue(
            search,
            "transDate",
            searchInput,
            searchedColumn,
            searchText,
            handleSearch,
            true
            ),
            render: (text) =>
            renderColumn(
                "transDate",
                hasValue(search["transDate"]),
                searchText,
                text,
                false,
                "input",
                search
            ),
        },
    ]
};