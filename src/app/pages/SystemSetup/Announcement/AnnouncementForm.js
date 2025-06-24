import moment from "moment";
import { LeftOutlined } from "@ant-design/icons";
import { Form, Image, Spin, Upload } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { showModalError, validateCreateUpdate } from "../../../../redux/slices/general_slice";
import {
  createHtmlAnnouncement,
  getAnnouncementDetail,
  checkAllowingFile,
  updateHtmlAnnouncement,
} from "../../../../redux/slices/system_setup/announcement";
import { getBase64 } from "../../../../utils/getBase64";
import { dateFormatting, formMessageRequired, hasValue } from "../../../../utils";
import { SYSTEM_SETUP_ROUTES } from "../../../../routes/system_setup/setup_routes";
import BaseContainer from "../../../../components/BaseContainer";
import BreadCrumb from "../../../../components/BreadCrumb";
import LayoutMenu from "../../../../components/SidebarMenu/LayoutMenu";
import ButtonComponent from "../../../../components/ButtonComponent";
import InputComponent from "../../../../components/InputComponent";
import DateComponent from "../../../../components/DateComponent";
import RadioTabs from "../../../../components/RadioTabs";
import ModalBack from "../../../../components/Modal/ModalBack";
import SVGIcon from "../../../../assets/Icon/index";
import ModalConfirmationAnnouncement from "./Modal/ModalConfirmationAnnouncement";
import { useTryAgainHooks } from "../../../../utils/useTryAgainHooks";
import userHttpService from "../../../../redux/services/userHttpService";

