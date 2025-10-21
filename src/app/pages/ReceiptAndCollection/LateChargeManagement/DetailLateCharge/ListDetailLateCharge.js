import React, { useEffect, useRef, useState } from "react";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import BreadCrumb from "../../../../../components/BreadCrumb";
import BaseContainer from "../../../../../components/BaseContainer";
import DetailText from "../../../../../components/DetailText";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";
import { getDetailLateChargePayment } from "../../../../../redux/slices/receipt_collection/lateCharge";
import TablePaginationNew from "../../../../../components/TablePaginationNew";
import { columnAdjusmentList } from "./TableDetail/ColumnAdjusmentList";
import TablePagination from "../../../../../components/TablePagination";
import { columnLateChargeHistories } from "./TableDetail/ColumnLateChargeHistories";
import { dateFormatting } from "../../../../../utils";
import moment from "moment";

const ListDetailLateCharge = () => {
  const { data_detail } = useSelector((state) => state?.late);
  const dispatch = useDispatch();
  const location = useLocation();
  const id = location?.state?.id;
  const searchInput = useRef(null);

  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (id) {
      dispatch(getDetailLateChargePayment(id));
    }
  }, [dispatch, id]);

  // Breadcrumbs
  const routes = [
    {
      path: "",
      breadcrumbName: "Receipt & Collection",
    },
    {
      path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_LATE_CHARGE,
      breadcrumbName: "Late Charge",
    },
    {
      path: RECEIPT_AND_COLLECTION_ROUTES.DETAIL_LATE_CHARGE,
      breadcrumbName: `Detail Late Charge`,
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
  // Function Change Pagination
  const handleChange = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };

  // Function Sort Table
  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };
  return (
    <LayoutMenu>
      <BreadCrumb routes={routes} />
      <BaseContainer header={"LATE CHARGE INFORMATION"}>
        <div className="w-full grid grid-cols-3">
          <DetailText label={"Cost Center"}>
            {data_detail?.costCenter}
          </DetailText>
          {/* <DetailText label={"Area Name"}>{data_detail?.areaName}</DetailText> */}
          <DetailText label={"Customer Number"}>
            {data_detail?.customerId}
          </DetailText>
          <DetailText label={"Customer Name"}>
            {data_detail?.customerName}
          </DetailText>
          <DetailText label={"Billing Period"}>
            {moment(data_detail?.billingPeriod).format(
              dateFormatting.datePeriod,
            )}
          </DetailText>
          <DetailText label={"Payment Amount"}>
            {data_detail?.paymentAmount}
          </DetailText>
          <DetailText label={"Currency"}>{data_detail?.currency}</DetailText>
          <DetailText label={"Type"}>{data_detail?.type}</DetailText>
          <DetailText label={"Invoice No"}>{data_detail?.invoiceNo}</DetailText>
          <DetailText label={"Total Period Bill"}>
            {data_detail?.totalLate}
          </DetailText>
          <DetailText label={"Total Late Charge"}>
            {data_detail?.totalLateCharge}
          </DetailText>
          <DetailText label={"Due Date"}>{data_detail?.dueDate}</DetailText>
          <DetailText label={"Late Charge Rate"}>
            {data_detail?.lateChargeRate}
          </DetailText>
          <DetailText label={"Payment Date"}>
            {data_detail?.paymentDate}
          </DetailText>
          <DetailText label={"Late Charge Time Unit"}>
            {data_detail?.timeUnit}
          </DetailText>
          <DetailText label={"Status"}>{data_detail?.status}</DetailText>
          <DetailText label={"Status Approval"}>
            {data_detail?.statusApproval}
          </DetailText>
        </div>
        <div className="w-full grid grid-cols-1">
          <DetailText label={"Remark"}>{data_detail?.remark}</DetailText>
        </div>
      </BaseContainer>

      <BaseContainer header={"INVOICE INFORMATION"}>
        <div className="w-full grid grid-cols-3">
          <DetailText label={"Invoice No"}>{data_detail?.invoiceNo}</DetailText>
          <DetailText label={"Total Amount"}>
            {data_detail?.totalAmountIdr}
          </DetailText>
          <DetailText label={"Due Date"}>{data_detail?.dueDate}</DetailText>
        </div>
      </BaseContainer>

      <BaseContainer header={"Adjusment List"}>
        <div className="w-full">
          <TablePagination
            dataSource={""}
            columns={columnAdjusmentList(
              page,
              pageSize,
              searchInput,
              searchedColumn,
              searchText,
              handleSearch,
            )}
            current={page}
            pageSize={pageSize}
            onChange={handleChange}
            onSizeChanger={handleChange}
            // totalData={"data?.page?.totalElements || 0"}
            totalData={0}
            onSort={onSort}
            tableScrolled={{ y: 525, x: 2400 }}
          />
        </div>
      </BaseContainer>

      <BaseContainer header={"LATE CHARGE HISTORIES LIST"}>
        <div className="w-full">
          <TablePagination
            dataSource={""}
            columns={columnLateChargeHistories(
              page,
              pageSize,
              searchInput,
              searchedColumn,
              searchText,
              handleSearch,
            )}
            current={page}
            pageSize={pageSize}
            onChange={handleChange}
            onSizeChanger={handleChange}
            // totalData={"data?.page?.totalElements || 0"}
            totalData={0}
            onSort={onSort}
            tableScrolled={{ y: 525, x: 2400 }}
          />
        </div>
      </BaseContainer>
    </LayoutMenu>
  );
};

export default ListDetailLateCharge;
