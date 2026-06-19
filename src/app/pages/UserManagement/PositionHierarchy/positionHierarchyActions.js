import { Button, Tooltip } from "antd";
import { NavLink } from "react-router-dom";
import { DownloadOutlined, PlusOutlined } from "@ant-design/icons";
import ButtonComponent from "../../../../components/ButtonComponent";
import { nxGetAccountActions } from "../../../../components/Nx/NxGetAccountActions";
import { USER_ROUTES } from "../../../../routes/user_management/user_routes";
import IconCopy from "../../../../assets/Icon/Nx/IconCopy";
import IconActive from "../../../../assets/icons/nx/IconActive";
import IconInactive from "../../../../assets/icons/nx/IconInactive";
import { Fragment } from "react";

// Action names gated against the user's granted access for the table column actions.
export const POSITION_HIERARCHY_PERMISSION_LIST = ["View", "Activate", "Update", "duplicate"];


// Page-level (toolbar) actions — rendered by <Toolbar type="page" />.
export const buildPositionHierarchyToolbarActions = ({ handleDownload, downloading }) => [
  {
    action: "Download",
    render: (
      <ButtonComponent
        onClick={handleDownload}
        type="submit"
        loading={downloading}
        icon={<DownloadOutlined style={{ fontSize: "20px" }} />}
      >
        Download List
      </ButtonComponent>
    ),
  },
  {
    action: "Create",
    render: (
      <NavLink to={USER_ROUTES.CREATE_POSITION}>
        <ButtonComponent
          type="submit"
          icon={<PlusOutlined style={{ fontSize: "20px" }} />}
        >
          Create New Position Hierarchy
        </ButtonComponent>
      </NavLink>
    ),
  },
];

// Table column actions. View + Update reuse the shared nxGetAccountActions catalog;
// Activate (DRAFT-only → activation modal) and duplicate are Position Hierarchy specific.
export const buildPositionHierarchyTableActions = ({
  handleView,
  handleUpdate,
  handleActivate,
  handleDuplicate,
}) => [
  ...nxGetAccountActions({ handleView, handleUpdate, handleDuplicate }).filter(
    (item) => item.action === "View" || item.action === "Update"
  ),
  {
    action: "Activate",
    type: "table",
    render: (record, actionLength, index) => {
      const isDraft = record?.status === "DRAFT";
      const content =
        actionLength > 3 ? (
          <Button
            icon={
              <IconActive width={20} />
            }
            border={false}
            onClick={() => handleActivate(record)}
            type={"action"}
            disabled={!isDraft}
          >
            Activate
          </Button>
        ) : (
          <Tooltip title="Activate" key={`table-action-${index}`}>
            <Button
              onClick={() => handleActivate(record)}
              type="table-action"
              disabled={!isDraft}
            >
              <IconActive width={20} />
            </Button>
          </Tooltip>
        );

      return <Fragment key={`table-action-${index}`}>{content}</Fragment>; 
    },
  },
  {
    action: "duplicate",
    type: "table",
    render: (record, actionLength, index) => {

      const content =
        actionLength > 3 ? (
          <Button
            icon={
              <IconCopy width={20} />
            }
            border={false}
            onClick={() => handleDuplicate(record)}
            type={"action"}
            disabled={false}
          >
            Duplicate
          </Button>
        ) : (
          <Tooltip title="Duplicate" key={`table-action-${index}`}>
            <Button
              onClick={() => handleDuplicate(record)}
              type="table-action"
            >
              <IconCopy width={20} />
            </Button>
          </Tooltip>
        );

      return <Fragment key={`table-action-${index}`}>{content}</Fragment>; 
    },
  },
];
