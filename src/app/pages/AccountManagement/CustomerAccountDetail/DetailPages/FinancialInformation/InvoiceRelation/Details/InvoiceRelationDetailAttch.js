import { Spin } from "antd";
import { useMemo, useRef, useState } from "react";
import accountManagementService from "../../../../../../../../redux/services/account_management/accountManagementService";
import axios from "axios";
import { tokenHeader } from "../../../../../../../../utils/tokenHeader";
import { getBase64 } from "../../../../../../../../utils/getBase64";
import { previewFileAttachment } from "../../../../../../../../utils/previewFileAttachment";
import { configApp } from "../../../../../../../../constants/configApp";
import NxTable from "../../../../../../../../components/Nx/NxTable";
import { getDetailAttachmentColumns } from "./getDetailAttachmentColumns";
import { nxApplyFixedColumns } from "../../../../../../../../utils/Nx/nxApplyFixedColumns";

const InvoiceRelationDetailAttch = ({ attachments = [] }) => {
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState({});
  const [tempFilters, setTempFilters] = useState([]);

  const [loadingDownload, setLoadingDownload] = useState(false);

  const [fixedColumns, setFixedColumns] = useState(() => ({
    right: ["action"],
    left: []
  }));

  const searchInput = useRef(null);

  const handleShow = async (r) => {
    if ((r.fileType || r.type).includes("application/vnd")) {
      accountManagementService.downloadData(r.urlFile1);
    } else {
      setLoadingDownload(true);
      try {
        const response = await axios.get(
          configApp.ACCOUNT_SERVICE + r.urlFile1,
          {
            headers: tokenHeader(),
            responseType: "blob"
          }
        );
        const base64 = await getBase64(response.data);
        previewFileAttachment(base64);
      } catch (error) {
        console.error("Failed to download file", error);
      } finally {
        setLoadingDownload(false);
      }
    }
  };

  /**
   * @param {string[]} selectedKeys
   * @param {() => {}} confirm
   * @param {string} dataIndex
   */
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch((prevState) => {
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0]
      };
    });
  };

  const columnDefinitions = useMemo(
    () =>
      getDetailAttachmentColumns(
        search,
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        handleShow
      ),
    [search, searchInput, searchText, searchedColumn]
  );

  const columns = useMemo(() => {
    return nxApplyFixedColumns(columnDefinitions, fixedColumns);
  }, [columnDefinitions, fixedColumns]);

  return (
    <Spin spinning={loadingDownload}>
      <NxTable
        idTable="invoice-relation-detail-attachment-table"
        dataSource={attachments}
        totalData={attachments.length}
        tableScrolled={{ x: "max-content" }}
        columns={columns}
        usePagination={false}
        useInfiniteScroll={false}
        loadMoreThreshold={20}
        fixedColumns={fixedColumns}
        setFixedColumns={setFixedColumns}
        columnDefinitions={columnDefinitions}
        showAdvanceSearch={true}
      />
    </Spin>
  );
};

export default InvoiceRelationDetailAttch;
