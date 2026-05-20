import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Steps, Form } from "antd";
import { RightOutlined } from "@ant-design/icons";
import SVGIcon from "../../../../../assets/Icon/index";
import ButtonComponent from "../../../../../components/ButtonComponent";
import { ModalError } from "../../../../../components/Modal/ModalPopUp";
import { IconModal } from "../../../../../utils/Icon";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import InputComponent from "../../../../../components/InputComponent";
import { requiredMessage } from "../../../../../utils";
import DetailText from "../../../../../components/DetailText";
import {
  getApprovalInstallmentList,
  approveInstallment,
  rejectInstallment,
} from "../../../../../redux/slices/rating_billing_invoice/installment";
import InstallmentApprovalTable from "./InstallmentApprovalTable";

const ApprovalInstallment = ({
  isOpen = false,
  handleCancel = () => {},
  handleApproveReject = () => {},
}) => {
  const { data_approval_list } = useSelector((state) => state.installment || {});

  const containerRef = useRef(null);
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const [current, setCurrent] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dataTableSelect, setDataTableSelect] = useState([]);

  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});
  const [action, setAction] = useState("");
  const [remark, setRemark] = useState("");

  useEffect(() => {
    if (isOpen) {
      dispatch(
        getApprovalInstallmentList({
          page: 0,
          pageSize: 50,
          sort: "createdDate~desc",
        }),
      );
    }
  }, [dispatch, isOpen]);

  const onSelectChange = (newSelectedRowKeys, newSelectedRow) => {
    console.log("Selected row keys:", newSelectedRowKeys);
    console.log("Selected rows:", newSelectedRow);
    
    // Ensure tAppId is properly mapped from tapId
    const mappedRows = newSelectedRow.map(row => ({
      ...row,
      tAppId: row.tAppId || row.tappId
    }));
    
    console.log("Mapped selected rows with tAppId:", mappedRows);
    setDataTableSelect(mappedRows);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    fixed: true,
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const steps = [
    {
      title: "INSTALLMENT INFORMATION",
      disabled: dataTableSelect.length === 0 || !form.getFieldValue()?.remark,
    },
    {
      title: "CONFIRMATION",
    },
  ];

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const scrollLeftHandler = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft -= 250;
    }
  };

  const scrollRightHandler = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft += 250;
    }
  };

  const handleScroll = () => {
    if (containerRef.current) {
      setScrollLeft(containerRef.current.scrollLeft);
    }
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
    form.resetFields();
    setCurrent(0);
  };

  const handleSave = (formValue) => {
    handleCancel();

    const installmentIds = dataTableSelect.map((item) => {
      console.log("Item id:", item.id, "item:", item);
      return item.id;
    });
    const approvalIds = dataTableSelect.map((item) => {
      const tAppId = item.tAppId || item.tappId;
      console.log("Item tAppId:", tAppId, "from item:", item);
      return tAppId;
    });
    
    console.log("dataTableSelect:", dataTableSelect);
    console.log("installmentIds:", installmentIds);
    console.log("approvalIds:", approvalIds);

    const body = {
      installmentIds: installmentIds,
      approvalIds: approvalIds,
      description: formValue.remark,
      action: action,
    };

    console.log("Sending body:", body);

    dispatch(
      action === "APPROVE"
        ? approveInstallment({ body: body })
        : rejectInstallment({ body: body }),
    )
      .unwrap()
      .then(() => {
        form.resetFields();
        setRemark("");
        setAction("");
        setDataTableSelect([]);
        setSelectedRowKeys([]);
        setCurrent(0);
        handleCancel();
        handleApproveReject();
        dispatch(
          getApprovalInstallmentList({
            page: 0,
            pageSize: 50,
            sort: "createdDate~desc",
          }),
        );
      })
      .catch((error) => {
        if (
          Math.floor(
            (error.response.code || error.response.status || 0) / 100,
          ) === 5
        ) {
          const message =
            (error?.response &&
              error?.response?.data &&
              error?.response?.data?.message) ||
            error?.message ||
            error?.toString();
          setBodyError({ message, value: formValue });
          setModalError(true);
        }
      });
  };

  const handleCloseModalError = () => {
    setModalError(false);
    setBodyError({});
  };

  const handleRetry = () => {
    handleSave(bodyError?.value);
    setModalError(false);
    setBodyError({});
  };

  return (
    <div>
      <ModalCustom
        isOpen={isOpen}
        handleCloseModal={() => {
          setCurrent(0);
          handleCancelForm();
        }}
        handleCancel={() => {
          setCurrent(0);
          handleCancelForm();
        }}
        onFinish={handleSave}
        type={"confirmation"}
        header="Approval Installment Information"
        width={1200}
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
              <p className="text-primary uppercase font-bold">
                Installment List
              </p>
              <InstallmentApprovalTable
                data={Array.isArray(data_approval_list?.result)
                  ? data_approval_list.result.map((a, index) => {
                      console.log("Mapping data item:", a);
                      return {
                        ...a,
                        key: a.id || index + 1,
                        tAppId: a.tAppId || a.tappId, // Ensure tAppId is properly mapped
                      };
                    })
                  : []}
                rowSelection={rowSelection}
                setRemark={setRemark}
              />

              <div className="pt-[30px]">
                <Form.Item
                  label={"Remark"}
                  name={"remark"}
                  rules={[
                    {
                      required: true,
                      message: requiredMessage("Remark"),
                    },
                  ]}
                >
                  <InputComponent
                    rows={1}
                    type="textarea"
                    placeholder={"Type your remark"}
                    onChange={(e) => setRemark(e.target.value)}
                  />
                </Form.Item>
              </div>
            </div>
          </Form>
        </div>

        <div
          className={`steps-content my-[30px] ${current !== 1 ? "hidden" : ""}`}
        >
          <div className="w-full grid grid-cols-1 gap-x-4 pt-[30px]">
            <p className="text-primary uppercase font-bold">
              Installment List
            </p>
            <InstallmentApprovalTable
              data={dataTableSelect}
              type={true}
              remark={remark}
            />

            <div className="pt-[30px]">
              <DetailText label="Remark">{remark}</DetailText>
            </div>
          </div>
        </div>
      </ModalCustom>

      <ModalError
        isOpen={modalError}
        handleOk={() => handleRetry()}
        handleCancel={() => handleCloseModalError()}
        customText={"Try Again"}
      >
        <div className="px-5 pt-5 pb-[10px] justify-center">
          <div className="w-full flex gap-[20px]">
            {IconModal["icon_error_inactivate"]}
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

export default ApprovalInstallment;
