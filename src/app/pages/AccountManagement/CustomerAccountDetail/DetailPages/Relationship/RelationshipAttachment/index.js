import { EyeOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import { useState } from "react";
import SVGIcon from "../../../../../../../assets/Icon/index";
import ButtonComponent from "../../../../../../../components/ButtonComponent";
import TablePagination from "../../../../../../../components/TablePagination";
import NxPanel from "../../../../../../../components/Nx/NxPanel";
import { bytesConverter } from "../../../../../../../utils/bytesConverter";
import { previewFileAttachment } from "../../../../../../../utils/previewFileAttachment";

const RelationshipAttachment = ({
  data = [],
  updateData = () => { },
  type,
  setModalUpload = () => { },
  hideActions = false,
  showUploadButton = true,
  onDownload = () => { },
  className = "",
}) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleDelete = (record) => {
    updateData((prevState) => {
      const temp = prevState.filter((detail) => detail.key !== record.key);
      return temp;
    });
  };

  const handleShow = async (r) => {
    if (r.dataType === "exist") {
      onDownload(r);
    } else {
      if (r.fileType.includes("application/vnd")) {
        // FileSaver.saveAs(r.base64, r.fileName);
      } else {
        previewFileAttachment(r.base64);
      }
    }
  };

  const columns = [
    {
      title: "NO",
      width: 70,
      align: "center",
      render: (text, object, index) => (
        <div className="py-2.5">{(page - 1) * pageSize + index + 1}</div>
      ),
    },
    {
      sorter: true,
      title: "TYPE",
      dataIndex: "type",
      width: 180,
    },
    {
      sorter: true,
      title: "FILENAME",
      dataIndex: "fileName",
      ellipsis: {
        showTitle: false,
      },
      render: (filename) => (
        <Tooltip placement="topLeft" title={filename}>
          {filename}
        </Tooltip>
      ),
    },
    {
      sorter: true,
      title: "FILE SIZE",
      align: "center",
      dataIndex: "fileSize",
      width: 130,
      render: (fileSize, r) => (
        <span>
          {r?.dataType === "new" ? fileSize : bytesConverter(fileSize)}
        </span>
      ),
    },
    // Conditional action column - hanya tampil jika hideActions = false
    ...(!hideActions
      ? [
        {
          title: "ACTION",
          align: "center",
          width: 100,
          render: (v, r, i) => {
            return (
              <div className="flex w-full justify-center gap-3">
                <Tooltip title="Preview">
                  <EyeOutlined
                    onClick={() => handleShow(r)}
                    style={{
                      fontSize: "18px",
                      color: "#0075bf",
                      cursor: "pointer",
                    }}
                  />
                </Tooltip>

                <Tooltip title="Delete">
                  <SVGIcon
                    name="IconDelete"
                    width={18}
                    className="cursor-pointer"
                    onClick={
                      r.dataType !== "exist"
                        ? () => handleDelete(r)
                        : undefined
                    }
                  />
                </Tooltip>
              </div>
            );
          },
          key: "action",
        },
      ]
      : []),
  ];

  const handleChange = (pageChange, pageSizeChange) => {
    setPage(pageSize !== pageSizeChange ? 1 : pageChange);
    setPageSize(pageSizeChange);
  };

  return (
    <div className={className}>
      <NxPanel title={"ATTACHMENT"} removeBottomMargin>
        <div className="flex flex-col w-full gap-2">
          {showUploadButton && (
            <div className="flex justify-between items-center mb-3">
              <p className="text-[13px] mb-0 text-dg-grey-dark">
                Attach File:
              </p>
              <div className="flex flex-row gap-2 items-center">
                <ButtonComponent
                  size="small"
                  type="default"
                  onClick={() => setModalUpload(true)}
                >
                  Choose File
                </ButtonComponent>
                <p className="text-[11px] text-dg-grey-dark mb-0">
                  {data.length === 0 ? "[No file choosen]" : ""}
                </p>
              </div>
            </div>
          )}

          <div className="pt-[10px]">
            <TablePagination
              dataSource={data.slice((page - 1) * pageSize, page * pageSize)}
              totalData={data?.length}
              current={page}
              pageSize={pageSize}
              onChange={handleChange}
              onShowSizeChange={handleChange}
              columns={columns}
            />
          </div>
        </div>
      </NxPanel>
    </div>
  );
};

export default RelationshipAttachment;
