import React, { useEffect, useRef } from "react";
import {
  DownloadOutlined,
  PlusOutlined,
  UnorderedListOutlined,
  EditOutlined,
  WarningOutlined,
  MoreOutlined,
  ExclamationCircleOutlined,
  CheckSquareOutlined,
  CheckSquareFilled,
} from "@ant-design/icons";
import { Collapse, Form, Space, Spin, Switch } from "antd";
import { Link, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Fragment } from "react";
import DetailText from "../../../../../../../components/DetailText";
import ButtonComponent from "../../../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../../../assets/Icon/index";
import PaymentChannelUpdate from "./PaymentChannelUpdate";
import ModalCustom from "../../../../../../../components/Modal/ModalCustom";
import {
  getGlobalTypePaymentChannel,
  getPaymentChannel,
  updatePaymentChannel,
} from "../../../../../../../redux/slices/account_management/detailAccount/FinancialInformationSlice";
import { useDispatch, useSelector } from "react-redux";
import { ModalError } from "../../../../../../../components/Modal/ModalPopUp";

const PaymentChannel = ({ access, id = 0 }) => {
  const dispatch = useDispatch();
  const { data_paymentChannel, data_globalTypePaymentChannel, loading } =
    useSelector((state) => state.financialInformation);

  //useEffect
  useEffect(() => {
    if (id) {
      dispatch(getPaymentChannel(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (id && data_paymentChannel) {
      dispatch(getGlobalTypePaymentChannel());
    }
  }, [dispatch, id, data_paymentChannel]);

  useEffect(() => {
    if (
      data_paymentChannel &&
      data_globalTypePaymentChannel
      // &&
      // data_globalTypePaymentChannel.length > 0
    ) {
      const temp = data_globalTypePaymentChannel.filter(
        (item) => item.id !== data_paymentChannel.paymentChannel,
      );
      setOptions(temp);
      // setVaIsEnable();
    }
  }, [data_paymentChannel, data_globalTypePaymentChannel]);

  //declare
  const [form] = Form.useForm();

  //state
  const [bodyError, setBodyError] = useState({});
  const [btnType, setBtnType] = useState(false);
  const [dataAccount, setDataAccount] = useState({});

  //modal
  const [modalUpdate, setModalUpdate] = useState(false);
  const [options, setOptions] = useState([]);
  const [modalError, setModalError] = useState(false);
  const [vaisEnable, setVaisEnable] = useState(false);

  const onFinish = (value) => {
    const temp = data_globalTypePaymentChannel.filter(
      (item) => item.id === value?.paymentChannel,
    );
    setDataAccount(temp[0]);
    setBtnType(true);
  };

  const handleRetry = () => {
    handleSend(bodyError?.value);
    setModalError(false);
    setBodyError({});
  };

  const handleSend = (e) => {
    const data = {
      accountId: id,
      paymentChannel: e.id,
    };
    dispatch(updatePaymentChannel({ ...data }))
      .unwrap()
      .then(() => {
        form.resetFields();
        setBtnType(false);
        setModalUpdate(false);
        // console.log("then",`id ${id} page ${page} pageSize ${pageSize}}`)
        dispatch(getPaymentChannel(id));
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
          setBodyError({ message, value: e });

          setModalError(true);
        }
      });
  };

  const onChange = (e) => {
    if (!vaisEnable) {
      setVaisEnable(e);
    }
  };
  return (
    <Fragment>
      <Spin spinning={loading}>
        <div className="flex flex-row w-full justify-end">
          {access?.actionList?.some((action) => action.name === "Update") && (
            <ButtonComponent
              icon={<SVGIcon name="IconEdit" color={"#FFFFFF"} width={24} />}
              type="submit"
              onClick={() => {
                setModalUpdate(true);
              }}
            >
              Update
            </ButtonComponent>
          )}
        </div>

        <div className="text-primary text-xs font-bold uppercase mb-5">
          {"Payment Information"}
        </div>

        <div className="mb-5">
          <DetailText label={"Payment Channel"}>
            {data_paymentChannel?.paymentChannelValue}
          </DetailText>
        </div>

        {data_paymentChannel?.paymentChannel === 783 ? (
          <div className="gap-2">
            <div className="text-primary text-xs font-bold uppercase mb-2">
              {"Virtual Account Number"}
            </div>

            <div className="flex gap-2 items-center">
              <Switch onChange={onChange} checked={vaisEnable} />
              <label className="text-xs font-semibold">
                Generate Virtual Account
              </label>
            </div>
            <div className="mt-2">
              <DetailText>
                {vaisEnable
                  ? "Virtual Account has been generate"
                  : `Turn Switch to generate virtual account, you can only generate once`}
              </DetailText>
            </div>
          </div>
        ) : null}

        {/* modalUpdate */}

        <Form
          id={"formUpdatePayment"}
          layout={"vertical"}
          form={form}
          onFinish={onFinish}
        >
          <ModalCustom
            isOpen={modalUpdate}
            type={"confirmation"}
            header="UPDATE PAYMENT CHANNEL"
            width={700}
            handleCancel={() => {
              form.resetFields();
              setBtnType(false);
              setModalUpdate(false);
            }}
            footer={
              <div className={"w-full flex justify-end"}>
                {btnType ? (
                  <div className="flex flex-row gap-3">
                    <ButtonComponent
                      onClick={() => {
                        setBtnType(false);
                        // setModalUpdate(false);
                        // form.resetFields();
                      }}
                      type="default"
                    >
                      Cancel
                    </ButtonComponent>
                    <ButtonComponent
                      onClick={() => {
                        handleSend(dataAccount);
                        // setBtnType(false);
                        // setModalUpdate(false);
                      }}
                      type="submit"
                    >
                      Confirm
                    </ButtonComponent>
                  </div>
                ) : (
                  <div className="w-full flex justify-end gap-5">
                    <ButtonComponent
                      icon={
                        <SVGIcon
                          name="IconButtonReset"
                          width={24}
                          color={"#FFFFFF"}
                        />
                      }
                      type="submit"
                      onClick={() => {
                        form.resetFields();
                      }}
                    >
                      Reset
                    </ButtonComponent>
                    <ButtonComponent
                      form={"formUpdatePayment"}
                      type={"submit"}
                      htmlType="submit"
                      // onClick={() => {setBtnType(true)}}
                    >
                      Save
                    </ButtonComponent>
                  </div>
                )}
              </div>
            }
          >
            <PaymentChannelUpdate
              btnType={btnType}
              paymentType={dataAccount}
              options={options}
            />
          </ModalCustom>
        </Form>

        {/** Modal Retry */}
        <ModalError
          isOpen={modalError}
          handleOk={handleRetry}
          handleCancel={() => {
            setModalError(false);
          }}
          customText={"Try Again"}
        >
          <div className="px-5 pt-5 pb-[10px] justify-center">
            <div className="w-full flex gap-[20px]">
              <SVGIcon name="IconFailed" width={48} />
              <p className="text-[18px] font-bold">{"Failed"}</p>
            </div>
            <p className="pl-[70px]">{`Your data was not updated`}</p>
            <p className="pl-[70px]">Please try again.</p>
          </div>
        </ModalError>
      </Spin>
    </Fragment>
  );
};

export default PaymentChannel;
