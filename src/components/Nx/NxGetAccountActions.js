import { Button, Checkbox, Tooltip } from "antd";
import ButtonComponent from "../ButtonComponent";
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
}) => [
  {
    action: "Download",
    render: (
      <ButtonComponent
        icon={<SVGIcon name="IconButtonDownload" width={20} />}
        type="submit"
        onClick={handleDownload}
      >
        Download List
      </ButtonComponent>
    )
  },
  {
    action: "Approve",
    render: (
      <ButtonComponent
        icon={<SVGIcon name="IconRequestApproval" width={20} color="#FFF" />}
        type="submit"
        onClick={() => handleApproval(true)}
      >
        Approval
      </ButtonComponent>
    )
  },
  {
    action: "Create",
    render: (
      <ButtonComponent
        icon={<SVGIcon name="IconButtonCreate" width={20} />}
        type={"submit"}
        border={false}
        onClick={handleCreate}
      >
        Create
      </ButtonComponent>
    )
  },
  {
    action: 'View',
    type: 'table',
    render: (record, actionLength, index) => {
      return (
        <Tooltip
          title="View"
          onClick={() => handleView(record.id)}
          key={`table-action-${index}`}
        >
          <Button
            onClick={() => handleUpdate(record.id)}
            type="table-action"
            directChildren
          >
            <SVGIcon name="IconDetail" width={20} />
          </Button>
        </Tooltip>
      )
    }
  },
  {
    action: 'Update',
    type: 'table',
    render: (record, actionLength, index) => {
      const isEditable =
        record.statusApproval === "DRAFT" ||
        record.statusApproval === "REJECTED";

      const content = actionLength > 3 ?
        (
          <ButtonComponent
            icon={<SVGIcon name="IconEdit" className="text-black group-hover:text-[#0075BF] group-disabled:text-[#BDBDBD] transition-colors duration-300 ease-in-out" width={20} />}
            border={false}
            disabled={!isEditable}
            onClick={() => handleUpdate(record.id)}
            type={"action"}
            className="group"
          >
            <span className={"text-black ml-3"}>Update</span>
          </ButtonComponent>
        ) : (
          <Tooltip title={isEditable ? "Update" : ""} key={`table-action-${index}`}>
            <Button
              onClick={() => handleUpdate(record.id)}
              disabled={!isEditable}
              type="table-action"
            >
              <SVGIcon
                name="IconEdit"
                width={20}
              />
            </Button>
          </Tooltip>
        );

      return (
        <Fragment key={`table-action-${index}`}>{content}</Fragment>
      )
    }
  },
  {
    action: 'Inactivate',
    type: 'table',
    render: (record, actionLength, index) => {
      const isInactive = record.status === "INACTIVE";
      const isActive = record.status === "ACTIVE";

      const content = actionLength > 3 ?
        (
          <ButtonComponent
            icon={
              <Checkbox
                disabled={!isActive}
                checked={isInactive}
                style={{ transform: "scale(0.9)" }}
                className="action-checkbox"
              />
            }
            border={false}
            disabled={!isActive}
            onClick={() => handleInactivate(true, record?.id, record?.appHierId, record?.relatedAccountNumber)}
            type={"action"}
          >
            <span className={"text-black ml-3"}>Inactivate</span>
          </ButtonComponent>
        ) : (
          <Tooltip
            title={isActive ? "Inactivate" : ""}
            key={`table-action-${index}`}
          >
            <Checkbox
              className="action-checkbox"
              disabled={!isActive}
              checked={isInactive}
              onClick={() => handleInactivate(true, record?.id, record?.appHierId, record?.relatedAccountNumber)}
              style={{ transform: "scale(0.9)" }}
            />
          </Tooltip>
        );

      return <Fragment key={`table-action-${index}`}>{content}</Fragment>
    }
  },
  {
    action: 'History',
    type: 'table',
    render: (record, actionLength, index) => {
      const content = (actionLength > 3) ?
        (
          <ButtonComponent
            icon={
              <SVGIcon name="IconLogHistory" className="text-black group-hover:text-[#0075BF] group-disabled:text-[#BDBDBD] transition-colors duration-300 ease-in-out" width={20} />
            }
            border={false}
            onClick={() => handleApprovalHistory(true, record?.id)}
            type={"action"}
            className="group"
          >
            <span className={"text-black ml-3"}>Approval History</span>
          </ButtonComponent>
        ) : (
          <Tooltip title="Approval History" key={`table-action-${index}`}>
            <Button
              onClick={() => handleApprovalHistory(true, record?.id)}
              type="table-action"
            >
              <SVGIcon
                name="IconLogHistory"
                width={20}
              />
            </Button>
          </Tooltip>
        );

      return <Fragment key={`table-action-${index}`}>{content}</Fragment>
    }
  }
];

export {
  nxGetAccountActions,
}