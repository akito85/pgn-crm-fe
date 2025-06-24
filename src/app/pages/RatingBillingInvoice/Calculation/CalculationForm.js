import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Modal, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import BreadCrumb from "../../../../components/BreadCrumb";
import BaseContainer from "../../../../components/BaseContainer";
import ButtonComponent from "../../../../components/ButtonComponent";
import { LeftOutlined, WarningOutlined } from "@ant-design/icons";
import SVGIcon from "../../../../assets/Icon/index";
import { RBI_ROUTES } from "../../../../routes/rating_billing/rbi_routes";
import ModalCustom from "../../../../components/Modal/ModalCustom";
import FormConfirmation from "./FormConfirmation";
import SelectComponent from "../../../../components/SelectComponent";
import { formMessageRequired } from "../../../../utils";
import InputComponent from "../../../../components/InputComponent";
import {
  ModalConfirm,
  ModalError,
} from "../../../../components/Modal/ModalPopUp";
import {
  getListAccountGroup,
  getListBillingCycle,
  getListBillingPeriod,
  getListCalculationType,
  getListCostCenter,
  getListCustomerSegment,
  getListMeterReadingCode,
  getListSchedulerType,
  getListServiceType,
  getListSor,
  getListSpecificCustomer,
  createCalculation,
  getUserDetailCalculation,
} from "../../../../redux/slices/rating_billing_invoice/calculation";
import { IconModal } from "../../../../utils/Icon";
import { validateCreateUpdate } from "../../../../redux/slices/general_slice";
import ratingBillingHttpService from "../../../../redux/services/ratingBillingHttpService";

