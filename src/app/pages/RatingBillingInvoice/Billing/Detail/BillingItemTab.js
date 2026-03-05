import React, { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import TableRBI from "../../../../../components/TableRBI";
import { getAllBillingItemPaginate } from "../../../../../redux/slices/rating_billing_invoice/billing";
import { columnsBillingItem } from "./Table/TableBillingItem";
import { applyFixedColumns } from "../../../../../utils/applyFixedColumns";

const BillingItemTab = ({ billingCodeId, calculationCodeId }) => {
  const { data_billingItem } = useSelector((state) => state.billing);

  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const dataSourceBI = data_billingItem?.result;

  const [pageBI, setPageBI] = useState(1);
  const [pageSizeBI, setPageSizeBI] = useState(10);
  const [searchedColumnBI, setSearchedColumnBI] = useState("");
  const [searchTextBI, setSearchTextBI] = useState("");
  const [sortBI, setSortBI] = useState("");
  const [searchBI, setSearchBI] = useState({});

  const [fixedColumnsBI, setFixedColumnsBI] = useState(() => ({
    left: ["no"],
    right: [],
  }));

  useEffect(() => {
    dispatch(
      getAllBillingItemPaginate({
        billingCodeId,
        searchBI: encodeURIComponent(JSON.stringify(searchBI)),
        pageBI,
        pageSizeBI,
        sortBI,
      })
    );
  }, [dispatch, billingCodeId, searchBI, pageBI, pageSizeBI, sortBI]);

  const handleSearchBI = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchTextBI(selectedKeys[0]);
    setSearchedColumnBI(dataIndex);
    setSearchBI((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setPageBI(1);
      }
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
  };

  const handleChangePageBI = (pageChange, pageSizeChange) => {
    const tempPage = pageSizeBI !== pageSizeChange ? 1 : pageChange;
    setPageBI(tempPage);
    setPageSizeBI(pageSizeChange);
  };

  const onSortBI = (_, __, sorter) => {
    const dataSort =
      sorter.order !== undefined
        ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSortBI(dataSort);
  };

  const baseColumnsBI = useMemo(() => {
    return columnsBillingItem(
      pageBI,
      pageSizeBI,
      searchInput,
      searchedColumnBI,
      searchTextBI,
      handleSearchBI,
      searchBI
    );
  }, [pageBI, pageSizeBI, searchedColumnBI, searchTextBI, searchBI]);

  const allColumnsBI = useMemo(() => {
    return baseColumnsBI.map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
  }, [baseColumnsBI]);

  const processedColumnsBI = useMemo(() => {
    return applyFixedColumns(allColumnsBI, fixedColumnsBI);
  }, [allColumnsBI, fixedColumnsBI]);

  const columnDefinitionsBI = useMemo(() => {
    return allColumnsBI.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [allColumnsBI]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-4">
        <div>
          <p className="text-[13px] text-gray-600 mb-1">Calculation Code</p>
          <p className="text-[15px] text-primary">{calculationCodeId || "-"}</p>
        </div>
        <div>
          <p className="text-[13px] text-gray-600 mb-1">Billing Code</p>
          <p className="text-[15px] text-primary">{billingCodeId || "-"}</p>
        </div>
      </div>

      <TableRBI
        size="small"
        dataSource={dataSourceBI}
        columns={processedColumnsBI}
        current={pageBI}
        pageSize={pageSizeBI}
        onChange={handleChangePageBI}
        onSizeChanger={handleChangePageBI}
        totalData={data_billingItem?.page?.totalElements || 0}
        tableScrolled={{ x: 4500, y: 525 }}
        onSort={onSortBI}
        columnDefinitions={columnDefinitionsBI}
        fixedColumns={fixedColumnsBI}
        showExport={false}
        setFixedColumns={setFixedColumnsBI}
        loading={false}
      />
    </div>
  );
};

export default BillingItemTab;