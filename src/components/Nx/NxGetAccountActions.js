import { Checkbox, Tooltip } from "antd";
import ButtonComponent from "../ButtonComponent";
import SVGIcon from "../../assets/Icon/index";
import { Link } from "react-router-dom";
import { Fragment } from "react";

const nxGetAccountActions = ({
  idAccount = 0,
  idCustomer = 0,
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
    render: (r, actionLength, index) => {
      return (
        <Link
          to={detailRoute}
          state={{
            id: r.id,
            idAccount,
            idCustomer,
          }}
          key={`table-action-${index}`}
        >
          <Tooltip title="Detail">
            <SVGIcon name="IconDetail" width={20} />
          </Tooltip>
        </Link>
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
            icon={<SVGIcon name="IconEdit" color={!isEditable ? "#8D91A0" : "#ACC424"} width={20} />}
            border={false}
            disabled={!isEditable}
            onClick={() => navigate(updateRoute, {
              state: {
                id: record.id,
                idAccount,
                idCustomer,
              }
            })}
          >
            <span className={"text-black ml-3"}>Update</span>
          </ButtonComponent>
        ) : (
          <Tooltip title="Update">
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
                    }
                  }) :
                  () => {}
              }
            />
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
      const isActive = record.status === "ACTIVE";

      const content = actionLength > 3 ?
        (
          <ButtonComponent
            icon={
              <Checkbox
                className="inactive-check"
                disabled={isActive ? false : true}
                checked={isActive ? false : true}
                style={{ transform: "scale(0.9)" }}
              />
            }
            border={false}
            disabled={!isActive}
            onClick={() => handleInactivate(true, record?.id, record?.appHierId, record?.relatedAccountNumber)}
          >
            <span className={"text-black ml-3"}>Inactivate</span>
          </ButtonComponent>
        ) : (
          <Tooltip
            title="Inactivate"
          >
            <Checkbox
              className="inactive-check"
              disabled={isActive ? false : true}
              checked={isActive ? false : true}
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
              <SVGIcon name="IconLogHistory" color={"#0075bf"} width={20} />
            }
            border={false}
            onClick={() => handleApprovalHistory(true, record?.id)}
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