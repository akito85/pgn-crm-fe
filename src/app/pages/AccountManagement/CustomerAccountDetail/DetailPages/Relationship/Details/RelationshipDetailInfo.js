import { useEffect, useMemo, useRef, useState } from "react";
import moment from "moment";
import { dateFormatting } from "../../../../../../../utils";
import NxDetailText from "../../../../../../../components/Nx/NxDetailText";
import NxBaseContainer from "../../../../../../../components/Nx/NxBaseContainer";
import NxTable from "../../../../../../../components/Nx/NxTable";
import StatusComponent from "../../../../../../../components/StatusComponent";
import { nxApplyFixedColumns } from "../../../../../../../utils/Nx/nxApplyFixedColumns";
import { getRelatedDetailColumns } from "./getRelatedDetailColumns";

const RelationshipDetailInfo = ({ dataDetail = {} }) => {
  const searchInput = useRef(null);

  // Related Detail table state
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState({});

  const [fixedColumns, setFixedColumns] = useState(() => ({
    right: [],
    left: [],
  }));

  const listRelatedDetail = dataDetail?.relatedDetail || [];

  // Calculate pagination for infinite scroll
  const totalElements = listRelatedDetail.length;

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
      getRelatedDetailColumns(
        search,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    [search, searchText, searchedColumn]
  );

  const allColumns = useMemo(() => {
    const columnsWithKeys = baseColumns.map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
    return columnsWithKeys;
  }, [baseColumns]);

  const processedColumns = useMemo(() => {
    return nxApplyFixedColumns(allColumns, fixedColumns);
  }, [allColumns, fixedColumns]);

  const columnDefinitions = useMemo(() => {
    return allColumns.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [allColumns]);

  const dataSourceWithKeys = useMemo(() => {
    if (!listRelatedDetail?.length) return [];

    return listRelatedDetail.map((item, index) => ({
      ...item,
      key: `related-${item.id || item.accountNumber || index}`,
    }));
  }, [listRelatedDetail]);

  useEffect(() => {
    console.log("dataSourceWithKeys", dataSourceWithKeys)
  }, [dataSourceWithKeys])

  return (
    <div className="flex flex-col gap-y-4">
      <NxBaseContainer border header="RELATIONSHIP INFORMATION">
        <div className="flex flex-col gap-y-4">
          <div className="w-full grid grid-cols-4 gap-4">
            <NxDetailText label="Relationship Type">
              {dataDetail?.relationshipTypeName?.toUpperCase() || "-"}
            </NxDetailText>
            <NxDetailText label="Relationship Category">
              {dataDetail?.relationshipCategoryName?.toUpperCase() || "-"}
            </NxDetailText>
            <NxDetailText label="Related Name">
              {dataDetail?.subjectName || dataDetail?.objectName || "-"}
            </NxDetailText>
            <NxDetailText label="Related Number">
              {dataDetail?.subjectNumber || dataDetail?.objectNumber || "-"}
            </NxDetailText>
            <NxDetailText label="Start Date">
              {dataDetail?.startDate
                ? moment(dataDetail.startDate).format(dateFormatting.date)
                : "-"}
            </NxDetailText>
            <NxDetailText label="End Date">
              {dataDetail?.endDate
                ? moment(dataDetail.endDate).format(dateFormatting.date)
                : "-"}
            </NxDetailText>
            <NxDetailText label="Status">
              <StatusComponent colour={dataDetail?.status}>
                {dataDetail?.status || "-"}
              </StatusComponent>
            </NxDetailText>
          </div>
          <div className="w-full">
            <NxDetailText label="Description">
              {dataDetail?.description || "-"}
            </NxDetailText>
          </div>
        </div>
      </NxBaseContainer>

      <NxBaseContainer border header="RELATED DETAIL">
        <NxTable
          idTable="relationship-related-detail-table"
          dataSource={dataSourceWithKeys}
          tableScrolled={{ y: 400, x: listRelatedDetail.length ? "max-content" : 3000 }}
          columns={processedColumns}
          usePagination={false}
          useInfiniteScroll={false}
          fixedColumns={fixedColumns}
          setFixedColumns={setFixedColumns}
          columnDefinitions={columnDefinitions}
          showAdvanceSearch={false}
        />
      </NxBaseContainer>
    </div>
  );
};

export default RelationshipDetailInfo;
