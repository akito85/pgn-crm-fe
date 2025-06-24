import DetailPositionHierarchy from "../../app/pages/UserManagement/PositionHierarchy/DetailPositionHierarchy";
import PositionHierarchyForm from "../../app/pages/UserManagement/PositionHierarchy/PositionHierarchyForm";
import PositionHierarchyPage from "../../app/pages/UserManagement/PositionHierarchy/PositionHierarchyPage";
import DetailUser from "../../app/pages/UserManagement/User/DetailUser";
import GeneratePasswordPage from "../../app/pages/UserManagement/User/GeneratePassword/GeneratePasswordPage";
import MaintainUser from "../../app/pages/UserManagement/User/MaintainUser";
import UploadUser from "../../app/pages/UserManagement/User/UploadUser";
import UserForm from "../../app/pages/UserManagement/User/UserForm";
import UserPage from "../../app/pages/UserManagement/User/UserPage";
import Employee from "../../app/pages/UserManagement/Employee/Employee";
import EmployeeDetail from "../../app/pages/UserManagement/Employee/EmployeeDetail";
import EmployeeCreate from "../../app/pages/UserManagement/Employee/EmployeeCreate";
import EmployeeEdit from "../../app/pages/UserManagement/Employee/EmployeeEdit";
import ForwardTaskForm from "../../app/pages/UserManagement/Employee/ForwardTaskForm";
import EmployeeUpload from "../../app/pages/UserManagement/Employee/EmployeeUpload";
import DelegationPage from "../../app/pages/UserManagement/Delegation/DelegationPage";
import DelegationForm from "../../app/pages/UserManagement/Delegation/DelegationForm";
import DelegationtDetail from "../../app/pages/UserManagement/Delegation/DelegationDetail";
import ApprovalHierarchyPage from "../../app/pages/SystemSetup/ApprovalHierarchy/ApprovalHierarchyPage";
import ApprovalHierarchyForm from "../../app/pages/SystemSetup/ApprovalHierarchy/ApprovalHierarchyForm";
import EmployeeForm from "../../app/pages/UserManagement/Employee/EmployeeForm";
import ProfilePage from "../../app/pages/UserManagement/User/Profile/ProfilePage";
import DataAccessHierarchyView from "../../app/pages/UserManagement/DataAccessHierarchy/DataAccessHierarchyView";
import FormDataAccessHierarchy from "../../app/pages/UserManagement/DataAccessHierarchy/FormDataAccessHierarchy";
import DetailDataAccessHierarchy from "../../app/pages/UserManagement/DataAccessHierarchy/DetailDataAccessHierarchy";

export const USER_ELEMENTS = {
  VIEW_USER_PAGE: <UserPage />,
  CREATE_USER_PAGE: <UserForm type="create" />,
  DETAIL_USER_PAGE: <DetailUser />,
  CHANGE_AUTH_PAGE: <MaintainUser />,
  GENERATE_PASSWORD_PAGE: <GeneratePasswordPage />,
  UPLOAD_USER_PAGE: <UploadUser />,
  UPDATE_USER_PAGE: <UserForm type="update" />,

  // position hierarchy page
  VIEW_POSITION_PAGE: <PositionHierarchyPage />,
  DETAIL_POSITION_PAGE: <DetailPositionHierarchy />,
  CREATE_POSITION_PAGE: <PositionHierarchyForm />,
  UPDATE_POSITION_PAGE: <PositionHierarchyForm type="update" />,

  // employee
  VIEW_EMPLOYEE_PAGE: <Employee />,
  DETAIL_EMPLOYEE_PAGE: <EmployeeDetail />,
  CREATE_EMPLOYEE_PAGE: <EmployeeForm type="create" />,
  UPDATE_EMPLOYEE_PAGE: <EmployeeForm type="update" />,
  UPLOAD_EMPLOYEE_PAGE: <EmployeeUpload />,
  FORWARD_TASK_PAGE: <ForwardTaskForm />,

  // DELEGATION
  VIEW_DELEGATION_PAGE: <DelegationPage />,
  CREATE_DELEGATION_PAGE: <DelegationForm type="create" />,
  DETAIL_DELEGATION_PAGE: <DelegationtDetail />,

  // approval hierarchy
  VIEW_APPROVAL_PAGE: <ApprovalHierarchyPage />,
  DETAIL_APPROVAL_PAGE: "",
  CREATE_APPROVAL_PAGE: <ApprovalHierarchyForm type={"create"} />,
  UPDATE_APPROVAL_PAGE: <ApprovalHierarchyForm type={"update"} />,

  // profile
  VIEW_PROFILE: <ProfilePage />,
  UPDATE_PROFILE: <></>,

  // data access
  VIEW_DATA_ACCESS_PAGE: <DataAccessHierarchyView />,
  CREATE_DATA_ACCESS_PAGE: <FormDataAccessHierarchy type={"create"} />,
  UPDATE_DATA_ACCESS_PAGE: <FormDataAccessHierarchy type={"update"} />,
  DETAIL_DATA_ACCESS_PAGE: <DetailDataAccessHierarchy />,
};
