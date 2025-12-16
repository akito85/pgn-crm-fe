import { Checkbox, Popover, Space, Tooltip } from "antd";
import Highlighter from "react-highlight-words";
import { Link } from "react-router-dom";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import StatusComponent from "../../../../../../components/StatusComponent";
import { dateFormatting } from "../../../../../../utils";
import { getColumnSearchPropsPaging } from "../../../../../../utils/getColumnSearchProps";
import SVGIcon from "../../../../../../assets/Icon/index";
import moment from "moment";
import { MoreOutlined } from "@ant-design/icons";

export const columnsReverseTab = (
  page,
  pageSize,
  searchInput,
  searchedColumn,
  searchText,
  handleSearch = () => { },
  handleApprovalHistory = () => { }
) => [
    {
      title: "NO",
      width: 60,
      align: "center",
      render: (text, object, index) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "RECEIPT CODE",
      dataIndex: "receiptCode",
      sorter: true,
      ...getColumnSearchPropsPaging(
        "receiptCode",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        searchedColumn === "receiptCode" ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : text ? (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ) : (
          ""
        ),
    },
    {
      title: "SOR",
      dataIndex: "sor",
      align: "left",
      sorter: true,
      ellipsis: {
        showTitle: false,
      },
      ...getColumnSearchPropsPaging(
        "sor",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (text) =>
        searchedColumn === "sor" ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : text ? (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ) : (
          ""
        ),
    },
    {
      title: "COST CENTER",
      dataIndex: "costCenter",
      align: "left",
      sorter: true,
      ...getColumnSearchPropsPaging(
        "costCenter",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      ellipsis: {
        showTitle: false,
      },
      render: (text) =>
        searchedColumn === "costCenter" ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : text ? (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ) : (
          ""
        ),
    },
    {
      title: "CUSTOMER",
      dataIndex: "customerName",
      align: "left",
      sorter: true,
      ...getColumnSearchPropsPaging(
        "customerName",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      ellipsis: {
        showTitle: false,
      },
      render: (text) =>
        searchedColumn === "customerName" ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : text ? (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ) : (
          ""
        ),
    },
    {
      title: "ACCOUNT",
      dataIndex: "accountNumber",
      align: "left",
      sorter: true,
      ...getColumnSearchPropsPaging(
        "accountNumber",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      ellipsis: {
        showTitle: false,
      },
      render: (text) =>
        searchedColumn === "accountNumber" ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : text ? (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ) : (
          ""
        ),
    },
    {
      title: "RECEIPT NUMBER",
      dataIndex: "receiptNumber",
      align: "right",
      sorter: true,
      ...getColumnSearchPropsPaging(
        "receiptNumber",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      ellipsis: {
        showTitle: false,
      },
      render: (text) =>
        searchedColumn === "receiptNumber" ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : text ? (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ) : (
          ""
        ),
    },
    {
      title: "RECEIPT DATE",
      dataIndex: "receiptDate",
      align: "center",
      sorter: true,
      ...getColumnSearchPropsPaging(
        "receiptDate",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true,
        "date"
      ),
      render: (text) =>
        searchedColumn === "receiptDate" ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[
              searchText
                ? moment(searchText, "YYYY-MM-DD").format("DD MMM YYYY")
                : "",
            ]}
            autoEscape
            textToHighlight={
              text ? moment(text).format(dateFormatting.dateCapital) : ""
            }
          />
        ) : (
          moment(text).format(dateFormatting.dateCapital) || ""
        ),
    },
    {
      title: "RECEIPT AMOUNT",
      dataIndex: "amount",
      align: "right",
      sorter: true,
      ...getColumnSearchPropsPaging(
        "amount",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      ellipsis: {
        showTitle: false,
      },
      render: (text) =>
        searchedColumn === "amount" ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0,
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : text ? (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        ) : (
          ""
        ),
    },
    {
      title: "STATUS APPROVAL",
      dataIndex: "statusApproval",
      align: "center",
      fixed: "right",
      width: 200,
      sorter: true,
      ...getColumnSearchPropsPaging(
        "statusApproval",
        searchInput,
        searchedColumn,
        searchText,
        handleSearch,
        true
      ),
      render: (approvalStatus) => {
        let text;
        switch (approvalStatus) {
          case "WAITING APPROVAL":
            text = "Waiting Approval";
            break;
          case "APPROVED":
            text = "Approved";
            break;
          default:
            text = approvalStatus
              ? approvalStatus.charAt(0).toUpperCase() +
              approvalStatus.slice(1).toLowerCase()
              : approvalStatus;
            break;
        }
        if (searchedColumn === "statusApproval") {
          return (
            <Highlighter
              highlightStyle={{
                backgroundColor: "#ffc069",
                padding: 0,
              }}
              searchWords={[searchText]}
              autoEscape
              textToHighlight={text ? text.toString() : ""}
            />
          );
        } else {
          return text ? (
            <div className={"flex justify-center"}>
              <StatusComponent colour={text}>{text}</StatusComponent>
            </div>
          ) : (
            text
          );
        }
      },
    },
    // {
    //   title: "ACTION",
    //   align: "center",
    //   dataIndex: "id",
    //   fixed: "right",
    //   width: 130,
    //   render: (id, r) => {
    //     return (
    //       <Space>
    //         <Popover
    //           content={
    //             <Space direction="vertical">
    //               {r?.statusApproval !== "Waiting Approval" &&
    //               r?.status !== "Inactive" ? (
    //                 <Link
    //                   className="w-full"
    //                   // to={RECEIPT_AND_COLLECTION_ROUTES.UPDATE_MASTER_BANK}
    //                   // state={{ id: id }}
    //                 >
    //                   <ButtonComponent
    //                     className="gap-5 w-full"
    //                     icon={
    //                       <SVGIcon name="IconEdit" width={24} color={"#0075BF"} />
    //                     }
    //                     border={false}
    //                     disabled={true}
    //                   >
    //                     <span
    //                       className={
    //                         "text-black gap-2 text-xl text-center w-full"
    //                       }
    //                     >
    //                       Update
    //                     </span>
    //                   </ButtonComponent>
    //                 </Link>
    //               ) : (
    //                 <ButtonComponent
    //                   className="gap-5 w-full"
    //                   icon={
    //                     <SVGIcon name="IconEdit" width={24} color={"#d3d3d3"} />
    //                   }
    //                   border={false}
    //                   disabled={true}
    //                 >
    //                   <span
    //                     className={"text-black gap-2 text-xl text-center w-full"}
    //                   >
    //                     Update
    //                   </span>
    //                 </ButtonComponent>
    //               )}

    //               <Link>
    //                 {
    //                   // r?.status === "ACTIVE" &&
    //                   r?.statusApproval !== "Waiting Approval" &&
    //                   r?.status !== "Inactive" ? (
    //                     <ButtonComponent
    //                       border={false}
    //                       // disabled={r?.status === "Draft"}
    //                       disabled={true}
    //                       // onClick={() => handleInactive(r)}
    //                     >
    //                       <Checkbox
    //                         // checked={r?.status === "Active" ? true : false}
    //                         className="gap-7"
    //                       />
    //                       <span
    //                         className={"text-black gap-2 text-xl text-center"}
    //                       >
    //                         {r?.status === "ACTIVE" ? "Inactivate" : "Activate"}
    //                       </span>
    //                     </ButtonComponent>
    //                   ) : (
    //                     <ButtonComponent border={false} disabled={true}>
    //                       <Checkbox
    //                         checked={
    //                           r?.status === "Active"
    //                             ? true
    //                             : false || r?.status === "Draft"
    //                             ? true
    //                             : null
    //                         }
    //                         disabled={true}
    //                         className="gap-7"
    //                       />
    //                       <span
    //                         className={"text-black gap-2 text-xl text-center"}
    //                       >
    //                         {r?.status === "Active" ? "Inactivate" : "Activate"}
    //                       </span>
    //                     </ButtonComponent>
    //                   )
    //                 }
    //               </Link>
    //               <Link>
    //                 <ButtonComponent
    //                   className="gap-5"
    //                   icon={
    //                     <SVGIcon
    //                       name="IconLogHistory"
    //                       color={"#0075bf"}
    //                       width={24}
    //                     />
    //                   }
    //                   disabled={true}
    //                   border={false}
    //                   // onClick={() => handleApprovalHistory(r)}
    //                 >
    //                   <span className={"text-black text-xl text-center"}>
    //                     Approval History
    //                   </span>
    //                 </ButtonComponent>
    //               </Link>
    //             </Space>
    //           }
    //           trigger={"click"}
    //           placement="bottomRight"
    //         >
    //           <div className="pt-1">
    //             <MoreOutlined style={{ fontSize: "22px", color: "#0075BF" }} />
    //           </div>
    //         </Popover>
    //         <Tooltip title="Detail">
    //           <div className="pt-1">
    //             <Link
    //             // to={RECEIPT_AND_COLLECTION_ROUTES.DETAIL_MASTER_BANK}
    //             // state={{ id: id }}
    //             >
    //               <SVGIcon name="IconDetail" width={24} />
    //             </Link>
    //           </div>
    //         </Tooltip>
    //       </Space>
    //     );
    //   },
    // },
  ];
