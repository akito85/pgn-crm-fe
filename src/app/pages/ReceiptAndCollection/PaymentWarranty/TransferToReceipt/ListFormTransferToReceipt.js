import {
  LeftOutlined,
  WarningOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Form, Spin, Tooltip } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import RadioTabs from "../../../../../components/RadioTabs";
import {
  submitTransferToReceipt,
  getAllApprovalList,
  getDetailTransferToReceipt,
  getListApprovalById,
  getListCategory,
} from "../../../../../redux/slices/receipt_collection/transferToReceipt";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";
import { dateFormatting } from "../../../../../utils";
import TransferToReceiptForm from "./TransferToReceiptForm";
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
import TableRBI from "../../../../../components/TableRBI";

import ModalSearchReceipt from "./ModalSearchReceipt";
import { getReceiptListColumns } from "./ReceiptListColumns";

const ListFormTransferToReceipt = (props) => {
  const { type } = props;
  const {
    data_detail,
    dataListAppHierId,
    dataListAppHierDetail,
    // loading, // Loading might be needed from here
  } = useSelector((state) => state.transferToReceipt);

  // Combine loading? Or just use local loadingForm state initialized from one of them.
  // const [loadingForm, setLoadingForm] = useState(loading);
  const loading = useSelector((state) => state.transferToReceipt.loading);

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
  const [receiptList, setReceiptList] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showSearchReceiptModal, setShowSearchReceiptModal] = useState(false);

  const handlePageChange = (page) => {
    setPage(page);
  };

  const handleSizeChange = (current, size) => {
    setPage(1);
    setPageSize(size);
  };


  useEffect(() => {
    if (id && type === "update") {
      dispatch(getDetailTransferToReceipt(id));
    }
  }, [dispatch, id, type]);

  useEffect(() => {
    dispatch(getAllApprovalList());
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
      // Mapping detail data to form if needed.
      // Assuming data_detail structure matches new fields, or leave generic for now.
    }
  }, [data_detail, id]);

  // Define tabData before using it in useState

  const [tabData, setTabData] = useState([
    {
      value: "Transfer to Receipt",
      paramValue: ["accountId", "payWarrantyId", "amount", "remarks"],
    }
  ]);

  const [valuePage, setValuePage] = useState(tabData[0].value);
  const [sendBody, setSendBody] = useState();
  const onChange = (e) => {
    setValuePage(e.target.value);
  };

  const handleSubmitForm = (values) => {
    // values sudah berisi accountId, payWarrantyId, amount, remarks dari form baru
    setSendBody(values);
    setModalConfirm(true);
  };

  const handleCancelModalConfirm = () => {
    setModalConfirm(false);
  };

  // Validation Button Back
  const handleBack = () => {
    if (
      form.getFieldValue() === null ||
      Object.keys(form.getFieldValue()).length === 0
    ) {
      navigate(-1);
    } else {
      setModalBack(true);
    }
  };

  const handleClear = () => {
    if (type === "create") {
      form.resetFields();
      setSelectedHierarchy("");
      setListDataAttachment([]);
      setReceiptList([]);
    } else {
      dispatch(getDetailTransferToReceipt(id));
      setReceiptList([]); // Or reset to original if update
    }
  };

  //handle Error
  const handleError = ({ values, errorFields, outOfDate }) => {
    console.log("Validation Failed:", errorFields);
  };

  // Breadcrumbs
  const routes = [
    {
      path: "",
      breadcrumbName: "Payment & Collection",
    },
    {
      path: "",
      breadcrumbName: "Payment Warranty",
    },
    {
      path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_TRANSFER_TO_RECEIPT,
      breadcrumbName: "Transfer to Receipt",
    },
    {
      path: RECEIPT_AND_COLLECTION_ROUTES.CREATE_TRANSFER_TO_RECEIPT,
      breadcrumbName: `${type === "create" ? "Create" : "Update"}`,
    },
  ];

  const handleSave = async () => {
    setModalConfirm(false);
    const payload = {
      ...sendBody,
    };

    dispatch(submitTransferToReceipt(payload))
      .unwrap()
      .then((response) => {
        dispatch(
          showModalSuccess({
            title: "Success",
            description: "Receipt created and warranty balance updated successfully",
            onOk: () => {
              // Redirect ke Allocation page / Receipt Detail menggunakan receiptId dari backend
              if (response && response.data && response.data.receiptId) {
                navigate(RECEIPT_AND_COLLECTION_ROUTES.DETAIL_RECEIPT, {
                  state: { id: response.data.receiptId }
                });
              } else {
                navigate(-1);
              }
            }
          })
        );
      })
      .catch((error) => {
        // Error handling is managed by slice
      });
  };

  const handleDeleteReceipt = (record) => {
    const updatedList = receiptList.filter((item) => item.no !== record.no);
    setReceiptList(updatedList);
  };

  const handleConfirmSearchReceipt = (selectedRows) => {
    setReceiptList(prev => {
      // Filter out duplicates based on 'no' or 'receiptId' if needed
      const newItems = selectedRows.filter(newItem => !prev.some(prevItem => prevItem.no === newItem.no));
      return [...prev, ...newItems];
    });
  };


  const columnsReceipt = getReceiptListColumns({
    page,
    pageSize,
    onDelete: handleDeleteReceipt,
    actionType: "delete",
  });

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
            <TransferToReceiptForm form={form} />
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
      <ModalConfirm
        isOpen={modalConfirm}
        handleCancel={handleCancelModalConfirm}
        handleOk={handleSave}
        width={500}
      >
        <div className="flex flex-col justify-center items-center mt-5 gap-[20px]">
          <p className="text-[18px] font-bold text-center">
            Are you sure you want to submit this Transfer to Receipt?
          </p>
        </div>
      </ModalConfirm>

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
      <ModalSearchReceipt
        isOpen={showSearchReceiptModal}
        onClose={() => setShowSearchReceiptModal(false)}
        onConfirm={handleConfirmSearchReceipt}
      />
    </>
  );
};

export default ListFormTransferToReceipt;
