import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spin, Select, message, Empty } from "antd";
import BreadCrumb from "../../../../components/BreadCrumb";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import ButtonComponent from "../../../../components/ButtonComponent";
import BaseContainer from "../../../../components/BaseContainer";
import TablePaginationNew from "../../../../components/TablePaginationNew";
import SVGIcon from "../../../../assets/Icon/index";
import { RBI_ROUTES } from "../../../../routes/rating_billing/rbi_routes";
import {
  getGapRatingBilling,
  downloadGapRatingBilling,
  getListBillingPeriod,
} from "../../../../redux/slices/rating_billing_invoice/monitoringSlice";
import { columnsGapRatingBilling } from "./Table/TableGapRatingBilling";

const { Option } = Select;

const DetailGapRatingBilling = ({ filterPeriod: initialPeriod, handleBack }) => {
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

  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  const onSortApi = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
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

        <BaseContainer header={"Detail - Gap Rating vs Billing"}>
          {/* Filters */}
          <div className="w-full mb-4">
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <div>
                <span style={{ marginRight: 8 }}>Periode:</span>
                <Select
                  value={filterPeriod}
                  onChange={(value) => {
                    setFilterPeriod(value);
                    setPage(1);
                  }}
                  style={{ width: 200 }}
                  showSearch
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
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
                <span style={{ marginRight: 8 }}>Gap Type:</span>
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
          <div className="w-full">
            {dataSource && dataSource.length > 0 ? (
              <TablePaginationNew
                dataSource={dataSource}
                columns={columnsGapRatingBilling(
                  page,
                  pageSize,
                  searchInput,
                  searchedColumn,
                  searchText,
                  handleSearch,
                  search
                )}
                current={page}
                pageSize={pageSize}
                onChange={handleChange}
                onSizeChanger={handleChange}
                totalData={gapRatingBillingData?.page?.totalElements || 0}
                onSort={onSortApi}
                tableScrolled={{ y: 525, x: 1800 }}
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
        </BaseContainer>
      </Spin>
    </LayoutMenu>
  );
};

export default DetailGapRatingBilling;