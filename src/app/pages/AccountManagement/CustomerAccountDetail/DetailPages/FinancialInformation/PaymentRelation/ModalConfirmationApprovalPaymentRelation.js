import ModalConfirmationApproval from "../../../../../../../components/Modal/ModalConfirmationApproval";

const ModalConfirmationApprovalPaymentRelation = ({
  dataSource,
  isOpen,
  setIsOpen,
}) => {
  const columns = [
    {
      title: "NO",
      width: 50,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "ACCOUNT NUMBER",
      dataIndex: "accountNumber",
      width: 150,
      sorter: true,
      ...getColumnSearchProps("accountNumber"),
    },
    {
      title: "PRIORITY",
      dataIndex: "priorty",
      width: 100,
      sorter: true,
      ...getColumnSearchProps("priorty"),
    },
    {
      title: "START DATE",
      dataIndex: "startDate",
      width: 150,
      align: "center",
      ...getColumnSearchProps("startDate", "date"),
      render: (startDate) => moment(startDate).format(dateFormatting.date),
    },
    {
      title: "END DATE",
      dataIndex: "endDate",
      width: 150,
      align: "center",
      ...getColumnSearchProps("endDate", "date"),
      render: (endDate) => moment(endDate).format(dateFormatting.date),
    },
    {
      title: "STATUS APPROVAL",
      dataIndex: "statusApproval",
      width: 100,
      sorter: true,
      align: "center",
      fixed: "right",
      ...getColumnSearchProps("statusApproval"),
      render: (status) => {
        const displayText = {
          "approved": "Approved",
          "waitingApproval": "Waiting Approval",
          "pending": "Pending",
          "rejected": "Rejected"
        };
        return (
          <div className="flex justify-center">
            <StatusComponent colour={status}>
              {displayText[status] || toTitleCase(String(status || "")) || "-"}
            </StatusComponent>
          </div>
        );
      },
    },
    {
      title: "STATUS",
      dataIndex: "status",
      sorter: true,
      fixed: "right",
      width: 100,
      ...getColumnSearchProps("status"),
      render: (status) => {
        const displayText = {
          "active": "Active",
          "inactive": "inactive",
        };

        return (
          <div className={" flex justify-center"}>
            <StatusComponent colour={status}>
              {displayText[status] || toTitleCase(String(status || "")) || "-"}
            </StatusComponent>
          </div>
        )
      },
    },
    {
      title: "ACTION",
      align: "center",
      width: 75,
      fixed: "right",
      render: (v, r, i) => {
        return (
          <div className="flex w-full justify-center gap-6">
            {!isApproval && (
              <Tooltip title="Detail">
                <div className="pt-1">
                  <SVGIcon
                    name="IconActionDropdown"
                    color={"#0075bf"}
                    width={24}
                    onClick={() => {}}
                  />
                </div>
              </Tooltip>
            )}
            <Tooltip title="Detail">
              <div className="pt-1">
                <SVGIcon
                  name="IconDetail"
                  color={"#0075bf"}
                  width={24}
                  onClick={() => {
                    handleDetail(r);
                  }}
                />
              </div>
            </Tooltip>
            {
              isApproval && (
                <Tooltip title="Detail">
                  <div className="pt-1">
                    <SVGIcon
                      name="IconLogHistory"
                      color={"#0075bf"}
                      width={24}
                      onClick={() => {}}
                    />
                  </div>
                </Tooltip>
              )
            }
          </div>
        );
      },
    },
  ];

  return (
    <ModalConfirmationApproval
      columns={columns}
      dataSource={dataSource}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    />
  )
}

export default ModalConfirmationApprovalPaymentRelation;