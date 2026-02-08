import { useState, useEffect, useRef } from "react";
import { Spin, Tooltip } from "antd";
import { EyeOutlined } from "@ant-design/icons";
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
  type,
  handleShow
) => {
  const res = [
    {
      key: "no",
      title: "NO",
      width: 60,
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      key: "fileCategoryName",
      title: "CATEGORY",
      width: 240,
      dataIndex: "fileCategoryName",
      onFilter: (value, record) => onFilter("fileCategoryName", value, record),
      sorter: (a, b) => sorter("fileCategoryName", a, b),
      ...getColumnSearchPropsPaging(
        "fileCategoryName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
      ),
    },
    {
      key: "fileName",
      title: "FILE NAME",
      width: 240,
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
      width: 240,
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
      width: 240,
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
      width: 240,
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
      width: 180,
      fixed: "right",
      render: (v, r, i) => {
        return (
          <div className="flex justify-center align-middle gap-2">
            <Tooltip title="Preview">
              <span className="flex justify-center">
                <EyeOutlined
                  style={{ fontSize: "20px", color: "#0075bf" }}
                  onClick={() => handleShow(r)}
                />
              </span>
            </Tooltip>
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
const ConfirmationModalAttachmentTable = ({
  data = [],
  type,
  dispatch = () => { },
  service = productPromoHttpService,
  configApplication = configApp.MASTER_MANAGEMENT,
  getAPIGuard = getGlobalPropertiesAttachment,
}) => {
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [loadingDownload, setLoadingDownload] = useState(false);
  // console.log("🚀 ~ dataListCategory:", dataListCategory)

  useEffect(() => {
    dispatch(getAPIGuard());
  }, [dispatch, getAPIGuard]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    const tempSearchColumn = selectedKeys[0] ? dataIndex : "";
    setSearchedColumn(tempSearchColumn);
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
    <Spin spinning={loadingDownload}>
      <div className="flex flex-col w-full gap-3">
        <NxTable
          dataSource={data}
          totalData={data.length}
          tableScrolled={{ y: 300, x: 1500 }}
          columns={columnAttachmentData(
            searchInput,
            searchedColumn,
            searchText,
            handleSearch,
            type,
            handleShow
          )}
          usePagination={false}
          showAdvanceSearch={false}
        />
      </div>
    </Spin>
  );
};

export default ConfirmationModalAttachmentTable;
