import { useState, useEffect, useRef } from "react";
import { Button, Spin, Tooltip } from "antd";
import SVGIcon from "../../../../../../../../../assets/Icon/index";
import ModalAttachment from "./ModalAttachmentRelationship";
import { useSelector } from "react-redux";
import { previewFileAttachment } from "../../../../../../../../../utils/previewFileAttachment";
import { getColumnSearchPropsPaging } from "../../../../../../../../../utils/getColumnSearchProps";
import moment from "moment";
import productPromoHttpService from "../../../../../../../../../redux/services/productPromoHttpService";
import { getBase64 } from "../../../../../../../../../utils/getBase64";
import { tokenHeader } from "../../../../../../../../../utils/tokenHeader";
import axios from "axios";
import FileSaver from "file-saver";
import { configApp } from "../../../../../../../../../constants/configApp";
import { getGlobalPropertiesAttachment } from "../../../../../../../../../redux/slices/product_promo/product";
import NxTable from "../../../../../../../../../components/Nx/NxTable";

const onFilter = (dataIndex, value, record) => {
  const search = value.toLowerCase();
  switch (dataIndex) {
    case "startDate":
    case "endDate":
      const date = record[dataIndex]
        ? moment(record[dataIndex]).format("DD MMM YYYY")
        : "";
      return date.toString().toLowerCase().includes(search);
    case "fileSize":
      return record.size.includes(search);
    default:
      return record[dataIndex]?.toLowerCase().includes(search);
  }
};


// extracting size 
const extractSize = (fileSize) => {
  if (fileSize.includes('KB')) {
    return parseFloat(fileSize.replace(' KB', '')) * 1024;
  } else if (fileSize.includes('MB')) {
    return parseFloat(fileSize.replace(' MB', '')) * 1024 * 1024;
  }
  return parseFloat(fileSize);

}

const sorter = (fieldSort, a, b) => {
  console.log(fieldSort, ' so');
  const handleDataSort = (obj) => {
    switch (fieldSort) {
      case "startDate":
      case "endDate":
        const date = obj[fieldSort]
          ? moment(obj[fieldSort]).format("DD MMM YYYY")
          : "";
        return date.toString().toLowerCase();
      case "fileSize":
        return extractSize(obj[fieldSort]);
      default:
        return obj[fieldSort].toString().toLowerCase();
    }
  };
  let fa = handleDataSort(a);
  let fb = handleDataSort(b);
  if (fieldSort === 'fileSize') {
    return fa - fb;
  } else {
    return fa.localeCompare(fb);
  }
};

