import { useEffect, useState } from "react";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import { Spin } from "antd";
import BreadCrumb from "../../../../components/BreadCrumb";
import BaseContainer from "../../../../components/BaseContainer";
import TableTransactionReport from "../../../../components/TableTransactionReport";
import TablePaginationNew from "../../../../components/TablePaginationNew";
import { columns as columnsTransactionReport } from "./ColumnTransactionReportView";
import { columnsDetail as columnsDetailTransactionReport } from "./ColumnDetailTransactionReport";
import { useDispatch, useSelector } from "react-redux";
import {
  getTransactionReport,
  getDetailTransactionReport,
} from "../../../../redux/slices/debt_and_collection/transactionReport";

const routes = [
  { path: "", breadcrumbName: "Debt & Collection" },
  { path: "/debt-and-collection/transaction-report", breadcrumbName: "Transaction Report" },
];

const ViewTransactionReport = () => {
  const dispatch = useDispatch();

  const {
    dataTransactionReport,
    detailTransactionReport,
    loading,
    loadingDetail,
  } = useSelector((state) => state.transactionReport);

  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);

  // Load main table + detail table automatically
  useEffect(() => {
    dispatch(getTransactionReport({ page, size }));
    dispatch(getDetailTransactionReport());
  }, [dispatch, page, size]);

  return (
    <LayoutMenu>
      <Spin spinning={loading || loadingDetail} className="w-full top-20" tip="Loading...">
        <BreadCrumb routes={routes} />

        <div className="flex flex-col w-full gap-6">
          <BaseContainer header="Transaction Report List">

            {/* MAIN TABLE */}
            <div style={{ overflowX: "auto" }}>
              <TableTransactionReport
                data={dataTransactionReport?.content || []}
                loading={loading}
                current={page}
                pageSize={size}
                onChange={(p, s) => { setPage(p); setSize(s); }}
                columns={columnsTransactionReport()}
              />
            </div>

            {/* DETAIL TABLE */}
            <div style={{ overflowX: "auto", marginTop: 20 }}>
              <TablePaginationNew
                type="FE"
                dataSource={detailTransactionReport || []}
                columns={columnsDetailTransactionReport()}
                current={1}
                pageSize={10}
                usePagination={true}
                useSelect={true}
                useFixColumn={true}
                rowKey="invoiceNum"
              />
            </div>

          </BaseContainer>
        </div>
      </Spin>
    </LayoutMenu>
  );
};

export default ViewTransactionReport;
