import { useMemo, useRef, useState } from "react";
import NxTable from "../../Nx/NxTable";
import { getColumnSearchPropsUseFilteredValueFE } from "../../../utils/getColumnSearchProps";

const ContactDetailExpandTable = ({ contactDetails = [] }) => {
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState({});

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(selectedKeys[0] ? dataIndex : "");
    setSearch((prev) => ({ ...prev, [dataIndex]: selectedKeys[0] }));
  };

  const columns = useMemo(
    () => [
      {
        key: "no",
        title: "NO",
        align: "center",
        width: 60,
        render: (text, object, index) => index + 1,
      },
      {
        key: "typeName",
        title: "TYPE",
        dataIndex: "typeName",
        width: 200,
        sorter: true,
        ...getColumnSearchPropsUseFilteredValueFE(
          search,
          "typeName",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
      },
      {
        key: "inputTypeName",
        title: "INPUT TYPE",
        dataIndex: "inputTypeName",
        width: 200,
        sorter: true,
        ...getColumnSearchPropsUseFilteredValueFE(
          search,
          "inputTypeName",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
      },
      {
        key: "fullValue",
        title: "VALUE",
        dataIndex: "fullValue",
        width: 650,
        sorter: true,
        ...getColumnSearchPropsUseFilteredValueFE(
          search,
          "fullValue",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
        ),
      },
    ],
    [search, searchText, searchedColumn]
  );

  return (
    <NxTable
      useSelect={false}
      usePagination={false}
      dataSource={contactDetails}
      columns={columns}
      tableScrolled={{ x: "max-content" }}
      rounded={false}
      showFooter={false}
      showBorder={false}
    />
  );
};

export default ContactDetailExpandTable;
