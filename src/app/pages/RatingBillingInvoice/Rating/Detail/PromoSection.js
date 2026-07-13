import React, { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import TableRBI from "../../../../../components/TableRBI";
import { getAllPromoServiceAgreementPaginate } from "../../../../../redux/slices/rating_billing_invoice/rating";
import { columnsPromo } from "./Table/TablePromo";
import { applyFixedColumns } from "../../../../../utils/applyFixedColumns";
import ButtonComponent from "../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../assets/Icon/index";
import ratingBillingHttpService from "../../../../../redux/services/ratingBillingHttpService";
import { showModalError } from "../../../../../redux/slices/general_slice";

const PromoSection = ({ ratingCode, calculationCode }) => {
  const { data_promoSA, loadingPromo } = useSelector((state) => state.rating);

  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const dataSource = data_promoSA?.result;

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});

  const [fixedColumns, setFixedColumns] = useState(() => ({
    left: ["no"],
    right: [],
  }));

  useEffect(() => {
    dispatch(
      getAllPromoServiceAgreementPaginate({
        id: ratingCode,
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize,
        sort,
      })
    );
  }, [dispatch, ratingCode, search, page, pageSize, sort]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(selectedKeys[0] ? dataIndex : "");
    setSearch((prevState) => {
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setPage(1);
      }
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
      };
    });
  };

  const handleChangePage = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  const onSort = (_, __, sorter) => {
    const dataSort =
      sorter.order !== undefined
        ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const baseColumns = useMemo(() => {
    return columnsPromo(
      search,
      page,
      pageSize,
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    );
  }, [search, page, pageSize, searchedColumn, searchText]);

  const allColumns = useMemo(() => {
    return baseColumns.map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
  }, [baseColumns]);

  const processedColumns = useMemo(() => {
    return applyFixedColumns(allColumns, fixedColumns);
  }, [allColumns, fixedColumns]);

  const columnDefinitions = useMemo(() => {
    return allColumns.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [allColumns]);

  const handleDownload = async () => {
    const searchParam = Object.keys(search).some((k) => search[k])
      ? encodeURIComponent(JSON.stringify(search))
      : "";
    const sortParams = sort || "lineNumber~asc";
    const url = `/v1/dbs/api/rating/download-rating-promo?ratingCode=${ratingCode}&page=1&size=99999&sort=${sortParams}&searchs=${searchParam}`;
    try {
      await ratingBillingHttpService.downloadXlsx(url, "RATING_PROMO");
    } catch {
      dispatch(showModalError({
        title: "Failed",
        description: "Can't download data, data is empty",
      }));
    }
  };

  return (
    <>
      <div className="mb-4">
        <p className="text-[15px] font-medium text-[#0075bf] mb-3">
          PROMO INFORMATION
        </p>
        <div className="flex flex-row gap-8">
          <div className="flex flex-col gap-1">
            <p className="text-[15px] font-normal text-gray-700">
              Calculation Code
            </p>
            <p className="text-[20px] font-medium text-[#0075bf]">
              {calculationCode || ""}
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-[15px] font-normal text-gray-700">Rating Code</p>
            <p className="text-[20px] font-medium text-[#0075bf]">
              {ratingCode || ""}
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-end mb-3">
        <ButtonComponent onClick={handleDownload} type={"submit"} border={false} icon={<SVGIcon name="IconButtonDownload" width={20} />}>
          Download List
        </ButtonComponent>
      </div>
      <div className="w-full">
        <TableRBI
          dataSource={dataSource}
          columns={processedColumns}
          current={page}
          pageSize={pageSize}
          onChange={handleChangePage}
          onSizeChanger={handleChangePage}
          showExport={false}
          totalData={data_promoSA?.page?.totalElements || 0}
          tableScrolled={{ x: 1500, y: 525 }}
          onSort={onSort}
          columnDefinitions={columnDefinitions}
          fixedColumns={fixedColumns}
          setFixedColumns={setFixedColumns}
          loading={loadingPromo}
        />
      </div>
    </>
  );
};

export default PromoSection;