const AnnouncementForm = ({ type }) => {
  //Selector
  const { loading, detail_Announcement, allow_file } = useSelector(
    (state) => state.announcement
  );
  const { bodyError } = useSelector(state => state?.general);


  //Declaration
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const id = location?.state?.id;
  const formValue = form.getFieldsValue();

  
  //Use State
  const [listSectionInfo, setListSectionInfo] = useState([
    { value: "HTML" },
    { value: "IMAGE" },
  ]);

  const [startDate, setStartDate] = useState();
  const [fileName, setFileName] = useState();
  const [valuePage, setValuePage] = useState(listSectionInfo[0].value);

  const [fileList, setFileList] = useState([]);
  const [base64Image, setBase64Image] = useState("");
  const [validateFile, setValidateFile] = useState(false);
  const [description, setDescription] = useState("");
  const [annContentHtml, setAnnContentHtml] = useState("");
  const [acceptExtension, setAcceptExtension] = useState("");

  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalBack, setModalBack] = useState(false);
  const [payload, setPayload] = useState({})

  const routes = [
    {
      path: "",
      breadcrumbName: "System Setup",
    },
    {
      path: SYSTEM_SETUP_ROUTES.VIEW_ANNOUNCEMENT,
      breadcrumbName: "Announcement",
    },
    {
      path: "",
      breadcrumbName: `${type === "create" ? "Create Announcement" : "Update Announcement"
        }`,
    },
  ];

  useEffect(() => {
    dispatch(checkAllowingFile());
    if (id && type === "update") {
      dispatch(getAnnouncementDetail(id));
    }
  }, [dispatch, id, type]);

  useEffect(() => {
    if (id && type === "update") {
      form.setFieldsValue({
        announcementName: detail_Announcement?.annName,
        startDate: detail_Announcement.startDate
          ? moment(detail_Announcement?.startDate)
          : undefined,
        endDate: detail_Announcement.endDate
          ? moment(detail_Announcement?.endDate)
          : undefined,
        description: detail_Announcement.description,
        annContent:
          detail_Announcement.contentType === "HTML"
            ? detail_Announcement.annContent
            : null,
        image: detail_Announcement.urlLogo2,
        urlImage: detail_Announcement?.urlLogo2,
      });
    }
    setAcceptExtension(
      allow_file?.data?.fileExt
        ?.toLowerCase()
        ?.split(",")
        ?.map((item) => `.${item}`)
        ?.join(", ")
    );
    setStartDate(moment(detail_Announcement?.startDate));
    setFileList([]);
  }, [id, form, detail_Announcement, type, allow_file]);

  const onChange = (e) => {
    if (e.target.value === "HTML" && type === "create") {
      handleRemove();
    } else if (e.target.value === "IMAGE" && type === "create") {
      form.resetFields(["annContent"]);
      setAnnContentHtml("");
    }
    setValuePage(e.target.value);
  };

  const onFinish = async (formValue) => {
    try {
      let url;
      let bodyRequest;
      let image = base64Image.split(",")[1];
      if (type === 'update') {
        bodyRequest = {
          announcementId: id,
          startDate: hasValue(formValue?.startDate) ? moment(formValue?.startDate).format(dateFormatting.date) : null,
          endDate: hasValue(formValue?.endDate) ? moment(formValue?.endDate).format(dateFormatting.date) : null,
          annName: formValue.announcementName,
          description: formValue.description,
          contentType: valuePage,
          annContent: valuePage === "HTML" ? formValue.annContent : fileName,
          image: valuePage === "IMAGE" ? image : undefined,
          urlImage: formValue.urlImage,
        }
        url = '/v1/dbs/api/announcement/validate-update'
      } else {
        bodyRequest = {
          startDate: hasValue(formValue?.startDate) ? moment(formValue?.startDate).format(dateFormatting.date) : null,
          endDate: hasValue(formValue?.endDate) ? moment(formValue?.endDate).format(dateFormatting.date) : null,
          annName: formValue.announcementName,
          description: formValue.description,
          contentType: valuePage,
          annContent: valuePage === "HTML" ? formValue.annContent : fileName,
          image: valuePage === "IMAGE" ? image : undefined,
          urlImage: formValue.urlImage,
        }
        url = '/v1/dbs/api/announcement/validate-create'
      }
      setPayload({
        body: bodyRequest,
        validateCreateUpdate: { body: bodyRequest, services: userHttpService, endPoint: url, type }
      })

      await dispatch(validateCreateUpdate({ body: bodyRequest, services: userHttpService, endPoint: url, type }))?.unwrap();
      setModalConfirm(true);
    } catch (error) {
      setModalConfirm(false);
    }
  };

  const getFileExtension = (file) => {
    return file.slice(((file.lastIndexOf(".") - 1) >>> 0) + 2)?.toLowerCase();
  };

  const handleStartDate = (e) => {
    if (e === null || e === undefined) {
      setStartDate(e);
    } else {
      setStartDate(moment(e));
    }
  };

  const handleDisableEndDate = (current) => {
    if (hasValue(formValue?.startDate)) {
      return current && current < moment(formValue?.startDate).startOf("day");
    } else {
      return current && current < moment().startOf("day");
    }
  };

  const handleChange = ({ fileList }) => {
    if (validateFile) {
      setFileList(fileList);
    } else {
      setFileList([]);
    }
  };

  const handleRemove = () => {
    setFileList([]);
    setFileName("");
    setBase64Image("");
  };

  const handleClear = () => {
    form.resetFields();
    setFileList([]);
    if (type === "create") {
      form.resetFields();
    } else {
      setBase64Image("");
      dispatch(getAnnouncementDetail(id));
      setFileList([]);
      setFileName("");
    }
  };

  const handleConfirm = async () => {
    try {
      handleCloseModalError()
      if (type === "create") {
        await dispatch(createHtmlAnnouncement(payload?.body))?.unwrap()
      } else {
        await dispatch(updateHtmlAnnouncement(payload?.body))?.unwrap()
      }
      handleClear()
    } catch (error) {
      handleCloseModalError()
    }
  };

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

  const handleCloseModalError = () => {
    setModalConfirm(false);
  };

  const handleRetry = () => {
    handleCancelTryAgain()
    if (bodyError?.action === 'CREATE_HTML_ANNOUNCEMENT') {
      dispatch(createHtmlAnnouncement(payload))
    } else if (bodyError?.action === 'UPDATE_HTML_ANNOUNCEMENT') {
      dispatch(updateHtmlAnnouncement(payload))
    } else {
      dispatch(getAnnouncementDetail(id))
    }
    handleCloseModalError()
  };

  const { renderModal, handleCancelTryAgain } = useTryAgainHooks(handleRetry)

  return (
    <LayoutMenu>
      <Spin spinning={loading}>
        <BreadCrumb routes={routes} />
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          scrollToFirstError={true}
        >
          <BaseContainer header={"Announcement Information"}>
            <div className="w-full grid grid-cols-2 gap-[30px]">
              <div>
                <Form.Item
                  label={"Name"}
                  rules={formMessageRequired("Name")}
                  name={"announcementName"}
                >
                  <InputComponent type="text" disabled={type === "update"} />
                </Form.Item>
                <Form.Item
                  label={"Start Date"}
                  rules={formMessageRequired("Start Date")}
                  name={"startDate"}
                >
                  <DateComponent
                    onChange={(e) => handleStartDate(e)}
                    disabled={type === "update"}
                  />
                </Form.Item>
                <Form.Item
                  label={"End Date"}
                  name={"endDate"}
                  rules={[
                    {
                      validator: (_, value) =>
                        (value && moment(startDate) <= moment(value)) || !value
                          ? Promise.resolve()
                          : Promise.reject(
                            new Error(
                              "The end date must be greater than or equal to the start date!"
                            )
                          ),
                    },
                  ]}
                >
                  <DateComponent
                    disabled={startDate === null}
                    dateDisable={handleDisableEndDate}
                  />
                </Form.Item>
                <div className="col-span-2">
                  <Form.Item label={"Description"} name={"description"}>
                    <InputComponent
                      type="textarea"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </Form.Item>
                </div>
              </div>
              <div className="w-full gap-3 pl-4">
                <RadioTabs
                  data={listSectionInfo}
                  onChange={onChange}
                  currentPosition={valuePage}
                />
                <div
                  style={{
                    display:
                      valuePage !== listSectionInfo[0].value
                        ? "none"
                        : undefined,
                  }}
                >
                  <Form.Item
                    label={"HTML"}
                    rules={
                      valuePage === "HTML" ? formMessageRequired("HTML") : false
                    }
                    name={"annContent"}
                  >
                    <InputComponent
                      type="textarea"
                      value={annContentHtml}
                      onChange={(e) => setAnnContentHtml(e.target.value)}
                    />
                  </Form.Item>
                </div>
                <div
                  style={{
                    display:
                      valuePage !== listSectionInfo[1].value
                        ? "none"
                        : undefined,
                  }}
                >
                  <Form.Item
                    name="image"
                    rules={
                      valuePage === "IMAGE"
                        ? formMessageRequired("IMAGE")
                        : false
                    }
                    className="w-full"
                  >
                    <Upload
                      fileList={fileList}
                      accept={acceptExtension}
                      listType="picture"
                      beforeUpload={async (file) => {
                        const allowed_file = allow_file?.data?.fileExt
                          ?.toLowerCase()
                          ?.split(",");
                        const file_extension = getFileExtension(file?.name);
                        const max_allowed_file = allow_file?.data?.size;
                        const fileInMb = file.size / (1024 * 1024);
                        if (
                          allowed_file?.includes(file_extension) &&
                          fileInMb < max_allowed_file
                        ) {
                          setValidateFile(true);
                          setFileName(file?.name);
                          const base64 = await getBase64(file);
                          const regex = "";
                          setBase64Image(base64.replace(regex, ""));
                          setFileList([...fileList, { ...file, percent: 0 }]);
                        } else {
                          if (
                            allowed_file?.includes(file_extension) === false
                          ) {
                            setValidateFile(false);
                            const errorBody = {
                              title: "Failed",
                              description: `Format file not valid`,
                            };
                            dispatch(showModalError(errorBody));
                          }
                          if (
                            allowed_file?.includes(file_extension) === true &&
                            fileInMb > max_allowed_file
                          ) {
                            setValidateFile(false);
                            const errorBody = {
                              title: "Failed",
                              description: `File size not valid, file too large!`,
                            };
                            dispatch(showModalError(errorBody));
                          }
                        }
                        return false;
                      }}
                      onChange={handleChange}
                      onRemove={handleRemove}
                      className="flex flex-wrap items-center gap-5 justify-start pt-3"
                      maxCount={1}
                    >
                      <div className="flex flex-col w-full gap-2">
                        <p className="text-[13px] mb-0 text-dg-grey-dark">
                          Upload File:
                          <span className={"pl-1"} style={{ color: "red" }}>
                            *
                          </span>
                        </p>
                        <div className="flex flex-row gap-2 items-center">
                          <ButtonComponent
                            fontSizeClassname="text-[11px]"
                            size="small"
                            type="default"
                          >
                            Choose File
                          </ButtonComponent>
                        </div>
                        {fileList.length === 0 &&
                          detail_Announcement?.annContent === null ? (
                          <p className="text-[11px] text-dg-grey-dark mb-0">
                            No file choosen
                          </p>
                        ) : (
                          <span className={"text-gray-500 text-xs ml-2"}>
                            {/* {" "} */}
                            {type === "update" ? (
                              <Image
                                src={detail_Announcement?.urlLogo2}
                                width={80}
                                onClick={(e) => e.stopPropagation()}
                              />
                            ) : null}
                          </span>
                        )}
                      </div>
                    </Upload>
                  </Form.Item>
                  <Form.Item hidden name={"urlImage"} />
                </div>
              </div>
            </div>
          </BaseContainer>
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
                onClick={() => {
                  handleClear();
                }}
              //disabled={isEditable}
              >
                {type === "update" ? "Reset" : "Clear"}
              </ButtonComponent>
              <ButtonComponent type="submit" htmlType={"submit"}>
                Save
              </ButtonComponent>
            </div>
          </div>
        </Form>
        {/* Modal Confitmation */}
        <ModalConfirmationAnnouncement
          isOpen={modalConfirm}
          data={payload?.body}
          handleCancel={() => setModalConfirm(false)}
          handleConfirm={() => handleConfirm()}
          valuePage={valuePage}
        />
        {/* Modal Back */}
        <ModalBack
          isOpen={modalBack}
          handleCancel={() => setModalBack(false)}
          handleOk={() => navigate(-1)}
        />
        {/* Modal Retry */}
        {renderModal()}
      </Spin>
    </LayoutMenu>
  );
};

export default AnnouncementForm;
