import React, { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spin, Radio, Tooltip } from "antd";
import BreadCrumb from "../../../../components/BreadCrumb";
import ButtonComponent from "../../../../components/ButtonComponent";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import SVGIcon from "../../../../assets/Icon/index";
import CardContainer from "../../../../components/CardContainer";
import { RBI_ROUTES } from "../../../../routes/rating_billing/rbi_routes";
import {
  downloadRatingGas,
  getListRatingGasPaginate,
} from "../../../../redux/slices/rating_billing_invoice/rating";
import { columnsRating } from "./TableRatingView";
import RatingDetail from "./RatingDetail";
import TableRBI from "../../../../components/TableRBI";
import Toolbar from "../../../../components/Toolbar";
import { useColumnActionPermission } from "../../../../components/ColumnActionPermission";
import { applyFixedColumns } from "../../../../utils/applyFixedColumns";

const RatingPage = () => {
  const { data, loading } = useSelector((state) => state.rating);

  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const dataSource = data?.result;

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});

  const [valueTab, setValueTab] = useState("Rating Gas");
  const [pageDetail, setPageDetail] = useState(false);
  const [ratingCode, setRatingCode] = useState("");
  const [calculationCode, setCalculationCode] = useState("");
  const [saNumberId, setSANumberId] = useState("");
  const [activeRowKey, setActiveRowKey] = useState(null);

  const [fixedColumns, setFixedColumns] = useState(() => ({
    left: ["no"],
    right: ["action"],
  }));

  const detailRef = useRef(null);

  useEffect(() => {
    if (pageDetail && activeRowKey && detailRef.current) {
      setTimeout(() => {
        detailRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      }, 100);
    }
  }, [activeRowKey, pageDetail]);

  useEffect(() => {
    dispatch(
      getListRatingGasPaginate({
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize,
        sort,
      }),
    );
  }, [search, page, pageSize, sort, dispatch]);

  const tabRating = [
    {
      label: "Rating Gas",
      value: "Rating Gas",
    },
    {
      label: "Rating Non Gas",
      value: "Rating Non Gas",
      disabled: true,
    },
  ];

  const routes = [
    {
      path: "",
      breadcrumbName: "Rating & Billing",
    },
    {
      path: RBI_ROUTES.RATING_VIEW,
      breadcrumbName: "Rating",
    },
  ];

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
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

  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  const onSortApi = (_, __, sorter) => {
    const dataSort =
      sorter.order !== undefined
        ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const onChangeTab = ({ target: { value } }) => {
    setValueTab(value);
  };

  const handleDetail = (record) => {
    const recordKey = record.ratingCode;

    if (activeRowKey === recordKey && pageDetail) {
      setPageDetail(false);
      setActiveRowKey(null);
      setRatingCode("");
      setCalculationCode("");
      setSANumberId("");
    } else {
      setRatingCode(record.ratingCode);
      setCalculationCode(record.calculationCode);
      setSANumberId(record.saNumber);
      setActiveRowKey(recordKey);
      setPageDetail(true);
    }
  };

  const handleDownload = () => {
    dispatch(
      downloadRatingGas({
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize,
        sort,
      }),
    );
  };

  const itemGrantAccess = [
    // {
    //   action: "View",
    //   type: "table",
    //   render: (record) => {
    //     return (
    //       <Tooltip title="Detail">
    //         <div className="pt-1">
    //           <SVGIcon
    //             name="IconDetail"
    //             width={24}
    //             onClick={() => handleDetail(record)}
    //           />
    //         </div>
    //       </Tooltip>
    //     );
    //   },
    // },
  ];

  const dataSourceWithKeys = useMemo(() => {
    return dataSource?.map((item) => ({
      ...item,
      key: item.ratingCode,
    }));
  }, [dataSource]);

  const baseColumns = useMemo(
    () =>
      columnsRating(
        search,
        page,
        pageSize,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
    [search, page, pageSize, searchedColumn, searchText],
  );

  const actionCols = useColumnActionPermission(["view"], itemGrantAccess);

  const allColumns = useMemo(() => {
    const columnsWithKeys = [...baseColumns, ...actionCols].map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
    return columnsWithKeys;
  }, [baseColumns, actionCols]);

  const processedColumns = useMemo(() => {
    return applyFixedColumns(allColumns, fixedColumns);
  }, [allColumns, fixedColumns]);

  const columnDefinitions = useMemo(() => {
    return allColumns.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [allColumns]);

  return (
    <LayoutMenu>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />
        <div className="w-full flex justify-end gap-[20px]">
          <Toolbar items={itemGrantAccess} />
        </div>

        <CardContainer
          header={
            <div className="flex -my-4 justify-between items-center">
              <p className="mt-[15px] font-bold">RATING LIST</p>
            </div>
          }
        >
          <div className="mt-[0px]">
            <Radio.Group
              options={tabRating}
              onChange={onChangeTab}
              value={valueTab}
              optionType="button"
              buttonStyle="solid"
              style={{ gap: 12, display: "flex" }}
            />
          </div>
          <div className="my-5">
            <TableRBI
              size="small"
              dataSource={dataSourceWithKeys}
              columns={processedColumns}
              current={page}
              pageSize={pageSize}
              handleDownload={handleDownload}
              onChange={handleChange}
              onSizeChanger={handleChange}
              totalData={data?.page?.totalElements || 0}
              tableScrolled={{ y: 525, x: 4500 }}
              onSort={onSortApi}
              columnDefinitions={columnDefinitions}
              fixedColumns={fixedColumns}
              setFixedColumns={setFixedColumns}
              loading={loading}
              onRow={(record) => ({
                onClick: () => handleDetail(record),
                style: {
                  cursor: "pointer",
                  backgroundColor:
                    activeRowKey === record.ratingCode
                      ? "#bae7ff"
                      : "transparent",
                  transition: "background-color 0.2s ease",
                },
                onMouseEnter: (e) => {
                  if (activeRowKey !== record.ratingCode) {
                    e.currentTarget.style.backgroundColor = "#f5f5f5";
                  }
                },
                onMouseLeave: (e) => {
                  if (activeRowKey !== record.ratingCode) {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                },
              })}
            />
          </div>
        </CardContainer>

        {pageDetail && (
          <div
            ref={detailRef}
            className="mt-6 border-t-4 border-blue-500 bg-blue-50/30 rounded-lg p-4"
          >
            <RatingDetail
              calculationCode={calculationCode}
              SAId={saNumberId}
              ratingCodeId={ratingCode}
              onClose={() => {
                setPageDetail(false);
                setActiveRowKey(null);
                setRatingCode("");
                setCalculationCode("");
                setSANumberId("");
              }}
            />
          </div>
        )}
      </Spin>
    </LayoutMenu>
  );
};

export default RatingPage;
