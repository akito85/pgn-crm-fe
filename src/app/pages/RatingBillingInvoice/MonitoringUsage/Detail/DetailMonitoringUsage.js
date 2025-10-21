import React, { useCallback, useEffect, useState } from "react";
import { RBI_ROUTES } from "../../../../../routes/rating_billing/rbi_routes";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import BreadCrumb from "../../../../../components/BreadCrumb";
import { Alert, Form, Spin, Tooltip } from "antd";
import { useDispatch, useSelector } from "react-redux";
import ButtonComponent from "../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../assets/Icon/index";
import { LeftOutlined, WarningOutlined } from "@ant-design/icons";
import RadioTabs from "../../../../../components/RadioTabs";
import {
  addDeletedData,
  addUpdatedData,
  getApprovalHierarchy,
  getDetailBatch,
  getDownloadFailed,
  getListApprovalById,
} from "../../../../../redux/slices/rating_billing_invoice/monitoring_usage";
import BaseContainer from "../../../../../components/BaseContainer";
import DetailText from "../../../../../components/DetailText";
import { dateFormatting, hasValue, toTitleCase } from "../../../../../utils";
import TablePagination from "../../../../../components/TablePagination";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import { useMonitoringList } from "../useMonirotingList";
import ModalUpdateUsage from "../ModalUpdateUsage";
import moment from "moment";
import ConfirmationUsage from "../ConfirmationUsage";
import { ModalConfirm } from "../../../../../components/Modal/ModalPopUp";
import TablePaginationNew from "../../../../../components/TablePaginationNew";

