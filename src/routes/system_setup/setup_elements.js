import Action from "../../app/pages/SystemSetup/Action/Action";
import ActionCreate from "../../app/pages/SystemSetup/Action/ActionCreate";
import ActionEdit from "../../app/pages/SystemSetup/Action/ActionEdit";
import ApprovalHierarchyForm from "../../app/pages/SystemSetup/ApprovalHierarchy/ApprovalHierarchyForm";
import ApprovalHierarchyPage from "../../app/pages/SystemSetup/ApprovalHierarchy/ApprovalHierarchyPage";
import CreateGlobalType from "../../app/pages/SystemSetup/GlobalType/CreateGlobalType";
import DetailGlobalType from "../../app/pages/SystemSetup/GlobalType/DetailGlobalType";
import EditGlobalType from "../../app/pages/SystemSetup/GlobalType/EditGlobalType";
import ViewGlobalType from "../../app/pages/SystemSetup/GlobalType/ViewGlobalType";
import Menu from "../../app/pages/SystemSetup/Menu/Menu";
import GlobalProperties from "../../app/pages/SystemSetup/GlobalProperties/GlobalProperties";
import GlobalPropertiesDetail from "../../app/pages/SystemSetup/GlobalProperties/GlobalPropertiesDetail";
// import GlobalPropertiesEdit from "../../app/pages/SystemSetup/GlobalProperties/GlobalPropertiesEdit";
import GlobalPropertiesForm from "../../app/pages/SystemSetup/GlobalProperties/GlobalPropertiesForm";
import EntityPage from "../../app/pages/SystemSetup/Entity/Entity";
import EntityDetail from "../../app/pages/SystemSetup/Entity/EntityDetail";
import EntityForm from "../../app/pages/SystemSetup/Entity/EntityForm";
import CostCenter from "../../app/pages/SystemSetup/MasterData/CostCenter/CostCenter";
import GroupAccess from "../../app/pages/SystemSetup/GroupAccess/GroupAccess";
import AnnouncementPage from "../../app/pages/SystemSetup/Announcement/AnnouncementPage";
import AnnouncementForm from "../../app/pages/SystemSetup/Announcement/AnnouncementForm";
import AnnouncementDetail from "../../app/pages/SystemSetup/Announcement/AnnouncementDetail";
import Job from "../../app/pages/SystemSetup/MasterData/Job/Job";
import LoginBackgroundPage from "../../app/pages/SystemSetup/LoginBackground/LoginBackgroundPage";
import LoginBackgroundForm from "../../app/pages/SystemSetup/LoginBackground/LoginBackgroundForm";
import PositionPage from "../../app/pages/SystemSetup/MasterData/Position/PositionPage";
import PositionForm from "../../app/pages/SystemSetup/MasterData/Position/PositionForm";
import JobForm from "../../app/pages/SystemSetup/MasterData/Job/JobForm";
import GroupAccessForm from "../../app/pages/SystemSetup/GroupAccess/GroupAccessForm";
import LoginBackgroundDetail from "../../app/pages/SystemSetup/LoginBackground/LoginBackgroundDetail";
import MaintenanceModePage from "../../app/pages/SystemSetup/MaintenanceMode/MaintenanceModePage";
import CostCenterForm from "../../app/pages/SystemSetup/MasterData/CostCenter/CostCenterForm";
import FormMenu from "../../app/pages/SystemSetup/Menu/FormMenu";
import GlobalPropertiesUpdate from "../../app/pages/SystemSetup/GlobalProperties/GlobalPropertiesUpdate";
import GlobalTypeForm from "../../app/pages/SystemSetup/GlobalType/GlobalTypeForm";
import FormAssets from "../../app/pages/SystemSetup/MasterData/Assets/FormAssets";
import ViewAssets from "../../app/pages/SystemSetup/MasterData/Assets/ViewAssets";
import DetailAssets from "../../app/pages/SystemSetup/MasterData/Assets/DetailAssets";

