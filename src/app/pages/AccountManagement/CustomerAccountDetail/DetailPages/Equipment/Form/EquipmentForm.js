import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Checkbox, Form, Input } from "antd";

import ModalCustom from "../../../../../../../components/Modal/ModalCustom";
import ButtonComponent from "../../../../../../../components/ButtonComponent";
import SelectComponent from "../../../../../../../components/SelectComponent";
import { hasValue, requiredMessage } from "../../../../../../../utils";
import {
  getDdlBrandEquipment,
  getDdlCapacityEquipment,
  getDdlEnergyEquipment,
  getDdlGasConversionEquipment,
  getDdlNameEquipment,
  getDdlQtyEquipment,
  getDdlTypeEquipment,
  getDdlFuelTypeEquipment,
} from "../../../../../../../redux/slices/account_management/detailAccount/equpmentSlice";
import InputComponent from "../../../../../../../components/InputComponent";
import SVGIcon from "../../../../../../../assets/Icon/index";
import accountManagementService from "../../../../../../../redux/services/account_management/accountManagementService";
import { validateCreateUpdate } from "../../../../../../../redux/slices/general_slice";
import DetailText from "../../../../../../../components/DetailText";

const EquipmentForm = ({
  type,
  dispatch,
  isOpen,
  setIsOpen,
  idAccount,
  idEquipment,
  body,
  setBody,
  handleSave,
  openConfirmation,
  setOpenConfirmation,
  form,
}) => {
  const {
    ddlNameEquipment,
    ddlTypeEquipment,
    ddlBrandEquipment,
    ddlQtyEquipment,
    ddlCapacityEquipment,
    ddlEnergyEquipment,
    ddlGasConversionEquipment,
    ddlFuelTypeEquipment,
    data_detail,
  } = useSelector((state) => state.accountEquipment);
  const [isDualFuel, setIsDualFuel] = useState(false);

  useEffect(() => {
    dispatch(getDdlNameEquipment());
    dispatch(getDdlTypeEquipment());
    dispatch(getDdlBrandEquipment());
    dispatch(getDdlQtyEquipment());
    dispatch(getDdlCapacityEquipment());
    dispatch(getDdlEnergyEquipment());
    dispatch(getDdlGasConversionEquipment());
    dispatch(getDdlFuelTypeEquipment());
  }, [dispatch]);

  const assert = useCallback(
    (data) => {
      if (data) {
        form.setFieldsValue({
          name: ddlNameEquipment?.filter(
            (item) => item?.label === data?.name,
          )[0]?.value,
          typeEquipment: ddlTypeEquipment?.filter(
            (item) => item?.label === data?.typeEquipment,
          )[0]?.value,
          brand: ddlBrandEquipment?.filter(
            (item) => item?.label === data?.brand,
          )[0]?.value,
          quantity: {
            value: data?.qty,
            id: ddlQtyEquipment?.filter(
              (item) => item?.label === data?.qtyUom,
            )[0]?.value,
          },
          capacity: {
            value: data?.cap,
            id: ddlCapacityEquipment?.filter(
              (item) => item?.label === data?.capUom,
            )[0]?.value,
          },
          energy: {
            value: data?.con,
            id: ddlEnergyEquipment?.filter(
              (item) => item?.label === data?.conUom,
            )[0]?.value,
          },
          gasConversion: {
            value: data?.gasConv,
            id: ddlGasConversionEquipment?.filter(
              (item) => item?.label === data?.gasConvUom,
            )[0]?.value,
          },
          noh: parseInt(data?.noh),
          nod: parseInt(data?.nod),
          isDualFuel: data?.isDualFuel === "No" ? false : true,
          fuelType1: data?.fuelType1Id,
          fuelType2: data?.fuelType2Id,
          description: data?.description,
        });
        setIsDualFuel(data?.isDualFuel === "No" ? false : true);
      }
    },
    [form, data_detail],
  );

  useEffect(() => {
    if (data_detail && type === "update") {
      assert(data_detail);
    }
  }, [assert, data_detail, type]);

  const handleReset = () => {
    if (type === "create") {
      form.resetFields();
      // handleInputChange(null, form);
    } else {
      assert(data_detail);
      // getValueForm(countryId, provinceId, cityId, districtId, subDistrictId)
    }
  };
  const onFinishCreate = async (formValue) => {
    try {
      let validateValueObj;
      let body;
      if (type === "update") {
        body = {
          ...formValue,
          id: idEquipment,
          accountId: idAccount,
          qty: formValue?.quantity?.value,
          qtyUom: formValue?.quantity?.id,
          cap: formValue?.capacity?.value,
          capUom: formValue?.capacity?.id,
          con: formValue?.energy?.value,
          conUom: formValue?.energy?.id,
          gasConv: formValue?.gasConversion?.value,
          gasConvUom: formValue?.gasConversion?.id,
          isDualFuel: formValue?.isDualFuel,
          noh: parseInt(formValue?.noh),
          nod: parseInt(formValue?.nod),
          fuelType2: hasValue(formValue?.fuelType2)
            ? formValue?.fuelType2
            : null,
        };

        validateValueObj = {
          body: body,
          services: accountManagementService,
          endPoint:
            "/v1/dbs/api/account-detail/equipment/validate-create-update",
          type,
        };
      } else {
        body = {
          ...formValue,
          id: null,
          accountId: idAccount,
          qty: formValue?.quantity?.value,
          qtyUom: formValue?.quantity?.id,
          cap: formValue?.capacity?.value,
          capUom: formValue?.capacity?.id,
          con: formValue?.energy?.value,
          conUom: formValue?.energy?.id,
          gasConv: formValue?.gasConversion?.value,
          gasConvUom: formValue?.gasConversion?.id,
          isDualFuel: hasValue(formValue?.isDualFuel)
            ? formValue?.isDualFuel
            : false,
          noh: parseInt(formValue?.noh),
          nod: parseInt(formValue?.nod),
          fuelType2: hasValue(formValue?.fuelType2)
            ? formValue?.fuelType2
            : null,
        };

        validateValueObj = {
          body: body,
          services: accountManagementService,
          endPoint:
            "/v1/dbs/api/account-detail/equipment/validate-create-update",
          type,
        };
      }
      delete body.capacity;
      delete body.energy;
      delete body.gasConversion;
      delete body.quantity;

      await dispatch(validateCreateUpdate(validateValueObj))?.unwrap();
      setIsOpen(false);
      setOpenConfirmation(true);
      setBody({
        body: body,
        validateValue: validateValueObj,
      });
    } catch (error) {
      return;
    }
  };

  return (
    <>
      {/* Modal Form */}
      <ModalCustom
        header={`${type === "create" ? "CREATE" : "UPDATE"} EQUIPMENT`}
        isOpen={isOpen}
        type={"confirmation"}
        handleCancel={() => {
          setIsOpen(false);
          form.resetFields();
        }}
        width={900}
        footer={
          <div className="w-full flex justify-end gap-5">
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
              onClick={() => {
                handleReset();
              }}
            >
              {type === "update" ? "Reset" : "Clear"}
            </ButtonComponent>
            <ButtonComponent
              form={"formCreate"}
              type={"submit"}
              htmlType="submit"
            >
              Save
            </ButtonComponent>
          </div>
        }
      >
        <Form
          id={"formCreate"}
          layout="vertical"
          form={form}
          onFinish={onFinishCreate}
        >
          <div className="text-primary text-xs font-semibold uppercase pb-[30px]">
            EQUIPMENT INFORMATION
          </div>

          <div className={"grid grid-cols-3 w-full gap-x-6"}>
            <Form.Item
              name={"name"}
              label={"Name"}
              rules={[
                {
                  message: requiredMessage("Name"),
                  required: true,
                },
              ]}
            >
              <SelectComponent options={ddlNameEquipment} />
            </Form.Item>
            <Form.Item
              name={"typeEquipment"}
              label={"Type"}
              rules={[
                {
                  message: requiredMessage("Type"),
                  required: true,
                },
              ]}
            >
              <SelectComponent options={ddlTypeEquipment} />
            </Form.Item>
            <Form.Item
              name={"brand"}
              label={"Brand"}
              rules={[
                {
                  message: requiredMessage("Brand"),
                  required: true,
                },
              ]}
            >
              <SelectComponent options={ddlBrandEquipment} />
            </Form.Item>

            {/* Quantity Group */}
            <Form.Item label="Quantity" required>
              <Input.Group compact>
                <Form.Item
                  name={["quantity", "value"]}
                  noStyle
                  getValueFromEvent={(e) => {
                    return e.floatValue;
                  }}
                  rules={[
                    {
                      required: true,
                      message: requiredMessage("Quantity Value"),
                    },
                  ]}
                >
                  <InputComponent
                    decimalScale={2}
                    thousandSeparator={","}
                    decimalSeparator={"."}
                    type="numeric"
                  />
                </Form.Item>
                <Form.Item
                  name={["quantity", "id"]}
                  noStyle
                  rules={[
                    {
                      required: true,
                      message: requiredMessage("Quantity Type"),
                    },
                  ]}
                >
                  <SelectComponent width={80} options={ddlQtyEquipment} />
                </Form.Item>
              </Input.Group>
            </Form.Item>

            {/* Capacity Group */}
            <Form.Item label="Capacity" required>
              <Input.Group compact>
                <Form.Item
                  name={["capacity", "value"]}
                  noStyle
                  getValueFromEvent={(e) => {
                    return e.floatValue;
                  }}
                  rules={[
                    {
                      required: true,
                      message: requiredMessage("Capacity Value"),
                    },
                  ]}
                >
                  <InputComponent
                    decimalScale={2}
                    thousandSeparator={","}
                    decimalSeparator={"."}
                    type="numeric"
                  />
                </Form.Item>
                <Form.Item
                  name={["capacity", "id"]}
                  noStyle
                  rules={[
                    {
                      required: true,
                      message: requiredMessage("Capacity Unit"),
                    },
                  ]}
                >
                  <SelectComponent width={80} options={ddlCapacityEquipment} />
                </Form.Item>
              </Input.Group>
            </Form.Item>

            {/* Energy Group */}
            <Form.Item label="Energy" required>
              <Input.Group compact>
                <Form.Item
                  name={["energy", "value"]}
                  noStyle
                  getValueFromEvent={(e) => {
                    return e.floatValue;
                  }}
                  rules={[
                    {
                      required: true,
                      message: requiredMessage("Energy Value"),
                    },
                  ]}
                >
                  <InputComponent
                    decimalScale={2}
                    thousandSeparator={","}
                    decimalSeparator={"."}
                    type="numeric"
                  />
                </Form.Item>
                <Form.Item
                  name={["energy", "id"]}
                  noStyle
                  rules={[
                    {
                      required: true,
                      message: requiredMessage("Energy Unit"),
                    },
                  ]}
                >
                  <SelectComponent width={80} options={ddlEnergyEquipment} />
                </Form.Item>
              </Input.Group>
            </Form.Item>

            {/* Gas Conversion Group */}
            <Form.Item label="Gas Conversion/Month" required>
              <Input.Group compact>
                <Form.Item
                  name={["gasConversion", "value"]}
                  noStyle
                  getValueFromEvent={(e) => {
                    return e.floatValue;
                  }}
                  rules={[
                    {
                      required: true,
                      message: requiredMessage("Gas Conversion Value"),
                    },
                  ]}
                >
                  <InputComponent
                    decimalScale={2}
                    thousandSeparator={","}
                    decimalSeparator={"."}
                    type="numeric"
                  />
                </Form.Item>
                <Form.Item
                  name={["gasConversion", "id"]}
                  noStyle
                  rules={[
                    {
                      required: true,
                      message: requiredMessage("Gas Conversion Unit"),
                    },
                  ]}
                >
                  <SelectComponent
                    width={80}
                    options={ddlGasConversionEquipment}
                  />
                </Form.Item>
              </Input.Group>
            </Form.Item>

            <Form.Item
              name={"noh"}
              label={"Operating Hours/Day"}
              rules={[
                {
                  message: requiredMessage("Operating Hours/Day"),
                  required: true,
                },
              ]}
            >
              <InputComponent type={"number"} />
            </Form.Item>
            <Form.Item
              name={"nod"}
              label={"Operating Days/Week"}
              rules={[
                {
                  message: requiredMessage("Operating Days/Week"),
                  required: true,
                },
              ]}
            >
              <InputComponent type={"number"} />
            </Form.Item>

            <Form.Item
              name="isDualFuel"
              label={"Dual Fuel"}
              // initialValue={isCheckPremise}
              valuePropName="checked"
            >
              <div className="flex flex-col">
                <Checkbox
                  checked={isDualFuel}
                  onChange={(e) => {
                    setIsDualFuel(e.target.checked);
                    form.resetFields(["fuelType2"]);
                  }}
                >
                  <span className="text-[12px]">
                    Check if equipment have dual fuel
                  </span>
                </Checkbox>
              </div>
            </Form.Item>
            <Form.Item
              name={"fuelType1"}
              label={"Fuel Type 1"}
              rules={[
                {
                  message: requiredMessage("Fuel Type 1"),
                  required: true,
                },
              ]}
            >
              <SelectComponent options={ddlFuelTypeEquipment} />
            </Form.Item>
            <Form.Item
              name={"fuelType2"}
              label={"Fuel Type 2"}
              rules={[
                {
                  message: requiredMessage("Fuel Type 2"),
                  required: isDualFuel,
                },
              ]}
            >
              <SelectComponent
                disabled={!isDualFuel}
                options={ddlFuelTypeEquipment}
              />
            </Form.Item>
          </div>

          <div className={"grid grid-cols-1 w-full gap-x-6"}>
            <Form.Item name={"description"} label={"Description"}>
              <InputComponent type="textarea" />
            </Form.Item>
          </div>
        </Form>
      </ModalCustom>

      {/* Modal Confirmation */}
      <ModalCustom
        header={`CONFIRMATION`}
        isOpen={openConfirmation}
        type={"confirmation"}
        handleCancel={() => {
          setOpenConfirmation(false);
          setIsOpen(true);
        }}
        width={900}
        footer={
          <div className="w-full flex justify-end gap-5 px-[4px] pb-[10px]">
            <ButtonComponent
              onClick={() => {
                setOpenConfirmation(false);
                setIsOpen(true);
              }}
              type="default"
            >
              Cancel
            </ButtonComponent>
            <ButtonComponent onClick={handleSave} type={"submit"}>
              Confirm
            </ButtonComponent>
          </div>
        }
      >
        <div>
          <div className="text-primary text-xs font-bold uppercase py-4">
            Equipment Information
          </div>
          <div className="w-full grid grid-cols-3">
            <DetailText label={"Name"}>
              {
                ddlNameEquipment?.filter(
                  (item) => item?.value === body?.body?.name,
                )[0]?.label
              }
            </DetailText>
            <DetailText label={"Type"}>
              {
                ddlTypeEquipment?.filter(
                  (item) => item?.value === body?.body?.typeEquipment,
                )[0]?.label
              }
            </DetailText>
            <DetailText label={"Brand"}>
              {
                ddlBrandEquipment?.filter(
                  (item) => item?.value === body?.body?.brand,
                )[0]?.label
              }
            </DetailText>
            <DetailText label={"Quantity"}>
              {body?.body?.qty}{" "}
              {
                ddlQtyEquipment?.filter(
                  (item) => item?.value === body?.body?.qtyUom,
                )[0]?.label
              }
            </DetailText>
            <DetailText label={"Capacity"}>
              {body?.body?.cap}{" "}
              {
                ddlCapacityEquipment?.filter(
                  (item) => item?.value === body?.body?.capUom,
                )[0]?.label
              }
            </DetailText>
            <DetailText label={"Energy Consumption"}>
              {body?.body?.con}{" "}
              {
                ddlEnergyEquipment?.filter(
                  (item) => item?.value === body?.body?.conUom,
                )[0]?.label
              }
            </DetailText>
            <DetailText label={"Gas Conversion/Month"}>
              {body?.body?.gasConv}{" "}
              {
                ddlGasConversionEquipment?.filter(
                  (item) => item?.value === body?.body?.gasConvUom,
                )[0]?.label
              }
            </DetailText>
            <DetailText label={"Operating Hours/Day"}>
              {body?.body?.noh}
            </DetailText>
            <DetailText label={"Operating Days/Week"}>
              {body?.body?.nod}
            </DetailText>
            <DetailText label={"Dual Fuel"}>
              {body?.body?.isDualFuel ? "Yes" : "No"}
            </DetailText>
            <DetailText label={"Fuel Type 1"}>
              {
                ddlFuelTypeEquipment?.filter(
                  (item) => item?.value === body?.body?.fuelType1,
                )[0]?.label
              }
            </DetailText>
            <DetailText label={"Fuel Type 2"}>
              {
                ddlFuelTypeEquipment?.filter(
                  (item) => item?.value === body?.body?.fuelType2,
                )[0]?.label
              }
            </DetailText>
          </div>
          <div className="w-full">
            <DetailText label={"Description"}>
              {body?.body?.description}
            </DetailText>
          </div>
        </div>
      </ModalCustom>
    </>
  );
};

export default EquipmentForm;
