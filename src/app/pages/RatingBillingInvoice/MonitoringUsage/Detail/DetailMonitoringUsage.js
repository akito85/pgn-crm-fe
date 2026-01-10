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
import { showModalError } from "../../../../../redux/slices/general_slice";
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
  const [loadMoreSize] = useState(20);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showBackWarning, setShowBackWarning] = useState(false);
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

  // Initial fetch with larger page size
  useEffect(() => {
    if (location?.state?.id) {
      dispatch(
        getDetailBatch({
          batchId: location?.state?.id,
          page: 1,
          pageSize: 100,
        })
      );
      dispatch(getApprovalHierarchy({ page: 1, pageSize: 100 }));
      setPage(1);
    }
  }, [location, dispatch]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  useEffect(() => {
    if (
      detail_batch &&
      detail_batch?.batchInformation?.batchId === location?.state?.id
    ) {
      assert(detail_batch);
      setDataTable(detail_batch?.usageList?.result || []);
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
    tabHeader,
    dispatch,
    list_approval,
    selectedHierarchy,
  ]);

  // Load more handler
  const handleLoadMore = async () => {
    const nextPage = page + 1;
    const totalPages = detail_batch?.usageList?.page?.totalPages || 0;

    if (nextPage <= totalPages && location?.state?.id) {
      await dispatch(
        getDetailBatch({
          batchId: location?.state?.id,
          page: nextPage,
          pageSize: loadMoreSize,
        })
      );
      setPage(nextPage);
    }
  };

  // Calculate if there's more data
  const totalElements = detail_batch?.usageList?.page?.totalElements || 0;
  const hasMore = dataTable.length < totalElements;

  // handle update row
  const handleUpdate = (record, values) => {
    setSelectedRecord(record);
    setRecordId(record?.recordId);
    setOpenUpdateUsage(true);
  };

  // handle save
  const handleSave = (formValue) => {
    if (!selectedHierarchy || !hasValue(selectedHierarchy)) {
      const errorBody = {
        title: "Validation Error",
        description:
          "Please select an Approval Hierarchy in the Approval tab before saving or submitting.",
      };
      dispatch(showModalError(errorBody));
      setTabHeader("Approval");
      return;
    }

    setBody({
      ...detail_batch,
      usageList: dataTable,
      isSubmit: flag === 1 ? false : true,
    });
    setOpenConfirmation(true);
  };

  const handleSaveUpdateUsage = async (formValue) => {
  try {
    // Helper function untuk convert string dengan thousand separator ke number
    const parseNumericValue = (value) => {
      if (value === null || value === undefined || value === '') return null;
      if (typeof value === 'number') return value;
      // Remove thousand separator dan convert ke number
      if (typeof value === 'string') {
        const cleaned = value.replace(/,/g, '');
        const parsed = parseFloat(cleaned);
        return isNaN(parsed) ? null : parsed;
      }
      return null;
    };

    const requestBody = {
      accountNumber: formValue?.accountNumber || null,
      accountName: formValue?.accountName || null,
      costCenter: formValue?.costCenter || null,
      assetSerialNum: formValue?.assetSerialNum || null,
      assetType: formValue?.assetType || null,
      fdate:
        formValue?.fdate === false
          ? null
          : moment(formValue?.fdate).format(dateFormatting.dateFormal),
      fhour: hasValue(formValue?.fhour)
        ? moment(formValue?.fhour).format(dateFormatting.fhour)
        : null,
      measDate: formValue?.measDate 
        ? moment(formValue?.measDate).toISOString() 
        : null,
      streamId: parseNumericValue(formValue?.streamId),
      temperature: parseNumericValue(formValue?.temperature),
      pressure: parseNumericValue(formValue?.pressure),
      correctionFactor: parseNumericValue(formValue?.correctionFactor),
      calorie: parseNumericValue(formValue?.calorie),
      beginStand: parseNumericValue(formValue?.beginStand),
      endStand: parseNumericValue(formValue?.endStand),
      volMeasured27: parseNumericValue(formValue?.volMeasured27),
      volMeasured60: parseNumericValue(formValue?.volMeasured60),
      engMeasured: parseNumericValue(formValue?.engMeasured),
      ghv: parseNumericValue(formValue?.ghv),
      volMscf: parseNumericValue(formValue?.volMscf),
      uncorrectedValue: parseNumericValue(formValue?.uncorrectedValue),
      sourceRowId: parseNumericValue(formValue?.sourceRowId),
      sourceName: formValue?.sourceName || null,
      source: formValue?.source || null,
      description: formValue?.description || null,
    };

    console.log('Request Body:', requestBody); // Debug log

    const resultAction = await dispatch(
      updateSingleUsage({
        recordId: recordId,
        data: requestBody,
        batchId: location?.state?.id,
      })
    );

    if (updateSingleUsage.fulfilled.match(resultAction)) {
      const newDataTable = [...dataTable];
      const index = newDataTable.findIndex(
        (item) => recordId === item.recordId
      );

      if (index !== -1) {
        const item = newDataTable[index];
        const updatedRow = {
          ...item,
          ...formValue,
          fdate: requestBody.fdate,
          fhour: requestBody.fhour,
          measDate: requestBody.measDate,
          streamId: requestBody.streamId,
          temperature: requestBody.temperature,
          pressure: requestBody.pressure,
          correctionFactor: requestBody.correctionFactor,
          calorie: requestBody.calorie,
          beginStand: requestBody.beginStand,
          endStand: requestBody.endStand,
          volMeasured27: requestBody.volMeasured27,
          volMeasured60: requestBody.volMeasured60,
          engMeasured: requestBody.engMeasured,
          ghv: requestBody.ghv,
          volMscf: requestBody.volMscf,
          uncorrectedValue: requestBody.uncorrectedValue,
          sourceRowId: requestBody.sourceRowId,
          status: "SUCCESS",
          recordId: recordId,
        };
        newDataTable.splice(index, 1, updatedRow);
        setDataTable(newDataTable);
      }

      setOpenUpdateUsage(false);

      // Refresh data from server
      dispatch(
        getDetailBatch({
          batchId: location?.state?.id,
          page: 1,
          pageSize: page * loadMoreSize,
        })
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
    if (hasUnsavedChanges) {
      setShowBackWarning(true);
    } else {
      navigate(-1);
    }
  };

  const handleConfirmLeave = () => {
    setShowBackWarning(false);
    setHasUnsavedChanges(false);
    navigate(-1);
  };

  // handle cancel update usage
  const handleCancel = () => setOpenUpdateUsage(false);

  // handle clear
  const handleClear = () => {
    form.setFieldsValue({
      apphierId: undefined,
    });

    setSelectedHierarchy(null);
    setAppHierDataDetail([]);
  };

  // handle delete usage list
  const handleDeleteOk = () => {
    const newData = dataTable.filter((item) => item.recordId !== recordId);
    setDataTable(newData);
    dispatch(addDeletedData(deletedRecord));
    setModalDelete(false);
    setHasUnsavedChanges(true);
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
                <div className="cursor-not-allowed inline-block">
                  <SVGIcon
                    name="IconDelete"
                    width={20}
                    color={"#C0BEC6"}
                    style={{ pointerEvents: "none" }}
                  />
                </div>
              )}
            </Tooltip>
          </div>
        );
      },
    },
  ];

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
              <Tabs.TabPane
                tab="Upload"
                key="Upload"
                className="flex flex-col gap-3"
              >
                <BaseContainer header={"Batch List"} border className="-mt-4">
                  {/* Two Column Layout */}
                  <div className="grid grid-cols-5 gap-x-8 gap-y-0">
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
                    <DetailText label="Status">
                      <StatusComponent
                        colour={detail_batch?.batchInformation?.status}
                      >
                        {detail_batch?.batchInformation?.status}
                      </StatusComponent>
                    </DetailText>
                  </div>
                </BaseContainer>

                <BaseContainer header={"Usage List"} border className="mt-1">
                  <div className="my-5">
                    <TableRBI
                      idTable="monitoring-usage-detail-table"
                      dataSource={dataTable}
                      columns={processedColumns}
                      totalData={totalElements}
                      tableScrolled={{ x: 7000, y: 525 }}
                      showExport={false}
                      columnDefinitions={columnDefinitions}
                      fixedColumns={fixedColumns}
                      setFixedColumns={setFixedColumns}
                      loading={loading}
                      usePagination={false}
                      useInfiniteScroll={true}
                      onLoadMore={handleLoadMore}
                      hasMore={hasMore}
                      loadMoreThreshold={20}
                    />
                  </div>
                </BaseContainer>
                <BaseContainer
                  header={"History Log Information"}
                  className="mt-1"
                  border
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
                      {detail_batch?.batchInformation?.updatedDate}
                    </DetailText>
                    <DetailText label="Updated By">
                      {detail_batch?.batchInformation?.updatedBy}
                    </DetailText>
                  </div>
                </BaseContainer>
              </Tabs.TabPane>

              <Tabs.TabPane tab="Approval" key="Approval">
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
              Are you sure you want to delete this record?
            </p>
          </div>
          <Alert
            message="Remember to save your changes! This deletion will only take effect after you click 'Save & Submit' or 'Save as Draft'."
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
          onSaveSuccess={() => setHasUnsavedChanges(false)}
        />

        <ModalConfirm
          isOpen={showBackWarning}
          handleCancel={() => setShowBackWarning(false)}
          handleOk={handleConfirmLeave}
          width={500}
          useOk={true}
        >
          <div className="flex justify-center gap-[20px] mt-6">
            <WarningOutlined style={{ fontSize: "24px", color: "#BE3036" }} />
            <p className="text-[18px] font-bold">You have unsaved changes!</p>
          </div>
          <Alert
            message="This change has not been saved yet. If you leave or continue without saving, all activities in this draft will be lost."
            type="error"
          />
        </ModalConfirm>

      </Spin>
    </LayoutMenu>
  );
};

export default DetailMonitoringUsage;
