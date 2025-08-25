import React, { useEffect, useRef } from "react";
import { Fragment } from "react";
import InputComponent from "../../../../../../../components/InputComponent";
import { Checkbox, DatePicker, Form, Select } from "antd";
import { dateFormatting, requiredMessage } from "../../../../../../../utils";
import DateComponent from "../../../../../../../components/DateComponent";
import ButtonComponent from "../../../../../../../components/ButtonComponent";
import SelectComponent from "../../../../../../../components/SelectComponent";
import SVGIcon from "../../../../../../../assets/Icon/index";
import UtilsDate from "./UtilsDate";

const AssignPage = ({
  handleModalChooseAsset = () => {},
  handleModalUpdateAsset = () => {},
  isUpdated = {},
  type = {},
  checkedCustody = () => {},
  onChangeCustody = () => {},
  isEnableCheckbox = {},
  optionsAssetName = [],
  optionsAssetType = [],
  optionsServiceType = [],
  optionsProductName = [],
  optionsBrand = [],
  optionsGsize = [],
  optionsAnsi = [],
  setAssetName = () => {},
  assetName,
}) => {
  const wrapper = "flex flex-col";
  const style = {
    borderRadius: "6px",
    boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    padding: "4px 12px",
  };
  return (
    <Fragment>
      {type ? (
        <div>
          <div className="w-full flex flex-row justify-end mb-5 gap-2">
            {isUpdated ? (
              <ButtonComponent
                type={"submit"}
                onClick={() => {
                  handleModalUpdateAsset(true);
                }}
                icon={<SVGIcon name="IconEdit" width={24} color={"#FFFFFF"} />}
              >
                Update Asset
              </ButtonComponent>
            ) : null}
            <ButtonComponent
              type={"submit"}
              onClick={() => {
                handleModalChooseAsset(true);
              }}
              icon={<SVGIcon name="IconButtonCreate" width={24} />}
            >
              Choose Asset
            </ButtonComponent>
          </div>
        </div>
      ) : (
        <div className="text-primary text-xs font-bold uppercase mb-5">
          {"ASSET INFORMATION"}
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        <Form.Item
          name={"productVersion"}
          label={"Product Name"}
          // rules={[{ message: requiredMessage("Product Name"), required: true }]}
          className="no-margin-form"
        >
          <SelectComponent mandatory disabled={type}>
            {optionsProductName?.map((item) => (
              <Select.Option key={item.id} value={item.id}>
                {item.productName}
              </Select.Option>
            ))}
          </SelectComponent>
        </Form.Item>

        <Form.Item
          name={"serviceType"}
          label={"Service Type"}
          rules={[{ message: requiredMessage("Service Type"), required: true }]}
          className="no-margin-form"
        >
          <SelectComponent mandatory disabled>
            {optionsServiceType?.map((item) => (
              <Select.Option key={item.glbTypeValId} value={item.glbTypeValId}>
                {item.name}
              </Select.Option>
            ))}
          </SelectComponent>
        </Form.Item>

        <Form.Item
          name={"assetName"}
          label={"Asset Name"}
          rules={[{ message: requiredMessage("Asset Name"), required: true }]}
        >
          <SelectComponent
            mandatory
            disabled={type}
            onChange={(e) => setAssetName(e)}
          >
            {optionsAssetName?.map((item) => (
              <Select.Option key={item.glbTypeValId} value={item.glbTypeValId}>
                {item.name}
              </Select.Option>
            ))}
          </SelectComponent>
        </Form.Item>

        <Form.Item
          name={"type"}
          label={"Asset Type"}
          rules={[{ message: requiredMessage("Asset Type"), required: true }]}
          className="no-margin-form"
        >
          <SelectComponent disabled={type}>
            {optionsAssetType?.map((item) => (
              <Select.Option key={item.glbTypeValId} value={item.glbTypeValId}>
                {item.name}
              </Select.Option>
            ))}
          </SelectComponent>
        </Form.Item>

        <Form.Item
          name={"serialNumber"}
          label={"Serial Number"}
          rules={[
            { message: requiredMessage("Serial Number"), required: true },
          ]}
        >
          <InputComponent
            disabled={type}
            mandatory
            // onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          name={"brand"}
          label={"Brand"}
          rules={[{ message: requiredMessage("Brand"), required: true }]}
          className="no-margin-form"
        >
          <SelectComponent mandatory disabled={type}>
            {optionsBrand?.map((item) => (
              <Select.Option key={item.glbTypeValId} value={item.glbTypeValId}>
                {item.name}
              </Select.Option>
            ))}
          </SelectComponent>
        </Form.Item>

        <Form.Item
          name={"year"}
          label={"Year"}
          // rules={[{ message: requiredMessage("Year"), required: true }]}
          className="no-margin-form"
        >
          <UtilsDate allowClear picker="year" disabled={type} format="YYYY" />
        </Form.Item>

        <Form.Item name="custodyTransfer" valuePropName="checked" noStyle>
          <div className="flex flex-col pt-[30px]">
            <Checkbox
              checked={checkedCustody}
              onChange={onChangeCustody}
              disabled={isEnableCheckbox}
            >
              Custody Transfer
            </Checkbox>
            <span className="text-xs text-[#92979D]">
              Check if this state is custody transfer
            </span>
          </div>
        </Form.Item>

      </div>

      <div className="text-primary text-xs font-bold uppercase mt-5 mb-5">
        {"ASSET ATTRIBUTE"}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Form.Item
          name={"inletDiameter"}
          label={"Inlet Diameter"}
          // rules={[
          //   { message: requiredMessage("Inlet Diameter"), required: true },
          // ]}
        >
          <InputComponent
            disabled={type}
            onInput={(e) =>
              (e.target.value = e.target.value.replace(/[^0-9,]/g, ""))
            }
            // onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          name={"outletDiameter"}
          label={"Outlet Diameter"}
          // rules={[
          //   { message: requiredMessage("Outlet Diameter"), required: true },
          // ]}
        >
          <InputComponent
            disabled={type}
            onInput={(e) =>
              (e.target.value = e.target.value.replace(/[^0-9,]/g, ""))
            }
            // onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          name={"minimumInletPressure"}
          label={"Minimum Inlet Pressure"}
          // rules={[
          //   {
          //     message: requiredMessage("Minimum Inlet Pressure"),
          //     required: true,
          //   },
          // ]}
        >
          <InputComponent
            disabled={type}
            onInput={(e) =>
              (e.target.value = e.target.value.replace(/[^0-9,]/g, ""))
            }
            // onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Item>


        {/* line 2 */}
        <Form.Item
          name={"maximumInletPressure"}
          label={"Maximum Inlet Pressure"}
          // rules={[
          //   {
          //     message: requiredMessage("Maximum Inlet Pressure"),
          //     required: true,
          //   },
          // ]}
        >
          <InputComponent
            disabled={type}
            onInput={(e) =>
              (e.target.value = e.target.value.replace(/[^0-9,]/g, ""))
            }
            // onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          name={"minimumOutletPressure"}
          label={"Minimum Oulet Pressure"}
          // rules={[
          //   {
          //     message: requiredMessage("Minimum Oulet Pressure"),
          //     required: true,
          //   },
          // ]}
        >
          <InputComponent
            disabled={type}
            onInput={(e) =>
              (e.target.value = e.target.value.replace(/[^0-9,]/g, ""))
            }
            // onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          name={"maximumOutletPressure"}
          label={"Maximum Outlet Pressure"}
          // rules={[
          //   {
          //     message: requiredMessage("Maximum Outlet Pressure"),
          //     required: true,
          //   },
          // ]}
        >
          <InputComponent
            disabled={type}
            onInput={(e) =>
              (e.target.value = e.target.value.replace(/[^0-9,]/g, ""))
            }
            // onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Item>


        {/* line 3 */}

        <Form.Item
          name={"maxFlowCapacityPerStream"}
          label={"Max Flow Capacity Per Stream"}
          // rules={[
          //   {
          //     message: requiredMessage("Max Flow Capacity Per Stream"),
          //     required: true,
          //   },
          // ]}
        >
          <InputComponent
            disabled={type}
            onInput={(e) =>
              (e.target.value = e.target.value.replace(/[^0-9,]/g, ""))
            }
            // onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          name={"streamAmount"}
          label={"Stream Amount"}
          // rules={[
          //   { message: requiredMessage("Stream Amount"), required: true },
          // ]}
        >
          <InputComponent
            disabled={type}
            onInput={(e) =>
              (e.target.value = e.target.value.replace(/[^0-9,]/g, ""))
            }
            // onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          name={"gsize"}
          label={"G Size"}
          rules={[
            {
              message: requiredMessage("G SIZE"),
              required: assetName === 155 ? true : false,
            },
          ]}
        >
          <SelectComponent disabled={type}>
            {optionsGsize?.map((item) => (
              <Select.Option key={item.id} value={item.id}>
                {item.text}
              </Select.Option>
            ))}
          </SelectComponent>
        </Form.Item>

        {/* line 4 */}
        <Form.Item
          name={"settingPressure"}
          label={"Setting Pressure"}
          // rules={[
          //   { message: requiredMessage("Setting Pressure"), required: true },
          // ]}
        >
          <InputComponent
            disabled={type}
            onInput={(e) =>
              (e.target.value = e.target.value.replace(/[^0-9,]/g, ""))
            }
            // onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          name={"length"}
          label={"Length"}
          // rules={[{ message: requiredMessage("Length"), required: true }]}
        >
          <InputComponent
            disabled={type}
            onInput={(e) =>
              (e.target.value = e.target.value.replace(/[^0-9,]/g, ""))
            }
            // onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          name={"boltHoleAmount"}
          label={"Bolt Hole Amount"}
          // rules={[
          //   { message: requiredMessage("Bolt Hole Amount"), required: true },
          // ]}
        >
          <InputComponent
            disabled={type}
            onInput={(e) =>
              (e.target.value = e.target.value.replace(/[^0-9,]/g, ""))
            }
            // onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Item>

        {/* line 5 */}
        <Form.Item
          name={"minimumCapacity"}
          label={"Minimum Capacity"}
          // rules={[
          //   { message: requiredMessage("Minimum Capacity"), required: true },
          // ]}
        >
          <InputComponent
            disabled={type}
            onInput={(e) =>
              (e.target.value = e.target.value.replace(/[^0-9,]/g, ""))
            }
            // onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          name={"maximumCapacity"}
          label={"Maximum Capacity"}
          // rules={[
          //   { message: requiredMessage("Maximum Capacity"), required: true },
          // ]}
        >
          <InputComponent
            disabled={type}
            onInput={(e) =>
              (e.target.value = e.target.value.replace(/[^0-9,]/g, ""))
            }
            // onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          name={"ansi"}
          label={"Class/ANSI"}
          // rules={[{ message: requiredMessage("Class / ANSI"), required: true }]}
        >
          <SelectComponent disabled={type}>
            {optionsAnsi?.map((item) => (
              <Select.Option key={item.id} value={item.id}>
                {item.name}
              </Select.Option>
            ))}
          </SelectComponent>
        </Form.Item>
      </div>

      <div className="w-full">
        {/* last line */}
        <Form.Item
          name={"description"}
          label={"Description"}
          // rules={[{ message: requiredMessage("Description"), required: true }]}
        >
          <InputComponent
            disabled={type}
            type="textarea"
            // onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Item>
      </div>

      {type ? (
        <div>
          <div className="text-primary text-xs font-bold uppercase mt-5 mb-5">
            {"ASSET ASSIGNMENT INFORMATION"}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Form.Item
              name={"premiseAddress"}
              label={"Premise Address"}
              rules={[
                {
                  message: requiredMessage("Premise Address"),
                  required: true,
                },
              ]}
            >
              <InputComponent
                disabled
                mandatory
                // onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Item>

            <Form.Item
              name={"servicePoint"}
              label={"Service Point"}
              rules={[
                { message: requiredMessage("Service Point"), required: true },
              ]}
            >
              <InputComponent
                disabled
                mandatory
                // onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Item>

            <Form.Item
              name={"installDate"}
              label="Install Date"
              rules={[
                {
                  message: requiredMessage("Install Date"),
                  required: true,
                  type: "object",
                },
              ]}
              className="no-margin-form w-full"
            >
              <DatePicker format={dateFormatting?.date} className="w-full"/>
            </Form.Item>

            <div className="col-span-3">
              <Form.Item
                name={"remarks"}
                label={"Remark"}
                // rules={[
                //   { message: requiredMessage("Remarks"), required: true },
                // ]}
              >
                <InputComponent
                  type="textarea"
                  // onChange={(e) => setDescription(e.target.value)}
                />
              </Form.Item>
            </div>
          </div>
        </div>
      ) : null}
    </Fragment>
  );
};

export default AssignPage;
