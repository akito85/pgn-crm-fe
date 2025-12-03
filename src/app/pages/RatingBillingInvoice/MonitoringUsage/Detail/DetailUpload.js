import React, { useState } from "react";
import BaseContainer from "../../../../../components/BaseContainer";
import DetailText from "../../../../../components/DetailText";
import TablePagination from "../../../../../components/TablePagination";
import { useMonitoringList } from "../useMonirotingList";
import { Alert, Tooltip } from "antd";
import { Link } from "react-router-dom";
import SVGIcon from "../../../../../assets/Icon/index";
import ModalUpdateUsage from "../ModalUpdateUsage";
import { useDispatch } from "react-redux";
import {
  addDeletedData,
  addUpdatedData,
} from "../../../../../redux/slices/rating_billing_invoice/monitoring_usage";
import { ModalConfirm } from "../../../../../components/Modal/ModalPopUp";
import { WarningOutlined } from "@ant-design/icons";
import { dateFormatting, hasValue, toTitleCase } from "../../../../../utils";
import moment from "moment";

const DetailUpload = ({
  dataTable,
  setDataTable = () => {},
  tabHeader,
  id,
  dataHeader,
  form,
}) => {
  const { columns, page, setPage, pageSize, setPageSize, onSort } =
    useMonitoringList(tabHeader, id);
  // const [form] = Form.useForm();
  const dispatch = useDispatch();
  // use state
  const [dataSource, setDataSource] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [deletedRecord, setDeletedRecord] = useState(null);
  const [modalDelete, setModalDelete] = useState(false);
  const [openUpdateUsage, setOpenUpdateUsage] = useState(false);
  const [recordId, setRecordId] = useState("");
  const filteredColumns = columns?.filter(
    (item) =>
      item?.dataIndex !== "ratingCode" &&
      item?.dataIndex !== "batchId" &&
      item?.dataIndex !== "accountGroupType" &&
      item?.dataIndex !== "serviceType" &&
      item?.dataIndex !== "ratingCode" &&
      item?.dataIndex !== "fileSource" &&
      item?.dataIndex !== "creationDate",
  );

  // handle update row
  const handleUpdate = (record, values) => {
    setSelectedRecord(record);
    setRecordId(record?.recordId);
    setOpenUpdateUsage(true);
  };

  // handle cancel
  const handleCancel = () => setOpenUpdateUsage(false);

  // column
  const action = [
    {
      title: "ACTION",
      dataIndex: "accountId",
      align: "center",
      fixed: "right",
      render: (id, record, index) => {
        return (
          <div className="flex w-full justify-center gap-6">
            <Tooltip title="Update">
              <Link
              // to={RBI_ROUTES.MONITORING_USAGE_LIST_UPDATE}
              // state={{ id: id, record: record }}
              >
                <div className="pt-1">
                  {dataHeader?.batchInformation?.status !== "COMPLETE" ? (
                    <SVGIcon
                      name="IconEdit"
                      width={24}
                      onClick={() => handleUpdate(record)}
                    />
                  ) : (
                    <SVGIcon
                      name="IconEdit"
                      width={24}
                      color={"#C0BEC6"}
                      className={"cursor-not-allowed"}
                    />
                  )}
                </div>
              </Link>
            </Tooltip>
            <Tooltip title="Delete">
              <div className="pt-1">
                {dataHeader?.batchInformation?.status !== "COMPLETE" ? (
                  <SVGIcon
                    name="IconDelete"
                    width={24}
                    onClick={() => {
                      setModalDelete(true);
                      setDeletedRecord(record);
                      setRecordId(record?.recordId);
                    }}
                  />
                ) : (
                  <SVGIcon
                    name="IconDelete"
                    width={24}
                    color={"#C0BEC6"}
                    className={"cursor-not-allowed"}
                  />
                )}
              </div>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  // change page
  const handleChangePage = (page, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : page;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  // handleSave udpate
  const handleSave = async () => {
    const row = await form.validateFields();
    const newDataTable = [...dataTable];
    const index = newDataTable.findIndex((item) => recordId === item.recordId);
    const item = newDataTable[index];
    const updatedRow = {
      ...item,
      ...row,
      billingPeriod:
        row.billingPeriod === false
          ? null
          : moment(row.billingPeriod).format(dateFormatting.datePeriod),
      fdate:
        row.fdate === false
          ? null
          : moment(row.fdate).format(dateFormatting.date),
      fhour: hasValue(row.fhour)
        ? moment(row.fhour).format(dateFormatting.hour_format)
        : null,
      measDate:
        row.measDate === false
          ? null
          : moment(row.measDate).format(dateFormatting.dateTime),
      status: "SUCCESS",
    };
    newDataTable.splice(index, 1, updatedRow);
    setDataTable(newDataTable);
    setOpenUpdateUsage(false);
    dispatch(addUpdatedData(updatedRow));
  };

  // handleDelete
  const handleDeleteOk = () => {
    const newData = dataTable.filter((item) => item.recordId !== recordId);
    setDataTable(newData);
    dispatch(addDeletedData(deletedRecord));
    setModalDelete(false);
  };

  // pagination table
  const paginationTable = (page, pageSize) => {
    return dataTable?.slice((page - 1) * pageSize, page * pageSize);
  };
  return (
    <>
      <BaseContainer header={"batch information"}>
        <div className={"w-full grid grid-cols-4"}>
          <DetailText label={"Batch ID"}>
            {dataHeader?.batchInformation?.batchId}
          </DetailText>
          <DetailText label={"Upload Type"}>
            {dataHeader?.batchInformation?.uploadType}
          </DetailText>
          <DetailText label={"Upload Date"}>
            {dataHeader?.batchInformation?.uploadDate}
          </DetailText>
          <DetailText label={"Upload By"}>
            {dataHeader?.batchInformation?.uploadBy}
          </DetailText>
        </div>
        <div className={"w-full grid grid-cols-4"}>
          <DetailText label={"Total Data"}>
            {dataHeader?.batchInformation?.totalUsage}
          </DetailText>
          <DetailText label={"Total Succeed"}>
            {dataHeader?.batchInformation?.totalSucceed}
          </DetailText>
          <DetailText label={"Total Progress"}>
            {dataHeader?.batchInformation?.totalProgress}
          </DetailText>
          <DetailText label={"Total Failed"}>
            {dataHeader?.batchInformation?.totalFailed}
          </DetailText>
        </div>
        <div className={"w-full grid grid-cols-4"}>
          <DetailText label={"Status"}>
            {toTitleCase(dataHeader?.batchInformation?.status)}
          </DetailText>
        </div>
      </BaseContainer>
      <BaseContainer header={"USAGE LIST"}>
        <div className="my-10">
          <TablePagination
            columns={[...filteredColumns, ...action]}
            dataSource={paginationTable(page, pageSize)}
            totalData={dataTable?.length}
            current={page}
            pageSize={pageSize}
            onChange={handleChangePage}
            tableScrolled={{ x: 8000, y: 600 }}
            onSort={onSort}
          />
        </div>
      </BaseContainer>
      <ModalUpdateUsage
        isOpen={openUpdateUsage}
        handleCancel={handleCancel}
        record={selectedRecord}
        handleSave={handleSave}
        form={form}
      />
      <ModalConfirm
        isOpen={modalDelete}
        handleCancel={() => setModalDelete(false)}
        handleOk={handleDeleteOk}
        width={500}
        useOk={true}
      >
        <div className="flex justify-center gap-[20px] mt-6">
          <WarningOutlined style={{ fontSize: "24px", color: "#BE3036" }} />
          <p className={"text-[18px] font-bold"}>
            {`Are you sure want to delete it?`}
          </p>
        </div>
        <Alert
          message="Warning! if you delete this data, it will be permanently."
          type={"error"}
        />
      </ModalConfirm>
    </>
  );
};

export default DetailUpload;
