import { useState, useEffect, useRef, useMemo } from "react";
import { Spin, Tooltip, Button } from "antd";
import SVGIcon from "../../assets/Icon/index";
import NxAttachmentModal from "./NxAttachmentModal";
import { useSelector, useDispatch } from "react-redux";
import { previewFileAttachment } from "../../utils/previewFileAttachment";
import { getColumnSearchPropsUseFilteredValueFE } from "../../utils/getColumnSearchProps";
import productPromoHttpService from "../../redux/services/productPromoHttpService";
import { getBase64 } from "../../utils/getBase64";
import { tokenHeader } from "../../utils/tokenHeader";
import axios from "axios";
import FileSaver from "file-saver";
import { configApp } from "../../constants/configApp";
import { getGlobalPropertiesAttachment } from "../../redux/slices/product_promo/product";
import NxTable from "./NxTable";
import { nxApplyFixedColumns } from "../../utils/Nx/nxApplyFixedColumns";

const columnAttachmentData = (
  search,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => {},
  handleDelete = () => {},
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
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
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
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
        "fileName",
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
      ...getColumnSearchPropsUseFilteredValueFE(
        search,
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
      render: (_, record) => {
        return (
          <div className="flex justify-center align-middle gap-2 py-1">
            <Tooltip title="Preview">
              <Button
                onClick={() => handleShow(record)}
                type="table-action"
              >
                <SVGIcon name="IconEye" width={20} />
              </Button>
            </Tooltip>
            {type !== "detail" && type !== "confirmation" ? (
              <Tooltip title="Delete">
                <Button
                  onClick={() => handleDelete(record)}
                  disabled={record.dataType === "exist"}
                  type="table-action"
                >
                  <SVGIcon name="IconDelete" width={20} />
                </Button>
              </Tooltip>
            ) : null}
          </div>
        );
      },
    },
  ];
  if (type === "preview") {
    return res.filter((column) => column.title !== "ACTION");
  }
  return res;
};

const NxAttachmentInput = ({
  data = [],
  updateData = () => {},
  setDeleted = () => {},
  type,
  getAPICategory = () => {},
  categoryData = [],
  service = productPromoHttpService,
  configApplication = configApp.MASTER_MANAGEMENT,
  getAPIGuard = getGlobalPropertiesAttachment,
  mandatory = false,
}) => {
  const dispatch = useDispatch();
  const searchInput = useRef(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState({});
  const [modalUpload, setModalUpload] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [loadingDownload, setLoadingDownload] = useState(false);
  const [fixedColumns, setFixedColumns] = useState(() => ({
    right: ["action"],
    left: []
  }));
  const { dataGlobalPropAttachment } = useSelector((state) => state.product);

  useEffect(() => {
    if (categoryData && categoryData.length > 0) {
      const tempCategory = categoryData.map((category) => ({
        id: category.id,
        text: category.text,
      }));
      setCategoryOptions(tempCategory);
    }
  }, [categoryData]);

  useEffect(() => {
    if (type !== "detail") {
      dispatch(getAPIGuard());
    }
  }, [dispatch, getAPIGuard, type]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(selectedKeys[0] ? dataIndex : "");
    setSearch((prev) => ({ ...prev, [dataIndex]: selectedKeys[0] }));
  };

  const handleDelete = (record) => {
    updateData((prevState) =>
      prevState.filter((attachment) => attachment.key !== record.key)
    );

    if (record.dataType === "draft") {
      setDeleted((prevState) => [
        ...prevState,
        {
          ...record,
          isDeleted: true,
        },
      ]);
    }
  };

  const handleOpenModal = () => {
    setModalUpload(true);
    dispatch(getAPICategory());
  };

  const handleShow = async (r) => {
    if (r.dataType === "new") {
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

  const columnDefinitions = useMemo(
    () =>
      columnAttachmentData(
        search,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        handleDelete,
        type,
        handleShow
      ),
    [search, searchedColumn, searchText, type]
  );

  const columns = useMemo(
    () => nxApplyFixedColumns(columnDefinitions, fixedColumns),
    [columnDefinitions, fixedColumns]
  );

  return (
    <>
      <Spin spinning={loadingDownload}>
        <div className="flex flex-col gap-y-4">
          {type !== "detail" && type !== "preview" && type !== "confirmation" ? (
            <div className="flex flex-col gap-y-2">
              <span className="text-sm">
                Attach File:
                {mandatory ? (
                  <span className={"pl-1"} style={{ color: "red" }}>*</span>
                ) : null}
              </span>
              <div className="flex gap-x-2 items-center">
                <Button type="menu" onClick={handleOpenModal}>
                  Choose File
                </Button>
                {!data.length && (
                  <span className="text-sm text-dg-grey-dark">No file choosen</span>
                )}
              </div>
            </div>
          ) : null}
          <NxTable
            idTable={"attachment-table"}
            dataSource={data}
            totalData={data.length}
            tableScrolled={{ x: 1500 }}
            columns={columns}
            usePagination={false}
            fixedColumns={fixedColumns}
            setFixedColumns={setFixedColumns}
            columnDefinitions={columnDefinitions}
            showAdvanceSearch={true}
          />
        </div>
      </Spin>
      <NxAttachmentModal
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

export default NxAttachmentInput;
