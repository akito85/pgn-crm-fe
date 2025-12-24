import { Fragment } from "react";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import BaseContainer from "../../../../../../components/BaseContainer";
import RelationshipTable from "./RelationshipTable";
import { ACCOUNT_MANAGEMENT_ROUTES } from "../../../../../../routes/account_management/customer_account_routes";
import ButtonComponent from "../../../../../../components/ButtonComponent";
import SVGIcon from "../../../../../../assets/Icon/index";
import { useDispatch } from "react-redux";
import { Form } from "antd";
import ModalCustom from "../../../../../../components/Modal/ModalCustom";
import CustomerQuery from "../../../Customer/Component/CustomerQuesry";
import { getGlobalSearchColumn, getGlobalSearchCondition, getGlobalSearchOperator } from "../../../../../../redux/slices/account_management/detailAccount/relationshipSlice";
import { CheckOutlined, DownloadOutlined, FilterOutlined } from "@ant-design/icons";

const Relationship = ({ id = 0, type = "standard", idCustomer = null }) => {
  const dispatch = useDispatch();
  const [formQuery] = Form.useForm();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState({});
  const [inputFields, setInputFields] = useState([]);
  const [tempInputFields, setTempInputFields] = useState([]);
  const [modalQuery, setModalQuery] = useState(false);
  const [approvalMode, setApprovalMode] = useState(false);

  const handleOpenFilter = () => {
    setModalQuery(true);
  };

  const handleCancelQuery = () => {
    formQuery.resetFields();
    setModalQuery(false);
    setTempInputFields(inputFields);
  };

  const handleSaveQuery = () => {
    const queryValues = formQuery.getFieldValue("query");
    if (queryValues) {
      const formattedQuery = queryValues.map((item) => ({
        condition: item.condition,
        column: item.column,
        operator: item.operator,
        value: item.value,
      }));
      setInputFields(formattedQuery);
      setTempInputFields(formattedQuery);
    }
    setModalQuery(false);
    setPage(1);
  };

  const handleFirstQuery = () => {
    const queries = formQuery.getFieldValue("query");
    if (queries && queries.length > 0) {
      formQuery.setFieldsValue({
        query: queries.map((item, index) => ({
          ...item,
          condition: index === 0 ? 1311 : item.condition,
        })),
      });
    }
  };

  /**
   * Handle entering or exiting approval mode
   * When entering: filter by statusApproval = WAITING_APPROVAL
   * When exiting: clear filter and reset states
   * @param {boolean} newApprovalMode 
   */
  const handleIsApproval = (newApprovalMode) => {
    if (newApprovalMode) {
      // ENTERING APPROVAL MODE
      setPage(1);
      setSearch((prevState) => ({
        ...prevState,
        statusApproval: "WAITING_APPROVAL",
      }));
      setApprovalMode(true);
    } else {
      // EXITING APPROVAL MODE
      setSearchText("");
      setSearchedColumn("");
      setPage(1);
      setSearch((prevState) => ({
        ...prevState,
        statusApproval: undefined,
      }));
      setApprovalMode(false);
    }
  };

  return (
    // <Spin spinning={loading} className={"w-full top-20"} tip={"Loading..."}>
    <Fragment>
      <BaseContainer header={"RELATIONSHIP LIST"}>
        {!approvalMode ? (
          <div className="w-full flex justify-between mb-[30px]">
            <ButtonComponent
              icon={
                <FilterOutlined
                  style={{
                    color: "#fff",
                    fontSize: 20,
                  }}
                />
              }
              type="submit"
              onClick={handleOpenFilter}
            >
              Filters
            </ButtonComponent>

            <div className="flex gap-3">
              <ButtonComponent
                type={"submit"}
                // onClick={handleDownload}
                icon={
                  <DownloadOutlined
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
                  height: "48px"
                }}
              >
                Download List
              </ButtonComponent>
              <ButtonComponent
                type={"submit"}
                onClick={() => handleIsApproval(true)}
                icon={
                  <CheckOutlined
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
                  height: "48px"
                }}
              >
                Approval
              </ButtonComponent>

              <NavLink
                to={ACCOUNT_MANAGEMENT_ROUTES.CREATE_RELATIONSHIP}
                state={{ idAccount: id, idCustomer: idCustomer, type: type }}
              >
                <ButtonComponent
                  type={"submit"}
                  icon={<SVGIcon name="IconButtonCreate" width={24} />}
                >
                  Create
                </ButtonComponent>
              </NavLink>
            </div>
          </div>
        ) : (
          <div className="w-full flex justify-end mb-[30px]">
            <ButtonComponent
              type="default"
              onClick={() => handleIsApproval(false)}
            >
              Cancel Approval
            </ButtonComponent>
          </div>
        )}

        <div className={"w-full mt-5"}>
          <RelationshipTable
            idAccount={id}
            page={page}
            setPage={setPage}
            pageSize={pageSize}
            setPageSize={setPageSize}
            searchedColumn={searchedColumn}
            setSearchedColumn={setSearchedColumn}
            searchText={searchText}
            setSearchText={setSearchText}
            sort={sort}
            setSort={setSort}
            search={search}
            setSearch={setSearch}
            approvalMode={approvalMode}
            handleIsApproval={handleIsApproval}
            type={type}
            idCustomer={idCustomer}
            inputFields={inputFields}
            tempInputFields={tempInputFields}
          />
        </div>
      </BaseContainer>

      {/* Modal Filter */}
      <ModalCustom
        isOpen={modalQuery}
        type="filter"
        header="Advanced Filter"
        width={700}
        handleCancel={handleCancelQuery}
        handleOk={handleSaveQuery}
      >
        <Form
          form={formQuery}
          id={"formQuery"}
          layout={"vertical"}
          onFinish={handleSaveQuery}
          initialValues={{
            query:
              tempInputFields.length > 0
                ? tempInputFields
                : [{ condition: 1311 }],
          }}
        >
          <CustomerQuery
            handleFirstQuery={handleFirstQuery}
            handleCancelQuery={handleCancelQuery}
            dispatch={dispatch}
            typeSelector="relationship"
            getApiColumn={getGlobalSearchColumn}
            getApiOperator={getGlobalSearchOperator}
            getApiCondition={getGlobalSearchCondition}
          />
        </Form>
      </ModalCustom>
    </Fragment>
    // </Spin>
  );
};

export default Relationship;