export const SYSTEM_SETUP_ELEMENTS = {
  // menu
  VIEW_MENU_PAGE: <Menu />,
  CREATE_MENU_PAGE: <FormMenu type={"create"} />,
  UPDATE_MENU_PAGE: <FormMenu type={"update"} />,

  // global type
  VIEW_GLOBAL_PAGE: <ViewGlobalType />,
  // CREATE_GLOBAL_PAGE: <CreateGlobalType type={"create"} />,
  CREATE_GLOBAL_PAGE: <GlobalTypeForm type={"create"} />,
  DETAIL_GLOBAL_PAGE: <DetailGlobalType />,
  // UPDATE_GLOBAL_PAGE: <EditGlobalType/>,
  UPDATE_GLOBAL_PAGE: <GlobalTypeForm type={"update"} />,

  // action
  VIEW_ACTION_PAGE: <Action />,
  CREATE_ACTION_PAGE: <ActionCreate type={"create"} />,
  UPDATE_ACTION_PAGE: <ActionCreate type={"update"} />,

  // global properties
  VIEW_GLOBAL_PROPERTIES_PAGE: <GlobalProperties />,
  DETAIL_GLOBAL_PROPERTIES_PAGE: <GlobalPropertiesDetail />,
  UPDATE_GLOBAL_PROPERTIES_PAGE: <GlobalPropertiesUpdate />,
  CREATE_GLOBAL_PROPERTIES_PAGE: <GlobalPropertiesForm />,

  // entity
  VIEW_ENTITY_PAGE: <EntityPage />,
  DETAIL_ENTITY_PAGE: <EntityDetail />,
  UPDATE_ENTITY_PAGE: <EntityForm type={"update"} />,
  CREATE_ENTITY_PAGE: <EntityForm type={"create"} />,

  // cost center
  VIEW_COST_CENTER_PAGE: <CostCenter />,
  CREATE_COST_CENTER_PAGE: <CostCenterForm type={"create"} />,
  UPDATE_COST_CENTER_PAGE: <CostCenterForm type={"update"} />,

  // group access
  VIEW_GROUP_ACCESS_PAGE: <GroupAccess />,
  // CREATE_GROUP_ACCESS_PAGE: <GroupAccessCreate />,
  // UPDATE_GROUP_ACCESS_PAGE: <GroupAccessEdit />,
  CREATE_GROUP_ACCESS_PAGE: <GroupAccessForm type="create" />,
  UPDATE_GROUP_ACCESS_PAGE: <GroupAccessForm type="update" />,

  // Announcement
  VIEW_ANNOUNCEMENT_PAGE: <AnnouncementPage />,
  CREATE_ANNOUNCEMENT_PAGE: <AnnouncementForm type="create" />,
  UPDATE_ANNOUNCEMENT_PAGE: <AnnouncementForm type="update" />,
  DETAIL_ANNOUNCEMENT_PAGE: <AnnouncementDetail />,

  // JOB
  VIEW_JOB_PAGE: <Job />,
  CREATE_JOB_PAGE: <JobForm type={"create"} />,
  UPDATE_JOB_PAGE: <JobForm type={"update"} />,

  // Login Background
  VIEW_LOGIN_BACKGROUND_PAGE: <LoginBackgroundPage />,
  CREATE_LOGIN_BACKGROUND_PAGE: <LoginBackgroundForm type={"create"} />,
  UPDATE_LOGIN_BACKGROUND_PAGE: <LoginBackgroundForm type={"update"} />,
  DETAIL_LOGIN_BACKGROUND_PAGE: <LoginBackgroundDetail />,

  // Position
  VIEW_MASTER_POSITION_PAGE: <PositionPage />,
  CREATE_MASTER_POSITION_PAGE: <PositionForm type={"create"} />,
  UPDATE_MASTER_POSITION_PAGE: <PositionForm type={"update"} />,
  // VIEW_MASTER_POSITION : <PositionPage/>,

  // ASSETS
  VIEW_MASTER_ASSETS_PAGE: <ViewAssets />,
  CREATE_MASTER_ASSETS_PAGE: <FormAssets type={"create"} />,
  UPDATE_MASTER_ASSETS_PAGE: <FormAssets type={"update"} />,
  DETAIL_MASTER_ASSETS_PAGE: <DetailAssets />,
  UPLOAD_MASTER_ASSETS_PAGE: <ViewAssets />,

  // Maintenance Mode
  VIEW_MAINTENANCE_MODE: <MaintenanceModePage />,
};
