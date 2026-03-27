import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Steps, Form } from "antd";
import { RightOutlined } from "@ant-design/icons";
import SVGIcon from "../../../../../assets/Icon/index";
import ButtonComponent from "../../../../../components/ButtonComponent";
import { ModalError } from "../../../../../components/Modal/ModalPopUp";
import { IconModal } from "../../../../../utils/Icon";
import ApprovalPosFirstStep from "./ApprovalPosFirstStep";
import {
  approvePOS,
  getListApprovalPage,
  rejectPOS,
} from "../../../../../redux/slices/rating_billing_invoice/PointOfSales";
import ModalCustom from "../../../../../components/Modal/ModalCustom";

const ApprovalPointOfSales = ({
  isOpen = false,
  handleCancel = () => {},
  handleApproveReject = () => {},
}) => {
  // Selector
  const { dataApprovalListPage } = useSelector((state) => state.pointOfSales);

  // Declaration
  const containerRef = useRef(null);
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  // State
  const [current, setCurrent] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dataTableSelect, setDataTableSelect] = useState([]);

  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});
  const [action, setAction] = useState("");
  const [remark, setRemark] = useState("");

  // console.log(bodyError, "bodyError");

  // Use State
  useEffect(() => {
    dispatch(getListApprovalPage());
  }, [dispatch]);

  const onSelectChange = (newSelectedRowKeys, newSelectedRow) => {
    setDataTableSelect(newSelectedRow);
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
      title: "POINT OF SALES INFORMATION",
      disabled: dataTableSelect.length === 0 || !form.getFieldValue().remark,
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
    handleCancel();

    const body = {
      mrbiApproveDTOs: dataTableSelect.map((item) => {
        return {
          approvalId: item.tappId,
          idPos: item.id,
        };
      }),
      remark: formValue.remark,
    };

    dispatch(
      action === "APPROVE"
        ? approvePOS({ body: body })
        : rejectPOS({ body: body })
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
        dispatch(getListApprovalPage());
      })
      .catch((error) => {
        // console.log(error, "code");
        if (
          Math.floor(
            (error.response.code || error.response.status || 0) / 100
          ) === 5
        ) {
          const message =
            (error?.response &&
              error?.response?.data &&
              error?.response?.data?.message) ||
            error?.message ||
            error?.toString();
          console.log(error);
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
        header="Approval Point Of Sales Information"
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
            <ApprovalPosFirstStep
              key={"first"}
              dataTable={Array.isArray(dataApprovalListPage)
                ? dataApprovalListPage.map((a, index) => ({
                    ...a,
                    key: index + 1,
                  }))
                : []
              }
              rowSelection={rowSelection}
              setRemark={setRemark}
            />
          </Form>
        </div>

        {/* Confirmation */}
        <div
          className={`steps-content my-[30px] ${current !== 1 ? "hidden" : ""}`}
        >
          <ApprovalPosFirstStep
            key={"confirm"}
            dataTable={dataTableSelect}
            type={true}
            remark={remark}
          />
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
            {
              // bodyError.type === "inactivate"
              //   ?
              IconModal["icon_error_inactivate"]
              // : IconModal["icon_error_default"]
            }
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

export default ApprovalPointOfSales;
