import React, { useEffect } from "react";
import BaseContainer from "../../../../../../components/BaseContainer";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../../assets/Icon/index";
import { requiredMessage } from "../../../../../../utils";
import { Form, Select } from "antd";
import SelectComponent from "../../../../../../components/SelectComponent";
import InputComponent from "../../../../../../components/InputComponent";
import DateComponent from "../../../../../../components/DateComponent";
import moment from "moment";
import { LeftOutlined } from "@ant-design/icons";
import RelationshipConfirm from "./RelationshipConfirm";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import { useState } from "react";
import LayoutMenu from "../../../../../../components/SidebarMenu/LayoutMenu";
import { useLocation, useNavigate } from "react-router-dom";
import HeaderDetail from "../../HeaderDetail";
import BreadCrumb from "../../../../../../components/BreadCrumb";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../routes/account_management/customer_account_routes";

const obj = {
  id: 1,
  accountInformation: {
    sorId: 1,
    sor: "SOR 3",
  },
};

const RelationshipCreateAndUpdate = ({
  type = {},
  handleChangeInteraction = () => {},
}) => {
  //declare
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const id = location?.state?.id;

  //modal
  const [modalConfirm, setModalConfirm] = useState(false);
  const [dataConfirm, setDataConfirm] = useState();

  useEffect(() => {
    if (obj && obj.id && type.action === "update") {
      form.setFieldsValue({
        subjectId: "23213213",
        subjectName: obj?.accountInformation?.sor,
        subjectTable: obj?.accountInformation?.sor,
        objectName: obj?.accountInformation?.sor,
        objectTable: obj?.accountInformation?.sor,
      });
    }
  }, [obj]);

  const sendData = (value) => {
    //code dispatch
  };

  const onFinish = (value) => {
    // console.log(moment(value.startDate).format("DD MMM YYYY"));
    const valueForm = {
      ...value,
      startDate: moment(value.startDate).format("DD MMM YYYY"),
      endDate: moment(value.endDate).format("DD MMM YYYY"),
    };
    setDataConfirm(valueForm);
  };

  const routes = [
    {
      path: "",
      breadcrumbName: "Account Management",
    },
    {
      path: "",
      breadcrumbName: "Customer/Account",
    },
    {
      path: "",
      breadcrumbName: "Detail Customer",
    },
    {
      path: ACCOUNT_MANAGEMENT_ROUTES.VIEW_DETAIL_ACCOUNT_STANDARD,
      breadcrumbName: "Detail Account",
    },
    {
      path:
        type === "create"
          ? ACCOUNT_MANAGEMENT_ROUTES.CREATE_RELATIONSHIP
          : ACCOUNT_MANAGEMENT_ROUTES.UPDATE_RELATIONSHIP,
      breadcrumbName:
        type === "create" ? "Create Relationship" : "Update Relationship",
    },
  ];

  return (
    <LayoutMenu>
      <Form
        id={"formRelationship"}
        layout={"vertical"}
        form={form}
        onFinish={onFinish}
      >
        <BreadCrumb routes={routes} />
        <div className="w-full">
          <HeaderDetail
            data_detail={obj}
            data_header={["CUSTOMER INFORMATION", "ACCOUNT INFORMATION"]}
          />
        </div>

        <BaseContainer header={"CREATE RELATIONSHIP"}>
          <div className="w-full grid grid-cols-3 gap-3">
            {/* Create Relationship */}

            <Form.Item
              name={"directionFlag"}
              rules={[
                { message: requiredMessage("Direction Flag"), required: true },
              ]}
              className="no-margin-form"
            >
              <SelectComponent mandatory label={"Direction Flag"}>
                <Select.Option
                  key={obj?.accountInformation?.sorId}
                  value={obj?.accountInformation?.sorId}
                >
                  {obj?.accountInformation?.sor}
                </Select.Option>
              </SelectComponent>
            </Form.Item>
            <Form.Item
              name={"relationshipCategory"}
              rules={[
                {
                  message: requiredMessage("Relationship Category"),
                  required: true,
                },
              ]}
              className="no-margin-form"
            >
              <SelectComponent mandatory label={"Relationship Category"}>
                <Select.Option
                  key={obj?.accountInformation?.sorId}
                  value={obj?.accountInformation?.sorId}
                >
                  {obj?.accountInformation?.sor}
                </Select.Option>
              </SelectComponent>
            </Form.Item>
          </div>
          <div className="text-primary text-xs font-bold uppercase mt-5 mb-5">
            {"RELATIONSHIP INFORMATION"}
          </div>

          <div className="w-full grid grid-cols-3 gap-3">
            {/* relationship information */}

            <div className="flex items-center gap-2">
              {/* line 1 */}
              <Form.Item
                name={"subjectId"}
                rules={[
                  { message: requiredMessage("Subject Id"), required: true },
                ]}
              >
                <InputComponent
                  label={"Subject Id"}
                  mandatory
                  disabled
                  // onChange={(e) => setName(e.target.value)}
                />
              </Form.Item>

              <ButtonComponent
                type={"submit"}
                onClick={() => {
                  // setModalConfirm(true);
                  //   setOpenModal(true);
                  //   setTypeModal("create");
                  //   setDataUpdate([]);
                }}
                icon={<SVGIcon name="IconButtonCreate" width={24} />}
              ></ButtonComponent>

              <ButtonComponent
                type={"submit"}
                onClick={() => {
                  // setModalConfirm(true);
                  //   setOpenModal(true);
                  //   setTypeModal("create");
                  //   setDataUpdate([]);
                }}
                icon={<SVGIcon name="IconClear" width={24} />}
              ></ButtonComponent>
            </div>

            <Form.Item
              name={"subjectName"}
              rules={[
                { message: requiredMessage("Subject Name"), required: true },
              ]}
              className="no-margin-form"
            >
              <SelectComponent mandatory disabled label={"Subject Name"}>
                <Select.Option
                  key={obj?.accountInformation?.sorId}
                  value={obj?.accountInformation?.sorId}
                >
                  {obj?.accountInformation?.sor}
                </Select.Option>
              </SelectComponent>
            </Form.Item>
            <Form.Item
              name={"subjectTable"}
              rules={[
                { message: requiredMessage("Subject Table"), required: true },
              ]}
              className="no-margin-form"
            >
              <SelectComponent mandatory disabled label={"Subject Table"}>
                <Select.Option
                  key={obj?.accountInformation?.sorId}
                  value={obj?.accountInformation?.sorId}
                >
                  {obj?.accountInformation?.sor}
                </Select.Option>
              </SelectComponent>
            </Form.Item>

            <div className="flex items-center gap-2">
              {/* line 2 */}
              <Form.Item
                name={"objectId"}
                rules={[
                  { message: requiredMessage("Object Id"), required: true },
                ]}
              >
                <InputComponent
                  label={"Object Id"}
                  mandatory
                  // onChange={(e) => setName(e.target.value)}
                />
              </Form.Item>

              <ButtonComponent
                type={"submit"}
                onClick={() => {
                  // setModalConfirm(true);
                  //   setOpenModal(true);
                  //   setTypeModal("create");
                  //   setDataUpdate([]);
                }}
                icon={<SVGIcon name="IconButtonCreate" width={24} />}
              ></ButtonComponent>

              <ButtonComponent
                type={"submit"}
                onClick={() => {
                  // setModalConfirm(true);
                  //   setOpenModal(true);
                  //   setTypeModal("create");
                  //   setDataUpdate([]);
                }}
                icon={<SVGIcon name="IconClear" width={24} />}
              ></ButtonComponent>
            </div>

            <Form.Item
              name={"objectName"}
              rules={[
                { message: requiredMessage("Object Name"), required: true },
              ]}
              className="no-margin-form"
            >
              <SelectComponent mandatory disabled label={"Object Name"}>
                <Select.Option
                  key={obj?.accountInformation?.sorId}
                  value={obj?.accountInformation?.sorId}
                >
                  {obj?.accountInformation?.sor}
                </Select.Option>
              </SelectComponent>
            </Form.Item>
            <Form.Item
              name={"objectTable"}
              rules={[
                { message: requiredMessage("Object Table"), required: true },
              ]}
              className="no-margin-form"
            >
              <SelectComponent mandatory disabled label={"Object Table"}>
                <Select.Option
                  key={obj?.accountInformation?.sorId}
                  value={obj?.accountInformation?.sorId}
                >
                  {obj?.accountInformation?.sor}
                </Select.Option>
              </SelectComponent>
            </Form.Item>

            {/* line 3 */}

            <Form.Item
              name={"relationCode"}
              rules={[
                { message: requiredMessage("Relation Code"), required: true },
              ]}
              className="no-margin-form"
            >
              <SelectComponent mandatory label={"Relation Code"}>
                <Select.Option
                  key={obj?.accountInformation?.sorId}
                  value={obj?.accountInformation?.sorId}
                >
                  {obj?.accountInformation?.sor}
                </Select.Option>
              </SelectComponent>
            </Form.Item>

            <Form.Item
              name={"startDate"}
              rules={[
                { message: requiredMessage("Start Date"), required: true },
              ]}
              className="no-margin-form"
            >
              <DateComponent
                label="Start Date"
                // dateDisable={handleDisableEndDate}
                // disabled={startDate === null}
              />
            </Form.Item>

            <Form.Item
              name={"endDate"}
              rules={[{ message: requiredMessage("End Date"), required: true }]}
              className="no-margin-form"
            >
              <DateComponent
                label="End Date"
                // dateDisable={handleDisableEndDate}
                // disabled={startDate === null}
              />
            </Form.Item>
          </div>

          <div className="w-full mt-5">
            <Form.Item
              name={"description"}
              rules={[
                { message: requiredMessage("Description"), required: true },
              ]}
            >
              <InputComponent
                label={"Description"}
                type="textarea"
                mandatory
                // onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Item>
          </div>
        </BaseContainer>
        <div className={"w-full flex justify-between mt-10"}>
          <div className=" flex">
            <ButtonComponent
              type={"submit"}
              onClick={() => navigate(-1)}
              icon={
                <LeftOutlined
                  style={{
                    color: "#fff",
                    fontSize: 24,
                    justifyItems: "center",
                  }}
                />
              }
            >
              Back
            </ButtonComponent>
          </div>

          <div className=" flex gap-5">
            <Form.Item>
              <ButtonComponent
                icon={<SVGIcon name="IconClear" width={24} color={"#FFFFFF"} />}
                type="submit"
                // onClick={() => {
                //   form.resetFields();
                //   setData([]);
                // }}
              >
                Clear
              </ButtonComponent>
            </Form.Item>
            <Form.Item>
              <ButtonComponent
                type="submit"
                htmlType={"submit"}
                form={"formRelationship"}
                onClick={() => {
                  setModalConfirm(true);
                }}
              >
                Save
              </ButtonComponent>
            </Form.Item>
          </div>
        </div>
      </Form>

      {/* create tax relation */}
      <ModalCustom
        isOpen={modalConfirm}
        type={"confirmation"}
        header="CONFIRMATION"
        width={1200}
        handleCancel={() => {
          setModalConfirm(false);
        }}
        footer={
          <div className={"w-full flex justify-end gap-3"}>
            <ButtonComponent
              onClick={() => {
                setModalConfirm(false);
              }}
              type="default"
            >
              Cancel
            </ButtonComponent>
            <ButtonComponent
              type="submit"
              onClick={() => {
                sendData(dataConfirm);
              }}
            >
              Confirm
            </ButtonComponent>
          </div>
        }
      >
        <RelationshipConfirm data={dataConfirm} />
      </ModalCustom>
    </LayoutMenu>
  );
};

export default RelationshipCreateAndUpdate;