const columnAttachmentData = (
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => { },
  handleDelete = () => { },
  type,
  handleShow,
) => {
  const res = [
    {
      key: "no",
      title: "NO",
      width: 30,
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      key: "category",
      title: "CATEGORY",
      width: 75,
      dataIndex: "fileCategoryName",
      onFilter: (value, record) => onFilter("fileCategoryName", value, record),
      sorter: (a, b) => sorter("fileCategoryName", a, b),
      ...getColumnSearchPropsPaging(
        "fileCategoryName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      key: "fileName",
      title: "FILE NAME",
      width: 200,
      dataIndex: "fileName",
      onFilter: (value, record) => onFilter("fileName", value, record),
      sorter: (a, b) => sorter("fileName", a, b),
      ...getColumnSearchPropsPaging(
        "fileName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      key: "createdBy",
      title: "UPLOADED BY",
      width: 100,
      dataIndex: "createdBy",
      onFilter: (value, record) => onFilter("createdBy", value, record),
      sorter: (a, b) => sorter("createdBy", a, b),
      ...getColumnSearchPropsPaging(
        "createdBy",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      key: "createdDate",
      title: "UPLOADED DATE",
      align: "center",
      width: 100,
      dataIndex: "createdDate",
      onFilter: (value, record) => onFilter("createdDate", value, record),
      sorter: (a, b) => sorter("createdDate", a, b),
      ...getColumnSearchPropsPaging(
        "createdDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      key: "fileSize",
      title: "FILE SIZE",
      align: "center",
      width: 100,
      dataIndex: "fileSize",
      onFilter: (value, record) => onFilter("fileSize", value, record),
      sorter: (a, b) => sorter("fileSize", a, b),
      ...getColumnSearchPropsPaging(
        "fileSize",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      key: "action",
      title: "ACTION",
      align: "center",
      width: 75,
      fixed: "right",
      render: (v, r, i) => {
        return (
          <div className="flex justify-center align-middle gap-2 py-1">
            <Tooltip title="Preview">
              <Button
                onClick={() => handleShow(r)}
                disabled={!r.dataType === "exist"}
                type="table-action"
              >
                <SVGIcon
                  name="IconEye"
                  width={20}
                />
              </Button>
            </Tooltip>
            {type !== "detail" && type !== "confirmation" ? (
              <Tooltip title="Delete">
                <Button
                  onClick={() => handleDelete(r)}
                  disabled={!r.dataType === "exist"}
                  type="table-action"
                >
                  <SVGIcon
                    name="IconDelete"
                    width={20}
                  />
                </Button>
              </Tooltip>
            ) : null}
          </div>
        );
      },
    },
  ];
  if (type === "preview") {
    return res.filter(
      (column) =>
        column.dataIndex !== "createdBy" &&
        column.dataIndex !== "createdDate" &&
        column.title !== "ACTION"
    );
  }
  return type !== "detail"
    ? res.filter(
      (column) =>
        column.dataIndex !== "createdBy" && column.dataIndex !== "createdDate"
    )
    : res;
};

const RelationshipAttachment = ({
  data = [],
  updateData = () => { },
  type,
  dispatch = () => { },
  getAPICategory = () => { },
  service = productPromoHttpService,
  configApplication = configApp.MASTER_MANAGEMENT,
  getAPIGuard = getGlobalPropertiesAttachment,
  mandatory = false,
}) => {
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [modalUpload, setModalUpload] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [loadingDownload, setLoadingDownload] = useState(false);
  const { data_attachmentCategory } = useSelector((state) => state.relationship);
  const { dataGlobalPropAttachment } = useSelector((state) => state.product);

  useEffect(() => {
    if (data_attachmentCategory && data_attachmentCategory.length > 0) {
      const tempCategory = data_attachmentCategory.map((category) => ({
        id: category.id,
        text: category.text,
      }));
      setCategoryOptions(tempCategory);
    }
  }, [data_attachmentCategory]);

  useEffect(() => {
    dispatch(getAPIGuard());
  }, [dispatch, getAPIGuard]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    const tempSearchColumn = selectedKeys[0] ? dataIndex : "";
    setSearchedColumn(tempSearchColumn);
  };
  
  const handleDelete = (record) => {
    updateData((prevState) => {
      const temp = prevState.filter((detail) => detail.key !== record.key);
      return temp;
    });
  };

  const handleOpenModal = () => {
    setModalUpload(true);
    dispatch(getAPICategory());
  };

  const handleShow = async (r) => {
    if (r.dataType !== "exist") {
      if (r.fileType.includes("application/vnd")) {
        FileSaver.saveAs(r.base64, r.fileName);
      } else {
        previewFileAttachment(r.base64);
      }
    } else {
      if ((r.fileType || r.type).includes("application/vnd")) {
        dispatch(service.downloadData(r.urlFile1));
      } else {
        setLoadingDownload(true);
        try {
          const response = await axios.get(configApplication + r.urlFile1, {
            headers: tokenHeader(),
            responseType: "blob",
          });
          const base64 = await getBase64(response.data);
          previewFileAttachment(base64);  
        } catch (error) {
          console.error("Failed to download file", error);
        } finally {
          setLoadingDownload(false);
        }
      }
    }
  };

  return (
    <>
      <Spin spinning={loadingDownload}>
        <div className="flex flex-col gap-y-4">
          {type !== "detail" && type !== "preview" && type !== "confirmation" ? (
            <div className="flex flex-col gap-y-2">
              <span className="text-sm">
                Attach File:
                {mandatory ? (
                <span className={"pl-1"} style={{ color: "red" }}>
                  *
                </span>
              ) : null}
              </span>
              <div className="flex gap-x-2 items-center">
                <Button
                  type="menu"
                  onClick={handleOpenModal}
                >
                  Choose File
                </Button>
                {!data.length && (
                  <span className="text-sm text-dg-grey-dark">
                    No file choosen
                  </span>
                )}
              </div>
            </div>
          ) : null}
          <NxTable
            dataSource={data}
            totalData={data.length}
            tableScrolled={{ x: 1500 }}
            columns={columnAttachmentData(
              searchInput,
              searchedColumn,
              searchText,
              handleSearch,
              handleDelete,
              type,
              handleShow,
            )}
            usePagination={false}
          />
        </div>
      </Spin>
      <ModalAttachment
        openUpload={modalUpload}
        updateData={updateData}
        categoryOptions={categoryOptions}
        handleCancel={() => setModalUpload(false)}
        valueGuard={
          configApplication === configApp.MASTER_MANAGEMENT
            ? dataGlobalPropAttachment
            : {}
        }
        withLink
      />
    </>
  );
};

export default RelationshipAttachment;
