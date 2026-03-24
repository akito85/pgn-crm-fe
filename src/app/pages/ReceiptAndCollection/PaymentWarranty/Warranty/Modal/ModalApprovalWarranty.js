import React, { useRef, useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Steps, Form, Button, message } from "antd";
import { FormStepper } from "../../../../../../components/FormStepNavigation";
import { RightOutlined } from "@ant-design/icons";
import { ModalError } from "../../../../../../components/Modal/ModalPopUp";
import { IconModal } from "../../../../../../utils/Icon";
import {
  submitApproval,
  getListApprovalWarranty,
} from "../../../../../../redux/slices/receipt_collection/warranty";
import { tableApprovalWarranty } from "./TableApprovalWarranty";
import { formMessageRequired } from "../../../../../../utils";
import TableRBI from "../../../../../../components/TableRBI";
import { applyFixedColumns } from "../../../../../../utils/applyFixedColumns";
import SVGIcon from "../../../../../../assets/Icon/index";
import InputComponent from "../../../../../../components/InputComponent";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import DetailText from "../../../../../../components/DetailText";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import { WARRANTY_APPROVAL_STATUS } from "../../../../../../constants/warranty";


const ModalApprovalWarranty = ({
  isOpen,
  handleCancel,
  handleListRefresh = () => {},
}) => {
  // Selector
  const { data_approval_list, loading_approval_list } = useSelector((state) => state.warranty);

  // Declaration
  const containerRef = useRef(null);
  const searchInput = useRef(null);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const dataApproval = data_approval_list?.result || [];

  // Use State
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
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

  const [fixedColumns, setFixedColumns] = useState({
    approvalStatus: "right",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initial fetch
  useEffect(() => {
    if (isOpen) {
      dispatch(
        getListApprovalWarranty({
          page: 0,
          pageSize: 100,
          isLoadMore: false,
        })
      );
      setPage(1);
    }
  }, [dispatch, isOpen]);

  // Load more handler
  const handleLoadMore = async () => {
    const nextPage = page + 1;
    const totalPages = data_approval_list?.page?.totalPages || 0;

    if (nextPage <= totalPages) {
      await dispatch(
        getListApprovalWarranty({
          page: nextPage - 1,
          pageSize: pageSize,
          isLoadMore: true,
        })
      );
      setPage(nextPage);
    }
  };

  const hasMore =
    dataApproval.length < (data_approval_list?.page?.totalElements || 0);

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
    getCheckboxProps: (record) => {
      const isWaitingApproval = record.approvalStatus === WARRANTY_APPROVAL_STATUS.WAITING_APPROVAL;
      const isNotApprover = !record.isApprover;
      
      let differentApprover = false;
      if (dataTableSelect.length > 0) {
        differentApprover = record.appHierId !== dataTableSelect[0].appHierId;
      }

      return {
        disabled: !isWaitingApproval || isNotApprover || differentApprover,
        name: record.warrantyCode,
      };
    },
  };

  const baseColumns = useMemo(() => {
    return tableApprovalWarranty(
      search,
      page,
      pageSize,
      searchInput,
      searchedColumn,
      searchText,
      handleSearch
    );
  }, [search, page, pageSize, searchedColumn, searchText]);

  const processedColumns = useMemo(() => {
    return applyFixedColumns(baseColumns, fixedColumns);
  }, [baseColumns, fixedColumns]);

  const columnDefinitions = useMemo(() => {
    return baseColumns.map((col) => ({
      key: col.key || col.dataIndex || col.title,
      title: col.title,
    }));
  }, [baseColumns]);

  const steps = [
    {
      title: "Guarantee Information",
      disabled: dataTableSelect.length === 0,
    },
    {
      title: "Confirmation",
    },
  ];

  const next = () => setCurrent(current + 1);
  const prev = () => setCurrent(current - 1);

  const scrollLeftHandler = () => {
    if (containerRef.current) containerRef.current.scrollLeft -= 250;
  };

  const scrollRightHandler = () => {
    if (containerRef.current) containerRef.current.scrollLeft += 250;
  };

  const handleScroll = () => {
    if (containerRef.current) setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleButtonNext = () => {
    next();
    scrollRightHandler();
  };

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  const handleCancelForm = () => {
    handleCancel();
    setSelectedRowKeys([]);
    setDataTableSelect([]);
    setRemark("");
    setCurrent(0);
    form.resetFields();
  };

  const handleSave = async (formValue) => {
    if (isSubmitting) return; // Prevent double submission

    if (current < steps.length - 1) {
      handleButtonNext();
    } else {
      setIsSubmitting(true);
      try {
        const payload = dataTableSelect.map((item) => ({
          id: item.id,
          action: action,
          remark: formValue.remark,
          approvalId: item.approvalId,
        }));

        await dispatch(submitApproval({ body: payload })).unwrap();
        handleCancelForm();
        handleListRefresh();
      } catch (error) {
        message.error('Failed to submit approval. Please try again.');
        console.error("Error", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div>
      <ModalCustom
        isOpen={isOpen}
        type="confirmation"
        header="Approval Guarantee"
        message={
          current === steps.length - 1
            ? "Are you sure you want to approve/reject these guarantees?"
            : "Please choose guarantee to approve or reject"
        }
        handleCancel={handleCancelForm}
        width={1000}
        footer={
          <div className="flex w-full justify-between items-center bg-white rounded-lg border border-[#D6E1F0] p-4 mt-6">
            <ButtonComponent
              type="default"
              onClick={handleCancelForm}
              className="!border-[#0075BF] !text-[#0075BF]"
            >
              Cancel
            </ButtonComponent>
            <div className="flex items-center gap-3">
              {current > 0 && (
                <Button
                  onClick={() => {
                    prev();
                    scrollLeftHandler();
                  }}
                  style={{
                    backgroundColor: "#fff",
                    borderColor: "#DADDE5",
                    color: "#4B465C",
                    borderRadius: "6px",
                    height: "32px",
                    fontSize: "12px",
                    border: "1px solid #DADDE5",
                  }}
                >
                  Previous
                </Button>
              )}

              {current < steps.length - 1 ? (
                <Button
                  key="btn-next"
                  htmlType="submit"
                  form="formApproveWarranty"
                  type="primary"
                  disabled={steps[current].disabled}
                  style={{
                    backgroundColor: "#0075BF",
                    borderColor: "#0075BF",
                    color: "#fff",
                    borderRadius: "6px",
                    height: "32px",
                    fontSize: "12px",
                  }}
                >
                  Next
                </Button>
              ) : (
                <>
                  <Button
                    key="btn-reject"
                    htmlType="submit"
                    disabled={isSubmitting}
                    onClick={() => setAction("REJECT")}
                    style={{
                      backgroundColor: "#BE3036",
                      borderColor: "#BE3036",
                      color: "#fff",
                      borderRadius: "6px",
                      height: "32px",
                      fontSize: "12px",
                      opacity: isSubmitting ? 0.6 : 1,
                    }}
                  >
                    Reject
                  </Button>
                  <Button
                    key="btn-approve"
                    htmlType="submit"
                    form="formApproveWarranty"
                    disabled={isSubmitting}
                    onClick={() => setAction("APPROVE")}
                    style={{
                      backgroundColor: "#388E3C",
                      borderColor: "#388E3C",
                      color: "#fff",
                      borderRadius: "6px",
                      height: "32px",
                      fontSize: "12px",
                      opacity: isSubmitting ? 0.6 : 1,
                    }}
                  >
                    Approve
                  </Button>
                </>
              )}
            </div>
          </div>
        }
      >
        <FormStepper 
          steps={steps} 
          current={current} 
          onPrev={() => current > 0 && prev()} 
          onNext={() => current < steps.length - 1 && !steps[current].disabled && next()} 
        />

        <div className={`steps-content my-[30px] ${current !== 0 ? "hidden" : ""}`}>
          <Form
            layout="vertical"
            form={form}
            id={"formApproveWarranty"}
            onFinish={handleSave}
          >
            <div className="w-full grid grid-cols-1 gap-x-4 pt-[30px]">
              <div className="flex gap-2 justify-between">
                <p className="text-primary uppercase font-bold">Guarantee List</p>
                {selectedRowKeys.length > 0 && (
                  <p className="text-sm font-semibold text-blue-600">
                    {selectedRowKeys.length} selected
                  </p>
                )}
              </div>
              <TableRBI
                idTable="approval-warranty-table"
                dataSource={dataApproval?.map((a, index) => ({
                    ...a,
                    key: a.id || index + 1,
                  }))}
                columns={processedColumns}
                totalData={data_approval_list?.page?.totalElements || 0}
                tableScrolled={{ x: 1500, y: 300 }}
                onSort={onSort}
                showExport={false}
                columnDefinitions={columnDefinitions}
                fixedColumns={fixedColumns}
                setFixedColumns={setFixedColumns}
                rowSelection={rowSelection}
                loading={loading_approval_list}
                usePagination={false}
                useInfiniteScroll={true}
                onLoadMore={handleLoadMore}
                hasMore={hasMore}
                loadMoreThreshold={20}
              />

              <div className="pt-[30px]">
                <Form.Item
                  label={"Remark"}
                  name={"remark"}
                  rules={formMessageRequired("Remark")}
                >
                  <InputComponent
                    rows={3}
                    type="textarea"
                    placeholder={"Type your remark"}
                  />
                </Form.Item>
              </div>
            </div>
          </Form>
        </div>

        <div className={`steps-content my-[30px] ${current !== 1 ? "hidden" : ""}`}>
          <div className="w-full grid grid-cols-1 gap-x-4 pt-[30px]">
            <div className="flex justify-between items-center mb-4">
              <p className="text-primary uppercase font-bold">Guarantee List</p>
              <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-md border border-blue-200">
                <span className="text-blue-600 font-semibold">
                  {dataTableSelect.length} records selected
                </span>
              </div>
            </div>

            <TableRBI
              dataSource={dataTableSelect}
              columns={processedColumns}
              totalData={dataTableSelect.length || 0}
              tableScrolled={{ x: 1500, y: 300 }}
              onSort={onSort}
              showExport={false}
              columnDefinitions={columnDefinitions}
              fixedColumns={fixedColumns}
              setFixedColumns={setFixedColumns}
              loading={false}
              usePagination={false}
            />
            <div className="pt-[30px]">
              <DetailText label={"Remark"}>
                {form.getFieldValue().remark}
              </DetailText>
            </div>
          </div>
        </div>
      </ModalCustom>
    </div>
  );
};

export default ModalApprovalWarranty;
