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
  // Selector
  const { data, loading } = useSelector((state) => state.rating);

  // Declaration
  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const dataSource = data?.result;

  // State
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

  const [fixedColumns, setFixedColumns] = useState({
    no: "left",
    action: "right",
  });

   const detailRef = useRef(null);

   useEffect(() => {
    if (pageDetail && detailRef.current) {
      // Smooth scroll ke detail section
      detailRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  }, [pageDetail]);

  // Use Effect
  useEffect(() => {
    dispatch(
      getListRatingGasPaginate({
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize,
        sort,
      })
    );
  }, [search, page, pageSize, sort, dispatch]);

  // Value Tab
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

  // Breadcrumbs
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

  // Function Search Column
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

  // Handle Change Page
  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  // Sort Table
  const onSortApi = (_, __, sorter) => {
    const dataSort =
      sorter.order !== undefined
        ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  // Handle Value Tab
  const onChangeTab = ({ target: { value } }) => {
    setValueTab(value);
  };

  // Handle Detail
  const handleDetail = (record) => {
    setPageDetail(true);
    setRatingCode(record.ratingCode);
    setCalculationCode(record.calculationCode);
    setSANumberId(record.saNumber);
  };

  // Handle Download
  const handleDownload = () => {
    dispatch(
      downloadRatingGas({
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize,
        sort,
      })
    );
  };

  const itemGrantAccess = [
    {
      action: "Download",
      render: (
        <ButtonComponent
          icon={<SVGIcon name="IconButtonDownload" width={24} />}
          type="submit"
          onClick={handleDownload}
        >
          Download List
        </ButtonComponent>
      ),
    },

    // Column Action Column
    {
      action: "View",
      type: "table",
      render: (record) => {
        return (
          <Tooltip title="Detail">
            <div className="pt-1">
              <SVGIcon
                name="IconDetail"
                width={24}
                onClick={() => handleDetail(record)}
              />
            </div>
          </Tooltip>
        );
      },
    },
  ];

  const baseColumns = useMemo(
    () =>
      columnsRating(
        search,
        page,
        pageSize,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    [search, page, pageSize, searchedColumn, searchText]
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
              <div className="mt-[15px]">
                <Radio.Group
                  options={tabRating}
                  onChange={onChangeTab}
                  value={valueTab}
                  optionType="button"
                  buttonStyle="solid"
                  style={{ gap: 12, display: "flex" }}
                />
              </div>
            </div>
          }
        >
          <div className="my-5">
            <TableRBI
              dataSource={dataSource}
              columns={processedColumns}
              current={page}
              pageSize={pageSize}
              onChange={handleChange}
              onSizeChanger={handleChange}
              totalData={data?.page?.totalElements || 0}
              tableScrolled={{ y: 525, x: 23000 }}
              onSort={onSortApi}
              columnDefinitions={columnDefinitions}
              fixedColumns={fixedColumns}
              setFixedColumns={setFixedColumns}
              loading={loading}
            />
          </div>
        </CardContainer>

        {/* Detail Rating */}
        {pageDetail === true ? (
          <div ref={detailRef}>
            <RatingDetail
              calculationCode={calculationCode}
              SAId={saNumberId}
              ratingCodeId={ratingCode}
            />
          </div>
        ) : null}
      </Spin>
    </LayoutMenu>
  );
};

export default RatingPage;  