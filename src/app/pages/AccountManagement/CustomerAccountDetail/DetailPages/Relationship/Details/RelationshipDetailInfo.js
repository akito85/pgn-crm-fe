import { useMemo, useRef, useState } from "react";
import { dateFormatting } from "../../../../../../../utils";
import NxDetailText from "../../../../../../../components/Nx/NxDetailText";
import NxBaseContainer from "../../../../../../../components/Nx/NxBaseContainer";
import NxTable from "../../../../../../../components/Nx/NxTable";
import NxDate from "../../../../../../../components/Nx/NxDatePicker";
import StatusComponent from "../../../../../../../components/StatusComponent";
import { getRelatedDetailColumns } from "../getRelatedDetailColumns";

const RelationshipDetailInfo = ({ detail = {} }) => {
  const searchInput = useRef(null);

  // Related Detail table state
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState({});

  const listRelatedDetail = detail.relatedDetail || [];

  /**
   * @param {string[]} selectedKeys
   * @param {() => {}} confirm
   * @param {string} dataIndex
   */
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch((prevState) => {
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
  };

  const baseColumns = useMemo(
    () =>
      getRelatedDetailColumns({
        search,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      }),
    [search, searchText, searchedColumn]
  );

  const columns = useMemo(() => {
    const columnsWithKeys = baseColumns.map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
    return columnsWithKeys;
  }, [baseColumns]);

  return (
    <div className="flex flex-col gap-y-4">
      <NxBaseContainer border header="RELATIONSHIP INFORMATION">
        <div className="flex flex-col gap-y-4">
          <div className="w-full grid grid-cols-4 gap-4">
            <NxDetailText label="Relationship Type">
              {detail?.relationshipTypeName?.toUpperCase() || "-"}
            </NxDetailText>
            <NxDetailText label="Relationship Category">
              {detail?.relationshipCategoryName?.toUpperCase() || "-"}
            </NxDetailText>
            <NxDetailText label="Related Name">
              {detail?.subjectName || detail?.objectName || "-"}
            </NxDetailText>
            <NxDetailText label="Related Number">
              {detail?.subjectNumber || detail?.objectNumber || "-"}
            </NxDetailText>
            <NxDetailText label="Start Date">
              {NxDate.formatDate(detail?.startDate, dateFormatting.date)}
            </NxDetailText>
            <NxDetailText label="End Date">
              {NxDate.formatDate(detail?.endDate, dateFormatting.date)}
            </NxDetailText>
            <NxDetailText label="Status">
              <StatusComponent colour={detail?.status}>
                {detail?.status || "-"}
              </StatusComponent>
            </NxDetailText>
          </div>
          <div className="w-full">
            <NxDetailText label="Description">
              {detail?.description || "-"}
            </NxDetailText>
          </div>
        </div>
      </NxBaseContainer>

      <NxBaseContainer border header="RELATED DETAIL">
        <NxTable
          idTable="relationship-related-detail-table"
          dataSource={listRelatedDetail}
          tableScrolled={{ x: listRelatedDetail.length ? "max-content" : 3000 }}
          columns={columns}
          usePagination={false}
          useInfiniteScroll={false}
          showAdvanceSearch={false}
        />
      </NxBaseContainer>
    </div>
  );
};

export default RelationshipDetailInfo;
