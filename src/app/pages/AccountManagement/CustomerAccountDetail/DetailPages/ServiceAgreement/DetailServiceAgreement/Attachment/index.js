import React,{useState, useRef, useEffect} from 'react'
import TablePagination from '../../../../../../../../components/TablePagination';
import { previewFileAttachment } from "../../../../../../../../utils/previewFileAttachment";
import { getColumnSearchProps } from "../../../../../../../../utils/getColumnSearchProps";
import { Spin, Tooltip } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { bytesConverter } from "../../../../../../../../utils/bytesConverter";
import FileSaver from "file-saver";
import {  useDispatch } from "react-redux";
import { getBase64 } from "../../../../../../../../utils/getBase64";
import { tokenHeader } from "../../../../../../../../utils/tokenHeader";
import axios from "axios";
import { configApp } from "../../../../../../../../constants/configApp";
import accountManagementService from '../../../../../../../../redux/services/account_management/accountManagementService';

const columnAttachmentData = (
  page,
  pageSize,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  previewFileAttachment = () => {},
  handleShow
) => {
  const res = [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "CATEGORY",
      dataIndex: "category",
      sorter: true,
      ...getColumnSearchProps(
        "category",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "FILE NAME",
      dataIndex: "fileName",
      sorter: true,
      ...getColumnSearchProps(
        "fileName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "UPLOAD BY",
      dataIndex: "uploadBy",
      sorter: true,
      ...getColumnSearchProps(
        "createdBy",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "UPLOADED DATE",
      dataIndex: "uploadDate",
      sorter: true,
      ...getColumnSearchProps(
        "uploadDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "FILE SIZE",
      dataIndex: "fileSize",
      sorter: true,
      ...getColumnSearchProps(
        "fileSize",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch
      ),
    },
    {
      title: "ACTION",
      align: "center",
      width: 120,
      fixed: "right",
      render: (v, r, i) => {
        return (
          <div className="flex justify-center align-middle gap-2">
            <Tooltip title="Preview">
              <span className="flex justify-center">
                <EyeOutlined
                  style={{ fontSize: "24px", color: "#0075bf" }}
                  onClick={() => handleShow(r)}
                />
              </span>
            </Tooltip>
          </div>
        );
      },
      key: "action",
    },
  ];

  return res;
};

const Attachment = ({dataSource}) => {
  const searchInput = useRef(null);
  const [dataTable, setDataTable] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElement] = useState(0);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [fieldSort, setFieldSort] = useState("");
  const [orderSort, setOrderSort] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [dataAttachment, setDataAttachment] = useState([]);
  const [loadingDownload, setLoadingDownload] = useState(false);
  
  const service = accountManagementService
  const configApplication = configApp.ACCOUNT_SERVICE
  const dispatch = useDispatch();

  useEffect(() => {
    const urlLink = (id) => `/v1/dbs/api/sa/download/${id}`
    if(dataSource){
      setDataAttachment((dataSource || []).map((item) => ({
        ...item,
        createdDate: item.uploadDate,
        fileSize: bytesConverter(item.fileSize || 0),
        urlFile1: urlLink(item?.id),
        dataType: "exist",
      })));
      setTotalElement(dataSource?.length)
    }
  },[dataSource])


  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    const tempSearchColumn = selectedKeys[0] ? dataIndex : "";
    if (searchedColumn !== tempSearchColumn) {
      setPage(1);
    }
    setSearchedColumn(tempSearchColumn);
  };

  const handleChangeSize = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  const onSort = (_, __, sort) => {
    if (sort.order) {
      setFieldSort(sort.field);
      setOrderSort(sort.order === "ascend" ? "asc" : "desc");
    } else {
      setFieldSort("");
      setOrderSort("");
    }
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
        const response = await axios.get(configApplication + r.urlFile1, {
          headers: tokenHeader(),
          responseType: "blob",
        });
        const base64 = await getBase64(response.data);
        setLoadingDownload(false);
        previewFileAttachment(base64);
      }
    }
  };
  const filterDataByPage = () => {
    let result = [...dataAttachment];
    if (searchedColumn) {
      const fixSearchText = searchText.toLowerCase();
      result = result.filter((item) => {
        return item[searchedColumn]?.toLowerCase().includes(fixSearchText);
      });
    }
    const handleDataSort = (obj) => {
      return obj[fieldSort];
    };
    if (fieldSort) {
      result.sort((a, b) => {
        let fa = handleDataSort(a);
        let fb = handleDataSort(b);
        if (fa < fb) {
          return orderSort === "asc" ? -1 : 1;
        }
        if (fa > fb) {
          return orderSort === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return result.slice((page - 1) * pageSize, page * pageSize);
  };
  return (
    <Spin spinning={loadingDownload}>
      <div className={"w-full py-6"}>
        <TablePagination
          pageSize={pageSize}
          current={page}
          dataSource={filterDataByPage()}
          tableScrolled={{y: 525, x: 1600 }}
          totalData={totalElements}
          onChange={handleChangeSize}
          onSort={onSort}
          columns={columnAttachmentData(
            page,
            pageSize,
            searchInput,
            searchedColumn,
            searchText,
            handleSearch,
            previewFileAttachment,
            handleShow
          )}
        />
      </div>
    </Spin>
  )
}

export default Attachment