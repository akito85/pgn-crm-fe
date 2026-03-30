import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import moment from "moment";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Tabs } from "antd";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import ModalApproveOrReject from "../../../../../components/Modal/ModalApproveOrReject";
import {
  getDetailDeduction,
  approveOrRejectDeduction,
  getListCategory,
  getAllApprovalList,
  getListApprovalById,
  getCustomerDeductionList
} from "../../../../../redux/slices/receipt_collection/deduction";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";
import DetailDeduction from "./DetailDeduction";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import SectionCard from "../../../../../components/SectionCard";
import CardContainerNoBorder from "../../../../../components/CardContainerNoBorder";
import FooterDetail from "../../../../../components/FooterDetail";
import receiptCollectionHttpService from "../../../../../redux/services/receiptCollectionHttpService";
import { configApp } from "../../../../../constants/configApp";
import TableRBI from "../../../../../components/TableRBI";
import { getCustomerListColumns } from "./CustomerColumns";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import GridLayout from "../../../../../components/GridLayout";
import DetailText from "../../../../../components/DetailText";
import LogHistoryInfo from "../../../../../components/LogHistoryInfo";

const ListDetailDeduction = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [modalApprove, setModalApprove] = useState(false);
  const [approveOrReject, setApproveOrReject] = useState("");
  const id = location?.state?.id;
  const [dataHeader, setDataHeader] = useState({});
  const [listDataAttachment, setListDataAttachment] = useState([]);

  const {
    loading,
    data_detail,
    dataListAppHierId,
    dataListAppHierDetail,
    customerData
  } = useSelector((state) => state.deduction);

  const [activeTab, setActiveTab] = useState("1");
  const [appHierOptions, setAppHierOptions] = useState([]);
  const [selectedHierarchy, setSelectedHierarchy] = useState(null);
  const [appHierDataDetail, setAppHierDataDetail] = useState([]);

  // Table state 
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const approvalName = dataListAppHierId?.find(x => x.appHierId === data_detail?.deduction?.appHierId)?.approvalName || dataHeader?.approvalName || dataHeader?.appHierId || "-";

  useEffect(() => {
    if (id) {
      dispatch(getDetailDeduction(id));
      dispatch(getAllApprovalList());
    }
  }, [dispatch, id]);

  useEffect(() => {
    dispatch(getCustomerDeductionList({ page, pageSize }));
  }, [dispatch, page, pageSize]);

  useEffect(() => {
    if (data_detail && data_detail.deduction?.appHierId) {
      setSelectedHierarchy(data_detail.deduction.appHierId);
      form.setFieldsValue({ apphierId: data_detail.deduction.appHierId });
    }

    if (data_detail) {
      const dataAttachment = (data_detail?.attachmentDtoList || []).map(
        (item) => {
          return {
            id: item.id,
            size: item.size,
            fileName: item.fileName,
            fileSize: item.fileSize,
            fileType: item.fileType,
            fileCategoryId: item.fileCategoryId,
            fileCategoryName: item.fileCategoryName,
            pathFile: item.pathFile,
            urlFile1: item.urlFile1,
            urlFile2: item.urlFile2,
            createdBy: item.createdBy,
            createdDate: item.createdDate
              ? moment(item.createdDate).format("DD MMM YYYY")
              : "",
            dataType: "exist",
          };
        }
      );
      setListDataAttachment(dataAttachment);
      setDataHeader(data_detail.deduction);
    }
  }, [data_detail, form]);

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
    if (selectedHierarchy) {
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

  const columnsCustomer = useMemo(() => {
    return getCustomerListColumns({
      page,
      pageSize,
      actionType: "none",
    });
  }, [page, pageSize]);

  const onChangePage = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const handleNext = () => {
    if (activeTab === "1") setActiveTab("2");
    else if (activeTab === "2") setActiveTab("3");
  };

  const items = [
    {
      key: '1',
      label: 'Deduction',
      children: (
          <SectionCard title="DEDUCTION INFORMATION" >
            <DetailDeduction data_detail={dataHeader} />
          </SectionCard>
      ),
    },
    {
      key: '2',
      label: 'Approval',
      children: (
        <SectionCard title="DEDUCTION APPROVAL INFORMATION">
          <ApprovalComponentGeneral
            dataTable={appHierDataDetail}
            dataOption={appHierOptions}
            selectedHierarchy={selectedHierarchy}
            updateSelectedHierarchy={setSelectedHierarchy}
            showSelect={false}
            disableSelect={true}
            approvalName={approvalName}
          />
        </SectionCard>
      ),
    },
    {
      key: '3',
      label: 'Attachment',
      children: (
        <SectionCard title="ATTACHMENT INFORMATION">
          <AttachmentComponent
            type={"detail"}
            data={listDataAttachment}
            updateData={setListDataAttachment}
            typeSelector="deduction"
            dispatch={dispatch}
            getAPICategory={getListCategory}
            service={receiptCollectionHttpService}
            configApplication={configApp.PAYMENT_SERVICE}
          />
        </SectionCard>
      ),
    },
  ];

  const isShowButton = data_detail?.tApprovalDto?.isApprover;

  const routes = [
    {
      path: "",
      breadcrumbName: "Receipt & Collection",
    },
    {
      path: "",
      breadcrumbName: "Payment Warranty",
    },
    {
      path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_DEDUCTION,
      breadcrumbName: "Deduction",
    },
    {
      path: RECEIPT_AND_COLLECTION_ROUTES.DETAIL_DEDUCTION,
      breadcrumbName: "Detail Deduction",
    },
  ];

  const handleConfirm = (res, handleClear) => {
    const data = {
      id: id,
      remark: res.remark,
      approvalId: data_detail?.tApprovalDto?.tAppId,
      action: approveOrReject.toUpperCase(),
    };

    dispatch(approveOrRejectDeduction({ body: data }));
    handleClear();
    setModalApprove(false);
  };

  const handleCancel = () => {
    setModalApprove(false);
  };

  return (
    <>
      <BreadCrumb routes={routes} />
      <div className="w-full">
        <CardContainerNoBorder 
          header="DEDUCTION DETAIL" 
          collapsible={true}
          defaultExpanded={true}
          noPadding={true}
        >
          <div className="px-4 pb-4">
            <Tabs 
              activeKey={activeTab} 
              onChange={setActiveTab} 
              items={items} 
              className="custom-tabs"
            />
          </div>
        </CardContainerNoBorder>

        <CardContainerNoBorder 
          header="CUSTOMER INFORMATION" 
          collapsible={true}
          defaultExpanded={true}
        >
          <SectionCard title="CUSTOMER INFORMATION" > 
            <TableRBI
              columns={columnsCustomer}
              dataSource={customerData?.result?.map((item, index) => ({ ...item, key: index })) || []}
              pagination={false}
              tableScrolled={{ x: 1800 }}
              size="small"
              current={page}
              pageSize={pageSize}
              totalData={customerData?.page?.totalElements || 0}
              onChange={onChangePage}
              onSizeChanger={onChangePage}
            />
          </SectionCard>
        </CardContainerNoBorder>

        

        <LogHistoryInfo
          data={{
            recordId: dataHeader?.id || "-",
            createdDate: dataHeader?.createdDate ? moment(dataHeader.createdDate).format("DD MMM YYYY HH:mm:ss") : "-",
            createdBy: dataHeader?.createdBy || "-",
            updatedDate: dataHeader?.updatedDate ? moment(dataHeader.updatedDate).format("DD MMM YYYY HH:mm:ss") : "-",
            updatedBy: dataHeader?.updatedBy || "-"
          }}
        />
      </div>

      <ModalApproveOrReject
        isOpen={modalApprove}
        handleCloseModal={handleCancel}
        onFinish={handleConfirm}
        header={approveOrReject}
        approveOrReject={approveOrReject}
        menu={"Deduction"}
        named={dataHeader?.id}
      />

      <FooterDetail
        onCancel={() => navigate(-1)}
        onApprove={() => {
          setModalApprove(true);
          setApproveOrReject("approve");
        }}
        onReject={() => {
          setModalApprove(true);
          setApproveOrReject("reject");
        }}
        showApproval={isShowButton}
      />
    </>
  );
};

export default ListDetailDeduction;
