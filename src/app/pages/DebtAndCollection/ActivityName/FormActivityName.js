import { LeftOutlined, WarningOutlined } from "@ant-design/icons";
import { Form, Input, Spin,InputNumber } from "antd";
import SVGIcon from "../../../../assets/Icon/index";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import BaseContainer from "../../../../components/BaseContainer";
import BreadCrumb from "../../../../components/BreadCrumb";
import ButtonComponent from "../../../../components/ButtonComponent";
import DetailText from "../../../../components/DetailText";
import ModalCustom from "../../../../components/Modal/ModalCustom";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import {
  getDetailActivityNamePaginate,
  createUpdateActivityName,
  validateCreateUpdateActivityName
} from "../../../../redux/slices/debt_and_collection/activityName";
import { DEBT_AND_COLLECTION_ROUTES } from "../../../../routes/DebtAndCollection/rc_routes.js";
import { ModalConfirm } from "../../../../components/Modal/ModalPopUp";
import { formMessageRequired, hasValue } from "../../../../utils";
import InputComponent from "../../../../components/InputComponent";
import { useTryAgainHooks } from "../../../../utils/useTryAgainHooks";

const FormActivityName = (props) => {
  const { type } = props;
  const { dataDetailActivityName,  loading } = useSelector((state) => state.activityName);


  const location = useLocation();

  // console.log("location", location);
  const dispatch = useDispatch();

  const [form] = Form.useForm();
  const [openModal, setOpenModal] = useState(false);
  const [modalBack, setModalBack] = useState(false);
  const navigate = useNavigate();
  const id = location?.state?.id;
  const [payload, setPayload] = useState({});

  const assert = () => {
    // console.log("dataDetail", dataDetailActivityName);
    form.setFieldsValue({
      name: dataDetailActivityName?.name,
      exception: dataDetailActivityName?.exception,
      urutan: dataDetailActivityName?.urutan,
      dueDateRule: dataDetailActivityName?.dueDateRule,
    });
  };

  // call id 
  useEffect(() => {
    if (id) {
      // console.log("id", id);
      dispatch(getDetailActivityNamePaginate(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    // jika type update maka set form dengan data detail
    if (type === 'update') {
      assert();
    }
  }, [dataDetailActivityName, form, type]);


  const routes = [
    {
      path: "",
      breadcrumbName: "Debt & Collection",
    },
    {
      path: DEBT_AND_COLLECTION_ROUTES.VIEW_ACTIVITY_NAME,
      breadcrumbName: "Activity Name",
    },
    {
      path: "",
      breadcrumbName: `${type === "update" ? "Update Activity Name" : "Create Activity Name"}`,
    },
  ];


  const saveAction = async () => {
    try {
      setOpenModal(false);
      if (type === "update") {
        const bodyUpdate = {
          ...payload?.body,
          id: dataDetailActivityName?.id,
        };
        await dispatch(createUpdateActivityName(bodyUpdate))?.unwrap()
      }else{
        await dispatch(createUpdateActivityName(payload?.body))?.unwrap()
      }
    } catch (error) {
      setOpenModal(false);
    }
  };

  const onFinish = async (formValue) => {
    try {
      const dataValue = {
        name: formValue.name,
        exception: formValue.exception,
        urutan: formValue.urutan,
        dueDateRule: formValue.dueDateRule
      };
      
      const bodyValidasiUpdate = {
        ...dataValue,
        id: dataDetailActivityName?.id,
      };

      setPayload(
        {
          body: formValue
        }
      )
      if (type !== "update") {
        dispatch(validateCreateUpdateActivityName(dataValue))
          .unwrap()
          .then(async (data) => {
            const sukses = data?.success;
            if (sukses === false) {
              setOpenModal(false);
            }
            setOpenModal(true);
          });
      }
      dispatch(validateCreateUpdateActivityName(bodyValidasiUpdate))
        .unwrap()
        .then(async (data) => {
          const sukses = data?.success;
          if (sukses === false) {
            setOpenModal(false);
          }
          setOpenModal(true);
        });

      

      // console.log("payload", { body: formValue });
    } catch (error) {
      setOpenModal(false);
    }
  };

  const onFinishFailed = () => {
    setOpenModal(false);
  };
  const handleCancel = () => {
    setOpenModal(false);
  };

  const handleClear = () => {
    if (type === "create") {
      form.resetFields();
    } else {
      assert();
    }
  };


  const handleRetry = () => {
    handleCancelTryAgain()
    dispatch(createUpdateActivityName(payload?.body));
  };

  const { renderModal, handleCancelTryAgain } = useTryAgainHooks(handleRetry);

  return (
    <LayoutMenu>
      <BreadCrumb routes={routes} />
      <Spin spinning={loading}>
        <Form
          form={form}
          layout={"vertical"}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <div className={"flex w-full gap-12 mt-5"}>
            <BaseContainer
              header={type === "update" ? "UPDATE ACTIVITY NAME" : "CREATE ACTIVITY NAME"}
            >
              <div className="flex flex-col w-full gap-3">
                <div className={"flex w-full gap-3"}>
                  <div className={"flex flex-col w-full"}>
                    <Form.Item
                      label={"Name"}
                      name={"name"}
                      rules={formMessageRequired("Name")}
                      className={"w-full no-margin-form"}
                    >
                      <Input
                        // disabled={type === "update"} 
                        onInput={(e) =>
                          (e.target.value = e.target.value.trimStart())
                        }
                      />
                    </Form.Item>
                  </div>

                  <div className={"flex flex-col w-full"}>
                    <Form.Item
                      label={"Exception"}
                      name={"exception"}
                      // rules={formMessageRequired("Exception")}
                      className={"w-full no-margin-form"}
                    >
                      <Input
                        onInput={(e) =>
                          (e.target.value = e.target.value.trimStart())
                        }
                      />
                    </Form.Item>
                  </div>
                </div>
                <div className={"flex w-full gap-3"}>
                  <div className={"flex flex-col w-full"}>
                    <Form.Item
                      label={"Urutan"}
                      name={"urutan"}
                      // rules={formMessageRequired("Urutan")}
                      className={"w-full no-margin-form"}
                    >
                      <InputNumber
                        type="number"
                        controls={false}
                        style={{
                          width: "100%",
                        }}
                      />
                    </Form.Item>
                  </div>
                  <div className={"flex flex-col w-full"}>
                    <Form.Item
                      label={"Due Date Rule"}
                      name={"dueDateRule"}
                      // rules={formMessageRequired("Description")}
                      className="w-full"
                    >
                      <Input
                        onInput={(e) =>
                          (e.target.value = e.target.value.trimStart())
                        }
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>
            </BaseContainer>
          </div>
          <div className={"w-full flex my-5"}>
            <ButtonComponent
              type={"submit"}
              onClick={() => setModalBack(true)}
              icon={
                <LeftOutlined
                  style={{
                    color: "#fff",
                    fontSize: 16,
                    justifyItems: "left",
                  }}
                ></LeftOutlined>
              }
            >
              Back
            </ButtonComponent>
            <div className={"w-full justify-end flex gap-5"}>
              <ButtonComponent
                icon={
                  <SVGIcon
                    name={
                      type === "update" ? `IconButtonReset` : `IconButtonClear`
                    }
                    width={24}
                  />
                }
                type={"submit"}
                border={false}
                onClick={handleClear}
              >
                {type === "update" ? "Reset" : "Clear"}
              </ButtonComponent>
              <ButtonComponent type={"submit"} htmlType={"submit"}>
                Save
              </ButtonComponent>
            </div>
          </div>
        </Form>
      </Spin>

      <ModalCustom
        isOpen={openModal}
        header={"CONFIRMATION"}
        width={500}
        type={"confirmation"}
        handleCancel={handleCancel}
      >
        <div className="w-full flex flex-col flex-wrap gap-y-3">
          <div className="w-full">
            <span className="text-primary uppercase">Activity Name</span>
          </div>
          <div className={"w-full flex"}>
            <div className={"w-full flex-col"}>
              <DetailText label={"Name"}>{payload?.body?.name}</DetailText>
            </div>
            <div className={"w-full flex-col"}>
              <DetailText label={"Exception"}>{payload?.body?.exception}</DetailText>
            </div>
            <div className={"w-full flex-col"}>
              <DetailText label={"Urutan"}>{payload?.body?.urutan}</DetailText>
            </div>
          </div>
          <div className="w-full">
            <DetailText label={"Due Date Rule"}>{payload?.body?.dueDateRule}</DetailText>
          </div>
        </div>
        <div className="flex justify-end gap-5">
          <ButtonComponent onClick={handleCancel} type="default">
            Cancel
          </ButtonComponent>
          <ButtonComponent onClick={saveAction} type="submit">
            Confirm
          </ButtonComponent>
        </div>
      </ModalCustom>

      {/* modal Back */}
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

      {/* render modal try again */}
      {renderModal()}
    </LayoutMenu>
  );
};

export default FormActivityName;
