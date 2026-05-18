import { useMemo, useRef, useState } from "react";
import NxTable from "../../../../../../../components/Nx/NxTable";
import { getContactDetailColumns } from "./getContactDetailColumns";

const ContactDetailTable = ({ details = [], contactKey }) => {
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
    () => getContactDetailColumns({ search, searchInput, searchedColumn, searchText, handleSearch }),
    [search, searchText, searchedColumn]
  );

  return (
    <NxTable
      useSelect={false}
      usePagination={false}
      dataSource={details}
      columns={columns}
      idTable={`contact-detail-table-${contactKey}`}
      totalData={details.length}
      tableScrolled={{ x: "max-content" }}
      rounded={false}
      showFooter={false}
      showBorder={false}
    />
  );
};

export default ContactDetailTable;
