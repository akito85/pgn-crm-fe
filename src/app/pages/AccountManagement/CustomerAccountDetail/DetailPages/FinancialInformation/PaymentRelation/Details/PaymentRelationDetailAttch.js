import { Spin, Tooltip } from "antd";
import SVGIcon from "../../../../../../../../assets/Icon/index";
import { Fragment, useState } from "react";
import BaseContainer from "../../../../../../../../components/BaseContainer";
import TablePaginationNew from "../../../../../../../../components/TablePaginationNew";
import accountManagementService from "../../../../../../../../redux/services/account_management/accountManagementService";
import axios from "axios";
import { tokenHeader } from "../../../../../../../../utils/tokenHeader";
import { getBase64 } from "../../../../../../../../utils/getBase64";
import { previewFileAttachment } from "../../../../../../../../utils/previewFileAttachment";
import { configApp } from "../../../../../../../../constants/configApp";


const PaymentRelationDetailAttch = ({
  dataAttachment = [],
  getColumnSearchProps = () => {},
}) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [loadingDownload, setLoadingDownload] = useState(false);

  const handleShow = async (r) => {
    if ((r.fileType || r.type).includes("application/vnd")) {
      accountManagementService.downloadData(r.urlFile1);
    } else {
      setLoadingDownload(true);
      const response = await axios.get(configApp.MASTER_MANAGEMENT + r.urlFile1, {
        headers: tokenHeader(),
        responseType: "blob",
      });
      const base64 = await getBase64(response.data);
      setLoadingDownload(false);
      previewFileAttachment(base64);
    }
  };

  const columns = [
    {
      title: "NO",
      width: 80,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
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
    <Fragment>
      <Spin spinning={loadingDownload}>
        <BaseContainer header={"ATTACHMENTS"}>
          <TablePaginationNew
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
          />

        </BaseContainer>
      </Spin>
    </Fragment>
  );
};

export default PaymentRelationDetailAttch;
