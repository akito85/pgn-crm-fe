import {
  ExclamationCircleOutlined,
  FilterOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { Alert, DatePicker, Form, Input, Steps, Tooltip } from "antd";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { useDispatch, useSelector } from "react-redux";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import InputComponent from "../../../../../../components/InputComponent";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import StatusComponent from "../../../../../../components/StatusComponent";
import TablePagination from "../../../../../../components/TablePagination";
import receiptCollectionHttpService from "../../../../../../redux/services/receiptCollectionHttpService";
import {
  showModalError,
  showModalSuccess,
} from "../../../../../../redux/slices/general_slice";
import {
  approveOrRejectStatment,
  getAllApprovalList,
  getListApprovalById,
  getListCategory,
  getTableReverse,
  getTableReverseSelect,
  requestApprove,
  requestModal,
} from "../../../../../../redux/slices/receipt_collection/electrionicBank";
import { dateFormatting, formMessageRequired } from "../../../../../../utils";
import {
  getColumnSearchProps,
  getColumnSearchPropsPaging,
} from "../../../../../../utils/getColumnSearchProps";
import ApprovalSectionForm from "../../../../ProductAndPromo/Pricing/Form/ApprovalSectionForm";
import AttachmentSectionForm from "../../../../ProductAndPromo/Pricing/Form/AttachmentSectionForm";
import ContentModalConfirmReverse from "../ContentModalConfirmReverse";
import TableReverseFE from "./TableReverseFE";
import TablePaginationNew from "../../../../../../components/TablePaginationNew";
import { configApp } from "../../../../../../constants/configApp";
import AttachmentComponent from "../../../../../../components/Attachment/AttachmentComponent";
import { columnsReverseTab } from "./ColumnReverseTab";

const DetailRevers = (props) => {
  const { data, loading, id, isApprover } = props;

  // Declaration
  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const {
    data_reverse,
    dataListAppHierId,
    dataListAppHierDetail,
    data_reverse_select,
  } = useSelector((state) => state.electronic);
  // State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [search, setSearch] = useState({});
  const [sort, setSort] = useState("");
  const [current, setCurrent] = useState(0);
  const containerRef = useRef(null);
  const [form] = Form.useForm();
  const formValue = form.getFieldsValue();
  const [appHierOptions, setAppHierOptions] = useState([]);
  const [appHierDataDetail, setAppHierDataDetail] = useState([]);
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [listDataAttachmentApprove, setListDataAttachmentApprove] = useState(
    [],
  );

  const [tableDatas, setTableDatas] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [dataTable, setDataTable] = useState([]);
  const [boolean, setBoolean] = useState(false);
  const [modalRequest, setModalRequest] = useState(false);
  const [tableForceSelected, setTableForceSelected] = useState([]);
  const [forceObj, setForceObj] = useState({});
  const [keyTableForceSelected, setKeyTableForceSelected] = useState([]);
  const [loadingForm, setLoadingForm] = useState(false);
  const [modalApproval, setModalApproval] = useState(false);
  const [approveOrReject, setApproveOrReject] = useState("");
  const [showModal, setShowModal] = useState(false);

  //useEffect + search
  useEffect(() => {
    // let tempSearch = "";
    // for (const dataIndex in search) {
    //   if (Object.hasOwnProperty.call(search, dataIndex)) {
    //     const tempSearchText = search[dataIndex];
    //     if (tempSearchText) {
    //       tempSearch += `${dataIndex}~${tempSearchText},`;
    //     }
    //   }
    // }
    // tempSearch = tempSearch ? tempSearch.slice(0, -1) : "";
    dispatch(
      getTableReverse({
        search: encodeURIComponent(JSON.stringify(search)),
        page,
        pageSize,
        sort,
        id,
      }),
    );
  }, [search, page, pageSize, sort, dispatch, id]);

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
    dispatch(getTableReverseSelect({ id, boolean: showModal, page, pageSize }));
  }, [id, showModal, page, pageSize]);

  // use effect
  useEffect(() => {
    dispatch(getAllApprovalList());
  }, []);

  useEffect(() => {
    if (forceObj.approvalHierarchy) {
      dispatch(getListApprovalById(forceObj.approvalHierarchy));
    }
  }, [forceObj]);
  useEffect(() => {
    if (dataListAppHierId && dataListAppHierId.length > 0) {
      const tempAppHier = dataListAppHierId.map((appHier) => ({
        name: appHier.approvalName,
        value: appHier.appHierId,
      }));
      setAppHierOptions(tempAppHier);
    }
  }, [dataListAppHierId]);
  useEffect(() => {
    if (dataListAppHierDetail && dataListAppHierDetail.length > 0) {
      const data = dataListAppHierDetail.map((a, index) => ({
        ...a,
        key: index + 1,
        employeeDetail: a.employeeDetail.map((b, index) => ({
          ...b,
          key: index + 1,
        })),
      }));
      setAppHierDataDetail(data);
    } else {
      setAppHierDataDetail([]);
    }
  }, [dataListAppHierDetail]);

  const matchedObjectsCriteria = data_reverse_select?.filter((obj) =>
    keyTableForceSelected.includes(obj.receiptReconcileId),
  );

  // const combineAttachment = matchedObjectsCriteria?.map(
  //   (b) => b.attachmentDtoList
  // )[0];

  const combineAttachment = matchedObjectsCriteria?.flatMap(
    (obj) => obj.attachmentDtoList || [],
  );

  //attachment untuk approve use effect nya
  useEffect(() => {
    const dataAttachment = (combineAttachment || []).map((item) => {
      return {
        id: item.id,
        size: item.size,
        fileName: item.fileName,
        fileSize: item.fileSize,
        fileType: item.fileType,
        fileCategoryId: item.fileCategoryId,
        fileCategoryName: item.fileCategoryName,
        pathFile: item.pathFile,
        urlFile1: item.urlFile1,
        urlFile2: item.urlFile2,
        createdBy: item.createdBy,
        createdDate: item.createdDate
          ? moment(item.createdDate).format("DD MMM YYYY")
          : "",
        dataType: "exist",
      };
    });
    setListDataAttachmentApprove(dataAttachment);
  }, [keyTableForceSelected, modalApproval]);

  const next = () => {
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };
  const tabData = [
    { value: "Reverse" },
    { value: "Approval" },
    { value: "Attachment" },
  ];

  const scrollRightHandler = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft += 250;
    }
  };
  const scrollLeftHandler = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft -= 250;
    }
  };
  const handleButtonPrev = () => {
    prev();
    scrollLeftHandler();
  };
  const handleButtonNext = () => {
    next();
    scrollRightHandler();
  };

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

  const rowSelectionRequest = {
    fixed: true,
    type: "checkbox",
    preserveSelectedRowKeys: true,
    selectedRowKeys: keyTableForceSelected,
    onChange: (selectedRowKeys, selectedRows) => {
      setTableForceSelected(selectedRows);
      setKeyTableForceSelected(selectedRowKeys);
    },
    getCheckboxProps: (record) => ({
      disabled:
        record.statusApproval === "Waiting Approval" ||
        record?.statusApproval === "Approved",
    }),
  };

  const rowSelectionApproval = {
    fixed: true,
    type: "checkbox",
    preserveSelectedRowKeys: true,
    selectedRowKeys: keyTableForceSelected,
    onChange: (selectedRowKeys, selectedRows) => {
      setTableForceSelected(selectedRows);
      setKeyTableForceSelected(selectedRowKeys);
    },
    getCheckboxProps: (record) => ({
      disabled:
        record.statusApproval === "-" || record.statusApproval === "Approved",
    }),
  };

  const handleForceObj = (e, type) => {
    let result;
    switch (type) {
      case "remark":
        result = e.target.value;
        break;
      default:
        result = e;
        break;
    }
    setForceObj((prevState) => ({
      ...prevState,
      [type]: result,
    }));
    return result;
  };

  const mappingData = (data = []) => {
    return data?.map((item) => ({
      ...item,
      key: item?.receiptReconcileId,
    }));
  };

  const handleClear = () => {
    setModalRequest(false);
    setListDataAttachment([]);
    form.resetFields();
    setForceObj({});
    setCurrent(0);
    setKeyTableForceSelected([]);
  };

  const handleClearApprove = () => {
    setModalApproval(false);
    setListDataAttachment([]);
    form.resetFields();
    setForceObj({});
    setCurrent(0);
    setKeyTableForceSelected([]);
  };

  const handleSave = () => {
    const successMessageCreate = {
      title: "Successfull",
      description: `Your data has been submitted`,
      return: false,
    };
    const body = {
      dtoList: keyTableForceSelected.map((item, index) => ({
        id: item,
        accountNumber: "",
      })),
      remark: forceObj?.remark,
      appHierId: forceObj?.approvalHierarchy,
      type: "REVERSE",
    };
    dispatch(requestModal(body))
      .unwrap()
      .then(async (dataRequest) => {
        setLoadingForm(true);
        for (let index = 0; index < dataRequest.length; index++) {
          const elements = dataRequest[index];

          for (let icon = 0; icon < listDataAttachment.length; icon++) {
            const element = listDataAttachment[icon];
            const body = {
              files: element.file,
              fileCategoryId: element.fileCategoryId,
              category: "REVERSE",
              // referensiId: idForce,
            };
            const response = await receiptCollectionHttpService.uploadImage(
              `/v1/dbs/api/receipt/upload-attachment/${elements}`,
              body,
            );
          }
        }
        setLoadingForm(false);
        handleClear();
        dispatch(showModalSuccess(successMessageCreate));
        dispatch(
          getTableReverse({
            id,
            page,
            pageSize,
            sort,
            search: encodeURIComponent(JSON.stringify(search)),
          }),
        );
        dispatch(
          getTableReverseSelect({ id, boolean: showModal, page, pageSize }),
        );
      })
      .catch((error) => {
        if (Math.floor((error.response.data.code || 0) / 100) === 5) {
          const message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          dispatch(showModalError(message));
        }
      });
  };

  const handleSaveApprove = () => {
    const messageSukses = {
      title: "Successfull",
      description: `your data has been ${
        approveOrReject === "approve" ? "approved" : "rejected"
      }`,
      return: false,
    };

    const tempData = (data_reverse_select || [])
      .filter((data) =>
        keyTableForceSelected.includes(data?.receiptReconcileId),
      )
      ?.map((item) => {
        const dataApprov = {
          id: item?.receiptReconcileId,
          approvalId: item?.tapprovalDto?.tAppId,
        };
        return dataApprov;
      });
    const body = {
      action: approveOrReject.toUpperCase(),
      remark: forceObj?.remark,
      receiptReconcileDtoList: tempData,
      type: "REVERSE",
    };
    dispatch(requestApprove(body))
      .unwrap()
      .then(async (dataApprove) => {
        setLoadingForm(true);
        for (let index = 0; index < dataApprove.length; index++) {
          const elements = dataApprove[index];

          for (let icon = 0; icon < listDataAttachment.length; icon++) {
            const element = listDataAttachment[icon];
            const body = {
              files: element.file,
              fileCategoryId: element.fileCategoryId,
              category: "REVERSE",
              // referensiId: idForce,
            };
            const response = await receiptCollectionHttpService.uploadImage(
              `/v1/dbs/api/receipt/upload-attachment/${elements}`,
              body,
            );
          }
        }
        setLoadingForm(false);
        handleClearApprove();
        dispatch(showModalSuccess(messageSukses));
        setModalApproval(false);
        dispatch(
          getTableReverse({
            id,
            page,
            pageSize,
            sort,
            search: encodeURIComponent(JSON.stringify(search)),
          }),
        );
      })
      .catch((error) => {
        if (Math.floor((error.response.data.code || 0) / 100) === 5) {
          const message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          dispatch(showModalError(message));
        }
      });
  };

  const steps = () => {
    if (showModal === true) {
      let temp = [
        {
          title: "Reverse Information",
          content: (
            <>
              <p className="text-primary text-xl font-semibold uppercase py-[20px] gap-5">
                RECEIPT ON BANK STATEMENT
              </p>
              <div className="my-5">
                {/* <TablePagination
                  dataSource={mappingData(data_reverse_select)}
                  columns={columns}
                  current={page}
                  pageSize={pageSize}
                  totalData={data_reverse_select.length}
                  tableScrolled={{
                    x: 2500,
                    y: 525,
                  }}
                  rowSelection={rowSelection}
                  onChange={handleChange}
                  onShowSizeChange={handleChange}
                  onSort={onSort}
                /> */}
                <TableReverseFE
                  data={mappingData(data_reverse_select)}
                  key={"1-approval"}
                  rowSelection={rowSelectionApproval}
                  type={1}
                  page={page}
                  pageSize={pageSize}
                  setPage={setPage}
                  setPageSize={setPageSize}
                  searchedColumn={searchedColumn}
                  setSearchedColumn={setSearchedColumn}
                  searchText={searchText}
                  setSearchText={setSearchText}
                />
              </div>
            </>
          ),
          disabled: tableForceSelected.length === 0,
        },
        {
          title: "Attachment Information",
          content: (
            <div className="my-5 gap-5">
              <AttachmentComponent
                data={listDataAttachmentApprove}
                updateData={setListDataAttachmentApprove}
                typeSelector="electronic"
                service={receiptCollectionHttpService}
                configApplication={configApp.PAYMENT_SERVICE}
                type={"detail"}
              />
            </div>
          ),
          disabled: listDataAttachment.length === 0,
        },
        {
          title: "Confirmation",
          content: (
            <div className="my-5 gap-5">
              <TableReverseFE
                data={tableForceSelected}
                key={"3-approve"}
                rowSelection={rowSelectionRequest}
                type={3}
                page={page}
                pageSize={pageSize}
                setPage={setPage}
                setPageSize={setPageSize}
                searchedColumn={searchedColumn}
                setSearchedColumn={setSearchedColumn}
                searchText={searchText}
                setSearchText={setSearchText}
              />
              <div className="w-full my-5 gap-5">
                <Alert
                  icon={
                    <ExclamationCircleOutlined
                      style={{ fontSize: "20px", color: "#65481C" }}
                    />
                  }
                  message={`Are you sure want to ${approveOrReject} these Receipt?`}
                  type={"warning"}
                  showIcon
                />
              </div>
              <div className={"mt-4"}>
                <Form.Item
                  label={"Remark"}
                  name={"remark"}
                  rules={formMessageRequired("Remark")}
                  getValueFromEvent={(e) => handleForceObj(e, "remark")}
                >
                  <InputComponent rows={5} type="textarea" />
                </Form.Item>
              </div>
            </div>
          ),
          disabled: !forceObj.remark,
        },
      ];
      return temp;
    }
    let temp = [
      {
        title: "Reverse Information",
        content: (
          <>
            <p className="text-primary text-xl font-semibold uppercase py-[20px] gap-5">
              RECEIPT ON BANK STATEMENT
            </p>
            <div className="my-5">
              <TableReverseFE
                data={mappingData(data_reverse_select)}
                key={"1-request"}
                rowSelection={rowSelectionRequest}
                type={1}
                page={page}
                pageSize={pageSize}
                setPage={setPage}
                setPageSize={setPageSize}
                searchedColumn={searchedColumn}
                setSearchedColumn={setSearchedColumn}
                searchText={searchText}
                setSearchText={setSearchText}
              />
            </div>
            <div className={"mt-4"}>
              <Form.Item
                label={"Remark"}
                name={"remark"}
                rules={formMessageRequired("Remark")}
                getValueFromEvent={(e) => handleForceObj(e, "remark")}
              >
                <InputComponent rows={5} type="textarea" />
              </Form.Item>
            </div>
          </>
        ),
        disabled: !forceObj.remark || tableForceSelected.length === 0,
      },
      {
        title: "Approval Information",
        content: (
          <div className="my-5 gap-5">
            <ApprovalSectionForm
              dataTable={appHierDataDetail}
              dataOption={appHierOptions}
              selectedHierarchy={forceObj.approvalHierarchy}
              updateSelectedHierarchy={(e) =>
                handleForceObj(e, "approvalHierarchy")
              }
            />
          </div>
        ),
        disabled: !forceObj.approvalHierarchy,
      },
      {
        title: "Attachment Information",
        content: (
          <div className="my-5 gap-5">
            <AttachmentComponent
              // type={type}
              data={listDataAttachment}
              updateData={setListDataAttachment}
              typeSelector="electronic"
              dispatch={dispatch}
              getAPICategory={getListCategory}
              mandatory={true}
              service={receiptCollectionHttpService}
              configApplication={configApp.PAYMENT_SERVICE}
              typeRBI={"data"}
            />
          </div>
        ),
        disabled:
          !forceObj.approvalHierarchy || listDataAttachment.length === 0,
      },
      {
        title: "Confirmation",
        content: (
          <div className="my-5 gap-5">
            <ContentModalConfirmReverse
              data={forceObj}
              tabData={tabData}
              pageSize={pageSize}
              columns={columnsReverseTab(
                page,
                pageSize,
                searchInput,
                searchedColumn,
                searchText,
                handleSearch,
              )}
              dataTable={tableForceSelected}
              listDataAttachment={listDataAttachment}
              listDataDetail={tableDatas}
              listDataAppHierDetail={appHierDataDetail}
              dataOption={appHierOptions}
              selectedHierarchy={forceObj.approvalHierarchy}
            />
          </div>
        ),
      },
    ];
    return temp;
  };

  return (
    <div className="my-5">
      <div className="w-full flex justify-end my-5 gap-5">
        <ButtonComponent
          //   icon={<SVGIcon name="IconButtonDownload" width={24} />}
          type="submit"
          onClick={() => {
            setModalRequest(true);
            setShowModal(false);
          }}
        >
          Request
        </ButtonComponent>
        {isApprover ? (
          <>
            <ButtonComponent
              type="submit"
              onClick={() => {
                setModalApproval(true);
                setShowModal(true);
              }}
            >
              Approval
            </ButtonComponent>
          </>
        ) : null}
      </div>
      {/* <TablePaginationNew
        dataSource={data?.result}
        totalData={data?.page?.totalElements || 0}
        columns={columnsReverseTab(
          page,
          pageSize,
          searchInput,
          searchedColumn,
          searchText,
          handleSearch
        )}
        current={page}
        pageSize={pageSize}
        onChange={handleChange}
        // onShowSizeChange={handleChange}
        onSizeChanger={handleChange}
        onSort={onSort}
        tableScrolled={{
          x: 2700,
          y: 300,
        }}
      /> */}
      <TableReverseFE
        data={data?.result}
        totalData={data?.page?.totalElements || 0}
        paging="BE"
        key={"4-view"}
        current={page}
        type={10}
        pageSize={pageSize}
        onChange={handleChange}
        // onShowSizeChange={handleChange}
        columns={"colReverseTab"}
        handleChangeBE={handleChange}
        handleSearchBE={handleSearch}
        onSortBE={onSort}
        page={page}
        setPage={setPage}
        setPageSize={setPageSize}
        searchedColumn={searchedColumn}
        setSearchedColumn={setSearchedColumn}
        searchText={searchText}
        setSearchText={setSearchText}
      />

      <ModalCustom
        isOpen={modalRequest}
        handleOk={handleSave}
        handleCancel={handleClear}
        header={"RECOMMENDATION REVERSE"}
        type={"confirmation"}
        width={1200}
        footer={
          <div className="flex justify-end gap-5">
            <ButtonComponent type={"default"} onClick={() => handleClear()}>
              Back
            </ButtonComponent>
            {current > 0 ? (
              <ButtonComponent
                type={"submit"}
                onClick={handleButtonPrev}
                icon={
                  <LeftOutlined
                    style={{
                      color: "#fff",
                      fontSize: 15, // Ubah ukuran ikon sesuai kebutuhan
                      marginRight: 10,
                    }}
                  />
                }
              >
                Previous
              </ButtonComponent>
            ) : null}

            {current < steps().length - 1 && (
              <ButtonComponent
                type={"submit"}
                onClick={handleButtonNext}
                disabled={steps()[current].disabled}
              >
                <div style={{ textAlign: "center" }}>
                  <span>Next</span>
                  <RightOutlined
                    style={{
                      color: "#fff",
                      fontSize: 15, // Ubah ukuran ikon sesuai kebutuhan
                      marginLeft: 10,
                    }}
                  />
                </div>
              </ButtonComponent>
            )}
            {current === steps().length - 1 && (
              <ButtonComponent
                type={"submit"}
                onClick={handleSave}
                htmlType={"submit"}
              >
                Confirm
              </ButtonComponent>
            )}
          </div>
        }
      >
        <div className="w-full gap-5">
          <div
            ref={containerRef}
            className="overflow-x-scroll scrollStepsCstm gap-5"
          >
            <Steps
              current={current}
              items={steps()}
              labelPlacement="vertical"
            />
          </div>
          <Form
            form={form}
            layout="vertical"
            className="mt-3"
            // onFinish={onFinish}
            // onFinishFailed={onFinishFailed}
          >
            {steps()[current].content}
          </Form>
        </div>
      </ModalCustom>

      <ModalCustom
        isOpen={modalApproval}
        handleOk={handleSaveApprove}
        handleCancel={handleClearApprove}
        header={"APPROVAL PAYMENT"}
        type={"confirmation"}
        width={1200}
        footer={
          current === 0 ? (
            <div className="flex mt-[30px] justify-between py-5">
              <ButtonComponent
                type={"submit"}
                onClick={() => handleClearApprove()}
                icon={
                  <LeftOutlined
                    style={{
                      color: "#fff",
                      fontSize: 24,
                      justifyItems: "center",
                    }}
                  />
                }
              >
                Back
              </ButtonComponent>

              <div className={"w-full flex justify-end gap-5"}>
                <ButtonComponent
                  type="reject"
                  onClick={() => {
                    handleButtonNext();
                    setApproveOrReject("reject");
                  }}
                  disabled={steps()[current].disabled}
                >
                  Reject
                </ButtonComponent>

                <ButtonComponent
                  type="approve"
                  onClick={() => {
                    handleButtonNext();
                    setApproveOrReject("approve");
                  }}
                  disabled={steps()[current].disabled}
                >
                  Approve
                </ButtonComponent>
              </div>
            </div>
          ) : current === 1 ? (
            <div className={"w-full flex justify-end gap-5"}>
              <ButtonComponent type="default" onClick={handleButtonPrev}>
                Back
              </ButtonComponent>
              <ButtonComponent
                type={"submit"}
                onClick={handleButtonNext}
                disabled={steps()[current].disabled}
              >
                <div style={{ textAlign: "center" }}>
                  <span>Next</span>
                  <RightOutlined
                    style={{
                      color: "#fff",
                      fontSize: 15,
                      marginLeft: 10,
                    }}
                  />
                </div>
              </ButtonComponent>
            </div>
          ) : (
            current === steps().length - 1 && (
              <div className={"w-full flex justify-end gap-5"}>
                <ButtonComponent
                  type={"default"}
                  onClick={handleClearApprove}
                  htmlType={"submit"}
                >
                  Cancel
                </ButtonComponent>

                <ButtonComponent
                  type={"submit"}
                  onClick={handleSaveApprove}
                  htmlType={"submit"}
                >
                  Confirm
                </ButtonComponent>
              </div>
            )
          )
        }
      >
        <div className="w-full gap-5">
          <div
            ref={containerRef}
            className="overflow-x-scroll scrollStepsCstm gap-5"
          >
            <Steps
              current={current}
              items={steps()}
              labelPlacement="vertical"
            />
          </div>
          <Form
            form={form}
            layout="vertical"
            className="mt-3"
            // onFinish={onFinish}
            // onFinishFailed={onFinishFailed}
          >
            {steps()[current].content}
          </Form>
        </div>
      </ModalCustom>
    </div>
  );
};

export default DetailRevers;
