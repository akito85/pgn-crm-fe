import React, { useRef, useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Steps, Form } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { ModalError } from "../../../../components/Modal/ModalPopUp";
import { IconModal } from "../../../../utils/Icon";
import {
  approveRejectData,
  getListApproval,
} from "../../../../redux/slices/rating_billing_invoice/monitoring_usage";
import { tableApproval } from "./Table/TableApproval";
import { formMessageRequired } from "../../../../utils";
import TableRBI from "../../../../components/TableRBI";
import { applyFixedColumns } from "../../../../utils/applyFixedColumns";
import SVGIcon from "../../../../assets/Icon/index";
import InputComponent from "../../../../components/InputComponent";
import ButtonComponent from "../../../../components/ButtonComponent";
import DetailText from "../../../../components/DetailText";
import ModalCustom from "../../../../components/Modal/ModalCustom";
import TableRBI from "../../../../components/TableRBI";

const ModalApprovalUsage = ({
  isOpen,
  handleCancel,
  dataUsage,
  handleListRefresh = () => {},
}) => {
  // Selector
  const { data_approval } = useSelector((state) => state.monitoring_usage);

  // Declaration
  const containerRef = useRef(null);
  const searchInput = useRef(null);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const dataApproval = data_approval?.result;

  // Use State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");

  const [current, setCurrent] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [remark, setRemark] = useState("");
  const [action, setAction] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dataTableSelect, setDataTableSelect] = useState([]);
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});

  const [fixedColumns, setFixedColumns] = useState(() => ({
    left: [],
    right: [],
  }));

  // Use Effect
  useEffect(() => {
    dispatch(getListApproval({ page, pageSize }));
  }, [dispatch, page, pageSize]);

  // Function Search API
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

  // Handle Change Page
  const handleChange = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  // Function onSort
  const onSort = (_, __, sorter) => {
    const dataSort =
      sorter && sorter.order !== undefined
        ? `${sorter.field}~${sorter.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const onSelectChange = (newSelectedRowKeys, newSelectedRow) => {
    setDataTableSelect(newSelectedRow);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    fixed: true,
    selectedRowKeys,
    onChange: onSelectChange,
  };

  // Base Columns dengan useMemo
  const baseColumns = useMemo(() => {
    return tableApproval(
      search,
      page,
      pageSize,
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    );
  }, [search, page, pageSize, searchedColumn, searchText]);

  // Processed Columns
  const processedColumns = useMemo(() => {
    return applyFixedColumns(baseColumns, fixedColumns);
  }, [baseColumns, fixedColumns]);

  // Column Definitions
  const columnDefinitions = useMemo(() => {
    return baseColumns.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [baseColumns]);

  // Step
  const steps = [
    {
      title: "USAGE INFORMATION",
      disabled: dataTableSelect.length === 0,
    },
    {
      title: "CONFIRMATION",
    },
  ];

  // Button Next
  const next = () => {
    setCurrent(current + 1);
  };

  // Button Previous
  const prev = () => {
    setCurrent(current - 1);
  };

  // Scroll Left Handler
  const scrollLeftHandler = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft -= 250;
    }
  };

  // Scroll Right Handler
  const scrollRightHandler = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft += 250;
    }
  };

  // Scroll Handler
  const handleScroll = () => {
    if (containerRef.current) {
      setScrollLeft(containerRef.current.scrollLeft);
    }
  };

  // Handle Next
  const handleButtonNext = () => {
    next();
    scrollRightHandler();
  };

  // Mapping Step
  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  // Handle Cancel Form
  const handleCancelForm = () => {
    handleCancel();
    setSelectedRowKeys([]);
    setDataTableSelect([]);
    setRemark("");
    form.resetFields();
  };

  // Handle Save for Modal Confirmation
  const handleSave = (formValue) => {
    if (current < steps.length - 1) {
      handleButtonNext();
    } else {
      handleCancel();
      const dataUsageCode = dataTableSelect.map((a) => {
        return {
          recordId: a.recordId,
          tAppId: a.tappId,
        };
      });

      dispatch(
        approveRejectData({
          usage: dataUsageCode,
          action: action,
          remarks: formValue.remark,
        })
      )
        .unwrap()
        .then(() => {
          form.resetFields();
          setDataTableSelect([]);
          setSelectedRowKeys([]);
          setCurrent(0);
          setRemark("");
          setAction("");
          handleListRefresh();
          handleCancel();
        })
        .catch((error) => {
          console.log("Error", error);
        });
    }
  };

  const handleCloseModalError = () => {
    setModalError(false);
    setBodyError({});
  };

  const handleRetry = () => {
    handleSave();
    setModalError(false);
    setBodyError({});
  };

  return (
    <div>
      <ModalCustom
        isOpen={isOpen}
        type="confirmation"
        header="Approval Usage"
        message={
          current === steps.length - 1
            ? "Are you sure you want to approve/reject these Usage?"
            : "Please choose data will be approve or reject"
        }
        handleCancel={handleCancelForm}
        width={1000}
        footer={
          <div className="flex w-full justify-end gap-5">
            {current < steps.length - 1 && (
              <ButtonComponent type={"default"} onClick={handleCancelForm}>
                Cancel
              </ButtonComponent>
            )}
            {current > 0 && (
              <ButtonComponent
                onClick={() => {
                  prev();
                  scrollLeftHandler();
                }}
                type={"submit"}
                icon={<SVGIcon name="IconArrowNarrowLeft" width={24} />}
              >
                Previous
              </ButtonComponent>
            )}

            {current < steps.length - 1 && (
              <ButtonComponent
                type={"submit"}
                className="ant-btn ant-btn-submit flex w-full justify-center"
                disabled={steps[current].disabled}
                form={"formApprove"}
                htmlType="submit"
              >
                <span className="p-1 text-[18px] text-center">Next</span>
                <RightOutlined
                  style={{
                    justifyItems: "center",
                    fontSize: "18px",
                    color: "#fff",
                  }}
                />
              </ButtonComponent>
            )}
            {current === steps.length - 1 && (
              <>
                <ButtonComponent
                  type={"reject"}
                  htmlType={"submit"}
                  form={"formApprove"}
                  onClick={() => setAction("REJECT")}
                >
                  Reject
                </ButtonComponent>
                <ButtonComponent
                  type={"approve"}
                  htmlType={"submit"}
                  form={"formApprove"}
                  onClick={() => setAction("APPROVE")}
                >
                  Approve
                </ButtonComponent>
              </>
            )}
          </div>
        }
      >
        <div className="flex flex-row justify-center">
          <div
            onScroll={handleScroll}
            ref={containerRef}
            className="overflow-x-scroll scrollStepsCstm"
          >
            <Steps current={current} items={items} labelPlacement="vertical" />
          </div>
        </div>

        <div
          className={`steps-content my-[30px] ${current !== 0 ? "hidden" : ""}`}
        >
          <Form
            layout="vertical"
            form={form}
            id={"formApprove"}
            onFinish={handleSave}
          >
            <div className="w-full grid grid-cols-1 gap-x-4 pt-[30px]">
              <p className="text-primary uppercase font-bold">Usage List</p>
              <TableRBI
                type="FE"
                dataSource={dataApproval?.map((a, index) => ({
                  ...a,
                  key: index + 1,
                }))}
                columns={processedColumns}
                current={page}
                pageSize={pageSize}
                onChange={handleChange}
                onSizeChanger={handleChange}
                totalData={dataApproval?.length || 0}
                tableScrolled={{ x: 8500, y: 300 }}
                onSort={onSort}
                showExport={false}
                columnDefinitions={columnDefinitions}
                fixedColumns={fixedColumns}
                setFixedColumns={setFixedColumns}
                rowSelection={rowSelection}
                loading={false}
              />
              
              <div className="pt-[30px]">
                <Form.Item
                  label={"Remark"}
                  name={"remark"}
                  rules={formMessageRequired("Remark")}
                >
                  <InputComponent
                    rows={1}
                    type="textarea"
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    placeholder={"Type your remark"}
                  />
                </Form.Item>
              </div>
            </div>
          </Form>
        </div>

        {/* Confirmation */}
        <div
          className={`steps-content my-[30px] ${current !== 1 ? "hidden" : ""}`}
        >
          <div className="w-full grid grid-cols-1 gap-x-4 pt-[30px]">
            {/* TAMPILKAN INFO SELECTED RECORDS DI STEP KEDUA */}
            <div className="flex justify-between items-center mb-4">
              <p className="text-primary uppercase font-bold">Usage List</p>
              <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-md border border-blue-200">
                <span className="text-blue-600 font-semibold">
                  {dataTableSelect.length} record{dataTableSelect.length > 1 ? 's' : ''} selected
                </span>
              </div>
            </div>

            <TableRBI
              dataSource={dataTableSelect}
              columns={processedColumns}
              current={page}
              pageSize={pageSize}
              onChange={handleChange}
              onSizeChanger={handleChange}
              totalData={dataTableSelect.length || 0}
              tableScrolled={{ x: 9000, y: 300 }}
              onSort={onSort}
              showExport={false}
              columnDefinitions={columnDefinitions}
              fixedColumns={fixedColumns}
              setFixedColumns={setFixedColumns}
              loading={false}
            />
            <div className="pt-[30px]">
              <DetailText label={"Remark"}>
                {form.getFieldValue().remark}
              </DetailText>
            </div>
          </div>
        </div>
      </ModalCustom>

      {/** Modal Retry */}
      <ModalError
        isOpen={modalError}
        handleOk={() => handleRetry()}
        handleCancel={() => handleCloseModalError()}
        customText={"Try Again"}
      >
        <div className="px-5 pt-5 pb-[10px] justify-center">
          <div className="w-full flex gap-[20px]">
            {bodyError.type === "inactivate"
              ? IconModal["icon_error_inactivate"]
              : IconModal["icon_error_default"]}
            <p className="text-[18px] font-bold">{"Failed"}</p>
          </div>
          <p className="pl-[70px]">{`Your data was not ${
            action === "APPROVE" ? "approved" : "rejected"
          }. ${bodyError.message}.`}</p>
          <p className="pl-[70px]">Please try again.</p>
        </div>
      </ModalError>
    </div>
  );
};

export default ModalApprovalUsage;