import React, { useState, useEffect } from "react";
import { SYSTEM_SETUP_ROUTES } from "../../../../../routes/system_setup/setup_routes";
import { useDispatch, useSelector } from "react-redux";

import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import GridLayout from "../../../../../components/GridLayout";

import BreadCrumb from "../../../../../components/BreadCrumb";
import { useNavigate, useLocation } from "react-router-dom";
import SVGIcon from "../../../../../assets/Icon/index";
import { Select, Spin, Tag, Form } from "antd";
import {
  LeftOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined
} from "@ant-design/icons";
import BaseContainer from "../../../../../components/BaseContainer";
import InputComponent from "../../../../../components/InputComponent";
import ButtonComponent from "../../../../../components/ButtonComponent";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import DetailText from "../../../../../components/DetailText";
import { ModalSuccess, ModalError } from "../../../../../components/Modal/ModalPopUp";
import { getUpdateCostCenter, getParent, getSiblingByParent, getType, updateCostCenter } from "../../../../../redux/slices/system_setup/master_data/master_cost_center";

const OPTIONS = ["Apples", "Nails", "Bananas", "Helicopters"];

const EditCostCenter = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const idDataRecord = location?.state?.id

  const [modalConfirmation, setModalConfirmation] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openModalSuccess, setOpenModalSuccess] = useState(false);
  const [openModalError, setOpenModalError] = useState(false);
  const [form] = Form.useForm();

  const [formValue, setFormValue] = useState({});

  const [siblings, setSiblings] = useState([]);
  const filteredOptions = OPTIONS.filter((o) => !siblings.includes(o));

  const { data, typeData, siblingsDataByParent, parentData, loading } = useSelector((state) => state.master_cost_center);
  const dataRecord = data
  const parentDataSource = parentData;
  const typeDataSource = typeData;
  const siblingsDataSource = siblingsDataByParent;
  const idParent = dataRecord?.parent;

  useEffect(() => {
    dispatch(getUpdateCostCenter(idDataRecord))
    dispatch(getParent())
    dispatch(getType())
  }, [dispatch])
  
  useEffect(() => {
		form.setFieldsValue({
			code: dataRecord?.code,
      costCenterName: dataRecord?.name,
      parent: dataRecord?.parent,
      type: dataRecord?.type,
      valName:  dataRecord?.valName,
      valCode:  dataRecord?.valCode,
      description: dataRecord?.description,
      sibling:  dataRecord?.sibling
		});
	}, [data]);

  useEffect(() => {
    idParent &&  dispatch(getSiblingByParent(idParent))
  }, [dispatch, idParent])
  
  
  const handleListSibling = async (id) =>{
    form.setFieldsValue({sibling:[]})
    dispatch(getSiblingByParent(id))
  }
  
  const handleCancel = () => {
		setOpenModal(false);
		setOpenModalSuccess(false);
		setOpenModalError(false);
	};

  const tagRender = (props) => {
    const { label, closable, onClose } = props;
    const onPreventMouseDown = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };
    return (
      <Tag
        color="#CEDBEC"
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{
          marginRight: 3,
        }}
        className={"select-multiple"}
      >
        {label}
      </Tag>
    );
  };

  const content = (
    <span className="text-[11px] font-bold  text-[#3C6DB2]">
      Please fill mandatory form
    </span>
  );

  const clearForm = () => {
    form.resetFields();
    form.setFieldsValue({
      sibling:[]
    })
  };

  const onFinish = () => {
    setFormValue(form.getFieldsValue())
    setModalConfirmation(true);
	};

  const submitForm = async () => {
    const body = {
      id: idDataRecord,
      name: formValue.costCenterName,
      code: formValue.code,
      parent: formValue.parent,
      type: formValue.type,
      sibling: formValue.sibling,
      description: formValue.description,
      valName: formValue.valName,
      valCode: formValue.valCode,
    };

    await dispatch(updateCostCenter(body))
    .unwrap()
    .then( (res) => {
      console.log("🚀 ~ file: EditCostCenter.js:142 ~ .then ~ res", res)
      if (res) {
        setModalConfirmation(false);
        setOpenModalSuccess(true);
      } else {
        setOpenModalError(true)
      }
    })
    .catch(() => {
      alert('gagal')
    })
    // setModalConfirmation(false);
    // setOpenModal(true);
  };
  const routes = [
		{
		path: "",
		breadcrumbName: "System Setup",
		},
		{
		path: "",
		breadcrumbName: "Master Data",
		},
		{
		path: SYSTEM_SETUP_ROUTES.VIEW_COST_CENTER,
		breadcrumbName: "Cost Center",
		},
		{
		path: SYSTEM_SETUP_ROUTES.UPDATE_HIERARCHY,
		breadcrumbName: "Update",
		},
	];
  return (
    <LayoutMenu>
      <Spin spinning={loading} className="w-full top-20" tip="Loading">
        <BreadCrumb routes={routes}/>

        <Form
					layout={"vertical"}
					form={form}
					onFinish={onFinish}
					// onFinishFailed={onFinishFailed}
				>
					<div className="flex gap-x-4 w-full">
						<BaseContainer header={"CREATE COST CENTER"}>
							<div className="w-full flex flex-col gap-5">
								<GridLayout cols={3}>
									<Form.Item 
                    label={"Code"} 
                    name={"code"}
                    rules={[{ required: true, message: 'Please input your code' }]}
                  >
										<InputComponent mandatory />
									</Form.Item>
									<Form.Item 
                    label={"Cost Center Name"} 
                    name={"costCenterName"}
                    rules={[{ required: true, message: 'Please input your cost center name' }]}
                  >
										<InputComponent mandatory />
									</Form.Item>
                  <Form.Item 
                    label={"Parent"} 
                    name={"parent"}
                    rules={[{ required: true, message: 'Please input your parent' }]}
                  >
                    <Select onSelect={(value) => handleListSibling(value)}>
                      {parentDataSource?.map((item) => (
											  <Select.Option key={item?.value} value={item?.value}>{item?.text}</Select.Option>
                      ))}
										</Select>
									</Form.Item>
									<Form.Item 
                    label={"Type"} 
                    name={"type"}
                  >
										<Select>
                      {typeDataSource?.map((item)=>(
                        <Select.Option key={item.code} value={item.text}>{item.text}</Select.Option>
                      ))}
										</Select>
									</Form.Item>
									<Form.Item label={"Value Name"} name={"valName"}>
										<InputComponent mandatory />
									</Form.Item>
									<Form.Item label={"Value Code"} name={"valCode"}>
										<InputComponent mandatory />
									</Form.Item>
								</GridLayout>
								<GridLayout cols={1}>
									<Form.Item label={"Description"} name={"description"}>
										<InputComponent type="textarea" mandatory />
									</Form.Item>
                  <Form.Item label={"Add Siblings"} name={"sibling"}>
                    <Select defaultValue={dataRecord?.sibling} mode="multiple">
                      {siblingsDataSource?.map((item)=>(
                        <Select.Option value={item.id} key={item.id}>{item.code}</Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
								</GridLayout>
							</div>
						</BaseContainer>
					</div>

					{/* Button Action */}
					<div className="flex justify-between">
						<ButtonComponent
							type={"submit"}
							onClick={() => navigate(-1)}
							icon={
								<LeftOutlined
									style={{
										color: "#fff",
										fontSize: 16,
										justifyItems: "center",
									}}
								></LeftOutlined>
							}
						>
							Back
						</ButtonComponent>
						<div className="flex justify-end gap-x-2">
							<ButtonComponent
								icon={
									<SVGIcon
										name={"IconButtonClear"}
										width={24}
									/>
								}
								type="submit"
                onClick={() => clearForm()}
							>
								Clear
							</ButtonComponent>
							<ButtonComponent
								htmlType="submit"
								type="submit"
							>
								Save
							</ButtonComponent>
						</div>
					</div>
				</Form>

        <ModalCustom
          isOpen={modalConfirmation}
          handleCancel={() => setModalConfirmation(false)}
          header={"CONFIRMATION"}
          width={1200}
          type={"confirmation"}
        >
          <div className="flex flex-col w-full gap-y-10">
            <div className="grid grid-cols-3 gap-y-2.5">
              <DetailText label={"Cost Center Name"}>{formValue?.costCenterName}</DetailText>
              <DetailText label={"Created At"}>{formValue?.createdAt}</DetailText>
              <DetailText label={"Code"}>{formValue?.code}</DetailText>
              <DetailText label={"Created By"}>{formValue?.createdBy}</DetailText>
              <DetailText label={"Parent"}>{formValue?.parent}</DetailText>
              <DetailText label={"Latest By"}>{formValue?.updatedAt}</DetailText>
              <DetailText label={"Type"}>{formValue?.type}</DetailText>
              <DetailText label={"Update By"}>{formValue?.updatedBy}</DetailText>
              <DetailText label={"Siblings"}>
                {formValue?.sibling?.map((a) => (
                  <ul className="p-0">{a}</ul>
                ))}
              </DetailText>
            </div>

            <div className="flex mt-4 w-full justify-end">
              <ButtonComponent
                // icon={<DeleteOutlined style={{ fontSize: "24px" }} />}
                type={"default"}
                className="cancel-button"
                onClick={() => setModalConfirmation(false)}
              >
                Cancel
              </ButtonComponent>
              <ButtonComponent onClick={() => submitForm()} type={"submit"}>
                Submit
              </ButtonComponent>
            </div>
          </div>
        </ModalCustom>

        <ModalSuccess isOpen={openModalSuccess} handleCancel={handleCancel}>
          <div className="w-full justify-center flex mt-6 mb-2 text-[#a4be37]">
            <CheckCircleOutlined className={"text-2xl mr-3"} />
            <span className={"text-xl text-bold text-black"}>Create successfull</span>
          </div>
          <div className={"w-full justify-center flex"}>
            <span>Your data has been created</span>
          </div>
          <div className={"w-full justify-end flex pr-8 pb-5"}>
            <ButtonComponent
              type={"submit"}
              onClick={() => {
                setOpenModalSuccess(false);
                navigate(SYSTEM_SETUP_ROUTES.VIEW_COST_CENTER);
              }}
            >
              Ok
            </ButtonComponent>
          </div>
        </ModalSuccess>

        <ModalError isOpen={openModalError} handleCancel={handleCancel}>
          <div className="w-full justify-center flex mt-6 mb-2">
            <CloseCircleOutlined className={"text-2xl mr-3"} />
            <span className={"text-xl text-bold text-black"}>Create failed</span>
          </div>
          <div className={"w-full justify-center flex"}>
            <span> Failed to Create data</span>
          </div>
          <div className={"w-full justify-end flex pr-8 pb-5"}>
            <ButtonComponent
              type={"reject"}
              border={false}
              onClick={() => setOpenModalError(false)}
            >
              Ok
            </ButtonComponent>
          </div>
        </ModalError>
      </Spin>
    </LayoutMenu>
  );
};

export default EditCostCenter;
