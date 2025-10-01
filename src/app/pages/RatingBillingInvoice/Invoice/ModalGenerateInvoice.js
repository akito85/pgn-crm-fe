import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Steps, Form } from "antd";
import { RightOutlined } from "@ant-design/icons";
import ButtonComponent from "../../../../components/ButtonComponent";
import ModalCustom from "../../../../components/Modal/ModalCustom";
import SVGIcon from "../../../../assets/Icon/index";
import TablePagination from "../../../../components/TablePagination";
import InputComponent from "../../../../components/InputComponent";
import { columnsGenerateInvoice } from "./TableGenerateInvoice";
import DetailText from "../../../../components/DetailText";
import { useEffect } from "react";
import { createGenerate } from "../../../../redux/slices/rating_billing_invoice/invoice";
import TablePaginationNew from "../../../../components/TablePaginationNew";

const data = [];
for (let i = 0; i < 10; i++) {
  data.push({
    key: i,
    billingCode: `RA${i}`,
    template: "Invoice RT dengan materai",
    billingCycle: `${i}-3${i}`,
    billingPeriod: "2023-01",
  });
}

const ModalGenerateInvoice = ({
  isOpen,
  handleCancel,
  data,
  refreshTable,
  setBodyError,
  setModalError,
}) => {
  // Selector

  // Declaration
  const containerRef = useRef(null);
  const searchInput = useRef(null);
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  // State
  const [current, setCurrent] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState("");
  const [remark, setRemark] = useState("");
  const [dataTable, setDataTable] = useState([]);
  const [filterRowSelected, setFilterRowSelected] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // Use Effect
  useEffect(() => {
    if (isOpen === false) {
      form.resetFields();
      setSelectedRowKeys([]);
      setDataTable([]);
      setFilterRowSelected([]);
    } else {
      if (data) {
        setDataTable(
          data?.map((item, index) => {
            return {
              key: index + 1,
              ...item,
            };
          })
        );
      }
    }
  }, [data, form, isOpen]);

  useEffect(() => {
    if (selectedRowKeys?.length !== 0) {
      setFilterRowSelected(
        dataTable?.filter((item) => selectedRowKeys?.includes(item?.key))
      );
    }
  }, [dataTable, selectedRowKeys]);

  // Function Search API
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

  // Handle Change Page
  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  // Sort Table
  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    fixed: true,
    selectedRowKeys,
    onChange: onSelectChange,
  };

  // Step
  const steps = [
    {
      title: "BILLING INFORMATION",
      disabled: selectedRowKeys.length === 0,
    },
    {
      title: "CONFIRMATION",
    },
  ];

  // Button Next
  const next = () => {
    setPage(1);
    setPageSize(10);
    setSearch("");
    setSearchText("");
    setSearchedColumn("");
    setCurrent(current + 1);
  };

  // Button Previous
  const prev = () => {
    setPage(1);
    setPageSize(10);
    setSearch("");
    setSearchText("");
    setSearchedColumn("");
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

  // Handle Confirm
  const handleConfirm = () => {
    const body = {
      invoiceNumbers: filterRowSelected.map((a) => a.invoiceNumber),
      remark: remark,
    };
    dispatch(createGenerate(body))
      .unwrap()
      .then(() => {
        refreshTable();
      })
      .catch((error) => {
        if (Math.floor((error.response.data.code || 0) / 100) === 5) {
          const message =
            (error?.response &&
              error?.response?.data &&
              error?.response?.data?.message) ||
            error?.message ||
            error?.toString();
          console.log(error);
          setBodyError({ message });
          setModalError(true);
        }
      });
    handleCancel();
  };

  return (
    <ModalCustom
      isOpen={isOpen}
      handleCancel={() => {
        handleCancel();
        setSelectedRowKeys([]);
        setRemark("");
      }}
      type="confirmation"
      header="GENERATE INVOICE"
      width={1000}
      footer={
        <div className="flex w-full justify-end gap-x-5">
          {current < steps.length - 1 && (
            <ButtonComponent
              type={"default"}
              onClick={() => {
                handleCancel();
                setSelectedRowKeys([]);
                setRemark("");
              }}
            >
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
              onClick={() => {
                handleButtonNext();
              }}
              type={"submit"}
              className="ant-btn ant-btn-submit flex w-full justify-center"
              disabled={steps[current].disabled}
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
            <ButtonComponent type={"submit"} onClick={handleConfirm}>
              Confirm
            </ButtonComponent>
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
        <div className="w-full grid grid-cols-1 gap-[30px]">
          <div>
            <span className="text-primary uppercase font-bold mt-[60px]">
              Billing Information
            </span>
          </div>
          <div className="w-full">
            <TablePaginationNew
              type="FE"
              dataSource={dataTable}
              totalData={data?.page?.totalElements}
              current={page}
              pageSize={pageSize}
              onChange={handleChange}
              onSizeChanger={handleChange}
              columns={columnsGenerateInvoice(
                search,
                page,
                pageSize,
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
              )}
              onSort={onSort}
              tableScrolled={{ y: 525, x: 11000 }}
              rowSelection={rowSelection || undefined}
            />
          </div>
          <Form layout="vertical" form={form}>
            <Form.Item label={"Remark"} name={"remark"}>
              <InputComponent
                rows={1}
                type="textarea"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder={"Type your remark"}
              />
            </Form.Item>
          </Form>
        </div>
      </div>

      <div
        className={`steps-content my-[30px] ${current !== 1 ? "hidden" : ""}`}
      >
        <div className="w-full grid grid-cols-1 gap-[30px]">
          <div>
            <span className="text-primary uppercase font-bold mt-[60px]">
              Confirmation
            </span>
          </div>
          <div className="w-full">
            <TablePaginationNew
              type="FE"
              dataSource={filterRowSelected}
              totalData={filterRowSelected.length}
              current={page}
              pageSize={pageSize}
              onChange={handleChange}
              onSizeChanger={handleChange}
              columns={columnsGenerateInvoice(
                search,
                page,
                pageSize,
                searchInput,
                searchedColumn,
                searchText,
                handleSearch
              )}
              onSort={onSort}
              tableScrolled={{ y: 525, x: 11000 }}
            />
          </div>
          <div>
            <DetailText label={"Remark"}>
              {form.getFieldValue("remark")}
            </DetailText>
          </div>
        </div>
      </div>
    </ModalCustom>
  );
};

export default ModalGenerateInvoice;
