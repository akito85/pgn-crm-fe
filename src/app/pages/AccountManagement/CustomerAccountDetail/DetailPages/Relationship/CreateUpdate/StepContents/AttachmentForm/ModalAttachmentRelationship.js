import { Button, Form, Modal, Progress, Select, Typography } from "antd";
import { useState, useCallback, useEffect } from "react";
import SelectComponent from "../../../../../../../../../components/SelectComponent";
import Dragger from "antd/lib/upload/Dragger";
import {
  CloseOutlined,
  FileOutlined,
  UndoOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import InputComponent from "../../../../../../../../../components/InputComponent";
import ButtonComponent from "../../../../../../../../../components/ButtonComponent";
import { bytesConverter } from "../../../../../../../../../utils/bytesConverter";
import { getBase64 } from "../../../../../../../../../utils/getBase64";
import SVGIcon from "../../../../../../../../../assets/Icon/index";
import ExtensionFile from "../../../../../../../../../utils/ExtensionFile";

const MAX_FILE_SIZE = 5000000;
const ModalAttachment = ({
  openUpload = false,
  updateData = () => {},
  handleCancel = () => {},
  categoryOptions = [],
  withLink = true,
  valueGuard = {},
}) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [category, setCategory] = useState();
  const [submit, setSubmit] = useState(false);
  const [dataLink, setDataLink] = useState({});
  const [urlLink, setUrlLink] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [dataGuard, setDataGuard] = useState({});

  useEffect(() => {
    const tempFileExt = (valueGuard?.fileExt || "")
      .split(",")
      .reduce((prev, current, index) => {
        return `.${current}${index !== 0 ? ", " : ""}${prev}`;
      }, "");
    const tempSize = parseInt(valueGuard?.size || "0") * 1000000;
    setDataGuard({
      fileExt: tempFileExt === "." ? ExtensionFile : tempFileExt,
      size: tempSize || MAX_FILE_SIZE,
    });
  }, [valueGuard]);

  const getFileExtension = (file) => {
    return file.slice(((file.lastIndexOf(".") - 1) >>> 0) + 2)?.toLowerCase();
  };

  const handleClose = () => {
    setFileList([]);
    setCategory("");
    setDataLink({});
    setUrlLink("");
    setErrorMessage("");
    setSubmit(false);
    form.resetFields();
    handleCancel();
  };
  const handleCategory = (value) => {
    setCategory(value);
  };
  const handleRemove = (index) => {
    setFileList((prevFileList) => {
      const updatedFileList = [...prevFileList];
      updatedFileList.splice(index, 1);
      if (updatedFileList.length === 0) {
        setSubmit(false);
      }
      return updatedFileList;
    });
  };
  const property = {
    name: "file",
    multiple: true,
    fileList: fileList,
    showUploadList: false,
    accept: dataGuard.fileExt,
    disabled: !category,
    beforeUpload: useCallback(
      async (file) => {
        const base64 = await getBase64(file);
        const file_extension = getFileExtension(file?.name);
        if (dataGuard.fileExt.includes(file_extension)) {
          setFileList((prevState) => {
            const res = {
              file: file,
              size: file.size,
              fileName: file.name,
              fileSize: bytesConverter(file.size),
              fileType: file.type,
              fileStatus: file.status,
              percent: 100,
              dataType: "new",
              base64: base64,
            };
            return [...prevState, res];
          });
          setSubmit(true);
        }
        return false;
      },
      [category]
    ),
  };

  const handleUpload = (value) => {
    if (fileList.length > 0) {
      updateData((prevState) => {
        let key = prevState.reduce(
          (current, next) => {
            const nextKey = next.key || 0;
            return current > nextKey
              ? parseInt(current) + 1
              : parseInt(nextKey) + 1;
          },
          [1]
        );
        let newData = fileList.map((file) => {
          return {
            ...file,
            key: key++,
            fileCategoryName: category.label,
            fileCategoryId: category.value,
          };
        });
        newData = newData.filter((item) => item.size <= dataGuard.size);
        return [...prevState, ...newData];
      });
    } else {
      updateData((prevState) => {
        let key = prevState.reduce(
          (current, next) => {
            const nextKey = next.key || 0;
            return current > nextKey
              ? parseInt(current) + 1
              : parseInt(nextKey) + 1;
          },
          [1]
        );
        const data = {
          ...dataLink,
          key: key++,
          fileCategoryName: category.label,
          fileCategoryId: category.value,
        };
        return [...prevState, data];
      });
    }
    handleClose();
  };

  const handleUploadLink = async (e) => {
    e.stopPropagation();
    const url = urlLink.startsWith("http") ? urlLink : `https://${urlLink}`;
    if (!!url) {
      try {
        const fileName = url.split("/").pop();
        const result = await fetch(url);
        const blob = await result.blob();
        const file = new File([blob], fileName, {
          lastModified: new Date(),
          type: blob.type,
        });
        const base64 = await getBase64(file);
        const res = {
          file: file,
          size: file.size,
          fileName: file.name,
          fileSize: bytesConverter(file.size),
          fileType: blob.type,
          fileStatus: "",
          percent: 100,
          dataType: "new",
          base64: base64,
        };
        const file_extension = getFileExtension(file?.name);

        if (
          res.size <= dataGuard.size &&
          dataGuard.fileExt.includes(file_extension)
        ) {
          setDataLink(res);
          setSubmit(true);
        } else {
          setSubmit(true);
          setErrorMessage(
            res.size > dataGuard.size
              ? "The file size more than 5 MB"
              : "Format file not valid"
          );
        }
      } catch (error) {
        setSubmit(true);
        setErrorMessage(error?.message || "Link cannot access to get the file");
      }
    }
  };

  const updateLink = (e) => {
    e.stopPropagation();
    setUrlLink(e.target.value);
  };

  return (
    <Modal
      open={openUpload}
      footer={false}
      className={"modal-custom"}
      closable={false}
      centered={true}
      width={950}
    >
      <Form layout={"vertical"} form={form} onFinish={handleUpload}>
        <div className="flex flex-col w-full gap-3 p-8">
          <div
            className={
              "rounded-tl-[5px] rounded-tr-[5px] flex w-full items-end justify-between"
            }
          >
            <div className={"flex flex-col gap-y-5"}>
              <span className="text-xl">Attach Files</span>
              <span className="text-gray-500">
                Attach files to this section
              </span>
            </div>
            <Form.Item name={"category"} className={"w-1/4 no-margin-form"}>
              <SelectComponent
                allowClear={false}
                mandatory
                label={"Category"}
                onChange={handleCategory}
                labelInValue
              >
                {categoryOptions.map((data, index) => (
                  <Select.Option key={index} value={data.id}>
                    {data.text}
                  </Select.Option>
                ))}
              </SelectComponent>
            </Form.Item>
          </div>
          <Form.Item name={"file"}>
            <div className="w-full">
              <Dragger {...property}>
                <p className="ant-upload-drag-icon">
                  <SVGIcon name="IconUploadAttachment" />
                </p>
                {(submit && fileList.length > 0) || !submit ? (
                  <>
                    <p className="ant-upload-text underline text-bold">
                      Click here to attach a file
                    </p>
                    <p className="ant-upload-hint">
                      The maximum file size is limited to 5 MB
                    </p>
                  </>
                ) : null}
                {withLink && !submit && (
                  <>
                    <div className="flex items-center justify-center my-3 gap-x-3">
                      <div className="border-t-0 rounded-full border-x-0 border-solid border-gray-300 w-24 h-0" />
                      <span>or</span>
                      <div className="border-t-0 rounded-full border-x-0 border-solid border-gray-300 w-24 h-0" />
                    </div>
                    <div className="flex flex-col items-center gap-4">
                      <p className="ant-upload-text">Put URL link below</p>
                      <div className="flex justify-center items-center gap-3">
                        <InputComponent
                          width={"24%"}
                          onChange={updateLink}
                          onClick={(e) => e.stopPropagation()}
                          disabled={!category}
                        />
                        <Button
                          onClick={handleUploadLink}
                          icon={<UploadOutlined />}
                          type={"submit"}
                          border={false}
                          disabled={!category}
                        />
                      </div>
                    </div>
                  </>
                )}
                {submit && (dataLink.file || !!errorMessage) ? (
                  <>
                    <p
                      className={`mb-1 text-base${
                        errorMessage ? " text-red-700" : ""
                      }`}
                      style={!errorMessage ? { color: "#BBCF4B" } : null}
                    >
                      {errorMessage || "Link has been attached!"}
                    </p>
                    <p className="ant-upload-text underline">{urlLink}</p>
                  </>
                ) : null}
              </Dragger>
            </div>
          </Form.Item>
          {fileList.map((file, index) => (
            <div
              className="border-solid border-[0.12rem] border-black rounded-[0.5rem] my-4 py-2 px-3 flex gap-4 items-center"
              key={index}
            >
              <div>
                <FileOutlined style={{ fontSize: "20px" }} />
              </div>
              <div className="flex flex-col w-full">
                <div className="flex w-full justify-between">
                  <Typography className={"text-red-500"}>
                    {file.fileName}
                  </Typography>
                  <Button
                    icon={<CloseOutlined style={{ color: "#58804D" }} />}
                    onClick={() => handleRemove(index)}
                  />
                </div>
                <Typography>{file.fileSize}</Typography>
                {file.fileStatus === "error" ? (
                  <div className="flex w-full justify-between">
                    <span className={"text-red-700"}>Failed to Upload</span>
                    <Button>
                      <span className={"text-green-800 mr-2"}>Re-upload</span>
                      <UndoOutlined style={{ color: "#58804D" }} />
                    </Button>
                  </div>
                ) : file.size <= dataGuard.size ? (
                  <Progress
                    percent={file.percent || 0}
                    format={(percent) => `${percent}%`}
                  />
                ) : (
                  <span className={"text-red-700"}>
                    File is bigger than 5MB
                  </span>
                )}
              </div>
            </div>
          ))}
          <div className="w-full flex justify-end gap-2">
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              type={"submit"}
              border={false}
              htmlType={"submit"}
              disabled={!submit || errorMessage}
            >
              Save
            </Button>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default ModalAttachment;
