import { useEffect, useState } from "react";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import { Spin, Table } from "antd";
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
import { DEBT_AND_COLLECTION_ROUTES } from "../../../../routes/DebtAndCollection/rc_routes";
import {  useNavigate } from "react-router-dom";

const routes = [
  { path: "", breadcrumbName: "Debt & Collection" },
  { path: DEBT_AND_COLLECTION_ROUTES.VIEW_TRANSACTION_REPORT, breadcrumbName: "Transaction Report" },
];

const ViewTransactionReport = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    dataTransactionReport,
    dataDetailTransactionReport,
    loading,
  } = useSelector((state) => state.transactionReport);

  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [dataTable, setDataTable] = useState([]);

  // Load main table + detail table automatically
  useEffect(() => {
    dispatch(getTransactionReport({ page, size }));
    console.log("test")
    
  }, [dispatch, page, size]);

  
  useEffect(() => {
    // console.log("Hello")
    if (dataDetailTransactionReport) {
      let result = dataDetailTransactionReport?.data || [];
      setDataTable(result);

    }
  }, [dataDetailTransactionReport]);

  const handleClickDetail = (row, category) => {

    // masih harcode untuk area nya
    dispatch(
      getDetailTransactionReport({
        arAge: category,
        accountType: row.segmentName,
        area: "JAKARTA",
      })
    );


    // contoh navigate jika mau
    // navigate('/detail', { state: { row, category } });
  };

  

  return (
    <LayoutMenu>
      <Spin spinning={loading } className="w-full top-20" tip="Loading...">
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
                onClickDetail={handleClickDetail}
              />
            </div>

            {/* DETAIL TABLE */}
            <div style={{ overflowX: "auto", marginTop: 20 }}>
              <TablePaginationNew
                type="FE"
                dataSource={dataTable}
                columns={columnsDetailTransactionReport(navigate)}
                current={1}
                pageSize={10}
                usePagination={true}
                useSelect={true}
                useFixColumn={true}
              />
            </div>

          </BaseContainer>
        </div>
      </Spin>
    </LayoutMenu>
  );
};

export default ViewTransactionReport;
