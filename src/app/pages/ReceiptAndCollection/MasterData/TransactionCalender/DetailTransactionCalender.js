import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Alert, DatePicker, Form, Tooltip } from "antd";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { useDispatch, useSelector } from "react-redux";
import BaseContainer from "../../../../../components/BaseContainer";
import DetailText from "../../../../../components/DetailText";
import StatusComponent from "../../../../../components/StatusComponent";
import {
  dateFormatting,
  requiredMessage,
} from "../../../../../utils";
import DynamicTableInlinePayment from "../../DynamicTableInlinePayment";
import SVGIcon from "../../../../../assets/Icon/index";
import ButtonComponent from "../../../../../components/ButtonComponent";
import {
  createTransPeriod,
  getTransPeriod,
  openCloseTransCalender,
} from "../../../../../redux/slices/receipt_collection/transactionCalender";
import InputComponent from "../../../../../components/InputComponent";
import FunctionalTableCriteriaPayment from "../Bank/Table/FunctionalTableCriteriaPayment";
import {
  getColumnSearchPropsPaging,
} from "../../../../../utils/getColumnSearchProps";
import ModalCustom from "../../../../../components/Modal/ModalCustom";

export const columnPeriod = (
  page = 1,
  pageSize = 10,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => { }
) => [
    {
      title: "NO",
      width: 60,
      align: "center",
      dataIndex: "no",
      editable: true,
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "PERIOD",
      dataIndex: "period",
      align: "center",
      sorter: true,
      disabled: true,
      inputType: "text",
      ...getColumnSearchPropsPaging(
        "period",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "datePeriod"
      ),
      render: (text) =>
        searchedColumn === "period" ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[
              searchText
                ? moment(searchText, "YYYY-MM").format(dateFormatting.datePeriod)
                : "",
            ]}
            autoEscape
            textToHighlight={
              text ? moment(text).format(dateFormatting.datePeriod) : ""
            }
          />
        ) : text === null ? (
          " "
        ) : (
          moment(text).format(dateFormatting.datePeriod)
        ),
    },
    {
      title: "START DATE",
      dataIndex: "startDate",
      align: "center",
      sorter: true,
      // inputType: "date",
      ...getColumnSearchPropsPaging(
        "startDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "dateCapital"
      ),
      render: (text) => {
        const tempValue = text ? moment(text).format(dateFormatting.date) : "";
        if (searchedColumn === "startDate") {
          const highlight = (
            <Highlighter
              highlightStyle={{
                backgroundColor: "#ffc069",
                padding: 0,
              }}
              searchWords={[searchText]}
              autoEscape
              textToHighlight={tempValue || ""}
            />
          );
          if (tempValue) {
            return highlight;
          }
          return highlight;
        } else {
          if (tempValue) {
            return tempValue;
          }
          return "";
        }
      },
    },
    {
      title: "END DATE",
      dataIndex: "endDate",
      align: "center",
      // inputType: "date",
      sorter: true,
      ...getColumnSearchPropsPaging(
        "endDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "dateCapital"
      ),
      render: (text) => {
        const tempValue = text ? moment(text).format(dateFormatting.date) : "";
        if (searchedColumn === "endDate") {
          const highlight = (
            <Highlighter
              highlightStyle={{
                backgroundColor: "#ffc069",
                padding: 0,
              }}
              searchWords={[searchText]}
              autoEscape
              textToHighlight={tempValue || ""}
            />
          );
          if (tempValue) {
            return highlight;
          }
          return highlight;
        } else {
          if (tempValue) {
            return tempValue;
          }
          return "";
        }
      },
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      sorter: true,
      ...getColumnSearchPropsPaging(
        "description",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      ellipsis: {
        showTitle: false,
      },
      render: (text) => {
        if (searchedColumn === "description") {
          return (
            <Tooltip placement="topLeft" title={text}>
              <Highlighter
                highlightStyle={{
                  backgroundColor: "#ffc069",
                  padding: 0,
                }}
                searchWords={[searchText]}
                autoEscape
                textToHighlight={text ? text.toString() : ""}
              />
            </Tooltip>
          );
        } else {
          if (text) {
            return (
              <Tooltip placement="topLeft" title={text}>
                {text}
              </Tooltip>
            );
          }
          return "";
        }
      },
    },
    {
      title: "STATUS",
      dataIndex: "status",
      sorter: true,
      ...getColumnSearchPropsPaging(
        "status",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      // render: (text) =>
      //   searchedColumn === "status" ? (
      //     <Highlighter
      //       highlightStyle={{
      //         backgroundColor: "#ffc069",
      //         padding: 0,
      //       }}
      //       searchWords={[searchText]}
      //       autoEscape
      //       textToHighlight={text ? text.toString() : ""}
      //     />
      //   ) : text ? (
      //     <div className="flex justify-center">
      //       <StatusComponent colour={text}>{text}</StatusComponent>
      //     </div>
      //   ) : (
      //     ""
      //   ),
      render: (index) => {
        let text;
        switch (index) {
          case true:
            text = "OPEN";
            break;
          case false:
            text = "CLOSE";
            break;
          default:
            text = index
              ? index.charAt(0).toUpperCase() + index.slice(1).toLowerCase()
              : index;
            break;
        }
        return text ? (
          <div className="flex justify-center">
            <StatusComponent colour={text}>{text}</StatusComponent>
          </div>
        ) : (
          text
        );
      },
    },
  ];

const DetailTransactionCalender = ({
  data_detail,
  id,
  type,
  data,
  dataCriteria,
  updateData,
  data_req,
  statusApproval,
  detailNameCriteria,
}) => {
  const { data_period } = useSelector((state) => state.cycle);
  const searchInput = useRef(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [tableData, setTableData] = useState([]);
  const dispatch = useDispatch();
  const [modalPeriod, setModalPeriod] = useState(false);
  const [year, setYear] = useState("");
  const [modalOpenClose, setModalOpenClose] = useState(false);
  const [remark, setRemark] = useState("");
  const [open, setOpen] = useState("");
  const [close, setClose] = useState("");
  const [openOrClose, setOpenOrClose] = useState();
  const [modalClose, setModalClose] = useState(false);
  const [chooseId, setChooseId] = useState();
  const [periode, setPeriode] = useState("");
  const [form] = Form.useForm();
  const [openClose] = Form.useForm();
  const [approveOrReject, setApproveOrReject] = useState("");

  useEffect(() => {
    let tempSearch = "";
    for (const dataIndex in search) {
      if (Object.hasOwnProperty.call(search, dataIndex)) {
        const tempSearchText = search[dataIndex];
        if (tempSearchText) {
          tempSearch += `${dataIndex}~${tempSearchText},`;
        }
      }
    }
    tempSearch = tempSearch ? tempSearch.slice(0, -1) : "";
    dispatch(
      getTransPeriod({
        id,
        page,
        pageSize,
        sort,
        search: tempSearch,
      })
    );
  }, [id, page, pageSize, sort, search, dispatch]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(selectedKeys[0] ? dataIndex : "");
    setSearch((prevState) => {
      let result = selectedKeys[0];
      if (prevState[dataIndex] !== selectedKeys[0]) {
        setPage(1);
      }
      if (dataIndex === "period") {
        result = result ? moment(result, "YYYY-MM").format("MMM YYYY") : "";
      }
      return {
        ...prevState,
        [dataIndex]: result,
      };
    });
  };

  const assert = () => {
    const dataTable = data_period?.result?.map((item, index) => {
      return {
        period: item?.period,
        key: (index + 1).toString(),
        id: item?.id,
        startDate:
          item?.startDate === null ? moment() : moment(item?.startDate).clone(),
        endDate:
          item?.endDate === null ? moment() : moment(item?.endDate).clone(),
        description: item?.description,
        status: item?.status,
      };
    });
    setTableData(dataTable);
  };

  useEffect(() => {
    if (id) {
      assert();
    }
  }, [data_period]);

  const handleCancelPeriod = () => {
    setModalPeriod(false);
    setYear("");
    form.resetFields();
  };

  const createPeriod = () => {
    setModalPeriod(true);
  };

  // handle Confirm
  const handleConfirm = () => {
    setModalPeriod(false);
    const body = {
      transactionCalendarId: id,
      year: year,
    };
    dispatch(createTransPeriod(body))
      .unwrap()
      .then(() => {
        dispatch(getTransPeriod({ id, search, sort, page, pageSize }));
        form.resetFields();
      })
      .catch(() => {
        form.resetFields();
      });
  };

  const onSortPeriod = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const handleChangePage = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const handleOpenClose = () => {
    setModalOpenClose(false);
    dispatch(
      openCloseTransCalender({
        id: chooseId,
        status: openOrClose,
        remark: remark,
      })
    )
      .unwrap()
      .then(() => {
        dispatch(getTransPeriod({ id, search, sort, page, pageSize }));
        openClose.resetFields();
      })
      .catch(() => {
        openClose.resetFields();
      });
  };

  const handleCloseOpen = (record, type) => {
    setModalOpenClose(true);
    setChooseId(record?.id);
    setPeriode(record?.period);
    setOpenOrClose(type);
  };
  const handleCancelOpenClose = () => {
    setModalOpenClose(false);
    openClose.resetFields();
  };

  const onChange = (date, dateString) => {
    setYear(dateString);
  };

  const handleDisableDate = (current) => {
    return moment() >= current;
  };

  const formattedString = (detailNameCriteria || [])
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(", ");

  console.log(data_detail);

  return (
    <div>
      {data_req?.isApprover &&
        data_req?.approvalType &&
        data_req?.approvalType === "INACTIVE_TRANSACTION_CALENDAR" ? (
        <BaseContainer header={"INACTIVE REQUEST INFORMATION"}>
          <div className="grid grid-cols-4 w-full">
            <DetailText label={"Requested Date"}>
              {data_req?.requestedDate
                ? moment(data_req?.requestedDate).format("DD MMM YYYY HH:mm:ss")
                : ""}
            </DetailText>
            <DetailText label={"Requested By"}>
              {data_req?.requestedBy}
            </DetailText>
            <DetailText label={"Remark"}>{data_req?.remarks}</DetailText>
          </div>
        </BaseContainer>
      ) : null}

      <BaseContainer header={"TRANSACTION CALENDAR INFORMATION"}>
        <div className="w-full grid grid-cols-3 gap-3">
          <DetailText label="Begin Cycle">{data_detail?.beginCycle}</DetailText>
          <DetailText label="End Cycle">{data_detail?.endCycle}</DetailText>
          <DetailText label="Time Unit">{data_detail?.timeUnit}</DetailText>
          <DetailText label="Start Date">
            {data_detail?.startDate
              ? moment(data_detail?.startDate).format(
                dateFormatting.dateCapital
              )
              : ""}
          </DetailText>
          <DetailText label="End Date">
            {data_detail?.endDate
              ? moment(data_detail?.endDate).format(dateFormatting.dateCapital)
              : ""}
          </DetailText>
          <DetailText label={"Criteria"}>{formattedString}</DetailText>
          <DetailText label="Status">{data_detail?.status}</DetailText>
          <DetailText label="Status Approval">
            {data_detail?.statusApproval}
          </DetailText>
          <div className="col-span-3">
            <DetailText label="Description">
              {data_detail?.description}
            </DetailText>
          </div>
        </div>
      </BaseContainer>
      {data_detail?.status?.toLowerCase() !== 'draft' &&
        <BaseContainer header={"PERIOD INFORMATION"}>
          <div className="w-full flex justify-end gap-[20px]">
            <ButtonComponent
              icon={<SVGIcon name="IconButtonCreate" width={24} />}
              type="submit"
              onClick={createPeriod}
              disabled={statusApproval !== "Approved"}
            >
              Create
            </ButtonComponent>
          </div>
          <DynamicTableInlinePayment
            // header={"PERIOD INFORMATION"}
            onDataChange={setTableData}
            useSelect={true}
            totalData={data_period?.page?.totalElements}
            pageSize={pageSize}
            current={page}
            onClose={handleCloseOpen}
            onOpen={handleCloseOpen}
            // upDate={handleUpdate}
            onChangePage={handleChangePage}
            onSizeChanger={handleChangePage}
            usePagination={true}
            tableData={tableData}
            isOpenOrClose={open}
            cols={columnPeriod(
              page,
              pageSize,
              searchInput,
              searchedColumn,
              searchText,
              handleSearch
            )}
            mode={"update"}
            showCreateButton={false}
            scrollTable={{ x: 1200, y: 500 }}
            onSort={onSortPeriod}
            actionButton={["update", "onOpen", "onClose"]}
            disableDate={handleDisableDate}
          />
        </BaseContainer>

      }

      <BaseContainer header={"CRITERIA INFORMATION"}>
        <FunctionalTableCriteriaPayment
          // type={type}
          data={data}
          dataCriteria={dataCriteria}
          // updateData={updateData}
          type={"show"}
          showAction={"show"}
        />
      </BaseContainer>

      <BaseContainer header={"HISTORY LOG INFORMATION"}>
        <div className="w-full grid grid-cols-5">
          <DetailText label={"Record ID"}>{data_detail?.id}</DetailText>
          <DetailText label={"Created Date"}>
            {moment(data_detail?.createdDate).format("DD MMM YYYY HH:mm:ss")}
          </DetailText>
          <DetailText label={"Created By"}>{data_detail?.createdBy}</DetailText>
          <DetailText label={"Updated Date"}>
            {data_detail?.updatedDate === null
              ? ""
              : moment(data_detail?.updatedDate).format("DD MMM YYYY HH:mm:ss")}
          </DetailText>
          <DetailText label={"Updated By"}>{data_detail?.updatedBy}</DetailText>
        </div>
      </BaseContainer>

      {/* <ModalApproveOrReject
        isOpen={modalPeriod}
        handleCloseModal={handleCancel}
        onFinish={handleConfirm}
        header={"Create Transaction Cycle"}
        approveOrReject={approveOrReject}
        menu={""}
        named={"Period"}
      >
        <DatePicker
          name="year"
          // value={year}
          // onChange={(e) => setYear(e.target.value)}
          onChange={onChange}
          picker={"year"}
          className={"w-full"}
        />
      </ModalApproveOrReject> */}

      <ModalCustom
        isOpen={modalPeriod}
        handleCancel={handleCancelPeriod}
        header={`Create Transaction Period`}
        width={1000}
        type={"confirmation"}
        footer={
          <div className="w-full flex justify-end gap-5 p-4">
            <ButtonComponent onClick={handleCancelPeriod} type="default">
              Cancel
            </ButtonComponent>
            <ButtonComponent
              form="formApproveReject"
              type="submit"
              htmlType="submit"
            >
              Confirm
            </ButtonComponent>
          </div>
        }
      >
        <Form
          id="formApproveReject"
          layout="vertical"
          form={form}
          onFinish={handleConfirm}
        >
          {/* Alert Section */}
          <div className="flex flex-col justify-center gap-6">
            <Alert
              message={`Are you sure you want to create Transaction Period ?`}
              icon={
                <ExclamationCircleOutlined
                  style={{ fontSize: "24px", color: "#65481C" }}
                />
              }
              type={"warning"}
              showIcon
              className="p-0 m-0"
            />
            <Form.Item name={"year"} className="w-full">
              <DatePicker
                name="year"
                // value={year}
                // onChange={(e) => setYear(e.target.value)}
                onChange={onChange}
                picker={"year"}
                className={"w-full"}
              />
            </Form.Item>
            <Form.Item
              name={"remark"}
              label={"Remark"}
              rules={[{ message: requiredMessage("Remark"), required: true }]}
              className="w-full"
            >
              <InputComponent
                rows={1}
                type="textarea"
                value={remark}
                placeholder={"Type your remark"}
                onChange={(e) => setRemark(e.target.value)}
              />
            </Form.Item>
          </div>
        </Form>
      </ModalCustom>

      <ModalCustom
        isOpen={modalOpenClose}
        header={`${openOrClose} Information`}
        // message={`Are you sure want to ${openOrClose} this period '${periode}' ? `}
        width={1000}
        type={"confirmation"}
        handleCancel={handleCancelOpenClose}
        footer={
          <div className={"w-full flex justify-end gap-5"}>
            <ButtonComponent
              type={"default"}
              onClick={handleCancelOpenClose}
              form={"formOpenorClose"}
            >
              Cancel
            </ButtonComponent>
            <ButtonComponent
              form={"formOpenorClose"}
              type={"submit"}
              htmlType={"submit"}
              border={false}
            >
              Confirm
            </ButtonComponent>
          </div>
        }
      >
        {/* Alert Section */}
        <div className="flex flex-col justify-center gap-6">
          <Alert
            message={`Are you sure want to ${openOrClose} period '${periode}'`}
            icon={
              <ExclamationCircleOutlined
                style={{ fontSize: "24px", color: "#65481C" }}
              />
            }
            type={"warning"}
            showIcon
            className="p-0 m-0"
          />
          <Form
            layout="vertical"
            id="formOpenorClose"
            onFinish={handleOpenClose}
            form={openClose}
          >
            <Form.Item
              name={"remark"}
              rules={[{ message: requiredMessage("Remark"), required: true }]}
            >
              <InputComponent
                rows={1}
                placeholder="Type your remark"
                type="textarea"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
              />
            </Form.Item>
          </Form>
        </div>
      </ModalCustom>
    </div>
  );
};

export default DetailTransactionCalender;
