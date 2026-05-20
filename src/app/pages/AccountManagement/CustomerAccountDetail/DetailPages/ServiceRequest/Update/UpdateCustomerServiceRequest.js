import React, { useEffect, useState, useRef } from "react";

import { Steps, Button, message, Form } from "antd";
import { LeftCircleOutlined, RightCircleOutlined, RightOutlined, WarningOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import BreadCrumb from "../../../../../../../components/BreadCrumb";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../../routes/account_management/customer_account_routes";
import BaseContainer from "../../../../../../../components/BaseContainer";
import StepContents from "./StepContents";
import SVGIcon from "../../../../assets/Icon/index";
import ButtonComponent from "../../../../components/ButtonComponent";
import { ModalConfirm } from "../../../../components/Modal/ModalPopUp";

const { InformationForm, AddressForm, ContactForm } = StepContents;

const routes = [
  {
    path: "",
    breadcrumbName: "Account Management",
  },
  {
    path: ACCOUNT_MANAGEMENT_ROUTES.CREATE_CUSTOMER_ACCOUNT,
    breadcrumbName: "Customer/Account Create",
  },
];

const CreateCustomerAccount = (props) => {
  const containerRef = useRef(null);
  const [modalBack, setModalBack] = useState(false);
  const [current, setCurrent] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [form] = Form.useForm();
  const { type } = props;
  const [productInfoObj, setProductInfoObj] = useState({});

  useEffect(() => {
  }, [productInfoObj])


  const handleProductInfoObj = (e, type) => {
    let result;
    switch (type) {
      case "productName":
      case "productDescription":
        result = e.target.value;
        break;
      default:
        result = e;
        break;
    }
    setProductInfoObj((prevState) => ({
      ...prevState,
      [type]: result,
    }));
    console.log(type, "<<<<<<<<<<")
    return result;
  };

  const steps = [
    {
      title: "Customer & Account Information",
      content: <InformationForm updateBody={handleProductInfoObj} />,
      disabled: false
    },
    {
      title: "Address",
      content: <AddressForm />,
      disabled: false
    },
    {
      title: "Contact",
      content: <ContactForm />,
      disabled: false
    }
  ];
  

  const navigate = useNavigate();
  const next = () => {
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };
  const scrollRightHandler = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft += 250;
    }
  };
  const handleButtonNext = () => {
    next();
    scrollRightHandler()
  }
  
  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  const handleScroll = () => {
    if (containerRef.current) {
      setScrollLeft(containerRef.current.scrollLeft);
    }
  };

  const scrollLeftHandler = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft -= 250;
    }
  };

  const handleSubmitForm = (value) => {
    setModalConfirm(true);
  };

  return (
    <>
      <BreadCrumb routes={routes} />
      <Form
        id="accountForm"
        form={form}
        layout={"vertical"}
        onFinish={handleSubmitForm}
        // onFinishFailed={handleErrorSubmit}
        scrollToFirstError={true}
      >
        {/* Step Contents */}
        <BaseContainer>
          <div className="flex flex-row gap-x-6 justify-center">
            <span className="mt-[10px]">
              <LeftCircleOutlined style={{ fontSize: '24px', color: '#0075bf' }} onClick={scrollLeftHandler}/>
            </span>
            <div onScroll={handleScroll} ref={containerRef} className="overflow-x-scroll scrollStepsCstm">
              <Steps current={current} items={items} labelPlacement="vertical" />
            </div>
            <span className="mt-[10px]">
              <RightCircleOutlined style={{ fontSize: '24px', color: '#0075bf' }} onClick={scrollRightHandler}/>
            </span>
          </div>
          <div className="steps-content my-6">{steps[current].content}</div>
        </BaseContainer>
        
        {/* Section Action Steps */}
        <div className="steps-action my-8 flex w-full justify-between gap-x-2">
          <ButtonComponent
            type={"submit"}
            icon={<SVGIcon name="IconArrowNarrowLeft" width={24} />}
            onClick={()=>{setModalBack(true)}}
          >
            Back
          </ButtonComponent>
          <div className="flex w-full justify-end gap-x-4">
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
              <Button
                onClick={handleButtonNext}
                type="primary"
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
              </Button>
            )}
            {current === steps.length - 1 && (
              <ButtonComponent
                onClick={() => message.success("Processing complete!")}
                type={"submit"}
                htmlType={"submit"}
                icon={<SVGIcon name="IconArrowNarrowRight" width={24} />}
              >
                Save
              </ButtonComponent>
            )}
          </div>
        </div>
      </Form>


      {/* Modal Back */}
      <ModalConfirm
        isOpen={modalBack}
        handleCancel={() => setModalBack(false)}
        handleOk={() => navigate(-1)}
        width={400}
      >
        <div className="flex justify-center mt-5 gap-[20px]">
          <WarningOutlined style={{ fontSize: "24px", color: "#BE3036" }} />
          <p className="text-[18px] font-bold">
            Are you sure you want to back?
          </p>
        </div>
      </ModalConfirm>
    </>
  );
};

export default CreateCustomerAccount;
