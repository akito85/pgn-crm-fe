import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Spin, Select } from "antd";
import BreadCrumb from "../../../../components/BreadCrumb";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import ButtonComponent from "../../../../components/ButtonComponent";
import CardContainer from "../../../../components/CardContainer";
import TableRBI from "../../../../components/TableRBI";
import SVGIcon from "../../../../assets/Icon/index";
import { RBI_ROUTES } from "../../../../routes/rating_billing/rbi_routes";
import {
  getGapRatBill,
  getParameters,
  downloadGapRatBill,
} from "../../../../redux/slices/rating_billing_invoice/monitoringSlice";

const { Option } = Select;

const DetailPraBillingVsRating = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { loading, gapRatBillData, periodLov } = useSelector(
    (state) => state.monitoring
  );

  const [filterPeriod, setFilterPeriod] = useState(
    location.state?.period || null
  );
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    if (periodLov.length === 0) {
      dispatch(getParameters());
    }
  }, [dispatch, periodLov.length]);

  useEffect(() => {
    if (filterPeriod) {
      dispatch(
        getGapRatBill({
          period: filterPeriod,
          page: page - 1,
          pageSize,
        })
      );
    }
  }, [filterPeriod, page, pageSize, dispatch]);

  const routes = [
    {
      path: "",
      breadcrumbName: "Rating & Billing",
    },
    {
      path: RBI_ROUTES.MONITORING_CUSTOMER_VIEW,
      breadcrumbName: "Monitoring Customer",
    },
    {
      path: "",
      breadcrumbName: "Detail Pra-Billing vs Rating",
    },
  ];

  const tableColumns = [
    {
      title: "NO",
      dataIndex: "no",
      key: "no",
      width: 60,
      align: "center",
      fixed: "left",
      render: (_, __, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "ACCOUNT NUMBER",
      dataIndex: "accountNumber",
      key: "accountNumber",
      width: 150,
      fixed: "left",
    },
    {
      title: "ACCOUNT NAME",
      dataIndex: "name",
      key: "name",
      width: 200,
    },
    {
      title: "INIT CODE",
      dataIndex: "initCode",
      key: "initCode",
      width: 150,
    },
    {
      title: "BILLING PERIOD",
      dataIndex: "billingPeriod",
      key: "billingPeriod",
      width: 130,
    },
    {
      title: "RATING CODE",
      dataIndex: "ratingCode",
      key: "ratingCode",
      width: 150,
    },
    {
      title: "RATING VALUE",
      dataIndex: "ratingValue",
      key: "ratingValue",
      width: 130,
      isNumber: true,
    },
    {
      title: "GAP",
      dataIndex: "gap",
      key: "gap",
      width: 120,
      isNumber: true,
    },
  ];

  const handleChangePage = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  const handleDownload = () => {
    dispatch(downloadGapRatBill({ period: filterPeriod }));
  };

  return (
    <LayoutMenu grantPath={RBI_ROUTES.MONITORING_CUSTOMER_VIEW}>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />

        <CardContainer
          header={
            <div className="flex justify-between items-center -my-4">
              <p className="mt-[15px] font-bold">PRA-BILLING VS RATING</p>
              <ButtonComponent
                icon={<SVGIcon name="IconButtonDownload" width={24} />}
                type="submit"
                onClick={handleDownload}
              >
                Download List
              </ButtonComponent>
            </div>
          }
        >
          <div className="w-full mb-4 mt-4">
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <span style={{ fontWeight: 500 }}>Period:</span>
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
                placeholder="Select period"
              >
                {periodLov.map((p) => (
                  <Option key={p.value} value={p.value}>
                    {p.label}
                  </Option>
                ))}
              </Select>
            </div>
          </div>

          <TableRBI
            idTable="table-pra-billing-vs-rating"
            dataSource={gapRatBillData?.result || []}
            columns={tableColumns}
            pageSize={pageSize}
            current={page}
            loading={loading}
            totalData={gapRatBillData?.page?.totalElements || 0}
            tableScrolled={{ x: "max-content" }}
            usePagination={true}
            useSelect={true}
            showAdvanceSearch={true}
            showSearchBar={true}
            onChange={handleChangePage}
          />
        </CardContainer>
      </Spin>
    </LayoutMenu>
  );
};

export default DetailPraBillingVsRating;

