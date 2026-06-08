import { Fragment } from "react";
import { NavLink, Link } from "react-router-dom";
import { Button, Checkbox, Tooltip } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import SVGIcon from "../../../../../../assets/Icon/index";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import { nxGetAccountActions } from "../../../../../../components/Nx/NxGetAccountActions";

export const SERVICE_AGREEMENT_PERMISSION_LIST = [
  "Delete",
  "View",
  "CreateAddon",
  "CreateAmendment",
  "Update",
  "Activate",
  "History",
];

export const SERVICE_AGREEMENT_PERMISSION_MAPPING = {
  CreateAddon: "Update",
  CreateAmendment: "Update",
};

export const buildServiceAgreementToolbarActions = ({
  variant,
  scope,
  isExistMain,
  onDownload,
  onOpenApproval,
}) => {
  const createTooltipTitle =
    "An active SA Main already exists. Please deactivate the current SA Main before creating a new one.";
  const toolbarActions = [
    {
      action: "Download",
      render: (
        <ButtonComponent
          icon={<SVGIcon name="IconButtonDownload" width={20} color="#FFF" />}
          type="submit"
          onClick={onDownload}
        >
          Download
        </ButtonComponent>
      ),
    },
    {
      action: "Approve",
      render: (
        <ButtonComponent
          icon={<SVGIcon name="IconRequestApproval" width={20} color="#FFF" />}
          type="submit"
          onClick={onOpenApproval}
        >
          Approval
        </ButtonComponent>
      ),
    },
  ];

  if (!variant.routes?.createMain || !variant.stateBuilders?.createMain) {
    return toolbarActions;
  }

  return [
    ...toolbarActions,
    {
      action: "Create",
      render: isExistMain ? (
        <Tooltip placement="bottom" title={createTooltipTitle}>
          <span>
            <ButtonComponent
              icon={<SVGIcon name="IconButtonCreate" width={20} />}
              type="submit"
              border={false}
              disabled
            >
              Create
            </ButtonComponent>
          </span>
        </Tooltip>
      ) : (
        <NavLink
          to={variant.routes.createMain}
          state={variant.stateBuilders.createMain({ scope })}
        >
          <ButtonComponent
            icon={<SVGIcon name="IconButtonCreate" width={20} />}
            type="submit"
            border={false}
          >
            Create
          </ButtonComponent>
        </NavLink>
      ),
    },
  ];
};

