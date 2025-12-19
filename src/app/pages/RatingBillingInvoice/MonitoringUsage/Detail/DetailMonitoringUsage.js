import React, { useCallback, useEffect, useState, useMemo } from "react";
import { RBI_ROUTES } from "../../../../../routes/rating_billing/rbi_routes";
import { useLocation, useNavigate } from "react-router-dom";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import BreadCrumb from "../../../../../components/BreadCrumb";
import { Alert, Form, Spin, Tooltip, Tabs } from "antd";
import { useDispatch, useSelector } from "react-redux";
import ButtonComponent from "../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../assets/Icon/index";
import { LeftOutlined, WarningOutlined } from "@ant-design/icons";
import {
  addDeletedData,
  addUpdatedData,
  getApprovalHierarchy,
  getDetailBatch,
  getDownloadFailed,
  getListApprovalById,
  updateSingleUsage,
  deleteSingleUsage,
} from "../../../../../redux/slices/rating_billing_invoice/monitoring_usage";
import CardContainer from "../../../../../components/CardContainer";
import BaseContainer from "../../../../../components/BaseContainer";
import DetailText from "../../../../../components/DetailText";
import { dateFormatting, hasValue, toTitleCase } from "../../../../../utils";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import { useMonitoringList } from "../useMonirotingList";
import ModalUpdateUsage from "../ModalUpdateUsage";
import moment from "moment";
import ConfirmationUsage from "../ConfirmationUsage";
import { ModalConfirm } from "../../../../../components/Modal/ModalPopUp";
import TableRBI from "../../../../../components/TableRBI";
import { applyFixedColumns } from "../../../../../utils/applyFixedColumns";
import StatusComponent from "../../../../../components/StatusComponent";

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
      item?.dataIndex !== "serviceType" &&
      item?.dataIndex !== "ratingCode" &&
      item?.dataIndex !== "fileSource" &&
      item?.dataIndex !== "creationDate"
  );

  // use state
  const [tabHeader, setTabHeader] = useState("Upload");
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
  const [fixedColumns, setFixedColumns] = useState(() => ({
    left: ["no"],
    right: ["status", "action"],
  }));

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
    [form]
  );

  // use effect
  useEffect(() => {
    if (location?.state?.id) {
      dispatch(
        getDetailBatch({ batchId: location?.state?.id, page, pageSize })
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
    tabHeader,
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
    try {
      // Prepare request body sesuai format backend
      const requestBody = {
        accountNumber: formValue?.accountNumber || null,
        accountName: formValue?.accountName || null,
        costCenter: formValue?.costCenter || null,
        billingPeriod:
          formValue?.billingPeriod || null,
        assetSerialNum: formValue?.assetSerialNum || null,
        assetType: formValue?.assetType || null,
        fdate:
          formValue?.fdate === false
            ? null
            : moment(formValue?.fdate).format(dateFormatting.dateFormal),
        fhour: hasValue(formValue?.fhour)
          ? moment(formValue?.fhour).format(dateFormatting.fhour)
          : null,
        measDate:
          formValue?.measDate || null ,
        streamId: formValue?.streamId || null,
        temperature: formValue?.temperature || null,
        pressure: formValue?.pressure || null,
        correctionFactor: formValue?.correctionFactor || null,
        calorie: formValue?.calorie || null,
        beginStand: formValue?.beginStand || null,
        endStand: formValue?.endStand || null,
        volMeasured27: formValue?.volMeasured27 || null,
        volMeasured60: formValue?.volMeasured60 || null,
        engMeasured: formValue?.engMeasured || null,
        ghv: formValue?.ghv || null,
        volMscf: formValue?.volMscf || null,
        uncorrectedValue: formValue?.uncorrectedValue || null,
        taxationRowId: formValue?.taxationRowId || null,
        source: formValue?.source || null,
        description: formValue?.description || null,
      };

      // Dispatch update ke API
      const resultAction = await dispatch(
        updateSingleUsage({
          recordId: recordId,
          data: requestBody,
        })
      );

      if (updateSingleUsage.fulfilled.match(resultAction)) {
        // Update local state setelah API berhasil
        const newDataTable = [...dataTable];
        const index = newDataTable.findIndex(
          (item) => recordId === item.recordId
        );

        if (index !== -1) {
          const item = newDataTable[index];
          const updatedRow = {
            ...item,
            ...formValue,
            billingPeriod: requestBody.billingPeriod,
            fdate: requestBody.fdate,
            fhour: requestBody.fhour,
            measDate: requestBody.measDate,
            status: "SUCCESS",
            recordId: recordId,
          };
          newDataTable.splice(index, 1, updatedRow);
          setDataTable(newDataTable);
        }

        setOpenUpdateUsage(false);

        // Refresh data dari server
        dispatch(
          getDetailBatch({ batchId: location?.state?.id, page, pageSize })
        );
      }
    } catch (error) {
      console.error("Error updating usage:", error);
    }
  };

  // change tabs
  const changeTab = (key) => {
    setTabHeader(key);
  };

  // handle back page
  const handleBack = () => {
    navigate(-1);
  };

  // handle cancel update usage
  const handleCancel = () => setOpenUpdateUsage(false);

  // handle clear
  const handleClear = () => {};

  // handle delete usage list
  const handleDeleteOk = async () => {
    try {
      const resultAction = await dispatch(deleteSingleUsage(recordId));

      if (deleteSingleUsage.fulfilled.match(resultAction)) {
        // Update local state setelah API berhasil
        const newData = dataTable.filter((item) => item.recordId !== recordId);
        setDataTable(newData);
        setModalDelete(false);

        // Refresh data dari server
        dispatch(
          getDetailBatch({ batchId: location?.state?.id, page, pageSize })
        );
      }
    } catch (error) {
      console.error("Error deleting usage:", error);
      setModalDelete(false);
    }
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
      breadcrumbName: "Batch List Detail",
    },
  ];

  // column action
  const actionColumns = [
    {
      key: "action",
      title: "ACTION",
      dataIndex: "accountId",
      align: "center",
      width: 100,
      render: (id, record, index) => {
        const isComplete =
          detail_batch?.batchInformation?.status === "COMPLETE";
        return (
          <div className="flex w-full justify-center gap-3">
            <Tooltip title="Update">
              {!isComplete ? (
                <SVGIcon
                  name="IconEdit"
                  width={20}
                  onClick={() => handleUpdate(record)}
                />
              ) : (
                <SVGIcon
                  name="IconEdit"
                  width={20}
                  color={"#C0BEC6"}
                  className={"cursor-not-allowed"}
                />
              )}
            </Tooltip>
            <Tooltip title="Delete">
              {!isComplete ? (
                <SVGIcon
                  name="IconDelete"
                  width={20}
                  onClick={() => {
                    setModalDelete(true);
                    setDeletedRecord(record);
                    setRecordId(record?.recordId);
                  }}
                />
              ) : (
                <SVGIcon
                  name="IconDelete"
                  width={20}
                  color={"#C0BEC6"}
                  className={"cursor-not-allowed"}
                />
              )}
            </Tooltip>
          </div>
        );
      },
    },
  ];

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

  // All columns with keys
  const allColumns = useMemo(() => {
    const columnsWithKeys = [...filteredColumns, ...actionColumns].map(
      (col) => ({
        ...col,
        key: col.key || col.dataIndex || col.title,
        width: col.width || 150,
      })
    );
    return columnsWithKeys;
  }, [filteredColumns, actionColumns]);

  const processedColumns = useMemo(() => {
    return applyFixedColumns(allColumns, fixedColumns);
  }, [allColumns, fixedColumns]);

  const columnDefinitions = useMemo(() => {
    return allColumns.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [allColumns]);

  return (
    <LayoutMenu>
      <BreadCrumb routes={routes} />
      <Spin spinning={loading}>
        <Form layout="vertical" form={form} onFinish={handleSave}>
          <CardContainer
            header={
              <div className="flex justify-between items-center -my-4">
                <p className="mt-[15px] font-bold text-primary">
                  BATCH LIST DETAIL
                </p>
              </div>
            }
          >
            <Tabs
              activeKey={tabHeader}
              onChange={changeTab}
              type="line"
              size="small"
              className="tabs-compact"
              style={{ marginBottom: 0 }}
            >
              <Tabs.TabPane tab="Upload" key="Upload">
                <BaseContainer header={"Batch List"} className="-mt-4">
                  {/* Two Column Layout */}
                  <div className="grid grid-cols-5 gap-x-8 gap-y-4">
                    <DetailText label="Batch ID">
                      {detail_batch?.batchInformation?.batchId}
                    </DetailText>
                    <DetailText label="Upload Type">
                      {detail_batch?.batchInformation?.uploadType}
                    </DetailText>

                    <DetailText label="Upload Date">
                      {detail_batch?.batchInformation?.uploadDate}
                    </DetailText>
                    <DetailText label="Total Usage">
                      {detail_batch?.batchInformation?.totalUsage}
                    </DetailText>
                    <DetailText label="Total Succeed">
                      {detail_batch?.batchInformation?.totalSucceed}
                    </DetailText>

                    <DetailText label="Total Progress">
                      {detail_batch?.batchInformation?.totalProgress}
                    </DetailText>
                    <DetailText label="Total Failed">
                      {detail_batch?.batchInformation?.totalFailed}
                    </DetailText>
                    {/* <DetailText label="Generate Date">
                      {detail_batch?.batchInformation?.generateDate}
                    </DetailText> */}
                    <DetailText label="Status">
                      <StatusComponent
                        colour={detail_batch?.batchInformation?.status}
                      >
                        {detail_batch?.batchInformation?.status}
                      </StatusComponent>
                    </DetailText>
                  </div>
                </BaseContainer>

                <BaseContainer
                  header={"History Log Information"}
                  className="mt-1"
                >
                  <div className="grid grid-cols-5 gap-x-8 gap-y-4">
                    <DetailText label="Record ID">
                      {detail_batch?.batchInformation?.batchId}
                    </DetailText>
                    <DetailText label="Created Date">
                      {detail_batch?.batchInformation?.uploadDate}
                    </DetailText>
                    <DetailText label="Created By">
                      {detail_batch?.batchInformation?.uploadBy}
                    </DetailText>
                    <DetailText label="Updated Date">
                      {/* Tambahkan field updated date jika tersedia dari API */}
                      {detail_batch?.batchInformation?.updatedDate}
                    </DetailText>
                    <DetailText label="Updated By">
                      {/* Tambahkan field updated by jika tersedia dari API */}
                      {detail_batch?.batchInformation?.updatedBy}
                    </DetailText>
                  </div>
                </BaseContainer>

                <BaseContainer header={"Usage List"} className="mt-1">
                  <div className="my-5">
                    <TableRBI
                      dataSource={dataTable}
                      columns={processedColumns}
                      current={page}
                      pageSize={pageSize}
                      onChange={handleChangePage}
                      onSizeChanger={handleChangePage}
                      totalData={dataTable?.length || 0}
                      tableScrolled={{ x: 7000, y: 525 }}
                      columnDefinitions={columnDefinitions}
                      fixedColumns={fixedColumns}
                      setFixedColumns={setFixedColumns}
                      loading={loading}
                    />
                  </div>
                </BaseContainer>
              </Tabs.TabPane>

              <Tabs.TabPane tab="Approval" key="Approval">
                {/* Approval Tab - Sesuai Desain Figma */}
                <div className="bg-white mt-1">
                  <ApprovalComponentGeneral
                    dataTable={appHierDataDetail}
                    dataOption={appHierOptions}
                    selectedHierarchy={selectedHierarchy}
                    updateSelectedHierarchy={setSelectedHierarchy}
                  />
                </div>
              </Tabs.TabPane>
            </Tabs>
          </CardContainer>

          {/* Action Buttons */}
          <div className="w-full flex mt-5">
            <div className="w-full justify-start">
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
              <div className="w-full flex justify-end gap-5">
                <Form.Item>
                  <ButtonComponent
                    icon={<SVGIcon name={`IconButtonClear`} width={24} />}
                    type="submit"
                    onClick={handleClear}
                  >
                    Clear
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
            <p className="text-[18px] font-bold">
              Are you sure want to delete it?
            </p>
          </div>
          <Alert
            message="Warning! if you delete this data, it will be permanently."
            type={"error"}
          />
        </ModalConfirm>

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
      </Spin>
    </LayoutMenu>
  );
};

export default DetailMonitoringUsage;