const CalculationForm = ({ type }) => {
  // Selector
  const {
    loading,
    list_sor,
    list_service_type,
    list_account_group,
    list_customer_segment,
    list_calculation_type,
    list_scheduler_type,
    list_cost_center,
    list_meter_reading_code,
    list_specific_customer,
    list_billing_cycle,
    list_billing_period,
    data_user_calculation,
  } = useSelector((state) => state.rbi_calculation);

  // Declaration
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State
  const [openModal, setOpenModal] = useState(false);
  const [openBack, setOpenBack] = useState(false);
  const [billingCycle, setBillingCycle] = useState();
  const [form] = Form.useForm();
  const formValue = form.getFieldsValue();
  const [dataSpecificCustomer, setDataSpecificCustomer] = useState({
    sorId: null,
    costCenterId: [],
    meterReadingCodeId: [],
    accountSegmentId: [],
    accountGroupTypeId: [],
  });
  const [remark, setRemark] = useState("");
  const [mergedArrayMrc, setMergedArrayMrc] = useState([]);
  const [mergedArrayGroupType, setMergedArrayGroupType] = useState([]);
  const [dataFinal, setDataFinal] = useState({});
  const [modalSuccess, setModalSuccess] = useState(false);
  const [modalError, setModalError] = useState(false);
  const [bodyError, setBodyError] = useState({});
  const [defaultData, setDefaultData] = useState({});

  // Use Effect
  useEffect(() => {
    dispatch(getListSor());
    dispatch(getListServiceType());
    dispatch(getListCustomerSegment());
    dispatch(getListCalculationType());
    dispatch(getListSchedulerType());
    dispatch(getListCostCenter());
    dispatch(getListBillingCycle());
    dispatch(getUserDetailCalculation());
  }, [dispatch]);

  useEffect(() => {
    const tempBody = {
      sor: data_user_calculation.sorId || null,
      costCenter:
        data_user_calculation.ccId && data_user_calculation.ccId !== null
          ? typeof data_user_calculation.ccId === "number"
            ? [data_user_calculation.ccId]
            : data_user_calculation.ccId
          : [],
    };
    setDefaultData(tempBody);
    form.setFieldsValue(tempBody);
    setDataSpecificCustomer((prevState) => {
      return {
        ...prevState,
        sorId: data_user_calculation.sorId || null,
        costCenterId: data_user_calculation.ccId || null,
      };
    });
    if (tempBody.costCenter) {
      const body = {
        ccIds: (tempBody.costCenter || []).map((data) => {
          return {
            ccId: data,
          };
        }),
      };
      dispatch(getListMeterReadingCode(body));
    }
  }, [data_user_calculation]);

  useEffect(() => {
    if (dataSpecificCustomer?.sorId) {
      dispatch(getListSpecificCustomer(dataSpecificCustomer));
    }
  }, [dispatch, dataSpecificCustomer]);

  useEffect(() => {
    let dataMrc = list_meter_reading_code?.reduce(
      (result, current) => result?.concat(current?.dtoList),
      []
    );
    setMergedArrayMrc(dataMrc);
  }, [dispatch, list_meter_reading_code]);

  useEffect(() => {
    let dataGroupType = list_account_group?.reduce(
      (result, current) => result?.concat(current?.dtoList),
      []
    );
    setMergedArrayGroupType(dataGroupType);
  }, [dispatch, list_account_group]);

  // reset form
  const handleReset = () => {
    let tempData = [
      "billing_cycle",
      "billing_period",
      "calculation_type",
      "serviceType",
      "sor",
      "costCenter",
      "meterReading",
      "accountSegment",
      "accountGroupType",
      "specificCustomer",
      "type",
      "remark",
    ];
    if (defaultData?.costCenter.length > 0) {
      tempData = tempData.filter((item) => item !== "costCenter");
    }
    if (defaultData?.sor.length > 0) {
      tempData = tempData.filter((item) => item !== "sor");
    }
    form.resetFields(tempData);
  };

  // Validate Data before Modal
  const checkDataValidity = async (data) => {
    const url =
      type === "create"
        ? "/v1/dbs/api/rbi/calculation/validate-create"
        : "/v1/dbs/api/rbi/calculation/validate-update";

    try {
      await dispatch(
        validateCreateUpdate({
          body: data,
          services: ratingBillingHttpService,
          endPoint: url,
          type: type,
        })
      )?.unwrap();
      return true;
    } catch (error) {
      return false;
    }
  };

  // handle open modal
  const onFinish = async (formValue) => {
    setDataFinal({
      billingCycle: formValue?.billing_cycle,
      billingPeriod: formValue?.billing_period,
      serviceType: formValue?.serviceType,
      sor: formValue?.sor,
      scheduleType: formValue?.type,
      calculationType: formValue?.calculation_type,
      remark: formValue?.remark,
      rRbiCalculationCostCenter: (formValue?.costCenter || []).map((id) => {
        return {
          id: null,
          calCode: null,
          costCenter: id,
        };
      }),
      rRbiCalculationMeterReadingCode: (formValue?.meterReading || []).map(
        (id) => {
          return {
            id: null,
            calCode: null,
            mreadingCode: id,
          };
        }
      ),
      rRbiCalculationAccountSegment: (formValue?.accountSegment || []).map(
        (id) => {
          return {
            id: null,
            calCode: null,
            accSegment: id,
          };
        }
      ),
      rRbiCalculationAccountGroupType: (formValue?.accountGroupType || []).map(
        (id) => {
          return {
            id: null,
            calCode: null,
            accGroupType: id,
          };
        }
      ),
      rRbiCalculationSpecificCustomer: (formValue?.specificCustomer || []).map(
        (id) => {
          return {
            id: null,
            calCode: null,
            custNumb: id,
          };
        }
      ),
    });

    setOpenModal(true);
  };

  // handle save
  const handleSave = async () => {
    const tempBody = {
      ...dataFinal,
      isShow:
        (dataFinal?.rRbiCalculationSpecificCustomer || []).length > 0
          ? "Y"
          : "N",
      rRbiCalculationSpecificCustomer:
        (dataFinal?.rRbiCalculationSpecificCustomer || []).length > 0
          ? dataFinal.rRbiCalculationSpecificCustomer
          : (list_specific_customer || []).map((item) => {
              return {
                id: null,
                calCode: null,
                custNumb: item.code,
              };
            }),
    };
    dispatch(createCalculation({ body: tempBody }))
      .unwrap()
      .then((data) => {
        if (data) {
          setModalSuccess(true);
        }
      })
      .catch((error) => {
        if (Math.floor((error?.response?.data?.code || 0) / 100) === 5) {
          const message =
            error?.response?.data?.message ||
            error?.message ||
            error?.toString();
          setBodyError({ message });
          setModalError(true);
        }
      });
  };

  // handle back page
  const handleBackPage = () => {
    if (Object.values(formValue).length > 0) {
      setOpenBack(true);
    } else {
      setOpenBack(false);
      navigate(-1);
    }
  };

  // Routes
  const routes = [
    {
      path: "",
      breadcrumbName: "Rating Billing",
    },
    {
      path: RBI_ROUTES.CALCULATION_VIEW,
      breadcrumbName: "Calculation",
    },
    {
      path: "",
      breadcrumbName: "Create Calculation",
    },
  ];

  // Handle Change Billing Cycle
  const handleChangeBillingCycle = (e) => {
    setBillingCycle(e);
    dispatch(getListBillingPeriod(e));
  };

  // Handle Change Billing Cycle
  const handleChangeSOR = (e) => {
    setDataSpecificCustomer((prevState) => {
      return {
        ...prevState,
        sorId: e,
      };
    });
    form.resetFields(["specificCustomer"]);
  };

  // Handle Change Cost Center
  const handleChangeCostCenter = (e) => {
    setDataSpecificCustomer((prevState) => {
      return {
        ...prevState,
        costCenterId: e || null,
        meterReadingCodeId: [],
      };
    });
    const body = {
      ccIds: (e || []).map((data) => {
        return {
          ccId: data,
        };
      }),
    };
    dispatch(getListMeterReadingCode(body));
    form.resetFields(["meterReading", "specificCustomer"]);
  };

  // Handle Change Meter Reading Route
  const handleMeterReadingRoute = (e) => {
    setDataSpecificCustomer((prevState) => {
      return {
        ...prevState,
        meterReadingCodeId: e,
      };
    });
    form.resetFields(["specificCustomer"]);
  };

  // Handle Change Account Group
  const handleAccountGroup = (e) => {
    setDataSpecificCustomer((prevState) => {
      return {
        ...prevState,
        accountGroupTypeId: e,
      };
    });
    form.resetFields(["specificCustomer"]);
  };

  // Handle Change Account Segment
  const handleAccountSegment = (e) => {
    setDataSpecificCustomer((prevState) => {
      return {
        ...prevState,
        accountSegmentId: e,
        accountGroupTypeId: [],
      };
    });
    const body = {
      accSegment: (e || []).map((data) => {
        return {
          accSegmentId: data,
        };
      }),
    };
    dispatch(getListAccountGroup(body));
    form.resetFields(["accountGroupType", "specificCustomer"]);
  };

  // Handle Change Create New
  const handleCreateNew = () => {
    let tempData = [
      "costCenter",
      "meterReading",
      "accountSegment",
      "accountGroupType",
      "specificCustomer",
      "type",
      "remark",
    ];
    if (defaultData?.costCenter) {
      tempData = tempData.filter((item) => item !== "costCenter");
    }
    form.resetFields(tempData);
    setModalSuccess(false);
    setOpenModal(false);
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
    <LayoutMenu>
      <BreadCrumb routes={routes} />
      <Spin spinning={loading}>
        <Form layout={"vertical"} form={form} onFinish={onFinish}>
          <BaseContainer header={"BIlling Cycle Information"}>
            <div className={"w-full grid grid-cols-2 gap-2"}>
              <Form.Item
                label={"Billing Cycle"}
                name={"billing_cycle"}
                rules={formMessageRequired("Billing Cycle")}
              >
                <SelectComponent
                  onChange={handleChangeBillingCycle}
                  options={list_billing_cycle?.data?.map((item) => {
                    return {
                      label: item?.name,
                      value: item?.id,
                    };
                  })}
                />
              </Form.Item>
              <Form.Item
                label={"Billing Period"}
                name={"billing_period"}
                rules={formMessageRequired("Billing Period")}
              >
                <SelectComponent
                  disabled={!billingCycle}
                  options={
                    billingCycle
                      ? list_billing_period?.data?.map((item) => {
                          return {
                            label: item?.name,
                            value: item?.id,
                          };
                        })
                      : []
                  }
                />
              </Form.Item>
            </div>
          </BaseContainer>
          <BaseContainer header={"Input Parameter Information"}>
            <div className={"w-full grid grid-cols-2 gap-2"}>
              <Form.Item
                label={"Calculation Type"}
                name={"calculation_type"}
                rules={formMessageRequired("Calculation Type")}
              >
                <SelectComponent
                  options={list_calculation_type?.map((item) => {
                    return {
                      label: item?.name,
                      value: item?.id,
                    };
                  })}
                />
              </Form.Item>
              <Form.Item
                label={"Service Type"}
                name={"serviceType"}
                rules={formMessageRequired("Service Type")}
              >
                <SelectComponent
                  options={list_service_type?.map((item) => {
                    return {
                      label: item?.name,
                      value: item?.id,
                    };
                  })}
                />
              </Form.Item>
              <div className="col-span-2">
                <Form.Item
                  label={"SOR"}
                  name={"sor"}
                  rules={formMessageRequired("SOR")}
                >
                  <SelectComponent
                    onChange={handleChangeSOR}
                    options={list_sor?.data?.map((item) => {
                      return {
                        label: item?.name,
                        value: item?.id,
                      };
                    })}
                    disabled={defaultData?.sor}
                  />
                </Form.Item>
              </div>
              <Form.Item label={"Cost Center"} name={"costCenter"}>
                <SelectComponent
                  mode={"multiple"}
                  onChange={handleChangeCostCenter}
                  disabled={defaultData?.costCenter?.length !== 0}
                  options={list_cost_center?.data?.map((item) => {
                    return {
                      label: item?.name,
                      value: item?.id,
                    };
                  })}
                />
              </Form.Item>
              <Form.Item label={"Meter Reading Code"} name={"meterReading"}>
                <SelectComponent
                  mode={"multiple"}
                  onChange={handleMeterReadingRoute}
                  disabled={
                    !dataSpecificCustomer?.costCenterId ||
                    dataSpecificCustomer?.costCenterId?.length === 0
                  }
                  options={mergedArrayMrc?.map((item) => {
                    return {
                      label: item?.name,
                      value: item?.id,
                    };
                  })}
                />
              </Form.Item>
              <Form.Item label={"Account Segment"} name={"accountSegment"}>
                <SelectComponent
                  mode={"multiple"}
                  onChange={handleAccountSegment}
                  options={(list_customer_segment?.Data || []).map((item) => {
                    return {
                      label: item?.name,
                      value: item?.id,
                    };
                  })}
                />
              </Form.Item>
              <Form.Item label={"Account Group Type"} name={"accountGroupType"}>
                <SelectComponent
                  mode={"multiple"}
                  onChange={handleAccountGroup}
                  disabled={
                    !dataSpecificCustomer?.accountSegmentId ||
                    dataSpecificCustomer?.accountSegmentId?.length === 0
                  }
                  options={(mergedArrayGroupType || [])?.map((item) => {
                    return {
                      label: item?.name,
                      value: item?.id,
                    };
                  })}
                />
              </Form.Item>
              <div className="col-span-2">
                <Form.Item
                  label={"Specific Customer Account"}
                  name={"specificCustomer"}
                >
                  <SelectComponent
                    mode={"multiple"}
                    disabled={!dataSpecificCustomer?.sorId}
                    options={(list_specific_customer || []).map((item) => {
                      return {
                        label: item.name,
                        value: item.code,
                      };
                    })}
                  />
                </Form.Item>
              </div>
            </div>
          </BaseContainer>
          <BaseContainer header={"Scheduler Information"}>
            <Form.Item
              label={"Type"}
              name={"type"}
              rules={formMessageRequired("Type")}
            >
              <SelectComponent
                options={(list_scheduler_type || []).map((item) => {
                  return {
                    label: item?.name,
                    value: item?.id,
                  };
                })}
              />
            </Form.Item>
            <Form.Item label={"Remark"} name={"remark"}>
              <InputComponent
                type="textarea"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
              />
            </Form.Item>
          </BaseContainer>
          <div className={"w-full flex mt-5"}>
            <div className={"w-full justify-start"}>
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
                  onClick={handleBackPage}
                >
                  Back
                </ButtonComponent>
              </Form.Item>
            </div>
            <div className={"w-full justify-end flex gap-2"}>
              <ButtonComponent
                type={"submit"}
                icon={
                  <SVGIcon
                    name={
                      type === "update" ? `IconButtonReset` : `IconButtonClear`
                    }
                    width={24}
                  />
                }
                onClick={handleReset}
              >
                {type === "create" ? "Clear" : "Reset"}
              </ButtonComponent>
              <Form.Item>
                <ButtonComponent type={"submit"} htmlType={"submit"}>
                  Save
                </ButtonComponent>
              </Form.Item>
            </div>
          </div>
        </Form>
      </Spin>

      {/* modal back */}
      <ModalConfirm
        isOpen={openBack}
        handleCancel={() => setOpenBack(false)}
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

      {/* modal confirmation */}
      <ModalCustom
        isOpen={openModal}
        handleCancel={() => setOpenModal(false)}
        header={"CONFIRMATION"}
        width={900}
        type={"confirmation"}
        footer={
          <div className={"flex w-full justify-end gap-2 mb-5"}>
            <ButtonComponent onClick={() => setOpenModal(false)}>
              Cancel
            </ButtonComponent>
            <ButtonComponent type={"submit"} onClick={handleSave}>
              Confirm
            </ButtonComponent>
          </div>
        }
      >
        <FormConfirmation data={dataFinal} />
      </ModalCustom>

      {/* Modal Success */}

      <Modal
        open={modalSuccess}
        onOk={() => navigate(-1)}
        onCancel={() => navigate(-1)}
        footer={
          <div className="flex justify-end gap-4">
            <ButtonComponent
              type={"submit"}
              onClick={handleCreateNew}
              border={false}
            >
              Create New
            </ButtonComponent>
            <ButtonComponent
              type={"submit"}
              onClick={() => navigate(-1)}
              border={false}
            >
              OK
            </ButtonComponent>
          </div>
        }
        className={"modal-custom"}
        centered={true}
        width={500}
        maskClosable={false}
      >
        <div className="px-8 py-8 justify-center">
          <div className="w-full flex gap-[20px]">
            {IconModal["icon_success_default"]}
            <p className="text-[18px] font-bold">{"Successful"}</p>
          </div>
          <p className="pl-[70px]">{"Your data has been created."}</p>
        </div>
      </Modal>

      {/** Modal Retry */}
      <ModalError
        isOpen={modalError}
        handleOk={handleRetry}
        handleCancel={handleCloseModalError}
        customText={"Try Again"}
      >
        <div className="px-5 pt-5 pb-[10px] justify-center">
          <div className="w-full flex gap-[20px]">
            <SVGIcon name="IconFailed" width={48} />
            <p className="text-[18px] font-bold">{"Failed"}</p>
          </div>
          <p className="pl-[70px]">{`Your data was not created. ${bodyError.message}.`}</p>
          <p className="pl-[70px]">Please try again.</p>
        </div>
      </ModalError>
    </LayoutMenu>
  );
};

export default CalculationForm;