export const buildServiceAgreementTableActions = ({
  handleApprovalHistory,
  handleOpenDeleteDraft,
  handleOpenInactivate,
  navigate,
  scope,
  variant,
}) => {
  const canViewDetail =
    Boolean(variant.routes?.detail) && Boolean(variant.stateBuilders?.detail);
  const canUpdate =
    Boolean(variant.routes?.update) && Boolean(variant.stateBuilders?.update);
  const canCreateAddon =
    Boolean(variant.routes?.createAddon) &&
    Boolean(variant.stateBuilders?.createAddon);
  const canCreateAmendment =
    Boolean(variant.routes?.createAmendment) &&
    Boolean(variant.stateBuilders?.createAmendment);

  const itemActions = [
    ...nxGetAccountActions({
      handleDelete: handleOpenDeleteDraft,
      handleView: ({ id: idSA, ...record }) => {
        if (!canViewDetail) return;

        navigate(variant.routes.detail, {
          state: variant.stateBuilders.detail({
            record: { id: idSA, ...record },
            scope,
          }),
        });
      },
      handleUpdate: (record) => {
        if (!canUpdate) return;

        navigate(variant.routes.update, {
          state: variant.stateBuilders.update({ record, scope }),
        });
      },
      handleApprovalHistory: ({ id }) => handleApprovalHistory(id),
    })
      .filter((actionDef) => {
        if (actionDef.action === "View") {
          return canViewDetail;
        }

        if (actionDef.action === "Update") {
          return canUpdate;
        }

        return true;
      })
      .map((actionDef) => {
      if (actionDef.action === "Update") {
        return {
          ...actionDef,
          render: (record, actionLength, index) => {
            const isEditable =
              record?.approvalStatus !== "WAITING APPROVAL" &&
              record?.status !== "INACTIVE";
            const linkState = variant.stateBuilders.update({ record, scope });

            const content =
              actionLength > 3 ? (
                isEditable ? (
                  <Link to={variant.routes.update} state={linkState}>
                    <Button
                      icon={<SVGIcon name="IconEdit" width={20} />}
                      type="action"
                    >
                      Update
                    </Button>
                  </Link>
                ) : (
                  <Button
                    icon={<SVGIcon name="IconEdit" width={20} />}
                    type="action"
                    disabled
                  >
                    Update
                  </Button>
                )
              ) : isEditable ? (
                <Link to={variant.routes.update} state={linkState}>
                  <Tooltip title="Update" key={`table-action-update-${index}`}>
                    <Button type="table-action">
                      <SVGIcon name="IconEdit" width={20} />
                    </Button>
                  </Tooltip>
                </Link>
              ) : (
                <Tooltip title="" key={`table-action-update-${index}`}>
                  <Button disabled type="table-action">
                    <SVGIcon name="IconEdit" width={20} />
                  </Button>
                </Tooltip>
              );

            return (
              <Fragment key={`table-action-update-${index}`}>{content}</Fragment>
            );
          },
        };
      }

      if (actionDef.action === "Delete") {
        return {
          ...actionDef,
          render: (record, actionLength, index) => {
            const canDelete =
              record?.status === "DRAFT" &&
              (record?.approvalStatus === "DRAFT" ||
                record?.approvalStatus === "REJECTED");

            const content =
              actionLength > 3 ? (
                <Button
                  icon={<SVGIcon name="IconDelete" width={20} />}
                  type="action"
                  disabled={!canDelete}
                  onClick={canDelete ? () => handleOpenDeleteDraft(record?.id) : undefined}
                >
                  Delete
                </Button>
              ) : (
                <Tooltip title={canDelete ? "Delete" : ""} key={`table-action-delete-${index}`}>
                  <Button
                    type="table-action"
                    disabled={!canDelete}
                    onClick={canDelete ? () => handleOpenDeleteDraft(record?.id) : undefined}
                  >
                    <SVGIcon name="IconDelete" width={20} />
                  </Button>
                </Tooltip>
              );

            return (
              <Fragment key={`table-action-delete-${index}`}>{content}</Fragment>
            );
          },
        };
      }

      return actionDef;
    }),
    ...(canCreateAddon
      ? [{
      action: "CreateAddon",
      type: "table",
      render: (record, actionLength, index) => {
        const isCreate =
          record?.isMain === "Y" &&
          record?.status === "ACTIVE" &&
          (record?.approvalStatus === "APPROVED" ||
            record?.approvalStatus === "REJECTED");
        const linkState = variant.stateBuilders.createAddon({ record, scope });

        const content =
          actionLength > 3 ? (
            isCreate ? (
              <Link to={variant.routes.createAddon} state={linkState}>
                <Button
                  icon={
                    <PlusCircleOutlined
                      style={{ fontSize: "20px", color: "#0075BF" }}
                    />
                  }
                  type="action"
                >
                  Create Child
                </Button>
              </Link>
            ) : (
              <Button
                icon={
                  <PlusCircleOutlined
                    style={{ fontSize: "20px", color: "#8D91A0" }}
                  />
                }
                type="action"
                disabled
              >
                Create Child
              </Button>
            )
          ) : isCreate ? (
            <Tooltip title="Create Child" key={`table-action-addon-${index}`}>
              <Link to={variant.routes.createAddon} state={linkState}>
                <Button type="table-action">
                  <PlusCircleOutlined
                    style={{ fontSize: "20px", color: "#0075BF" }}
                  />
                </Button>
              </Link>
            </Tooltip>
          ) : (
            <Tooltip title="Create Child" key={`table-action-addon-${index}`}>
              <Button type="table-action" disabled>
                <PlusCircleOutlined
                  style={{ fontSize: "20px", color: "#c2cad2" }}
                />
              </Button>
            </Tooltip>
          );

        return <Fragment key={`table-action-addon-${index}`}>{content}</Fragment>;
      },
    }]
      : []),
    ...(canCreateAmendment
      ? [{
      action: "CreateAmendment",
      type: "table",
      render: (record, actionLength, index) => {
        const isCreate =
          record?.isMain === "Y" &&
          record?.status === "ACTIVE" &&
          (record?.approvalStatus === "APPROVED" ||
            record?.approvalStatus === "REJECTED");
        const linkState = variant.stateBuilders.createAmendment({ record, scope });

        const content =
          actionLength > 3 ? (
            isCreate ? (
              <Link to={variant.routes.createAmendment} state={linkState}>
                <Button
                  icon={
                    <PlusCircleOutlined
                      style={{ fontSize: "20px", color: "#0075BF" }}
                    />
                  }
                  type="action"
                >
                  Create Amendment
                </Button>
              </Link>
            ) : (
              <Button
                icon={
                  <PlusCircleOutlined
                    style={{ fontSize: "20px", color: "#8D91A0" }}
                  />
                }
                type="action"
                disabled
              >
                Create Amendment
              </Button>
            )
          ) : isCreate ? (
            <Tooltip title="Create Amendment" key={`table-action-amendment-${index}`}>
              <Link to={variant.routes.createAmendment} state={linkState}>
                <Button type="table-action">
                  <PlusCircleOutlined
                    style={{ fontSize: "20px", color: "#0075BF" }}
                  />
                </Button>
              </Link>
            </Tooltip>
          ) : (
            <Tooltip title="Create Amendment" key={`table-action-amendment-${index}`}>
              <Button type="table-action" disabled>
                <PlusCircleOutlined
                  style={{ fontSize: "20px", color: "#c2cad2" }}
                />
              </Button>
            </Tooltip>
          );

        return (
          <Fragment key={`table-action-amendment-${index}`}>{content}</Fragment>
        );
      },
    }]
      : []),
    {
      action: "Activate",
      type: "table",
      render: (record, actionLength, index) => {
        const isActive = record?.status === "ACTIVE";
        const canInactivate =
          isActive &&
          (record?.approvalStatus === "APPROVED" ||
            record?.approvalStatus === "REJECTED" ||
            record?.approvalStatus === "DRAFT");

        const content =
          actionLength > 3 ? (
            <Button
              icon={
                <Checkbox
                  className="action-checkbox"
                  disabled={!canInactivate}
                  checked={!isActive}
                  style={{ transform: "scale(0.9)" }}
                />
              }
              type="action"
              disabled={!canInactivate}
              onClick={
                canInactivate
                  ? () => handleOpenInactivate(record?.id, record?.saNumber)
                  : undefined
              }
            >
              {isActive ? "Inactivate" : "Activate"}
            </Button>
          ) : (
            <Tooltip title={isActive ? "Inactivate" : "Activate"} key={`table-action-activate-${index}`}>
              <Checkbox
                className="action-checkbox"
                disabled={!canInactivate}
                checked={!isActive}
                onClick={
                  canInactivate
                    ? () => handleOpenInactivate(record?.id, record?.saNumber)
                    : undefined
                }
                style={{ transform: "scale(0.9)" }}
              />
            </Tooltip>
          );

        return (
          <Fragment key={`table-action-activate-${index}`}>{content}</Fragment>
        );
      },
    },
  ];

  return itemActions;
};
