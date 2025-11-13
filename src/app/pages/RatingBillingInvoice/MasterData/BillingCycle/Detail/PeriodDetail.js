import { useEffect, useRef, useState } from "react";
import moment from "moment";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import CardComponent from "../../../../../../components/Card/CardComponent";
import DetailText from "../../../../../../components/DetailText";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import { dateFormatting, hasValue, renderColumn, renderDateColumn } from "../../../../../../utils";
import { getColumnSearchPropsUseFilteredValue } from "../../../../../../utils/getColumnSearchProps";
import TablePaginationNew from "../../../../../../components/TablePaginationNew";
import { useDispatch } from "react-redux";
import { getHistoryPeriod } from "../../../../../../redux/slices/rating_billing_invoice/MasterData/billingCycle";

const PeriodDetail = ({
  data_detail,
  data_history,
  openModal,
  closeModal = () => { },
  idDetail
}) => {
  const searchInput = useRef(null);
  const dispatch = useDispatch()
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});

  useEffect(() => {
    if (openModal === false) {
      setPage(1)
      setPageSize(10)
      setSearch({})
      setSearchText("")
      setSearchedColumn("")
      setSort("")
    }
  }, [openModal]);


  useEffect(() => {
    dispatch(
      getHistoryPeriod({
        id: idDetail,
        page,
        pageSize,
        search: encodeURIComponent(JSON.stringify(search)),
        sort,
      })
    );
  }, [dispatch, idDetail, page, pageSize, search, sort]);


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

  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const handleChangePage = (page, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : page;
    setPage(tempPage);
    setPageSize(pageSize);
  };

  const columns = [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => index + 1,
    },
    {
      title: "ACTION",
      dataIndex: "action",
      sorter: true,
      filteredValue: [search?.action] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "action",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) =>  renderColumn('action', hasValue(search['action']), searchText, text, false, 'input', search)
    },
    {
      title: "ACTOR",
      dataIndex: "actor",
      sorter: true,
      filteredValue: [search?.actor] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "actor",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => renderColumn('actor', hasValue(search['actor']), searchText, text, false, 'input', search)
    },
    {
      title: "ACTION DATE",
      dataIndex: "actionDate",
      sorter: true,
      align: "center",
      filteredValue: [search?.actionDate] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "actionDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        'datetime'
      ),
      render: (text) => renderDateColumn('actionDate', hasValue(search['actionDate']), searchText, text, 'datetime', search)
    },
    {
      sorter: true,
      title: "REMARK",
      dataIndex: "remark",
      ellipsis: {
        showTitle: false,
      },
      filteredValue: [search?.remark] || null,
      ...getColumnSearchPropsUseFilteredValue(
        search,
        "remark",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
      render: (text) => renderColumn('remark', hasValue(search['remark']), searchText, text, true, 'input', search)
    },
  ];
  return (
    <div>
      <ModalCustom
        isOpen={openModal}
        handleCancel={closeModal}
        type="detail"
        header="PERIOD DETAIL"
        width={800}
        footer={
          <ButtonComponent type={"default"} onClick={closeModal}>
            Back
          </ButtonComponent>
        }
      >
        <CardComponent header={"BILLING PERIOD INFORMATION"} cols={4}>
          <DetailText label="Period">
            {data_detail?.period
              ? moment(data_detail.period).format(dateFormatting.datePeriod)
              : ""}
          </DetailText>
          <DetailText label="Start Date">
            {data_detail?.startDate || ""}
          </DetailText>
          <DetailText label="End Date">{data_detail?.endDate || ""}</DetailText>
          <DetailText label="Invoice Date">
            {data_detail?.invoiceDate
              ? moment(data_detail.invoiceDate).format(dateFormatting.date)
              : ""}
          </DetailText>
          <DetailText label="Status">{data_detail?.status}</DetailText>
          <DetailText label="Description">
            {data_detail?.description}
          </DetailText>
        </CardComponent>

        <CardComponent header={"HISTORY LOG INFORMATION"} cols={5}>
          <DetailText label="Record ID">
            {data_detail?.id}
          </DetailText>
          <DetailText label="Created Date">
            {data_detail?.createdDate
              ? moment(data_detail.createdDate).format(dateFormatting.dateTime)
              : ""}
          </DetailText>
          <DetailText label="Created By">{data_detail?.createdBy}</DetailText>
          <DetailText label="Updated Date">
            {data_detail?.updatedDate
              ? moment(data_detail.updatedDate).format(dateFormatting.dateTime)
              : ""}
          </DetailText>
          <DetailText label="Updated By">{data_detail?.updatedBy}</DetailText>
        </CardComponent>

        <TablePaginationNew
          dataSource={data_history?.result}
          columns={columns}
          current={page}
          pageSize={pageSize}
          onChange={handleChangePage}
          onSizeChanger={handleChangePage}
          totalData={data_history?.page?.totalElements || 0}
          onSort={onSort}
          tableScrolled={{ y: 525, x: 1000 }}
        />
      </ModalCustom>
    </div>
  );
};

export default PeriodDetail;
