import { useState, useEffect, useRef, Fragment } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"

import TablePagination from "../../../../../../../components/TablePagination";
import TableExpand from "../../../../../../../components/Table/TableExpand";
import ButtonComponent from "../../../../../../../components/ButtonComponent";
import DetailText from "../../../../../../../components/DetailText";
import BaseContainer from "../../../../../../../components/BaseContainer";
import NxTable from "../../../../../../../components/Nx/NxTable";
import NxPanel from "../../../../../../../components/Nx/NxPanel";
import NxModal from "../../../../../../../components/Nx/NxModal";

import { Tooltip, Form } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import SVGIcon from "../../../../../../../assets/Icon/index";

import { USER_ROUTES } from "../../../../../../../routes/user_management/user_routes";

const CustomerServiceRequestContact = ({
  data = [],
  handleChange = () => {},
  handleChangeSize = () => {},
  totalElement = 0,
  page = 1,
  pageSize = 10,
  onSort = () => {},
  id,
  idAccount,
  idCustomer,
  accountType,
  data_accountDetail,
  data_customerDetail,
}) => {
  const [dataDetail, setDataDetail] = useState({});
  const [expanded, setExpanded] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  
  // Dummy data for main table (2 rows)
  const dataMain = [
    {
      key: '1',
      no: 1,
      primary: 'Yes',
      contactName: 'John Brown',
      job: 'Software Engineer',
      position: 'Senior Developer',
      contactAddress: 'New York No. 1 Lake Park',
      contactAddressAdditionalNote: 'Near Central Park',
      description: 'Main technical contact for project',
      status: 'Active',
    },
    {
      key: '2',
      no: 2,
      primary: 'No',
      contactName: 'Jim Green',
      job: 'Product Manager',
      position: 'Team Lead',
      contactAddress: 'London No. 1 Lake Park',
      contactAddressAdditionalNote: 'Building B, 3rd Floor',
      description: 'Project management and coordination',
      status: 'Inactive',
    },
  ];

  // Dummy data for child/expand table (3 rows)
  const dataExpand = {
      '1': [ {
          no: 1,
          type: 'Email',
          value: 'john.brown@company.com',
        },
        {
          no: 2,
          type: 'Phone',
          value: '+1-555-0101',
        },
      ],
      '2' : [
        {
          key: '3',
          no: 3,
          type: 'LinkedIn',
          value: 'linkedin.com/in/johnbrown',
        },
      ]
  };

  // Columns for main table
  const columnMain = [
    {
      title: 'NO',
      dataIndex: 'no',
      key: 'no',
      width: 60,
      sorter: true,
      filter: true,
    },
    {
      title: 'PRIMARY',
      dataIndex: 'primary',
      key: 'primary',
      width: 80,
      render: (primary) => (
        <span style={{ 
          color: primary === 'Yes' ? 'green' : 'gray',
          fontWeight: primary === 'Yes' ? 'bold' : 'normal'
        }}>
          {primary}
        </span>
      ),
      sorter: true,
      filter:true,
    },
    {
      title: 'CONTACT NAME',
      dataIndex: 'contactName',
      key: 'contactName',
      width: 150,
      sorter: true,
      filter:true,
    },
    {
      title: 'JOB',
      dataIndex: 'job',
      key: 'job',
      width: 150,
      sorter: true,
      filter:true,
    },
    {
      title: 'POSITION',
      dataIndex: 'position',
      key: 'position',
      width: 150,
      sorter: true,
      filter:true,
    },
    {
      title: 'CONTACT ADDRESS',
      dataIndex: 'contactAddress',
      key: 'contactAddress',
      width: 200,
      sorter: true,
      filter:true,
    },
    {
      title: 'CONTACT ADDRESS ADDITIONAL NOTE',
      dataIndex: 'contactAddressAdditionalNote',
      key: 'contactAddressAdditionalNote',
      width: 250,
      sorter: true,
      filter:true,
    },
    {
      title: 'DESCRIPTION',
      dataIndex: 'description',
      key: 'description',
      width: 200,
      sorter: true,
      filter:true,
    },
    {
      title: 'STATUS',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <span style={{ 
          color: status === 'Active' ? 'green' : 'red',
          fontWeight: 'bold'
        }}>
          {status}
        </span>
      ),
      sorter: true,
    },
  ];

  // Columns for expand table
  const columnExpand = [
    {
      title: 'NO',
      dataIndex: 'no',
      key: 'no',
      width: 60,
      sorter: true,
      filter:true,
    },
    {
      title: 'TYPE',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type) => (
        <span style={{ 
          color: '#1890ff',
          fontWeight: 'bold'
        }}>
          {type}
        </span>
      ),
      sorter: true,
      filter:true,
    },
    {
      title: 'VALUE',
      dataIndex: 'value',
      key: 'value',
      width: 250,
      sorter: true,
      filter:true,
   },
  ];
  // nav
  const navigate = useNavigate();

  // Use dummy data if no data provided
  const tableData = (Array.isArray(data) && data.length > 0) ? data : dataMain;

  // Sanitize pagination values to prevent NaN
  const sanitizedPage = Number(page) > 0 ? Number(page) : 1;
  const sanitizedPageSize = Number(pageSize) > 0 ? Number(pageSize) : 10;
  const sanitizedTotalElement = Number(totalElement) > 0 ? Number(totalElement) : tableData.length;

  const handleDetail = (value) => {
    setDataDetail(value);
  };

  const handleViewFile = (fileData) => {
    // Placeholder for view file action
    console.log("View file:", fileData);
    // Add your file viewing logic here
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleSaveContact = () => {
    form.validateFields()
      .then((values) => {
        console.log("Contact saved:", values);
        // Add logic to save contact
        handleCloseModal();
      })
      .catch((error) => {
        console.log("Validation failed:", error);
      });
  };

  const itemActions = [
  {
    action: "View",
    type: 'table',
    render: (record, data_length) => {
      return (
        <Tooltip title={"Detail"}>
          <Link
            to={USER_ROUTES.DETAIL_EMPLOYEE}
            state={{ id: record?.employeeCode }}
          >
            <div className="pt-1">
              <SVGIcon name="IconDetail" width={24} />
            </div>
          </Link>
        </Tooltip>
      );
    },
  },
  {
    action: "Update",
    type: 'table',
    render: (record, data_length) => {
      return (
        <Tooltip title="Update">
          <Link
            to={record?.status === "ACTIVE" && USER_ROUTES.UPDATE_EMPLOYEE}
            state={
              record?.status === "ACTIVE" && { id: record?.employeeCode }
            }
          >
            <div
              className={
                record?.status === "INACTIVE" && " cursor-not-allowed"
              }
            >
              <ButtonComponent
                icon={
                  <SVGIcon
                    name="IconEdit"
                    color={
                      record?.status === "ACTIVE" ? "#0075bf" : "#C0BEC6"
                    }
                    width={24}
                  />
                }
                border={false}
                disabled={record?.status === "ACTIVE" ? false : true}
              >
                {data_length > 3 && (
                  <span
                    className={
                      record?.status === "ACTIVE"
                        ? "text-black ml-3"
                        : "text-[#C0BEC6]"
                    }
                  >
                    Update
                  </span>
                )}
              </ButtonComponent>
            </div>
          </Link>
        </Tooltip>
      );
    },
  },
  ]

  return(
    <Fragment>
      <NxPanel title={"CONTACT LIST"}>
        {/* Create Contact Button */}
        <div className="w-full flex justify-end items-center gap-2.5 mb-5">
          <ButtonComponent
            type={"button"}
            onClick={handleOpenModal}
            icon={
              <PlusOutlined
                style={{
                  color: "#fff",
                  fontSize: 20,
                }}
              />
            }
            style={{
              backgroundColor: "#0075bf",
              color: "#fff",
              borderColor: "#0075bf",
              border: "1px solid #0075bf",
              borderRadius: "5px",
              height: "48px",
              paddingLeft: "16px",
              paddingRight: "16px",
              paddingTop: "9px",
              paddingBottom: "9px",
              display: "inline-flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
              fontSize: "20px",
              fontWeight: "400",
              lineHeight: "30px"
            }}
          >
            Create Contact
          </ButtonComponent>
        </div>

        <NxTable
          className="border-[0.5px] border-[#c8cdd4] border-solid "

          childTitle={"CONTACT DETAIL"}
          dataMain={dataMain}
          dataExpand={dataExpand}
          columnMain={columnMain}
          columnExpand={columnExpand}
          expandedRowKeys={expanded}
          expandRowByClick={true}

          // Styling props
          tablePadding="small"
          fontSize="small"

          // Column Visibility
          useSelect={true}

          // Pagination Props
          usePagination={true}
          onChange={(page, size) => {}}
          totalData={sanitizedTotalElement}
          current={sanitizedPage}
          pageSize={sanitizedPageSize}

          onExpand={(exp, record) => {
            setExpanded(exp
              ? [...expanded, record.key]
              : expanded.filter(k => k !== record.key)
            );
          }}
          onSort={onSort}
        />

      </NxPanel>

      {/* Modal for Creating Contact */}
      <NxModal
        id="ModalCreateContact"
        isOpen={isModalOpen}
        handleCancel={handleCloseModal}
        handleOk={handleSaveContact}
        header={"CREATE CONTACT"}
        width={800}
        title={"CREATE CONTACT"}
        footer={[
          <div key="footer" className="self-stretch flex flex-row justify-end">
            <div className="flex flex-row items-center gap-3">
              <ButtonComponent
                type={"button"}
                onClick={handleCloseModal}
                style={{
                  backgroundColor: "#ffffff",
                  color: "#0075bf",
                  borderColor: "#0075bf",
                  border: "1px solid #0075bf",
                  borderRadius: "5px",
                  height: "48px",
                  width: "135px",
                  paddingLeft: "16px",
                  paddingRight: "16px",
                  paddingTop: "9px",
                  paddingBottom: "9px",
                  display: "inline-flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "20px",
                  fontWeight: "400",
                  lineHeight: "30px"
                }}
              >
                Cancel
              </ButtonComponent>
              <ButtonComponent
                type={"submit"}
                onClick={handleSaveContact}
                style={{
                  backgroundColor: "#0075bf",
                  color: "#fff",
                  borderColor: "#0075bf",
                  border: "1px solid #0075bf",
                  borderRadius: "5px",
                  height: "48px",
                  width: "135px",
                  paddingLeft: "16px",
                  paddingRight: "16px",
                  paddingTop: "9px",
                  paddingBottom: "9px",
                  display: "inline-flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "20px",
                  fontWeight: "400",
                  lineHeight: "30px"
                }}
              >
                Save
              </ButtonComponent>
            </div>
          </div>
        ]}
      >
        <Form form={form} layout="vertical">
          <div className="mb-5 text-sky-600 text-sm font-bold">
            CONTACT INFORMATION
          </div>
          <p className="text-neutral-400 text-sm mb-4">
            Fill in the contact information below
          </p>
        </Form>
      </NxModal>

    </Fragment>
  )
}

export default CustomerServiceRequestContact
