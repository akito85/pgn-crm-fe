import { Spin, Tooltip } from "antd";
import SVGIcon from "../../../../../../../../assets/Icon/index";
import { useState } from "react";
import BaseContainer from "../../../../../../../../components/BaseContainer";
// import TablePaginationNew from "../../../../../../../../components/TablePaginationNew";
import accountManagementService from "../../../../../../../../redux/services/account_management/accountManagementService";
import axios from "axios";
import { tokenHeader } from "../../../../../../../../utils/tokenHeader";
import { getBase64 } from "../../../../../../../../utils/getBase64";
import { previewFileAttachment } from "../../../../../../../../utils/previewFileAttachment";
import { configApp } from "../../../../../../../../constants/configApp";
import { TablePaginationNew } from "poc-table-dragandrop";

const PaymentRelationDetailAttch = ({
  dataAttachment = [],
  getColumnSearchProps = () => {},
}) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [loadingDownload, setLoadingDownload] = useState(false);

  const handleChangeDetail = (pageChange, pageSizeChange) => {
    const tempPage = pageSize !== pageSizeChange ? 1 : pageChange;
    setPage(tempPage);
    setPageSize(pageSizeChange);
  };

  const handleShow = async (r) => {
    if ((r.fileType || r.type).includes("application/vnd")) {
      accountManagementService.downloadData(r.urlFile1);
    } else {
      setLoadingDownload(true);
      try {
        const response = await axios.get(configApp.ACCOUNT_SERVICE + r.urlFile1, {
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
  };

  const columns = [
    {
      title: "NO",
      width: 80,
      align: "center",
      dataIndex: "no",
    },
    {
      title: "TYPE",
      dataIndex: "fileCategoryName",
      width: 75,
      sorter: true,
      ...getColumnSearchProps("fileCategoryName"),
    },
    {
      title: "FILE NAME",
      dataIndex: "fileName",
      width: 300,
      sorter: true,
      ...getColumnSearchProps("fileName"),
    },
    {
      title: "FILE SIZE",
      dataIndex: "fileSize",
      width: 100,
      sorter: true,
      align: "center",
      ...getColumnSearchProps("fileSize"),
    },
    {
      title: "ACTION",
      align: "center",
      width: 100,
      fixed: "right",
      render: (v, r, i) => {
        return (
          <div className="flex w-full justify-center gap-6">
            <Tooltip title="View">
              <div className="pt-1 cursor-pointer">
                <SVGIcon
                  name="IconEye"
                  color={"#0075bf"}
                  width={24}
                  onClick={() => {
                    handleShow(r);
                  }}
                />
              </div>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  return (
    <Spin spinning={loadingDownload}>
      <BaseContainer header={"ATTACHMENTS"}>
        {/* <TablePaginationNew
          dataSource={dataAttachment.map((item, idx) => ({
            ...item,
            key: item.id || idx,
          }))}
          tableScrolled={{ y: 525, x: 1500 }}
          columns={columns}
          current={page}
          onChange={setPage}
          onSizeChanger={setPageSize}
          type="FE"
        /> */}
        <TablePaginationNew
          dataSource={dataAttachment.map((item, index) => ({
            ...item,
            key: item.id || index,
            no: (page - 1) * pageSize + index + 1,
          }))}
          tableScrolled={{ y: 525, x: 1500 }}
          columns={columns}
          onChange={handleChangeDetail}
          enableDragColumn={true}
          type="FE"
        />
      </BaseContainer>
    </Spin>
  );
};

export default PaymentRelationDetailAttch;
