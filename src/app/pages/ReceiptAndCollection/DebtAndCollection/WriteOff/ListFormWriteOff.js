import {
  LeftOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Form, Spin, Input } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import RadioTabs from "../../../../../components/RadioTabs";
import {
  getTypeDDL,
  getAllApprovalList,
  getDetailWriteOff,
  getListApprovalById,
  getListCategory,
} from "../../../../../redux/slices/receipt_collection/writeOff";
import { DEBT_AND_COLLECTION_ROUTES } from "../../../../../routes/DebtAndCollection/rc_routes";
import WriteOffForm from "./WriteOffForm";
import SVGIcon from "../../../../../assets/Icon/index";
import { ModalConfirm } from "../../../../../components/Modal/ModalPopUp";
import BaseContainer from "../../../../../components/BaseContainer";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import ContentModalConfirm from "./ContentModalConfirm";
import receiptCollectionHttpService from "../../../../../redux/services/receiptCollectionHttpService";
import {
  showModalError,
  showModalSuccess,
} from "../../../../../redux/slices/general_slice";
import { bytesConverter } from "../../../../../utils/bytesConverter";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import { configApp } from "../../../../../constants/configApp";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import ModalSearchCustomer from "./ModalSearchCustomer";
import TableRBI from "../../../../../components/TableRBI";

