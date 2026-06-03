import { useMemo, useRef, useState } from "react";
import NxTable from "../../../../../../components/Nx/NxTable";
import { getColumnSearchPropsUseFilteredValueFE } from "../../../../../../utils/getColumnSearchProps";

const ContactDetailTable = ({ contactDetails = [] }) => {
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
        width: 50,
        render: (text, object, index) => index + 1,
      },
      {
        key: "typeName",
        title: "INPUT TYPE",
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
        key: "contactValue",
        title: "VALUE",
        dataIndex: "contactValue",
        width: 590,
        sorter: true,
        ...getColumnSearchPropsUseFilteredValueFE(
          search,
          "contactValue",
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

export default ContactDetailTable;