const DetailMonitoringUsage = () => {
  // Selector
  const { detail_batch, loading, list_approval_by_id, list_approval } =
    useSelector((state) => state.monitoring_usage);

  // Declaration
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { columns } = useMonitoringList();
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

  // use state
  const [valuePage, setValuePage] = useState("Upload");
  const [tabPages, setTabPages] = useState([
    {
      value: "Upload",
      paramValue: [],
    },
    { value: "Approval", paramValue: ["apphierId"] },
  ]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [appHierOptions, setAppHierOptions] = useState([]);
  const [appHierDataDetail, setAppHierDataDetail] = useState([]);
  const [selectedHierarchy, setSelectedHierarchy] = useState();
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [deletedRecord, setDeletedRecord] = useState(null);
  const [modalDelete, setModalDelete] = useState(false);
  const [openUpdateUsage, setOpenUpdateUsage] = useState(false);
  const [recordId, setRecordId] = useState("");
  const [dataTable, setDataTable] = useState([]);
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [flag, setFlag] = useState(1);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [body, setBody] = useState({});

  // assert function
  const assert = useCallback(
    (data) => {
      if (data) {
        if (hasValue(data?.batchInformation?.apphierId)) {
          form.setFieldsValue({
            apphierId: data?.batchInformation?.apphierId,
          });
          setSelectedHierarchy(data?.batchInformation?.apphierId);
        }
      }
    },
    [form],
  );

  // use effect
  useEffect(() => {
    if (location?.state?.id) {
      dispatch(
        getDetailBatch({ batchId: location?.state?.id, page, pageSize }),
      );
      dispatch(getApprovalHierarchy({ page, pageSize }));
    }
  }, [location, dispatch, page, pageSize]);

  useEffect(() => {
    if (
      detail_batch &&
      detail_batch?.batchInformation?.batchId === location?.state?.id
    ) {
      assert(detail_batch);
      setDataTable(detail_batch?.usageList?.result);
    }
  }, [detail_batch, assert, location]);
  useEffect(() => {
    if (hasValue(selectedHierarchy) === true) {
      dispatch(getListApprovalById(selectedHierarchy));
    }
  }, [selectedHierarchy, dispatch]);
  useEffect(() => {
    if (
      list_approval_by_id?.length > 0 &&
      hasValue(selectedHierarchy) === true
    ) {
      setAppHierDataDetail(list_approval_by_id);
      const dataOptions = list_approval?.map((item) => ({
        name: item.approvalName,
        value: item.appHierId,
      }));
      setAppHierOptions(dataOptions);
    } else if (
      list_approval?.length > 0 &&
      hasValue(selectedHierarchy) === false
    ) {
      const dataOptions = list_approval?.map((item) => ({
        name: item.approvalName,
        value: item.appHierId,
      }));
      setAppHierOptions(dataOptions);
    }
  }, [
    list_approval_by_id,
    page,
    pageSize,
    valuePage,
    dispatch,
    list_approval,
    selectedHierarchy,
  ]);

  // handle update row
  const handleUpdate = (record, values) => {
    setSelectedRecord(record);
    setRecordId(record?.recordId);
    setOpenUpdateUsage(true);
  };

  // handle error
  // Handle Error Tab Form
  const handleError = ({ values, errorFields, outOfDate }) => {
    // console.log(errorFields, " error");
    setTabPages((prevState) => {
      const res = prevState.map((item) => {
        const errorBadge =
          item.value !== "Attachment"
            ? (errorFields || []).reduce(
                (current, next) =>
                  item.paramValue.includes(next.name[0])
                    ? current + 1
                    : current,
                0,
              )
            : listDataAttachment.length < 1
              ? 1
              : 0;
        return {
          value: item.value,
          paramValue: item.paramValue,
          errorBadge,
        };
      });
      return res;
    });
  };
  // handle save
  const handleSave = (formValue) => {
    setBody({
      ...detail_batch,
      usageList: dataTable,
      isSubmit: flag === 1 ? false : true,
    });
    setOpenConfirmation(true);
  };

  const handleSaveUpdateUsage = async (formValue) => {
    const newDataTable = [...dataTable];
    const index = newDataTable.findIndex((item) => recordId === item.recordId);
    const item = newDataTable[index];
    const updatedRow = {
      ...item,
      ...formValue,
      billingPeriod:
        formValue?.billingPeriod === false
          ? null
          : moment(formValue?.billingPeriod).format(dateFormatting.datePeriod),
      fdate:
        formValue?.fdate === false
          ? null
          : moment(formValue?.fdate).format(dateFormatting.date),
      fhour: hasValue(formValue?.fhour)
        ? moment(formValue?.fhour).format(dateFormatting.hour_format)
        : null,
      measDate:
        formValue?.measDate === false
          ? null
          : moment(formValue?.measDate).format(dateFormatting.dateTime),
      status: "SUCCESS",
      recordId: recordId,
    };
    // console.log(updatedRow, " updated row");
    newDataTable.splice(index, 1, updatedRow);
    setDataTable(newDataTable);
    setOpenUpdateUsage(false);
    dispatch(addUpdatedData(updatedRow));
  };
  // change tabs
  const changeTabHeader = (e) => {
    setValuePage(e.target.value);
  };
  // handle back page
  const handleBack = () => {
    navigate(-1);
    // dispatch(clearUpdatedDeleted())
  };

  // handle cancel update usage
  const handleCancel = () => setOpenUpdateUsage(false);

  // handle clear
  const handleClear = () => {};

  // handle delete usage list
  const handleDeleteOk = () => {
    const newData = dataTable.filter((item) => item.recordId !== recordId);
    setDataTable(newData);
    dispatch(addDeletedData(deletedRecord));
    setModalDelete(false);
  };

  // change page
  const handleChangePage = (page, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : page;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };
  // breadcrumbs routes
  const routes = [
    {
      path: "",
      breadcrumbName: "Rating Billing",
    },
    {
      path: RBI_ROUTES.MONITORING_USAGE_VIEW,
      breadcrumbName: "Monitoring Usage",
    },
    {
      path: "",
      breadcrumbName: "Detail Batch Usage",
    },
  ];

  // column
  const action = [
    {
      title: "ACTION",
      dataIndex: "accountId",
      align: "center",
      fixed: "right",
      width: 100,
      render: (id, record, index) => {
        return (
          <div className="flex w-full justify-center gap-3">
            <Tooltip title="Update">
              <div className="pt-1">
                {detail_batch?.batchInformation?.status !== "COMPLETE" ? (
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
            </Tooltip>
            <Tooltip title="Delete">
              <div className="pt-1">
                {detail_batch?.batchInformation?.status !== "COMPLETE" ? (
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

  // pagination table
  const paginationTable = (page, pageSize) => {
    return dataTable?.slice((page - 1) * pageSize, page * pageSize);
  };

  const handleDownloadFailed = () => {
    dispatch(getDownloadFailed(location?.state?.id))
      .unwrap()
      .then((response) => {
        console.log("Download successful", response);
      })
      .catch((error) => {
        console.error("Download failed", error);
      });
  };

  return (
    <LayoutMenu>
      <BreadCrumb routes={routes} />
      <Spin spinning={loading}>
        <div className={"w-full flex justify-start"}>
          <RadioTabs
            data={tabPages}
            onChange={changeTabHeader}
            currentPosition={valuePage}
          />
        </div>
        <div className={"w-full flex justify-end"}>
          {valuePage === "Upload" && (
            <ButtonComponent
              type={"submit"}
              icon={<SVGIcon name="IconButtonDownload" width={24} />}
              onClick={handleDownloadFailed}
            >
              Download Failed Data
            </ButtonComponent>
          )}
        </div>
        <Form
          layout="vertical"
          form={form}
          onFinish={handleSave}
          onFinishFailed={handleError}
        >
          <div className={`${valuePage !== "Upload" ? "hidden" : ""}`}>
            {/* <Form.Item> */}
            <BaseContainer header={"batch information"}>
              <div className={"w-full grid grid-cols-4"}>
                <DetailText label={"Batch ID"}>
                  {detail_batch?.batchInformation?.batchId}
                </DetailText>
                <DetailText label={"Upload Type"}>
                  {detail_batch?.batchInformation?.uploadType}
                </DetailText>
                <DetailText label={"Upload Date"}>
                  {detail_batch?.batchInformation?.uploadDate}
                </DetailText>
                <DetailText label={"Upload By"}>
                  {detail_batch?.batchInformation?.uploadBy}
                </DetailText>
              </div>
              <div className={"w-full grid grid-cols-4"}>
                <DetailText label={"Total Data"}>
                  {detail_batch?.batchInformation?.totalUsage}
                </DetailText>
                <DetailText label={"Total Succeed"}>
                  {detail_batch?.batchInformation?.totalSucceed}
                </DetailText>
                <DetailText label={"Total Progress"}>
                  {detail_batch?.batchInformation?.totalProgress}
                </DetailText>
                <DetailText label={"Total Failed"}>
                  {detail_batch?.batchInformation?.totalFailed}
                </DetailText>
              </div>
              <div className={"w-full grid grid-cols-4"}>
                <DetailText label={"Status"}>
                  {toTitleCase(detail_batch?.batchInformation?.status)}
                </DetailText>
              </div>
            </BaseContainer>
            <BaseContainer header={"USAGE LIST"}>
              <div className="my-10">
                <TablePaginationNew
                  type="FE"
                  columns={[...filteredColumns, ...action]}
                  dataSource={dataTable}
                  totalData={dataTable?.length}
                  current={page}
                  pageSize={pageSize}
                  onChange={handleChangePage}
                  tableScrolled={{ x: 8000, y: 600 }}
                  // onSort={onSort}
                />
              </div>
            </BaseContainer>
            {/* </Form.Item> */}
          </div>
          <div className={`${valuePage !== "Approval" ? "hidden" : ""}`}>
            <BaseContainer header={"Approval Information"}>
              <ApprovalComponentGeneral
                // type={type}
                dataTable={appHierDataDetail}
                dataOption={appHierOptions}
                selectedHierarchy={selectedHierarchy}
                updateSelectedHierarchy={setSelectedHierarchy}
              />
            </BaseContainer>
          </div>

          <div className={"w-full flex mt-5"}>
            <div className={"w-full justify-start"}>
              <Form.Item>
                <ButtonComponent
                  type={"submit"}
                  icon={
                    <LeftOutlined
                      style={{
                        color: "#fff",
                        fontSize: 16,
                        justifyItems: "left",
                      }}
                    />
                  }
                  onClick={handleBack}
                >
                  Back
                </ButtonComponent>
              </Form.Item>
            </div>
            {detail_batch?.batchInformation?.status !== "COMPLETE" && (
              <div className={"w-full flex justify-end gap-5"}>
                <Form.Item>
                  <ButtonComponent
                    icon={<SVGIcon name={`IconButtonClear`} width={24} />}
                    type="submit"
                    onClick={() => {
                      handleClear();
                    }}
                  >
                    {"Clear"}
                  </ButtonComponent>
                </Form.Item>
                <Form.Item>
                  <ButtonComponent
                    type="submit"
                    htmlType={"submit"}
                    onClick={() => setFlag(1)}
                  >
                    Save as Draft
                  </ButtonComponent>
                </Form.Item>
                <Form.Item>
                  <ButtonComponent
                    type="submit"
                    htmlType={"submit"}
                    onClick={() => setFlag(2)}
                  >
                    Save & Submit
                  </ButtonComponent>
                </Form.Item>
              </div>
            )}
          </div>
        </Form>
        <ModalUpdateUsage
          isOpen={openUpdateUsage}
          handleCancel={handleCancel}
          record={selectedRecord}
          uploadType={detail_batch?.batchInformation?.uploadType}
          handleSave={handleSaveUpdateUsage}
          // form={form}
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
      </Spin>
      <ConfirmationUsage
        isOpen={openConfirmation}
        setIsOpen={setOpenConfirmation}
        dispatcher={dispatch}
        dataOption={appHierOptions}
        selectedHierarchy={selectedHierarchy}
        listDataAppHierDetail={appHierDataDetail}
        data_detail={body}
        columns={filteredColumns}
      />
    </LayoutMenu>
  );
};

export default DetailMonitoringUsage;
