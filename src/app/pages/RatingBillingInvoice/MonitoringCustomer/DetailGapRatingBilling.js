import React, { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spin, Select, message, Empty } from "antd";
import BreadCrumb from "../../../../components/BreadCrumb";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import ButtonComponent from "../../../../components/ButtonComponent";
import CardContainer from "../../../../components/CardContainer";
import TableRBI from "../../../../components/TableRBI";
import SVGIcon from "../../../../assets/Icon/index";
import { RBI_ROUTES } from "../../../../routes/rating_billing/rbi_routes";
import {
  getGapRatingBilling,
  downloadGapRatingBilling,
  getListBillingPeriod,
} from "../../../../redux/slices/rating_billing_invoice/monitoringSlice";
import { getColumnsGapRatingBilling } from "./Table/TableGapRatingBilling";
import { applyFixedColumns } from "../../../../utils/applyFixedColumns";

const { Option } = Select;

const DetailGapRatingBilling = ({
  filterPeriod: initialPeriod,
  handleBack,
}) => {
  const { loading, gapRatingBillingData, list_billing_period } = useSelector(
    (state) => state.monitoring
  );

  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const dataSource = gapRatingBillingData?.result;

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [filterPeriod, setFilterPeriod] = useState(initialPeriod || 340);
  const [filterGapType, setFilterGapType] = useState("All");

  // State untuk fix column
  const [fixedColumns, setFixedColumns] = useState({
    no: "left",
  });

  useEffect(() => {
    if (list_billing_period.length === 0) {
      dispatch(getListBillingPeriod());
    }
  }, [dispatch, list_billing_period.length]);

  useEffect(() => {
    dispatch(
      getGapRatingBilling({
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize,
        sort,
      })
    );
  }, [search, page, pageSize, sort, dispatch]);

  const routes = [
    {
      path: "",
      breadcrumbName: "Rating & Billing",
    },
    {
      path: RBI_ROUTES.MONITORING_CUSTOMER,
      breadcrumbName: "Monitoring Customer",
    },
    {
      path: "",
      breadcrumbName: "Gap Rating vs Billing",
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

  const handleDownload = () => {
    if (dataSource && dataSource.length > 0) {
      dispatch(
        downloadGapRatingBilling({
          search: encodeURIComponent(JSON.stringify(search)),
          page,
          pageSize,
          sort,
        })
      );
      message.success("Download started!");
    } else {
      message.warning("No data to download");
    }
  };

  // Get columns from separated file
  const baseColumns = useMemo(
    () =>
      getColumnsGapRatingBilling(
        page,
        pageSize,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        search
      ),
    [page, pageSize, searchedColumn, searchText, search]
  );

  // Combine columns with keys
  const allColumns = useMemo(() => {
    const columnsWithKeys = baseColumns.map((col) => ({
      ...col,
      key: col.key || col.dataIndex || col.title,
    }));
    return columnsWithKeys;
  }, [baseColumns]);

  // Apply fixed columns
  const processedColumns = useMemo(() => {
    return applyFixedColumns(allColumns, fixedColumns);
  }, [allColumns, fixedColumns]);

  // Column definitions for dropdown
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

        <div className="w-full flex justify-between gap-[20px] mb-4">
          <ButtonComponent type="default" onClick={handleBack}>
            ← Kembali ke Dashboard
          </ButtonComponent>
          <ButtonComponent
            icon={<SVGIcon name="IconButtonDownload" width={24} />}
            type="submit"
            onClick={handleDownload}
            disabled={!dataSource || dataSource.length === 0}
          >
            Download
          </ButtonComponent>
        </div>

        <CardContainer
          header={
            <div className="flex -my-4 justify-between items-center">
              <p className="mt-[15px] font-bold">
                DETAIL - GAP RATING VS BILLING
              </p>
            </div>
          }
        >
          {/* Filters */}
          <div className="w-full mb-4 mt-4">
            <div
              style={{
                display: "flex",
                gap: 16,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <div>
                <span style={{ marginRight: 8, fontWeight: 500 }}>Period:</span>
                <Select
                  value={filterPeriod}
                  onChange={(value) => {
                    setFilterPeriod(value);
                    setPage(1);
                  }}
                  style={{ width: 200 }}
                  showSearch
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {list_billing_period.map((period) => (
                    <Option key={period.id} value={period.id}>
                      {period.name}
                    </Option>
                  ))}
                </Select>
              </div>
              <div>
                <span style={{ marginRight: 8, fontWeight: 500 }}>
                  Gap Type:
                </span>
                <Select
                  value={filterGapType}
                  onChange={setFilterGapType}
                  style={{ width: 150 }}
                >
                  <Option value="All">All</Option>
                  <Option value="Positive">Positive Gap</Option>
                  <Option value="Negative">Negative Gap</Option>
                </Select>
              </div>
            </div>
          </div>

          {/* Table or Empty State */}
          <div className="my-0">
            {dataSource && dataSource.length > 0 ? (
              <TableRBI
                dataSource={dataSource}
                columns={processedColumns}
                current={page}
                pageSize={pageSize}
                onChange={handleChangePage}
                onSizeChanger={handleChangePage}
                totalData={gapRatingBillingData?.page?.totalElements || 0}
                tableScrolled={{ x: 1800, y: 525 }}
                onSort={onSort}
                columnDefinitions={columnDefinitions}
                fixedColumns={fixedColumns}
                setFixedColumns={setFixedColumns}
                loading={loading}
              />
            ) : (
              <Empty
                description={
                  <span>
                    No gap data found between Rating and Billing.
                    <br />
                    This is a good sign - all values are matching!
                  </span>
                }
                style={{ padding: "60px 0" }}
              />
            )}
          </div>
        </CardContainer>
      </Spin>
    </LayoutMenu>
  );
};

export default DetailGapRatingBilling;
