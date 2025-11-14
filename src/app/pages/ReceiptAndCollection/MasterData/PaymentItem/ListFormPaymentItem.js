import {
  LeftOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Form } from "antd";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import BreadCrumb from "../../../../../components/BreadCrumb";
import ButtonComponent from "../../../../../components/ButtonComponent";
import RadioTabs from "../../../../../components/RadioTabs";
import LayoutMenu from "../../../../../components/SidebarMenu/LayoutMenu";
import {
  createPaymentItem,
  createValidasiPayMetohod,
  getAllApprovalList,
  getBankAccount,
  getDetailItem,
  getGlAccountDDL,
  getGLInformation,
  getListApprovalById,
  getListCategory,
  updatePaymentItem,
} from "../../../../../redux/slices/receipt_collection/paymentItem";
import { RECEIPT_AND_COLLECTION_ROUTES } from "../../../../../routes/Receipt&Collection/rc_routes";
import { dateFormatting } from "../../../../../utils";
import PaymentItemForm from "./PaymentItemForm";
import SVGIcon from "../../../../../assets/Icon/index";
import { ModalConfirm } from "../../../../../components/Modal/ModalPopUp";
import BaseContainer from "../../../../../components/BaseContainer";
import ModalCustom from "../../../../../components/Modal/ModalCustom";
import ContentModalConfirmPayment from "../../ReceiptReconciliation/ContentModalConfirmPayment";
import TableGlInformation from "./TableGlInformation";
import Highlighter from "react-highlight-words";
import receiptCollectionHttpService from "../../../../../redux/services/receiptCollectionHttpService";
import {
  showModalError,
  showModalSuccess,
} from "../../../../../redux/slices/general_slice";
import { bytesConverter } from "../../../../../utils/bytesConverter";
import { getColumnSearchPropsPaging } from "../../../../../utils/getColumnSearchProps";
import ApprovalComponentGeneral from "../../../../../components/Approval/ApprovalComponentGeneral";
import { configApp } from "../../../../../constants/configApp";
import AttachmentComponent from "../../../../../components/Attachment/AttachmentComponent";

