import { LeftOutlined } from "@ant-design/icons";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import BaseContainer from "../../../../../components/BaseContainer";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import ModalApproveOrReject from "../../../../../components/Modal/ModalApproveOrReject";
import RadioTabs from "../../../../../components/RadioTabs";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import {
  approveOrRejectInactiveBank,
  getBankDetail,
  getBankDetailDraft,
  getJobContact,
  getPositionContact,
} from "../../../../../redux/slices/receipt_collection/bankSlice";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";
import DetailBank from "./DetailBank";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";
import receiptCollectionHttpService from "../../../../../redux/services/receiptCollectionHttpService";
import { configApp } from "../../../../../constants/configApp";

const ListDetailBank = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const id = location?.state?.id;

  const [approveOrReject, setApproveOrReject] = useState("");
  const [modalConfirm, setModalConfirm] = useState(false);
  const [remark, setRemark] = useState("");
  const [modalError, setModalError] = useState(false);
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [dataSource, setDataSource] = useState([]);
  const [dataSourceDraft, setDataSourceDraft] = useState([]);
  const [dataText, setDataText] = useState({});
  const [dataTextDraft, setDataTextDraft] = useState({});
  const [totalElement, setTotalElement] = useState(0);
  const [totalElementDraft, setTotalElementDraft] = useState(0);
  const [listDataAttachment, setListDataAttachment] = useState([]);
  const [listDataAttachmentDraft, setListDataAttachmentDraft] = useState([]);

  // Define tabData before using it in useState
  const [tabData, setTabData] = useState([
    { value: "Bank" },
    { value: "Attachment" },
  ]);
  const [segmentedPage, setSegmentedPage] = useState(tabData[0].value);
  const handleSegmentedPage = (e) => {
    setSegmentedPage(e.target.value);
  };

  const {
    loading,
    data_detail,
    message,
    data_detail_draft,
    data_job,
    data_position,
    dataAccountInfoPaging,
  } = useSelector((state) => state.bank);
  const showButtonApproval = data_detail?.tApprovalDto?.isApprover;

  useEffect(() => {
    dispatch(getBankDetail(id));
    dispatch(getBankDetailDraft(id));
  }, [id, dispatch]);

  useEffect(() => {
    setTotalElement(dataSource?.lenght);
  }, [dataSource]);

  useEffect(() => {
    if (
      id &&
      data_detail?.bank?.id &&
      data_detail &&
      data_detail?.bank?.id === id
    ) {
      if (
        data_detail?.bank?.bankContacts &&
        data_detail?.bank?.bankContacts?.length > 0
      ) {
        const data = data_detail?.bank?.bankContacts?.map((item, index) => {
          const bankContacts = item?.contactDetails || []; // Ensure bankContacts is an array
          return {
            ...item,
            key: index + 1,
            contactDetails: bankContacts.map((detail, detailIndex) => {
              return {
                ...detail,
                key: detailIndex + 1,
              };
            }),
          };
        });
        setDataSource(data);
      }
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
      setDataText(data_detail?.bank);
    }
    if (
      id &&
      data_detail_draft?.bank?.id &&
      data_detail_draft &&
      data_detail_draft?.bank?.id === data_detail?.bank?.id
    ) {
      if (
        data_detail_draft?.bank?.bankContacts &&
        data_detail_draft?.bank?.bankContacts?.length > 0
      ) {
        const data = data_detail_draft?.bank?.bankContacts?.map(
          (item, index) => {
            const bankContacts = item?.contactDetails || []; // Ensure bankContacts is an array
            return {
              ...item,
              key: index + 1,
              contactDetails: bankContacts.map((detail, detailIndex) => {
                return {
                  ...detail,
                  key: detailIndex + 1,
                };
              }),
            };
          }
        );
        setDataSourceDraft(data);
        setTotalElementDraft(data?.lenght);
      }
      const dataAttachment = (data_detail_draft?.attachmentDtoList || []).map(
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
      setDataTextDraft(data_detail_draft?.bank);
      setListDataAttachmentDraft(dataAttachment);
      setTabData([
        { value: "Bank" },
        { value: "Draft" },
        { value: "Attachment" },
      ]);
    }
  }, [id, data_detail, data_detail_draft]);

  useEffect(() => {
    dispatch(getPositionContact());
    dispatch(getJobContact());
  }, []);

  const renderSection = (segmentedPage) => {
    switch (segmentedPage) {
      case "Bank":
        return (
          <DetailBank
            data_detail={dataText}
            id={id}
            data_req={data_detail?.tApprovalDto}
            key={"active"}
            dataSource={dataSource}
            data_job={data_job}
            // dataAccountInfoPaging={dataAccountInfoPaging}
            data_position={data_position}
            totalData={totalElement}
          />
        );
      case "Draft":
        return (
          <DetailBank
            data_detail={dataTextDraft}
            id={id}
            key={"draft"}
            data_req={data_detail_draft?.tApprovalDto}
            // dataAccountInfoPaging={dataAccountInfoPaging}
            dataSource={dataSourceDraft}
            data_job={data_job}
            data_position={data_position}
            totalData={totalElementDraft}
          />
        );
      case "Attachment":
        return (
          <BaseContainer header={"ATTACHMENT INFORMATION"}>
            <AttachmentComponent
              type={"detail"}
              data={listDataAttachment}
              updateData={setListDataAttachment}
              typeSelector="bank"
              service={receiptCollectionHttpService}
              configApplication={configApp.PAYMENT_SERVICE}
            />
          </BaseContainer>
        );
      default:
        return <></>;
    }
  };

  // Breadcrumbs
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
      path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_MASTER_BANK,
      breadcrumbName: "Bank",
    },
    {
      path: RECEIPT_AND_COLLECTION_ROUTES.DETAIL_MASTER_BANK,
      breadcrumbName: `Detail ${segmentedPage}`,
    },
  ];

  // handle Confirm
  const handleConfirm = (res, handleClear) => {
    let data

    if (data_detail?.tApprovalDto?.approvalType.toLowerCase() === 'bank') {
      data = {
        bankId: id,
        remark: res.remark,
        approvalId: data_detail?.tApprovalDto?.tAppId,
        action: approveOrReject.toUpperCase(),
        type: data_detail?.tApprovalDto?.approvalType
      };
    } else {
      data = {
        id: id,
        remark: res.remark,
        approvalId: data_detail?.tApprovalDto?.tAppId,
        action: approveOrReject.toUpperCase(),
        type: data_detail?.tApprovalDto?.approvalType
      };

    }
    dispatch(approveOrRejectInactiveBank({ body: data }));
    setModalConfirm(false);
    handleClear();
  };

  const handleCancel = () => {
    setRemark("");
    setModalConfirm(false);
  };

  return (
    <LayoutMenu>
      <BreadCrumb routes={routes} />
      <div className="w-full gap-5">
        <RadioTabs data={tabData} onChange={handleSegmentedPage} />

        {renderSection(segmentedPage)}
      </div>

      <div className="flex mt-[30px] justify-between py-5">
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

        {showButtonApproval ? (
          <div className="flex align-middle gap-5">
            <ButtonComponent
              type="reject"
              onClick={() => {
                setModalConfirm(true);
                setApproveOrReject("Reject");
              }}
            >
              Reject
            </ButtonComponent>
            <ButtonComponent
              type="approve"
              onClick={() => {
                setModalConfirm(true);
                setApproveOrReject("approved");
              }}
            >
              Approve
            </ButtonComponent>
          </div>
        ) : null}
      </div>

      <ModalApproveOrReject
        isOpen={modalConfirm}
        handleCloseModal={handleCancel}
        onFinish={handleConfirm}
        header={approveOrReject}
        approveOrReject={approveOrReject}
        menu={"Bank"}
        named={
          data_detail_draft?.bank?.bankName === id
            ? data_detail_draft?.bank?.bankName
            : data_detail?.bank?.bankName
        }
      />
    </LayoutMenu>
  );
};

export default ListDetailBank;
