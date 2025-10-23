import React,{ useState } from 'react'
import { Checkbox, Form, Select } from 'antd';

import ButtonComponent from '../../../../../../components/ButtonComponent';
import ModalCustom from '../../../../../../components/Modal/ModalCustom';
import SelectComponent from '../../../../../../components/SelectComponent';
import SVGIcon from "../../../../../../assets/Icon/index";
import InputComponent from "../../../../../../components/InputComponent";


const ChooseAddressForm = () => {
  const [modalChooseAddres, setModalChooseAddres] = useState(false)

  return (
    <div>
      <div className="flex w-full justify-end gap-x-2">
        <ButtonComponent type={'submit'} onClick={()=> setModalChooseAddres(true)}>
          Choose Address
        </ButtonComponent>
      </div>
      <ModalCustom
        isOpen={modalChooseAddres}
        type={'confirmation'}
        header={"CHOOSE ADDRESS"}
        width={900}
        handleCancel={()=> setModalChooseAddres(false)}
      >
        test
      </ModalCustom>

      {/* Section Form Choose Existing Address */}
      <div className={"grid grid-cols-3 w-full gap-x-6"}>
        <Form.Item
          name={"country"}
          rules={[
            {
              message: "This field is required",
              required: true,
            },
          ]}
        >
          <SelectComponent disabled={true} mandatory label={"Country"}>
            <Select.Option key={1} value={1}>
              Person
            </Select.Option>
            <Select.Option key={2} value={2}>
              Organization
            </Select.Option>
          </SelectComponent>
        </Form.Item>
        <Form.Item
          name={"province"}
          rules={[
            {
              message: "This field is required",
              required: true,
            },
          ]}
        >
          <SelectComponent disabled={true} mandatory label={"Province"}>
            <Select.Option key={1} value={1}>
              Person
            </Select.Option>
            <Select.Option key={2} value={2}>
              Organization
            </Select.Option>
          </SelectComponent>
        </Form.Item>
        <Form.Item
          name={"city"}
          rules={[
            {
              message: "This field is required",
              required: true,
            },
          ]}
        >
          <SelectComponent disabled={true} mandatory label={"City"}>
            <Select.Option key={1} value={1}>
              Person
            </Select.Option>
            <Select.Option key={2} value={2}>
              Organization
            </Select.Option>
          </SelectComponent>
        </Form.Item>
        <Form.Item
          name={"district"}
          rules={[
            {
              message: "This field is required",
              required: true,
            },
          ]}
        >
          <SelectComponent disabled={true} mandatory label={"District"}>
            <Select.Option key={1} value={1}>
              Person
            </Select.Option>
            <Select.Option key={2} value={2}>
              Organization
            </Select.Option>
          </SelectComponent>
        </Form.Item>
        <Form.Item
          name={"subdistrict"}
          rules={[
            {
              message: "This field is required",
              required: true,
            },
          ]}
        >
          <SelectComponent disabled={true} mandatory label={"Sub District"}>
            <Select.Option key={1} value={1}>
              Person
            </Select.Option>
            <Select.Option key={2} value={2}>
              Organization
            </Select.Option>
          </SelectComponent>
        </Form.Item>
        <Form.Item
          name={"postalCode"}
          rules={[
            {
              message: "This field is required",
              required: true,
            },
          ]}
        >
          <InputComponent disabled={true} mandatory label={"Postal Code"} type="text" />
        </Form.Item>
        <Form.Item
          name={"building"}
          rules={[
            {
              message: "This field is required",
              required: true,
            },
          ]}
        >
          <InputComponent disabled={true} mandatory label={"Building"} type="text" />
        </Form.Item>
        <Form.Item
          name={"floor"}
          rules={[
            {
              message: "This field is required",
              required: true,
            },
          ]}
        >
          <InputComponent disabled={true} mandatory label={"Floor"} type="text" />
        </Form.Item>
        <Form.Item
          name={"houseName"}
          rules={[
            {
              message: "This field is required",
              required: true,
            },
          ]}
        >
          <InputComponent disabled={true} mandatory label={"House Name"} type="text" />
        </Form.Item>
        <Form.Item
          name={"streetName"}
          rules={[
            {
              message: "This field is required",
              required: true,
            },
          ]}
        >
          <InputComponent disabled={true} mandatory label={"Street Name"} type="text" />
        </Form.Item>
        <Form.Item
          name={"block"}
          rules={[
            {
              message: "This field is required",
              required: true,
            },
          ]}
        >
          <InputComponent disabled={true} mandatory label={"Block"} type="text" />
        </Form.Item>
        <Form.Item
          name={"houseNumber"}
          rules={[
            {
              message: "This field is required",
              required: true,
            },
          ]}
        >
          <InputComponent disabled={true} mandatory label={"House Number"} type="text" />
        </Form.Item>
        <Form.Item
          name={"rt"}
          rules={[
            {
              message: "This field is required",
              required: true,
            },
          ]}
        >
          <InputComponent disabled={true} mandatory label={"RT"} type="text" />
        </Form.Item>
        <Form.Item
          name={"rw"}
          rules={[
            {
              message: "This field is required",
              required: true,
            },
          ]}
        >
          <InputComponent disabled={true} mandatory label={"RW"} type="text" />
        </Form.Item>
        <Form.Item
          name={"additionalInfo"}
          rules={[
            {
              message: "This field is required",
              required: true,
            },
          ]}
        >
          <InputComponent disabled={true} mandatory label={"Additional Info"} type="text" />
        </Form.Item>
      </div>
      <div className="grid w-full gap-x-6">
        <Form.Item name={"descAddress"}>
          <InputComponent disabled={true}
            label={"Description"}
            type="textarea"
            value={"description"}
            // onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Item>
        <div>
          <h1>Address *</h1>
          <p>JL. ANGKASA, AA NO. 12, Y, RT 08/RW 02, 18394, GALUR, SENEN, JAKARTA PUSAT, DKI JAKARTA, INDONESIA</p>
        </div>
      </div>

      {/* Section Checkbox */}
      <div className={"grid grid-cols-3 w-full gap-x-6 py-8"}>
        <Form.Item name="premiseAddress" label={"Premise Address"} valuePropName="checked" noStyle>
          <div className='flex flex-col'>
            <Checkbox>Premise Address</Checkbox>
            <span className='pl-[26px] text-[10px]'>Check premise address if this address will be the place where the product is installed/applied</span>
          </div>
        </Form.Item>
        <Form.Item name="primaryAddress" label={"Primary Address"} valuePropName="checked" noStyle>
          <div className='flex flex-col'>
            <Checkbox>Primary Address</Checkbox>
            <span className='pl-[26px] text-[10px]'>Check primary address if this address is primary addres</span>
          </div>
        </Form.Item>
      </div>

      {/* Section Coordinate & business purpose */}
      <div className={"grid grid-cols-2 w-full gap-x-6"}>
        <div>
          <div className="pt-8 pb-4">
            <h1 className="text-primary text-xs font-bold uppercase">
              ADDRESS COORDINATE
            </h1>
          </div>
          <Form.Item
            name={"sourceCoordinate"}
            rules={[
              {
                message: "This field is required",
                required: true,
              },
            ]}
          >
            <SelectComponent mandatory label={"Source"}>
              <Select.Option key={1} value={1}>
                Digio
              </Select.Option>
              <Select.Option key={2} value={2}>
                Google Maps
              </Select.Option>
            </SelectComponent>
          </Form.Item>
        </div>
        <div>
          <div className="pt-8 pb-4">
            <h1 className="text-primary text-xs font-bold uppercase">
              ADDRESS BUSINESS PURPOSE
            </h1>
          </div>
          <Form.Item
            name={"businessPurposes"}
            rules={[
              {
                message: "This field is required",
                required: true,
              },
            ]}
          >
            <SelectComponent disabled={true} mandatory label={"Business Purposes"} mode={"multiple"} defaultValue={[1, 2]}>
              <Select.Option key={1} value={1}>
                Digio
              </Select.Option>
              <Select.Option key={2} value={2}>
                Google Maps
              </Select.Option>
            </SelectComponent>
          </Form.Item>
        </div>
      </div>

    </div>
  )
}

export default ChooseAddressForm