const ListFormWriteOff = (props) => {
  const { type } = props;
  const {
    data_detail,
    dataListAppHierId,
    dataListAppHierDetail,
    loading,
    dataType,
  } = useSelector((state) => state.writeOff);

  // Declaration
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const formValue = form.getFieldsValue();
  const location = useLocation();
  const { id } = location?.state || {};
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [selectedHierarchy, setSelectedHierarchy] = useState();
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalBack, setModalBack] = useState(false);
  const [appHierOptions, setAppHierOptions] = useState([]);
  const [appHierDataDetail, setAppHierDataDetail] = useState([]);
  const [loadingForm, setLoadingForm] = useState(loading);

  // Customer List State
  const [customerList, setCustomerList] = useState([]);
  const [modalSearchCustomer, setModalSearchCustomer] = useState(false);

  useEffect(() => {
    if (id && type === "update") {
      dispatch(getDetailWriteOff(id));
    }
  }, [dispatch, id, type]);

  useEffect(() => {
    dispatch(getAllApprovalList());
    dispatch(getTypeDDL());
  }, [dispatch]);

  useEffect(() => {
    if (dataListAppHierId && dataListAppHierId.length > 0) {
      const tempAppHier = dataListAppHierId.map((appHier) => ({
        name: appHier.approvalName,
        value: appHier.appHierId,
      }));
      setAppHierOptions(tempAppHier);
    }
  }, [dataListAppHierId]);

  useEffect(() => {
    if (selectedHierarchy && selectedHierarchy !== 0) {
      dispatch(getListApprovalById({ id: selectedHierarchy }));
    }
  }, [dispatch, selectedHierarchy]);

  useEffect(() => {
    if (dataListAppHierDetail && dataListAppHierDetail.length > 0) {
      const data = dataListAppHierDetail.map((a, index) => ({
        ...a,
        key: index + 1,
        employeeDetail: a.employeeDetail.map((b, index) => ({
          ...b,
          key: index + 1,
        })),
      }));
      setAppHierDataDetail(data);
    } else {
      setAppHierDataDetail([]);
    }
  }, [dataListAppHierDetail]);

  useEffect(() => {
    if (
      formValue.approvalHierarchy &&
      !appHierOptions
        .map((item) => item.value)
        .includes(formValue.approvalHierarchy)
    ) {
      form.setFieldsValue({ approvalHierarchy: null });
      setSelectedHierarchy(null);
    }
  }, [formValue, appHierOptions, form]);

  useEffect(() => {
    if (id && data_detail) {
      // Map details to form logic here if needed for update
    }
  }, [data_detail, id]);

  const [tabData, setTabData] = useState([
    { value: "WriteOff", paramValue: ["writeOffPeriod", "type", "writeOffDate"] },
    { value: "Approval", paramValue: ["apphierId"] },
    { value: "Attachment" },
  ]);

  const [valuePage, setValuePage] = useState(tabData[0].value);
  const [sendBody, setSendBody] = useState();
  const onChange = (e) => {
    setValuePage(e.target.value);
  };

  const handleSubmitForm = (formValue) => {
    const dataValue = {
      ...formValue,
      customerList: customerList
    };

    setSendBody(dataValue);
    setModalConfirm(true);
    // Logic for create/update API call would go here
  };

  const handleCancelModalConfirm = () => {
    setModalConfirm(false);
  };

  // Validation Button Back
  const handleBack = () => {
    setModalBack(true);
  };

  const handleClear = () => {
    if (type === "create") {
      form.resetFields();
      setSelectedHierarchy("");
      setListDataAttachment([]);
      setCustomerList([]);
    } else {
      // Logic for reset update
    }
  };

  //handle Error
  const handleError = ({ values, errorFields, outOfDate }) => {
    setTabData((prevState) => {
      const res = prevState.map((item) => {
        if (!item.paramValue || item.paramValue.length < 0) {
          return {
            value: item.value,
            paramValue: item.paramValue,
          };
        }
        const errorBadge = errorFields.reduce(
          (current, next) =>
            item.paramValue.includes(next.name[0]) ? current + 1 : current,
          0
        );
        return {
          value: item.value,
          paramValue: item.paramValue,
          errorBadge,
        };
      });
      return res;
    });
  };

  // Breadcrumbs
  const routes = [
    {
      path: "",
      breadcrumbName: "Bad Debt & Collection",
    },
    {
      path: DEBT_AND_COLLECTION_ROUTES.VIEW_WRITE_OFF,
      breadcrumbName: "Write Off",
    },
    {
      path: DEBT_AND_COLLECTION_ROUTES.CREATE_WRITE_OFF,
      breadcrumbName: `${type === "create" ? "Create Write Off" : "Update Write Off"}`,
    },
  ];


  const handleSave = async () => {
    setModalConfirm(false);
    // Logic to save
    console.log("Saving data:", sendBody);
    navigate(-1);
  };

  const handleCustomerAmountChange = (id, value) => {
    const updatedList = customerList.map(item => {
      if (item.id === id) {
        return { ...item, amount: value };
      }
      return item;
    });
    setCustomerList(updatedList);
  };

  const handleDeleteCustomer = (id) => {
    const updatedList = customerList.filter(item => item.id !== id);
    setCustomerList(updatedList);
  };

  const customerColumns = [
    {
      title: "NO",
      dataIndex: "no",
      key: "no",
      width: 50,
      render: (text, record, index) => index + 1,
    },
    {
      title: "COST CENTER",
      dataIndex: "costCenter",
      key: "costCenter",
      width: 150,
    },
    {
      title: "CUSTOMER NUMBER",
      dataIndex: "customerNumber",
      key: "customerNumber",
      width: 120,
    },
    {
      title: "CUSTOMER NAME",
      dataIndex: "customerName",
      key: "customerName",
      width: 200,
    },
    {
      title: "CUSTOMER SEGMENT",
      dataIndex: "customerSegment",
      key: "customerSegment",
      width: 120,
    },
    {
      title: "AMOUNT",
      dataIndex: "amount",
      key: "amount",
      width: 150,
      render: (text, record) => (
        <Input
          placeholder="Placeholder"
          value={text}
          onChange={(e) => handleCustomerAmountChange(record.id, e.target.value)}
        />
      )
    },
    {
      title: "ACTION",
      key: "action",
      fixed: "right",
      width: 80,
      align: "center",
      render: (_, record) => (
        <div onClick={() => handleDeleteCustomer(record.id)} className="cursor-pointer flex justify-center text-red-500">
          <SVGIcon name="IconDelete" width={24} />
        </div>
      ),
    },
  ];

  return (
    <>
      <BreadCrumb routes={routes} />
      <Spin spinning={loadingForm}>
        <RadioTabs
          data={tabData}
          onChange={onChange}
          currentPosition={valuePage}
        />
        <Form
          layout="vertical"
          form={form}
          onFinish={handleSubmitForm}
          onFinishFailed={handleError}
        >
          <div
            style={{
              display: valuePage !== tabData[0].value ? "none" : undefined,
            }}
          >
            <WriteOffForm
              dataType={dataType}
              form={form}
            />

            <BaseContainer header={
              <div className="flex justify-between items-center w-full">
                <span className="font-bold">CUSTOMER INFORMATION</span>
              </div>
            }>
              <div className="flex justify-end mb-4">
                <ButtonComponent type="primary" onClick={() => setModalSearchCustomer(true)}>
                  Search Customer
                </ButtonComponent>
              </div>
              <TableRBI
                columns={customerColumns}
                dataSource={customerList}
                rowKey="id"
                usePagination={false}
              />
            </BaseContainer>

          </div>

          <div
            style={{
              display: valuePage !== tabData[1].value ? "none" : undefined,
            }}
          >
            <BaseContainer header={"APPROVAL INFORMATION"}>
              <ApprovalComponentGeneral
                dataTable={appHierDataDetail}
                dataOption={appHierOptions}
                selectedHierarchy={selectedHierarchy}
                updateSelectedHierarchy={setSelectedHierarchy}
              />
            </BaseContainer>
          </div>
          <div
            style={{
              display: valuePage !== tabData[2].value ? "none" : undefined,
            }}
          >
            <BaseContainer header={"ATTACHMENT INFORMATION"}>
              <AttachmentComponent
                type={type}
                data={listDataAttachment}
                updateData={setListDataAttachment}
                typeSelector="writeOff"
                dispatch={dispatch}
                getAPICategory={getListCategory}
                service={receiptCollectionHttpService}
                configApplication={configApp.PAYMENT_SERVICE}
                typeRBI={"data"}
              />
            </BaseContainer>
          </div>
          <div className="flex w-full justify-between align-middle my-3">
            <ButtonComponent
              type={"submit"}
              onClick={() => handleBack()}
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
            <div className="flex align-middle gap-3">
              <ButtonComponent
                icon={
                  <SVGIcon
                    name={
                      type === "update" ? `IconButtonReset` : `IconButtonClear`
                    }
                    width={24}
                  />
                }
                type="submit"
                onClick={handleClear}
              >
                {type === "update" ? "Reset" : "Clear"}
              </ButtonComponent>
              <ButtonComponent
                htmlType="submit"
                type="submit"
              >
                Save & Submit
              </ButtonComponent>
            </div>
          </div>
        </Form>
      </Spin>
      <ModalCustom
        isOpen={modalConfirm}
        handleCancel={handleCancelModalConfirm}
        header={"Confirmation"}
        width={1000}
        type={"confirmation"}
        footer={
          <div className="w-full flex justify-end gap-5 p-4">
            <ButtonComponent onClick={handleCancelModalConfirm} type="default">
              Cancel
            </ButtonComponent>
            <ButtonComponent type="submit" onClick={handleSave}>
              Confirm
            </ButtonComponent>
          </div>
        }
      >
        <div className="p-4">
          <ContentModalConfirm
            data={sendBody}
            listDataAttachment={listDataAttachment}
            listDataAppHierDetail={appHierDataDetail}
            tabData={tabData}
            dataOption={appHierOptions}
            selectedHierarchy={selectedHierarchy}
            typeSelector="writeOff"
          />
        </div>
      </ModalCustom>

      {/* Modal Back*/}
      <ModalConfirm
        isOpen={modalBack}
        handleCancel={() => setModalBack(false)}
        handleOk={() => navigate(-1)}
        width={600}
      >
        <div className="flex justify-center mt-5 gap-[20px]">
          <WarningOutlined style={{ fontSize: "24px", color: "#BE3036" }} />
          <p className="text-[18px] font-bold">
            Are you sure you want to back?
          </p>
        </div>
      </ModalConfirm>

      <ModalSearchCustomer
        isOpen={modalSearchCustomer}
        onClose={() => setModalSearchCustomer(false)}
        onConfirm={(selectedRecords) => {
          // Avoid duplicates
          const uniqueRecords = selectedRecords.filter(record => !customerList.some(existing => existing.id === record.id));
          setCustomerList([...customerList, ...uniqueRecords]);
        }}
      />

    </>
  );
};

export default ListFormWriteOff;