const ListFormPaymentItem = (props) => {
  const { type } = props;
  const {
    data_detail,
    data_GL,
    dataListAppHierId,
    dataListAppHierDetail,
    data_GLAccount,
    data_bank,
    loading,
  } = useSelector((state) => state.item);

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
  const [tableDatas, setTableDatas] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [modalBack, setModalBack] = useState(false);
  const [appHierOptions, setAppHierOptions] = useState([]);
  const [appHierDataDetail, setAppHierDataDetail] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const searchInput = useRef(null);
  const [checked, setChecked] = useState(false);
  const [methodId, setMethodId] = useState();
  const [loadingForm, setLoadingForm] = useState(loading);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    const tempSearchColumn = selectedKeys[0] ? dataIndex : "";
    if (searchedColumn !== tempSearchColumn) {
      setPage(1);
    }
    setSearchedColumn(tempSearchColumn);
  };

  const onSort = (_, __, sort) => {
    const dataSort =
      sort.order !== undefined
        ? `${sort.field}~${sort.order === "ascend" ? "asc" : "desc"}`
        : "";
    setSort(dataSort);
  };

  const handleChangePage = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };

  useEffect(() => {
    if (id && type === "update") {
      dispatch(getDetailItem(id));
    }
  }, [dispatch, id, type]);

  useEffect(() => {
    if (id && data_detail && data_detail?.paymentItem) {
      setChecked(data_detail?.paymentItem?.isBankMethod);
    } else {
      setChecked(false);
    }
  }, [data_detail]);

  useEffect(() => {
    dispatch(getBankAccount());
    dispatch(getGlAccountDDL());
  }, [dispatch]);

  useEffect(() => {
    if (id) {
      dispatch(getGLInformation({ id, page, pageSize, sort, search }));
    }
  }, [id, page, pageSize, sort, search]);

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
    if (id && data_GL && data_detail) {
      const dataTable = data_GL?.result?.map((item, index) => {
        return {
          glInformationId: item?.id,
          paymentItemId: item?.paymentItemId,
          key: (index + 1).toString(),
          id: item?.id,
          bankAccount: item?.bankAccount,
          bankAccountId: item?.bankAccountId,
          glAccount: item?.glAccount,
          startDate:
            item?.startDate === null ? "" : moment(item?.startDate).clone(),
          endDate: item?.endDate === null ? "" : moment(item?.endDate).clone(),
        };
      });

      form.setFieldsValue({
        id: data_detail?.paymentItem.id,
        paymentMethodCode: data_detail?.paymentItem?.paymentItemCode,
        name: data_detail?.paymentItem?.name,
        startDate:
          data_detail?.paymentItem?.startDate === null
            ? moment()
            : moment(data_detail?.paymentItem?.startDate).clone(),
        endDate:
          data_detail?.paymentItem?.endDate === null
            ? ""
            : moment(data_detail?.paymentItem?.endDate).clone(),
        description: data_detail?.paymentItem?.description,
        apphierId: data_detail?.paymentItem?.appHierId,
      });
      setSelectedHierarchy(data_detail?.paymentItem?.appHierId);
      setTableData(dataTable);
      setListDataAttachment(
        (data_detail?.attachmentDtoList || []).map((attachData) => ({
          ...attachData,
          fileSize: bytesConverter(attachData.fileSize || 0),
          dataType: "exist",
        }))
      );
    }
  }, [data_detail, data_GL, id]);

  // Define tabData before using it in useState

  const [tabData, setTabData] = useState([
    { value: "Payment Method", paramValue: ["name", "startDate"] },
    { value: "Approval", paramValue: ["apphierId"] },
    { value: "Attachment" },
  ]);

  const [valuePage, setValuePage] = useState(tabData[0].value);
  const [sendBody, setSendBody] = useState();
  const onChange = (e) => {
    setValuePage(e.target.value);
  };

  useEffect(() => {
    if (
      formValue.apphierId &&
      !appHierOptions.map((item) => item.value).includes(formValue.apphierId)
    ) {
      form.setFieldsValue({ apphierId: null });
      setSelectedHierarchy(null);
    }
  }, [formValue, appHierOptions, form]);

  const dataBanks = data_GLAccount?.data?.map((item) => {
    return {
      value: item,
      label: item,
    };
  });
  console.log(sendBody);

  const handleSubmitForm = (formValue) => {
    const isDuplicateBank = tableData?.map((item) => item?.glAccount);
    let message = "";
    if (tableData.length === 0) {
      message = "Please input your GL Information";
    } else if (
      isDuplicateBank.some(function (item, idx) {
        return isDuplicateBank.indexOf(item) !== idx;
      })
    ) {
      let findRow = isDuplicateBank
        .filter((item, index) => {
          let ind = isDuplicateBank.findIndex(
            (item2) => item?.item === item2?.item
          );
          return index === ind;
        })
        ?.toString();
      const positionNameFiltered = dataBanks?.filter(
        (a) => a.value === findRow
      );
      message = `GL Account is already exist`;
    }
    if (message || tableData?.length === 0) {
      const errorBody = {
        title: "Attention",
        description: `Your data was not created. ${message}. Please try again.`,
      };
      dispatch(showModalError(errorBody));
    } else {
      const modifiedArray = tableData.map((obj) => {
        const { key, ...rest } = obj;
        return rest;
      });
      const define = modifiedArray.map((item) => {
        return {
          glInformationId: item?.id || null,
          glAccount: item?.glAccount,
          bankAccountId: item?.bankAccountId,
          startDate: moment(item?.startDate).format("DD MMM YYYY"),
          endDate: item?.endDate
            ? moment(item.endDate).format("DD MMM YYYY")
            : null,
        };
      });

      const dataValue = {
        // paymentItemId: id,
        paymentMethodCode: formValue.paymentMethodCode,
        startDate: moment(formValue.startDate).format(dateFormatting.date),
        endDate: formValue.endDate
          ? moment(formValue.endDate).format(dateFormatting.date)
          : null,
        name: formValue.name,
        description: formValue.description,
        appHierId: formValue.apphierId,
        glInformationDtoList: define,
        isBankMethod: checked,
      };

      setSendBody(dataValue);
      setTabData([
        { value: "Payment Method", paramValue: ["name", "startDate"] },
        { value: "Approval", paramValue: ["apphierId"] },
        { value: "Attachment" },
      ]);
      const bodyValidasiUpdate = {
        ...dataValue,
        id: data_detail?.paymentItem?.id,
      };
      if (type !== "update") {
        dispatch(createValidasiPayMetohod(dataValue))
          .unwrap()
          .then(async (data) => {
            const sukses = data?.success;
            if (sukses === false) {
              setModalConfirm(false);
            }
            setModalConfirm(true);
          });
      }
      dispatch(createValidasiPayMetohod(bodyValidasiUpdate))
        .unwrap()
        .then(async (data) => {
          const sukses = data?.success;
          if (sukses === false) {
            setModalConfirm(false);
          }
          setModalConfirm(true);
          setSendBody(bodyValidasiUpdate)
        });
    }
  };

  const handleResetStartDate = () => { };

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
      setTableData([]);
      setListDataAttachment([]);
      setChecked(false);
    } else {
      dispatch(getDetailItem(id));
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
      breadcrumbName: "Receipt & Collection",
    },
    {
      path: RECEIPT_AND_COLLECTION_ROUTES.VIEW_PAYMENT_ITEM,
      breadcrumbName: "Payment Method",
    },
    {
      path: RECEIPT_AND_COLLECTION_ROUTES.CREATE_MASTER_BANK,
      breadcrumbName: `${type === "create" ? "Create" : "Update"}`,
    },
  ];

  /// table GL Information
  const handleCheckboxChange = () => {
    const filterBank = data_bank[0];
    setChecked(!checked); // Toggle the value of checked
    if (!checked) {
      const newData = [...tableData];
      const isItemExists = newData.some(
        (item) => item.bankAccountId === filterBank.id
      );
      if (!isItemExists) {
        const dataValue = {
          bankAccountId: filterBank.id,
          glAccount: data_GLAccount[0],
          startDate: moment().format("DD-MMM-YYYY"),
          endDate: null,
          key: tableData.length + 1,
        };
        newData.push(dataValue);
        setTableData(newData);
      }
    } else {
      // Jika kotak centang telah dicentang sebelumnya
      const newData = [...tableData];
      // Hapus data yang telah ditambahkan saat kotak centang adalah false
      const indexToRemove = newData.findIndex(
        (item) => item.bankAccountId === filterBank.id
      );
      if (indexToRemove !== -1) {
        const keyToReplace = newData[indexToRemove + 1]?.key; // Get the key of the next item if it exists
        newData.splice(indexToRemove, 1); // Remove the item
        // Check if the next item exists before replacing the key
        if (keyToReplace !== undefined) {
          newData[indexToRemove].key = keyToReplace;
        }
        setTableData(newData);
      }
    }
  };

  const columns = (
    page,
    pageSize,
    searchInput,
    searchedColumn,
    searchText,
    handleSearch = () => { }
  ) => [
      {
        title: "NO",
        dataIndex: "no",
        width: "5%",
        align: "center",
        render: (text, object, index) => (page - 1) * pageSize + index + 1,
      },
      {
        title: "BANK ACCOUNT",
        dataIndex: "bankAccountId",
        align: "",
        sorter: true,
        ...getColumnSearchPropsPaging(
          "bankAccountId",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch
        ),
        sorter: (a, b) => a.bankAccount - b.bankAccount,
        render: (dataBank) => (
          <span>
            {data_bank &&
              data_bank?.filter((a) => a.id === dataBank).find((b) => b.name)
                ?.name}
          </span>
        ),
      },
      {
        title: "GL ACCOUNTT",
        dataIndex: "glAccount",
        align: "",
        sorter: true,
        ...getColumnSearchPropsPaging(
          "glAccount",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch
        ),
      },
      {
        title: "START DATE",
        dataIndex: "startDate",
        inputType: "date",
        align: "center",
        editable: true,
        key: "startDate",
        ...getColumnSearchPropsPaging(
          "startDate",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
          "date"
        ),
        sorter: (a, b) => a.startDate - b.startDate,
        render: (index) => {
          const text = index ? moment(index).format("DD MMM YYYY") : "";
          if (searchedColumn === "startDate") {
            return (
              <Highlighter
                highlightStyle={{
                  backgroundColor: "#ffc069",
                  padding: 0,
                }}
                searchWords={[
                  searchText
                    ? moment(searchText, "YYYY-MM-DD").format("DD MMM YYYY")
                    : "",
                ]}
                autoEscape
                textToHighlight={text ? text.toString() : ""}
              />
            );
          } else {
            return text || " ";
          }
        },
      },
      {
        title: "END DATE",
        dataIndex: "endDate",
        inputType: "date",
        align: "center",
        editable: true,
        ...getColumnSearchPropsPaging(
          "endDate",
          searchInput,
          searchedColumn,
          searchText,
          handleSearch,
          true,
          "date"
        ),
        sorter: true,
        render: (index) => {
          const text = index ? moment(index).format("DD MMM YYYY") : "";
          if (searchedColumn === "endDate") {
            return (
              <Highlighter
                highlightStyle={{
                  backgroundColor: "#ffc069",
                  padding: 0,
                }}
                searchWords={[
                  searchText
                    ? moment(searchText, "YYYY-MM-DD").format("DD MMM YYYY")
                    : "",
                ]}
                autoEscape
                textToHighlight={text ? text.toString() : ""}
              />
            );
          } else {
            return text || " ";
          }
        },
      },
    ];

  const paginationTable = (typeData = "data") => {
    let result = [...tableData];
    if (searchedColumn) {
      const fixSearchText = searchText.toLowerCase();
      result = result.filter((item) => {
        if (searchedColumn === "bankAccountId") {
          const data = item[searchedColumn] || 0;
          const bankName = data_bank
            ?.filter((a) => a.id === data)
            .find((b) => b.name)?.name;
          return (bankName || "").toLowerCase().includes(fixSearchText);
        }
        if (searchedColumn === "glAccount") {
          const data = item[searchedColumn] || 0;
          const glName = data_GLAccount?.filter((a) => a === data)?.[0]?.a;
          return (glName || "").toLowerCase().includes(fixSearchText);
        } else {
          switch (searchedColumn) {
            case "startDate":
            case "endDate":
              const date = item[searchedColumn]
                ? moment(item[searchedColumn]).format("DD MMM YYYY")
                : "";
              return date?.toLowerCase().includes(fixSearchText);
            default:
              return item[searchedColumn]
                ?.toLowerCase()
                .includes(fixSearchText);
          }
        }
      });
    }
    const fix = result.slice((page - 1) * pageSize, page * pageSize);
    return typeData === "data" ? fix : result.length;
  };

  //kriim bodyy
  const handleSave = async () => {
    setModalConfirm(false);
    const successMessageCreate = {
      title: "Successfull",
      description: `Your data has been submited`,
      return: true,
    };

    const successMessageUpdate = {
      title: "Successfull",
      description: `Your data has been submited`,
      return: true,
    };

    if (type === "update") {
      // const updateBody = {
      //   ...sendBody,
      //   paymentItemId: data_detail?.paymentItem?.id,
      // };
      dispatch(updatePaymentItem(sendBody))
        .unwrap()
        .then(async () => {
          const id = data_detail?.paymentItem?.id;
          setLoadingForm(true);
          const filterDataAttach = listDataAttachment.filter(
            (item) => item.dataType !== "exist"
          );
          for (let icon = 0; icon < filterDataAttach.length; icon++) {
            const element = filterDataAttach[icon];
            const body = {
              referensiId: data_detail?.paymentItem?.id,
              files: element.file,
              category: "PAYMENT METHOD",
              fileCategoryId: element.fileCategoryId,
            };
            const response = await receiptCollectionHttpService.uploadImage(
              `/v1/dbs/api/attachment/upload/v1`,
              body
            );
          }
          setLoadingForm(false);
          setMethodId(id);
          handleCancelModalConfirm();
          form.resetFields();
          setSelectedHierarchy("");
          setListDataAttachment([]);
          dispatch(showModalSuccess(successMessageUpdate));
          handleClear();
        })
        .catch((error) => {
          if (Math.floor((error.response.data.code || 0) / 100) === 5) {
            const message =
              (error.response &&
                error.response.data &&
                error.response.data.message) ||
              error.message ||
              error.toString();
            dispatch(showModalError(message));
          }
        });
    } else {
      dispatch(createPaymentItem(sendBody))
        .unwrap()
        .then(async (data) => {
          let id = data.id;
          setLoadingForm(true);
          for (let icon = 0; icon < listDataAttachment.length; icon++) {
            const element = listDataAttachment[icon];

            const body = {
              files: element.file,
              fileCategoryId: element.fileCategoryId,
              referensiId: id,
              category: "PAYMENT METHOD",
            };
            const response = await receiptCollectionHttpService.uploadImage(
              `/v1/dbs/api/attachment/upload/v1`,
              body
            );
          }
          setLoadingForm(false);
          setMethodId(id);
          handleCancelModalConfirm();
          handleClear();
          dispatch(showModalSuccess(successMessageCreate));
        })
        .catch((error) => {
          if (Math.floor((error.response.data.code || 0) / 100) === 5) {
            const message =
              (error.response &&
                error.response.data &&
                error.response.data.message) ||
              error.message ||
              error.toString();
            dispatch(showModalError(message));
          }
        });
    }
  };

  return (
    <LayoutMenu>
      <BreadCrumb routes={routes} />
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
          <PaymentItemForm
            data_detail={data_detail?.paymentItem}
            id={id}
            handleCheck={handleCheckboxChange}
            checked={checked}
            formValue={formValue}
            form={form}
          // tableData={tableData}
          />
          <TableGlInformation
            formValueHeader={formValue}
            tableData={tableData}
            onSort={onSort}
            onDataChange={setTableData}
            id={id}
            data_GLAccount={data_GLAccount}
            data_bank={data_bank}
          />
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
              typeSelector="item"
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
            // onClick={() => setModalConfirm(true)}
            // disabled={disableSubmit}
            >
              Save & Submit
            </ButtonComponent>
          </div>
        </div>
      </Form>

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
        <ContentModalConfirmPayment
          data={sendBody}
          tabData={tabData}
          dataTable={paginationTable("data")}
          listDataAttachment={listDataAttachment}
          columns={columns(
            page,
            pageSize,
            searchInput,
            searchedColumn,
            searchText,
            handleSearch
          )}
          checked={checked}
          page={page}
          pageSize={pageSize}
          listDataDetail={tableDatas}
          totalData={paginationTable("length")}
          listDataAppHierDetail={appHierDataDetail}
          onChange={handleChangePage}
          dataOption={appHierOptions}
          selectedHierarchy={selectedHierarchy}
        />
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
    </LayoutMenu>
  );
};

export default ListFormPaymentItem;
