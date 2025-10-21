import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { Form } from "antd";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import BaseContainer from "../../../../../../components/BaseContainer";
import DetailText from "../../../../../../components/DetailText";
import { renderDateTime } from "../../GeneralTemplate/Utils/Utils";
import { TablePeriodInformation } from "../Table/TablePeriodInformation";
import {
  getBillingPeriodList,
  getDetailPeriod,
  getHistoryPeriod,
  getInfoDetail,
  openClosePeriodBilling,
} from "../../../../../../redux/slices/rating_billing_invoice/MasterData/billingCycle";
import DynamicTableInlineBillingCycle from "../Table/DynamicTableInlineBillingCycle";
import { dateFormatting } from "../../../../../../utils";
import ModalApproveOrReject from "../../../../../../components/Modal/ModalApproveOrReject";
import PeriodDetail from "./PeriodDetail";

const BillingCycleDetailInformation = ({
  id,
  data,
  type,
  action,
  statusApproval,
}) => {
  const { dataBillingCyclePeriod, loading, data_detail, dataHistory } =
    useSelector((state) => state.billingCycle);

  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const searchInput = useRef(null);

  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [modalOpenClose, setModalOpenClose] = useState(false);
  const [modalDetail, setModalDetail] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [openOrClose, setOpenOrClose] = useState();
  const [chooseId, setChooseId] = useState();
  const [remark, setRemark] = useState("");
  const [periode, setPeriode] = useState("");
  const [idDetailPeriod, setIdDetailPeriod] = useState();
  const [listPeriodInformation, setListPeriodInformation] = useState([]);

  useEffect(() => {
    dispatch(
      getBillingPeriodList({
        id: id,
        page: 1,
        pageSize: 10,
        sort,
        search: encodeURIComponent(JSON.stringify(search)),
      }),
    );
  }, [id, dispatch]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch((prevState) => {
      // let result = selectedKeys[0];
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setPage(1);
      }
      // if (dataIndex === "period") {
      //   result = result ? moment(result, "YYYY-MM").format("MMM YYYY") : "";
      // }
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

  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const handleFinish = (res, handleClear) => {
    setModalOpenClose(false);
    dispatch(
      openClosePeriodBilling({
        id: chooseId,
        isOpen: isOpen,
        remark: res.remark,
      }),
    )
      .unwrap()
      .then(() => {
        handleClear();
        setRemark("");
        form.resetFields();
        dispatch(
          getBillingPeriodList({
            id: id,
            search: encodeURIComponent(JSON.stringify(search)),
            sort,
            page,
            pageSize,
          }),
        );
      })
      .catch(() => {
        setRemark("");
      });
  };

  const handleOpenClose = (record, type, status) => {
    setChooseId(record.id);
    setPeriode(moment(record?.period).format(dateFormatting.datePeriod));
    setModalOpenClose(true);
    setOpenOrClose(type);
    setIsOpen(status);
  };

  const handleCancel = () => {
    setRemark("");
    setModalOpenClose(false);
  };

  const handleDetail = (id) => {
    if (id) {
      setIdDetailPeriod(id);
      dispatch(getDetailPeriod(id));
      // dispatch(
      //   getHistoryPeriod({
      //     id,
      //     page,
      //     pageSize,
      //     search: encodeURIComponent(JSON.stringify(search)),
      //     sort,
      //   })
      // );
      setModalDetail(true);
    }
  };

  const handleDataChange = useCallback(() => {
    const dataTable = dataBillingCyclePeriod?.map((item, index) => {
      return {
        key: (index + 1).toString(),
        id: item?.id,
        period: item?.period === null ? "" : moment(item?.period).clone(),
        startDate:
          item?.startDate === null ? "" : moment(item?.startDate).clone(),
        endDate: item?.endDate === null ? "" : moment(item?.endDate).clone(),
        invoiceDate:
          item?.invoiceDate === null ? "" : moment(item?.invoiceDate).clone(),
        description: item?.description,
        status: item?.status,
      };
    });
    setListPeriodInformation(dataTable);
  }, [dataBillingCyclePeriod]);

  useEffect(() => {
    if (id) {
      handleDataChange();
    }
  }, [dataBillingCyclePeriod, handleDataChange, id]);

  return (
    <Fragment>
      {type ? (
        <>
          <BaseContainer header={"Billing Cycle Information"}>
            <div className="w-full grid grid-cols-4 gap-3">
              <DetailText label="Begin Cycle">
                {data?.beginCycle || ""}
              </DetailText>
              <DetailText label="End Cycle">{data?.endCycle || ""}</DetailText>
              <DetailText label="Time Unit">{data?.timeUnit?.name}</DetailText>
              <DetailText label="Invoice Date">{data?.invoiceDate}</DetailText>
              <DetailText label="Start Date">
                {data?.startDate
                  ? moment(data?.startDate).format(dateFormatting.date)
                  : ""}
              </DetailText>
              <DetailText label="End Date">
                {data?.endDate
                  ? moment(data?.endDate).format(dateFormatting.date)
                  : ""}
              </DetailText>
              <DetailText label="Status">{data?.status}</DetailText>
              <DetailText label="Status Approval">
                {data?.statusApproval}
              </DetailText>
              <div className="col-span-4">
                <DetailText
                  label="Description"
                  classTextAdditional={"break-words"}
                >
                  {data?.description || ""}
                </DetailText>
              </div>
            </div>
          </BaseContainer>

          {action === "ACTIVE" && (
            <DynamicTableInlineBillingCycle
              id={id}
              header={"Period Information"}
              loading={loading}
              tableData={listPeriodInformation}
              onDataChange={setListPeriodInformation}
              onOpen={handleOpenClose}
              onClose={handleOpenClose}
              actionFix={true}
              cols={TablePeriodInformation(
                search,
                page,
                pageSize,
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
              )}
              showCreateButton={
                action === "ACTIVE" && statusApproval === "APPROVED"
              }
              current={page}
              pageSize={pageSize}
              setPage={setPage}
              sort={sort}
              search={search}
              useSelect={true}
              usePagination={true}
              onChange={handleChange}
              onChangePage={handleChange}
              onDetail={handleDetail}
              onSizeChanger={handleChange}
              totalData={dataBillingCyclePeriod?.length}
              onSort={onSort}
              required={{ required: true, message: "Please input your" }}
              scrollTable={{ y: 525, x: 1500 }}
              actionButton={["updateOnClose"]}
              dispatch={dispatch}
            />
          )}

          <BaseContainer header={"History Log Information"}>
            <div className="w-full grid grid-cols-5 gap-5">
              <DetailText label="Record ID">{data?.billingCycleId}</DetailText>
              <DetailText label="Created Date">
                {renderDateTime(data?.createdDate)}
              </DetailText>
              <DetailText label="Created By">{data?.createdBy}</DetailText>
              <DetailText label="Update Date">
                {renderDateTime(data?.updatedDate)}
              </DetailText>
              <DetailText label="Updated By">{data?.updatedBy}</DetailText>
            </div>
          </BaseContainer>
        </>
      ) : (
        <></>
      )}

      {/* Modal Open Close */}
      <ModalApproveOrReject
        handleCloseModal={handleCancel}
        onFinish={handleFinish}
        header={openOrClose}
        approveOrReject={openOrClose}
        menu={"Billing Cycle"}
        named={`period ${periode}`}
        isOpen={modalOpenClose}
      />

      {/* Modal Period Information Detail */}
      {idDetailPeriod ? (
        <PeriodDetail
          idDetail={idDetailPeriod}
          data_detail={data_detail}
          data_history={dataHistory}
          openModal={modalDetail}
          closeModal={() => {
            setModalDetail(false);
            setIdDetailPeriod();
          }}
        />
      ) : null}
    </Fragment>
  );
};
export default BillingCycleDetailInformation;
