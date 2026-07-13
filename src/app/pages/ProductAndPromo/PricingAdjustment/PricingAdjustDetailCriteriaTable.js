import { useMemo, useRef, useState } from "react";
import { Button, Table, Tooltip } from "antd";
import SVGIcon from "../../../../assets/Icon/index";
import NxModal from "../../../../components/Nx/NxModal";
import NxDetailText from "../../../../components/Nx/NxDetailText";
import NxBaseContainer from "../../../../components/Nx/NxBaseContainer";
import { columnsTableCriteriaAll } from "../UtilsProduct/TableCriteriaAllProduct";
import NxTable from "../../../../components/Nx/NxTable";
import { useSelector } from "react-redux";

// Read-only criteria/adjustment table for the Pricing Adjustment detail page.
// Kept local to this feature (not shared) so it can carry its own "Detail"
// action + modal without touching FunctionalCriteriaProduct, which is reused
// by several other unrelated pages (TOS, Pricing Rule, Promo, etc.).
const PricingAdjustDetailCriteriaTable = ({
  data = [],
  dataCriteria = [],
  fixedColumn = [],
  countryCriteriaId,
}) => {
  const searchInput = useRef(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState({});
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [openDetail, setOpenDetail] = useState(false);
  const [detailRecord, setDetailRecord] = useState(null);

  const { data: dataUser = {} } = useSelector((state) => state.profile);
  
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    const tempSearchColumn = selectedKeys[0] ? dataIndex : "";
    if (searchedColumn !== tempSearchColumn) {
      setPage(1);
    }
    setSearchedColumn(tempSearchColumn);
    setSearch((prev) => ({ ...prev, [dataIndex]: selectedKeys[0] }));
  };

  const handleOpenDetail = (record) => {
    setDetailRecord(record);
    setOpenDetail(true);
  };

  const columns = useMemo(() => {
    const criteriaColumns = columnsTableCriteriaAll(
      {},
      searchInput,
      searchedColumn,
      searchText,
      handleSearch,
      search,
      false,
      countryCriteriaId
    );
    const temp = [
      {
        title: "NO",
        key: "no",
        width: 60,
        dataIndex: "no",
        align: "center",
        render: (_, __, index) => (page - 1) * pageSize + index + 1,
      },
      ...criteriaColumns,
      {
        title: "ACTION",
        key: "operation",
        dataIndex: "operation",
        width: 100,
        fixed: "right",
        align: "center",
        render: (_, record) => (
          <Tooltip title="Detail">
            <Button type="table-action" onClick={() => handleOpenDetail(record)}>
              <SVGIcon name="IconDetail" width={20} />
            </Button>
          </Tooltip>
        ),
      },
    ];
    return temp.filter((col) =>
      !["NO", "ACTION", "START DATE", "END DATE", ...(fixedColumn || [])].includes(col.title)
        ? dataCriteria.includes(col.indexValue)
        : true
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataCriteria, fixedColumn, search, searchedColumn, searchText, page, pageSize, countryCriteriaId]);

  if (!(dataCriteria && dataCriteria.length > 0 && dataCriteria[0] !== 24)) {
    return null;
  }

  return (
    <div className="flex flex-col w-full gap-4">
      <NxTable
        idTable={"pricing-adjustment-detail-criteria-table"}
        userId={dataUser?.data?.username}
        useInfiniteScroll={true}
        showAdvanceSearch={false}
        showSearchBar={false}
        usePagination={false}
        rowKey={(record) => record.key}
        dataSource={data}
        columns={columns}
        scroll={{ x: 1500, y: 300 }}
        pagination={{
          position: ["topRight"],
          current: page,
          pageSize,
          onChange: (nextPage, nextPageSize) => {
            setPage(nextPageSize !== pageSize ? 1 : nextPage);
            setPageSize(nextPageSize);
          },
          className: "pr-1 w-3/4",
          style: { marginLeft: "auto", marginRight: 0 },
          showSizeChanger: true,
          showTotal: (total, range) =>
            `Showing ${range[0]} to ${range[1]} of ${total} records`,
        }}
      />

      <NxModal
        isOpen={openDetail}
        handleCancel={() => setOpenDetail(false)}
        title="DETAIL INFORMATION"
        width={1000}
        footer={
          <div className="flex justify-end">
            <Button type="menu" onClick={() => setOpenDetail(false)}>
              Back
            </Button>
          </div>
        }
      >
        <div className="p-4">
          <NxBaseContainer border>
            <div className="grid grid-cols-4 gap-x-4 gap-y-4">
              {columns
                .filter((col) => !["NO", "ACTION"].includes(col.title))
                .map((col) => (
                  <NxDetailText key={col.key} label={col.title}>
                    {col.render
                      ? col.render(detailRecord?.[col.dataIndex], detailRecord, 0)
                      : detailRecord?.[col.dataIndex]}
                  </NxDetailText>
                ))}
            </div>
          </NxBaseContainer>
        </div>
      </NxModal>
    </div>
  );
};

export default PricingAdjustDetailCriteriaTable;
