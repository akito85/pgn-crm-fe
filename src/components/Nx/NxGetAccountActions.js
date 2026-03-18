import { Button, Checkbox, Tooltip } from "antd";
import SVGIcon from "../../assets/Icon/index";
import { Fragment } from "react";

const nxGetAccountActions = ({
  handleCreate = () => {},
  handleUpdate = () => {},
  handleView = () => {},
  handleApproval = () => {},
  handleDownload = () => {},
  handleInactivate = () => {},
  handleApprovalHistory = () => {},
  handleRecalculate = () => {},
  handleExpire = () => {},
  handleDelete = () => {}
}) => [
  {
    action: "Download",
    render: (
      <Button
        icon={<SVGIcon name="IconButtonDownload" width={14} />}
        type="submit"
        onClick={handleDownload}
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
        record.status !== "INACTIVE" &&
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
          >
            <span className={"text-black ml-3"}>Recalculate</span>
          </Button>
        ) : (
          <Tooltip title="Recalculate" key={`table-action-${index}`}>
            <Button
              onClick={() => handleRecalculate(record)}
              type="table-action"
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
          >
            <span className={"text-black ml-3"}>Recalculate</span>
          </Button>
        ) : (
          <Tooltip title="Recalculate" key={`table-action-${index}`}>
            <Button
              onClick={() => handleExpire(record)}
              type="table-action"
            >
              <SVGIcon name="IconRating" width={20} />
            </Button>
          </Tooltip>
        );

      return <Fragment key={`table-action-${index}`}>{content}</Fragment>;
    }
  },
];

export { nxGetAccountActions };
