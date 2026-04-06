import React, { Fragment } from "react";
import { NavLink, Link } from "react-router-dom";
import { Checkbox, Tooltip } from "antd";
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
  onDownload,
  onOpenApproval,
}) => {
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
      render: (
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
              actionLength > 2 ? (
                isEditable ? (
                  <Link to={variant.routes.update} state={linkState}>
                    <ButtonComponent
                      icon={<SVGIcon name="IconEdit" color="#ACC424" width={20} />}
                      border={false}
                    >
                      <span className="text-black ml-3">Update</span>
                    </ButtonComponent>
                  </Link>
                ) : (
                  <ButtonComponent
                    icon={<SVGIcon name="IconEdit" color="#8D91A0" width={20} />}
                    border={false}
                    disabled
                  >
                    <span className="text-black ml-3">Update</span>
                  </ButtonComponent>
                )
              ) : isEditable ? (
                <Link to={variant.routes.update} state={linkState}>
                  <Tooltip title="Update">
                    <SVGIcon name="IconEdit" width={20} color="#ACC424" />
                  </Tooltip>
                </Link>
              ) : (
                <Tooltip title="Update">
                  <SVGIcon
                    name="IconEdit"
                    width={20}
                    color="#8D91A0"
                    className="cursor-not-allowed"
                  />
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
              actionLength > 2 ? (
                <ButtonComponent
                  icon={
                    <SVGIcon
                      name="IconDelete"
                      width={20}
                      color={canDelete ? "#be3036" : "#c2cad2"}
                    />
                  }
                  border={false}
                  disabled={!canDelete}
                  onClick={canDelete ? () => handleOpenDeleteDraft(record?.id) : undefined}
                >
                  <span className="text-black ml-3">Delete</span>
                </ButtonComponent>
              ) : (
                <Tooltip title={canDelete ? "Delete" : ""}>
                  <SVGIcon
                    name="IconDelete"
                    width={20}
                    color={canDelete ? "#be3036" : "#c2cad2"}
                    className={canDelete ? undefined : "disabled cursor-not-allowed"}
                    onClick={canDelete ? () => handleOpenDeleteDraft(record?.id) : undefined}
                  />
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
          actionLength > 2 ? (
            isCreate ? (
              <Link to={variant.routes.createAddon} state={linkState}>
                <ButtonComponent
                  icon={
                    <PlusCircleOutlined
                      style={{ fontSize: "20px", color: "#0075BF" }}
                    />
                  }
                  border={false}
                >
                  <span className="text-black ml-3">Create Child</span>
                </ButtonComponent>
              </Link>
            ) : (
              <ButtonComponent
                icon={
                  <PlusCircleOutlined
                    style={{ fontSize: "20px", color: "#8D91A0" }}
                  />
                }
                border={false}
                disabled
              >
                <span className="text-black ml-3">Create Child</span>
              </ButtonComponent>
            )
          ) : isCreate ? (
            <Tooltip title="Create Child">
              <Link to={variant.routes.createAddon} state={linkState}>
                <PlusCircleOutlined
                  style={{ fontSize: "20px", color: "#bbce4b" }}
                />
              </Link>
            </Tooltip>
          ) : (
            <Tooltip title="Create Child">
              <PlusCircleOutlined
                style={{ fontSize: "20px", color: "#c2cad2" }}
                className="cursor-not-allowed"
              />
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
          actionLength > 2 ? (
            isCreate ? (
              <Link to={variant.routes.createAmendment} state={linkState}>
                <ButtonComponent
                  icon={
                    <PlusCircleOutlined
                      style={{ fontSize: "20px", color: "#0075BF" }}
                    />
                  }
                  border={false}
                >
                  <span className="text-black ml-3">Create Amendment</span>
                </ButtonComponent>
              </Link>
            ) : (
              <ButtonComponent
                icon={
                  <PlusCircleOutlined
                    style={{ fontSize: "20px", color: "#8D91A0" }}
                  />
                }
                border={false}
                disabled
              >
                <span className="text-black ml-3">Create Amendment</span>
              </ButtonComponent>
            )
          ) : isCreate ? (
            <Tooltip title="Create Amendment">
              <Link to={variant.routes.createAmendment} state={linkState}>
                <PlusCircleOutlined
                  style={{ fontSize: "20px", color: "#0075BF" }}
                />
              </Link>
            </Tooltip>
          ) : (
            <Tooltip title="Create Amendment">
              <PlusCircleOutlined
                style={{ fontSize: "20px", color: "#c2cad2" }}
                className="cursor-not-allowed"
              />
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
          actionLength > 2 ? (
            <ButtonComponent
              icon={
                <Checkbox
                  className="inactive-check"
                  disabled={!canInactivate}
                  checked={!isActive}
                  style={{ transform: "scale(0.9)" }}
                />
              }
              border={false}
              disabled={!canInactivate}
              onClick={
                canInactivate
                  ? () => handleOpenInactivate(record?.id, record?.saNumber)
                  : undefined
              }
            >
              <span className="text-black ml-3">
                {isActive ? "Inactivate" : "Activate"}
              </span>
            </ButtonComponent>
          ) : (
            <Tooltip title={isActive ? "Inactivate" : "Activate"}>
              <Checkbox
                className="inactive-check"
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
