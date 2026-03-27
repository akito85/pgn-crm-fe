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

/**
 * Presentational attachment panel for a payment relation record.
 * Displays, previews, and downloads file attachments.
 *
 * @param {object}   props
 * @param {object[]} [props.attachments=[]] - List of attachment records
 */
const PaymentRelationDetailAttch = ({ attachments = [] }) => {
  // --- State ---
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState({});

  const [loadingDownload, setLoadingDownload] = useState(false);

  const [fixedColumns, setFixedColumns] = useState(() => ({
    right: ["action"],
    left: [],
  }));

  const searchInput = useRef(null);

  // --- Handlers ---
  /**
   * Previews or downloads a file attachment.
   * Downloads directly if the file type is an Office document (application/vnd);
   * otherwise fetches the file, converts it to base64, and opens a preview.
   * @param {object} r - Attachment record containing urlFile1 and fileType/type
   */
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
            responseType: "blob",
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
   * Confirms a column search and updates the active search state.
   * @param {string[]} selectedKeys
   * @param {() => {}} confirm
   * @param {string}   dataIndex
   */
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setSearch((prevState) => {
      return {
        ...prevState,
        [dataIndex]: selectedKeys[0],
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
        idTable="payment-relation-detail-attachment-table"
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

export default PaymentRelationDetailAttch;
