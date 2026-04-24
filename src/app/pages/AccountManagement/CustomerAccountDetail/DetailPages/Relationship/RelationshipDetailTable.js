import { useMemo, useRef, useState } from "react";
import { getRelatedDetailColumns } from "./getRelatedDetailColumns";
import NxTable from "../../../../../../components/Nx/NxTable";

/**
 * Renders the expandable nested "Related Detail" table for a relationship row.
 *
 * @param {object}   props
 * @param {Array}    [props.relatedDetail=[]] - Related detail records from the parent row.
 */
const RelationshipDetailTable = ({ relatedDetail = [] }) => {
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
    () => getRelatedDetailColumns({ search, searchInput, searchedColumn, searchText, handleSearch }),
    [search, searchText, searchedColumn]
  );

  return (
    <NxTable
      useSelect={false}
      usePagination={false}
      dataSource={relatedDetail}
      columns={columns}
      className="related-detail-nested-table"
    />
  );
};

export default RelationshipDetailTable;
