import { useMemo, useRef, useState } from "react";
import { dateFormatting } from "../../../../../../../utils";
import NxDetailText from "../../../../../../../components/Nx/NxDetailText";
import NxBaseContainer from "../../../../../../../components/Nx/NxBaseContainer";
import NxTable from "../../../../../../../components/Nx/NxTable";
import NxDate from "../../../../../../../components/Nx/NxDatePicker";
import { getRelatedDetailColumns } from "../getRelatedDetailColumns";
import NxStatusComponent from "../../../../../../../components/Nx/NxStatusComponent";

/**
 * Displays relationship info fields and the related-detail table for a single record.
 *
 * @param {object} props
 * @param {object} [props.detail={}] - Relationship detail record.
 */
const RelationshipDetailInfo = ({ detail = {} }) => {
  // --- Refs ---
  const searchInput = useRef(null);

  // --- State ---
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState({});

  // --- Derived values ---
  const {
    relationshipTypeName,
    relationshipCategoryName,
    relatedAccountName,
    relatedAccountNumber,
    startDate,
    endDate,
    status,
    statusApproval,
    description,
  } = detail;
  const listRelatedDetail = detail.relatedDetail || [];

  // --- Handlers ---
  /**
   * Applies column search filter and updates search state.
   * @param {string[]} selectedKeys - Active filter values
   * @param {Function} confirm      - Antd confirm callback
   * @param {string}   dataIndex    - Column key being searched
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

  // --- Columns ---
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
              {relationshipTypeName?.toUpperCase()}
            </NxDetailText>
            <NxDetailText label="Relationship Category">
              {relationshipCategoryName?.toUpperCase()}
            </NxDetailText>
            <NxDetailText label="Related Name">
              {relatedAccountName}
            </NxDetailText>
            <NxDetailText label="Related Number">
              {relatedAccountNumber}
            </NxDetailText>
            <NxDetailText label="Start Date">
              {NxDate.formatDate(startDate, dateFormatting.date)}
            </NxDetailText>
            <NxDetailText label="End Date">
              {NxDate.formatDate(endDate, dateFormatting.date)}
            </NxDetailText>
            <NxDetailText label="Status">
              <NxStatusComponent colour={status}>
                {status}
              </NxStatusComponent>
            </NxDetailText>
            <NxDetailText label="Status Approval">
              <NxStatusComponent colour={statusApproval}>
                {statusApproval}
              </NxStatusComponent>
            </NxDetailText>
          </div>
          <div className="w-full">
            <NxDetailText label="Description">
              {description}
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
          totalData={listRelatedDetail.length}
          usePagination={false}
          useInfiniteScroll={false}
          showAdvanceSearch={false}
        />
      </NxBaseContainer>
    </div>
  );
};

export default RelationshipDetailInfo;
