import { Button, Checkbox, Tooltip } from "antd";
import SVGIcon from "../../assets/Icon/index";
import { Fragment } from "react";
import { UploadOutlined } from "@ant-design/icons";

const nxGetAccountActions = ({
  handleCreate = () => {},
  handleUpdate = () => {},
  handleView = () => {},
  handleApproval = () => {},
  handleDownload = () => {},
  loadingDownload = false,
  handleActivate = () => {},
  handleInactivate = () => {},
  handleApprovalHistory = () => {},
  handleRecalculate = () => {},
  handleExpire = () => {},
  handleBulkRecalculate = () => {},
  handleBulkExpire = () => {},
  handleDelete = () => {},
  handleUpload = () => {},
  handleForwardTask = () => {},
  handleTerminate = () => {}
}) => [
  {
    action: "Download",
    render: (
      <Button
        icon={<SVGIcon name="IconButtonDownload" width={14} />}
        type="submit"
        onClick={handleDownload}
        loading={loadingDownload}
        disabled={loadingDownload}
      >
        Download List
      </Button>
    )
  },
  {
    action: "Approve",
    render: (
      <Button
        icon={<SVGIcon name="IconRequestApproval" width={14} />}
        type="submit"
        onClick={() => handleApproval(true)}
      >
        Approval
      </Button>
    )
  },
  {
    action: "Create",
    render: (
      <Button
        icon={<SVGIcon name="IconButtonCreate" width={14} />}
        type={"submit"}
        border={false}
        onClick={handleCreate}
      >
        Create
      </Button>
    )
  },
  {
    action: "Bulk-Recalculate",
    render: (
      <Button
        type={"submit"}
        border={false}
        onClick={handleBulkRecalculate}
      >
        Recalculate
      </Button>
    )
  },
  {
    action: "Bulk-Expire",
    render: (
      <Button
        type={"submit"}
        border={false}
        onClick={handleBulkExpire}
      >
        Expire
      </Button>
    )
  },
  {
    action: "Upload",
    render: (
      <Button
        icon={<UploadOutlined style={{ fontSize: "14px" }} />}
        type={"submit"}
        border={false}
        onClick={handleUpload}
      >
        Upload
      </Button>
    ),
  },
  {
    action: "View",
    type: "table",
    render: (record, actionLength, index) => {
      return (
        <Tooltip title="View" key={`table-action-${index}`}>
          <Button
            onClick={() =>
              handleView(record)
            }
            type="table-action"
          >
            <SVGIcon name="IconDetail" width={20} />
          </Button>
        </Tooltip>
      );
    }
  },
  {
    action: "Update",
    type: "table",
    render: (record, actionLength, index) => {
      const isEditable =
        (record.status === "ACTIVE" || record.status === "DRAFT") &&
        record.statusApproval !== "WAITING_APPROVAL" &&
        record.statusApproval !== "WAITING_FOR_APPROVAL";

      const content =
        actionLength > 3 ? (
          <Button
            icon={
              <SVGIcon
                name="IconEdit"
                width={20}
              />
            }
            disabled={!isEditable}
            onClick={() =>
              handleUpdate(record)
            }
            type={"action"}
          >
            Update
          </Button>
        ) : (
          <Tooltip
            title={isEditable ? "Update" : ""}
            key={`table-action-${index}`}
          >
            <Button
              onClick={() =>
                handleUpdate(record)
              }
              disabled={!isEditable}
              type="table-action"
            >
              <SVGIcon name="IconEdit" width={20} />
            </Button>
          </Tooltip>
        );

      return <Fragment key={`table-action-${index}`}>{content}</Fragment>;
    }
  },
  {
    action: "Activate",
    type: "table",
    render: (record, actionLength, index) => {
      const isInactive = record.status === "INACTIVE";
      const isActive = record.status === "ACTIVE";

      const content =
        actionLength > 3 ? (
          <Button
            icon={
              <Checkbox
                checked={isActive}
                style={{ transform: "scale(0.9)" }}
                className="action-checkbox"
              />
            }
            onClick={() =>
              handleActivate(record)
            }
            type={"action"}
          >
            Inactivate
          </Button>
        ) : (
          <Tooltip
            title={isInactive ? "Activate" : ""}
            key={`table-action-${index}`}
          >
            <Checkbox
              className="action-checkbox"
              checked={isActive}
              onClick={() =>
                handleActivate(record)
              }
              style={{ transform: "scale(0.9)" }}
            />
          </Tooltip>
        );

      return <Fragment key={`table-action-${index}`}>{content}</Fragment>;
    }
  },
  {
    action: "Inactivate",
    type: "table",
    render: (record, actionLength, index) => {
      const isInactive = record.status === "INACTIVE";
      const isActive = record.status === "ACTIVE";

      const content =
        actionLength > 3 ? (
          <Button
            icon={
              <Checkbox
                disabled={!isActive}
                checked={isInactive}
                style={{ transform: "scale(0.9)" }}
                className="action-checkbox"
              />
            }
            disabled={!isActive}
            onClick={() =>
              handleInactivate(record)
            }
            type={"action"}
          >
            Inactivate
          </Button>
        ) : (
          <Tooltip
            title={isActive ? "Inactivate" : ""}
            key={`table-action-${index}`}
          >
            <Checkbox
              className="action-checkbox"
              disabled={!isActive}
              checked={isInactive}
              onClick={() =>
                handleInactivate(record)
              }
              style={{ transform: "scale(0.9)" }}
            />
          </Tooltip>
        );

      return <Fragment key={`table-action-${index}`}>{content}</Fragment>;
    }
  },
  {
    action: "History",
    type: "table",
    render: (record, actionLength, index) => {
      const content =
        actionLength > 3 ? (
          <Button
            icon= {
              <SVGIcon
                name="IconLogHistory"
                width={20}
              />
            }
            onClick={() => handleApprovalHistory(record)}
            type={"action"}
          >
            Approval History
          </Button>
        ) : (
          <Tooltip title="Approval History" key={`table-action-${index}`}>
            <Button
              onClick={() => handleApprovalHistory(record)}
              type="table-action"
            >
              <SVGIcon name="IconLogHistory" width={20} />
            </Button>
          </Tooltip>
        );

      return <Fragment key={`table-action-${index}`}>{content}</Fragment>;
    }
  },
  {
    action: "Delete",
    type: "table",
    render: (record, _, index) => {
      return (
        <Tooltip title="Delete" key={`table-action-${index}`}>
          <Button onClick={() => handleDelete(record)} type="table-action">
            <SVGIcon
              name="IconDelete"
              className="text-black group-hover:text-[#0075BF] group-disabled:text-[#BDBDBD] transition-colors duration-300 ease-in-out"
              width={20}
            />
          </Button>
        </Tooltip>
      );
    }
  },
  {
    action: "Recalculate",
    type: "table",
    render: (record, actionLength, index) => {
      const disabled = ["NEED_TO_RECALCULATE", "NEED_TO_EXPIRE"].includes(record.status);

      const content =
        actionLength > 3 ? (
          <Button
            icon={
              <SVGIcon
                name="IconRating"
                width={20}
              />
            }
            border={false}
            onClick={() => handleRecalculate(record)}
            type={"action"}
            disabled={disabled}
          >
            Recalculate
          </Button>
        ) : (
          <Tooltip title="Recalculate" key={`table-action-${index}`}>
            <Button
              onClick={() => handleRecalculate(record)}
              type="table-action"
              disabled={disabled}
            >
              <SVGIcon name="IconRating" width={20} />
            </Button>
          </Tooltip>
        );

      return <Fragment key={`table-action-${index}`}>{content}</Fragment>;
    }
  },
  {
    action: "Expire",
    type: "table",
    render: (record, actionLength, index) => {
      const disabled = ["NEED_TO_RECALCULATE", "NEED_TO_EXPIRE"].includes(record.status);

      const content =
        actionLength > 3 ? (
          <Button
            icon={
              <SVGIcon
                name="IconExpire"
                width={20}
              />
            }
            border={false}
            onClick={() => handleExpire(record)}
            type={"action"}
            disabled={disabled}
          >
            Expire
          </Button>
        ) : (
          <Tooltip title="Expire" key={`table-action-${index}`}>
            <Button
              onClick={() => handleExpire(record)}
              type="table-action"
              disabled={disabled}
            >
              <SVGIcon name="IconExpire" width={20} />
            </Button>
          </Tooltip>
        );

      return <Fragment key={`table-action-${index}`}>{content}</Fragment>;
    }
  },
  {
    action: "forward",
    type: "table",
    render: (record, actionLength, index) => {
      const disabled = record?.status !== "ACTIVE";

      const content =
        actionLength > 3 ? (
          <Button
            icon={
              <SVGIcon
                name="IconForwardTask"
                width={20}
              />
            }
            border={false}
            onClick={() => handleForwardTask(record)}
            type={"action"}
            disabled={disabled}
          >
            Forward Task
          </Button>
        ) : (
          <Tooltip title="Forward Task" key={`table-action-${index}`}>
            <Button
              onClick={() => handleForwardTask(record)}
              type="table-action"
              disabled={disabled}
            >
              <SVGIcon name="IconForwardTask" width={20} />
            </Button>
          </Tooltip>
        );

        return <Fragment key={`table-action-${index}`}>{content}</Fragment>; 
    },
  },
  {
    action: "terminate",
    type: "table",
    render: (record, actionLength, index) => {
      const disabled = record?.status !== "ACTIVE";

      const content =
        actionLength > 3 ? (
          <Button
            icon={
              <SVGIcon
                name="IconTerminate"
                width={20}
              />
            }
            border={false}
            onClick={() => handleTerminate(record)}
            type={"action"}
            disabled={disabled}
          >
            Terminate
          </Button>
        ) : (
          <Tooltip title="Terminate" key={`table-action-${index}`}>
            <Button
              onClick={() => handleTerminate(record)}
              type="table-action"
              disabled={disabled}
            >
              <SVGIcon name="IconTerminate" width={20} />
            </Button>
          </Tooltip>
        );

      return <Fragment key={`table-action-${index}`}>{content}</Fragment>; 
    },
  },
];

export { nxGetAccountActions };
