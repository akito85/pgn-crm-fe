import { Checkbox, Tooltip } from "antd";
import ButtonComponent from "../ButtonComponent";
import SVGIcon from "../../assets/Icon/index";
import { Link } from "react-router-dom";
import { Fragment } from "react";

const nxGetAccountActions = ({
  idAccount = 0,
  idCustomer = 0,
  type = "",
  createRoute = "",
  updateRoute = "",
  detailRoute = "",
  navigate = () => {},
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
      <Link to={createRoute} state={{
        idAccount,
        idCustomer,
        type,
      }}>
        <ButtonComponent
          icon={<SVGIcon name="IconButtonCreate" width={20} />}
          type={"submit"}
          border={false}
        >
          Create
        </ButtonComponent>
      </Link>
    )
  },
  {
    action: 'View',
    type: 'table',
    render: (record, actionLength, index) => {
      return (
        <Tooltip
          title="Detail"
          onClick={
            () => navigate(detailRoute, {
              state: {
                id: record.id,
                idAccount,
                idCustomer,
                type,
              }
            })
          }
          key={`table-action-${index}`}
        >
          <div className="flex items-center h-full">
            <SVGIcon name="IconDetail" width={20} />
          </div>
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
            icon={<SVGIcon name="IconEdit" color={!isEditable ? "#BDBDBD" : "#0075BF"} width={20} />}
            border={false}
            disabled={!isEditable}
            onClick={() => navigate(updateRoute, {
              state: {
                id: record.id,
                idAccount,
                idCustomer,
                type,
              }
            })}
            type={"action"}
          >
            <span className={"text-black ml-3"}>Update</span>
          </ButtonComponent>
        ) : (
          <Tooltip title="Update">
            <div className="flex items-center h-full">

              <SVGIcon
                name="IconEdit"
                width={20}
                color={!isEditable ? "#8D91A0" : "#ACC424"}
                className={!isEditable ? "cursor-not-allowed" : undefined}
                onClick={
                  isEditable ?
                    () => navigate(updateRoute, {
                      state: {
                        id: record.id,
                        idAccount,
                        idCustomer,
                        type,
                      }
                    }) :
                    () => {}
                }
              />
            </div>
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
            title="Inactivate"
          >
            <div className="flex items-center h-full">
              <Checkbox
                className="action-checkbox"
                disabled={isActive ? false : true}
                checked={isActive ? false : true}
                onClick={() => handleInactivate(true, record?.id, record?.appHierId, record?.relatedAccountNumber)}
                style={{ transform: "scale(0.9)" }}
              />
            </div>
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
              <SVGIcon name="IconLogHistory" color={"#0075bf"} width={20} />
            }
            border={false}
            onClick={() => handleApprovalHistory(true, record?.id)}
            type={"action"}
          >
            <span className={"text-black ml-3"}>Approval History</span>
          </ButtonComponent>
        ) : (
          <Tooltip title="Approval History">
            <SVGIcon
              name="IconLogHistory"
              color={"#0075bf"}
              width={20}
              onClick={() => handleApprovalHistory(true, record?.id)}
            />
          </Tooltip>
        );

      return <Fragment key={`table-action-${index}`}>{content}</Fragment>
    }
  }
];

export {
  nxGetAccountActions,
}