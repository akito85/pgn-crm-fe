import { Button, Upload } from "antd";
import { getBase64 } from "../../../../../../utils/getBase64";
import { EyeOutlined } from "@ant-design/icons";
import { bytesConverter } from "../../../../../../utils/bytesConverter";
import { showModalError } from "../../../../../../redux/slices/general_slice";
import FileSaver from "file-saver";
import { tokenHeader } from "../../../../../../utils/tokenHeader";
import axios from "axios";
import { PreviewFile } from "../Utils/PreviewFile";
import { previewGeneralTemplate } from "../../../../../../redux/slices/rating_billing_invoice/MasterData/general_template";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import ExtensionFile from "../../../../../../utils/ExtensionFile";

const UploadTemplate = ({
  fileList,
  setFileList = () => {},
  setValidateFile = () => {},
  setFileName = () => {},
  setBase64Image = () => {},
  handleOnchange = () => {},
  handleRemove = () => {},
  showUploadList = {
    showPreviewIcon: false,
    showRemoveIcon: false,
  },
  dispatch,
  isMultiList = false,
  maxCount = 1,
  allowedFile = "png, jpeg, jpg",
  accept = ".pdf, .rtf",
  type = false,
  acceptFile = "file",
  allowSize = 5,
  configApplication,
  getAPIGuard,
  typeRBI,
  fileTypeCheck = ["application/msword", "application/rtf"],
}) => {
  // Selector
  const { dataConfigRBIDataGeneralTemplate } = useSelector(
    (state) => state.general_template,
  );

  // console.log("UploadTemplate", dataConfigRBIDataGeneralTemplate);
  const [dataGuard, setDataGuard] = useState({});
  const [valueGuard, setValueGuard] = useState({});

  useEffect(() => {
    if (getAPIGuard) {
      dispatch(getAPIGuard());
    }
  }, [dispatch, getAPIGuard]);

  useEffect(() => {
    if (dataConfigRBIDataGeneralTemplate) {
      setValueGuard(dataConfigRBIDataGeneralTemplate);
    } else {
      setValueGuard({});
    }
  }, [dataConfigRBIDataGeneralTemplate]);

  useEffect(() => {
    const tempFileExt = (valueGuard?.fileExt || "")
      .split(",")
      .reduce((prev, current, index) => {
        return `.${current}${index !== 0 ? ", " : ""}${prev}`;
      }, "");
    const tempSize = parseInt(valueGuard?.size || "0") * 1000000;
    setDataGuard({
      fileExt: tempFileExt === "." ? ExtensionFile : tempFileExt,
      size: tempSize || 5000000,
    });
  }, [valueGuard]);

  const getFileExtension = (file) => {
    return file.slice(((file.lastIndexOf(".") - 1) >>> 0) + 2)?.toLowerCase();
  };

  // console.log(accept);
  const handleShow = async (r) => {
    // console.log(r);
    if (r.dataType !== "exist") {
      if (r.fileType && r.fileType.includes("application/vnd")) {
        FileSaver.saveAs(r.base64, r.fileName);
      } else {
        PreviewFile(r.base64, r.fileName);
      }
    } else {
      try {
        if (r.type && fileTypeCheck.some((v) => r.type.includes(v))) {
          let filename = r?.fileName;
          let extension = filename.match(/\.([^.]+)$/);
          dispatch(
            previewGeneralTemplate({
              url: r.urlFile1,
              extension: extension[1],
              filename: filename,
            }),
          );
        } else {
          const response = await axios.get(configApplication + r.urlFile1, {
            headers: tokenHeader(),
            responseType: "blob",
          });
          // console.log(response);
          const base64 = await getBase64(response.data);
          // console.log(base64);
          PreviewFile(base64, r.fileName);
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    }
  };

  return (
    <div className="w-full flex flex-row items-center gap-5 justify-start">
      {type ? (
        <div>
          <p style={{ margin: 0 }}>{`${fileList[0]?.fileName || ""}`}</p>
        </div>
      ) : (
        <Upload
          fileList={fileList}
          showUploadList={showUploadList}
          accept={dataGuard.fileExt}
          // listType={acceptFile}
          beforeUpload={async (file) => {
            const allowed_file = allowedFile.toLowerCase()?.split(",");
            const file_extension = getFileExtension(file?.name);
            if (
              dataGuard.fileExt?.includes(file_extension) &&
              file.size / (1024 * 1024) <= parseInt(valueGuard?.size) // file in Mb
            ) {
              setValidateFile(true);
              setFileName(file?.name);
              const base64 = await getBase64(file);
              const regex = "";
              setBase64Image(base64.replace(regex, "")); // for those who need only base 64 to send to server

              setFileList((prevState) => {
                const res = {
                  // ...file,
                  file: file,
                  size: file.size,
                  name: file.name,
                  fileName: file.name,
                  fileSize: bytesConverter(file.size),
                  fileType: file.type,
                  fileStatus: file.status,
                  percent: 100,
                  dataType: "new",
                  base64: base64,
                };
                return [...(isMultiList ? prevState : []), res];
              });
              // setFileList([...fileList, { ...file, percent: 0 }]);
            } else {
              if (allowed_file?.includes(file_extension) === false) {
                setValidateFile(false);
                const errorBody = {
                  title: "Failed",
                  description: `Format file not valid`,
                };
                dispatch(showModalError(errorBody));
              }
              if (
                allowed_file?.includes(file_extension) === true &&
                file.size / (1024 * 1024) > parseInt(valueGuard?.size)
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
          onChange={handleOnchange}
          onRemove={handleRemove}
          className="flex flex-row items-center gap-5 justify-start"
          maxCount={maxCount}
        >
          <div>
            <Button>Choose File</Button>
            {fileList.length > 0 ? null : (
              <span className={"text-gray-500 text-xs ml-2 mb-4"}>
                {" "}
                No File Choosen
              </span>
            )}
          </div>
        </Upload>
      )}
      {fileList.length > 0 ? (
        <span className={"text-gray-500 text-xs ml-2"}>
          <EyeOutlined
            style={{ fontSize: "24px", color: "#8D91A0" }}
            onClick={() => handleShow(fileList[0])}
          />
        </span>
      ) : null}
    </div>
  );
};

export default UploadTemplate;
