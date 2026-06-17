import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { InputNumber, Collapse, Button, message, Spin, Tag } from "antd";
import NxSelect from "../../../components/Nx/NxSelect";
import {
  InfoCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  AuditOutlined,
  SettingOutlined,
  AppstoreOutlined,
  BellOutlined,
} from "@ant-design/icons";
import "./Notifications.css";

import NxPanel from "../../../components/Nx/NxPanel";
import NxSwitch from "../../../components/Nx/NxSwitch";

import {
  useNotificationUserSettings,
  useUpdateNotificationUserSettings,
  useGlobalNotificationSettings,
} from "../../../hooks/notifications/useNotificationSettings";

const { Panel } = Collapse;

const iconMap = {
  InfoCircleOutlined: <InfoCircleOutlined />,
  CheckCircleOutlined: <CheckCircleOutlined />,
  ExclamationCircleOutlined: <ExclamationCircleOutlined />,
  CloseCircleOutlined: <CloseCircleOutlined />,
  AuditOutlined: <AuditOutlined />,
};

const displayTypeDescriptions = {
  standard: "Notification list in drawer/panel - Shows in notification drawer, persists until dismissed",
  toast: "Small popup at corner of screen - Auto-dismisses after 4-5 seconds, stacks (max 3)",
  popup: "Modal dialog overlay - Blocks UI until acknowledged",
  inline: "Embedded in page content - Shows within current view as Alert banner",
};

const NotificationSettings = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { data: settings, isLoading: settingsLoading, error: settingsError } = useNotificationUserSettings();
  const { data: globalSettings, isLoading: globalLoading } = useGlobalNotificationSettings();
  const updateMutation = useUpdateNotificationUserSettings();

  const isLoading = settingsLoading || globalLoading;

  const availableModules = globalSettings?.availableModules ?? [];
  const availableTypes = globalSettings?.availableTypes ?? [];
  const displayTypeOptions = globalSettings?.displayTypeOptions ?? ["standard", "toast", "popup", "inline"];

  const [localSettings, setLocalSettings] = useState({
    soundEnabled: true,
    desktopNotificationsEnabled: false,
    maxNotifications: 50,
    displayType: "standard",
    modulePreferences: {},
    typePreferences: {},
  });

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionClass, setTransitionClass] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const fromHistory = location.state?.from === "history";
    setTransitionClass(fromHistory ? "page-transition-enter-from-right" : "page-transition-enter-from-left");
  }, [location]);

  useEffect(() => {
    if (settings) {
      const defaultModulePrefs = {};
      availableModules.forEach(mod => {
        defaultModulePrefs[mod.moduleCode] = true;
      });

      const defaultTypePrefs = {};
      availableTypes.forEach(type => {
        defaultTypePrefs[type.typeCode] = true;
      });

      setLocalSettings({
        soundEnabled: settings.soundEnabled ?? true,
        desktopNotificationsEnabled: settings.desktopNotificationsEnabled ?? false,
        maxNotifications: settings.maxNotifications ?? 50,
        displayType: settings.displayType ?? "standard",
        modulePreferences: settings.modulePreferences && Object.keys(settings.modulePreferences).length > 0
          ? settings.modulePreferences
          : defaultModulePrefs,
        typePreferences: settings.typePreferences && Object.keys(settings.typePreferences).length > 0
          ? settings.typePreferences
          : defaultTypePrefs,
      });
      setHasChanges(false);
    }
  }, [settings, availableModules, availableTypes]);

  const handleSettingChange = (key, value) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleModulePreferenceChange = (moduleCode, enabled) => {
    setLocalSettings(prev => ({
      ...prev,
      modulePreferences: { ...prev.modulePreferences, [moduleCode]: enabled },
    }));
    setHasChanges(true);
  };

  const handleTypePreferenceChange = (typeCode, enabled) => {
    setLocalSettings(prev => {
      const currentPref = prev.typePreferences[typeCode];
      if (typeof currentPref === "object" && currentPref !== null) {
        return {
          ...prev,
          typePreferences: {
            ...prev.typePreferences,
            [typeCode]: { ...currentPref, enabled },
          },
        };
      }
      return {
        ...prev,
        typePreferences: { ...prev.typePreferences, [typeCode]: enabled },
      };
    });
    setHasChanges(true);
  };

  const handleTypeDisplayTypeChange = (typeCode, displayType) => {
    setLocalSettings(prev => {
      const currentPref = prev.typePreferences[typeCode];
      const newPref = typeof currentPref === "object" && currentPref !== null
        ? { ...currentPref, displayType }
        : { enabled: !!currentPref, displayType };
      return {
        ...prev,
        typePreferences: { ...prev.typePreferences, [typeCode]: newPref },
      };
    });
    setHasChanges(true);
  };

  const getTypeEnabledStatus = (typeCode) => {
    const pref = localSettings.typePreferences[typeCode];
    if (typeof pref === "object" && pref !== null) return pref.enabled ?? true;
    return pref ?? true;
  };

  const getTypeDisplayTypeValue = (typeCode) => {
    const pref = localSettings.typePreferences[typeCode];
    if (typeof pref === "object" && pref !== null) {
      return pref.displayType || localSettings.displayType || "standard";
    }
    return localSettings.displayType || "standard";
  };

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync(localSettings);
      message.success("Settings saved successfully");
      setHasChanges(false);
    } catch (error) {
      message.error(error?.message || "Failed to save settings");
    }
  };

  const handleResetToDefaults = () => {
    const defaultModulePrefs = {};
    availableModules.forEach(mod => {
      defaultModulePrefs[mod.moduleCode] = true;
    });

    const defaultTypePrefs = {};
    availableTypes.forEach(type => {
      defaultTypePrefs[type.typeCode] = true;
    });

    setLocalSettings({
      soundEnabled: globalSettings?.defaultSoundEnabled ?? true,
      desktopNotificationsEnabled: globalSettings?.defaultDesktopNotificationsEnabled ?? false,
      maxNotifications: globalSettings?.defaultMaxNotifications ?? 50,
      displayType: globalSettings?.defaultDisplayType ?? "standard",
      modulePreferences: defaultModulePrefs,
      typePreferences: defaultTypePrefs,
    });
    setHasChanges(true);
  };

  const handleBackClick = () => {
    setIsTransitioning(true);
    setTransitionClass("page-transition-exit-to-left");
    setTimeout(() => {
      navigate("/notifications/view", { state: { from: "settings" } });
    }, 310);
  };

  const renderIcon = (iconName, color) => {
    const IconComponent = iconMap[iconName];
    if (IconComponent) {
      return <span style={{ color, fontSize: "18px", marginRight: "8px" }}>{IconComponent}</span>;
    }
    return <BellOutlined style={{ color, fontSize: "18px", marginRight: "8px" }} />;
  };

  const isSaving = updateMutation.isPending;

  if (isLoading && !localSettings.displayType) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spin size="large" tip="Loading settings..." />
      </div>
    );
  }

  return (
    <>
      <div className={transitionClass}>
        <NxPanel title="Notification Settings" icon={<SettingOutlined />}>
          {settingsError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
              {settingsError?.message || "Failed to load settings"}
            </div>
          )}

          <div className="space-y-6">
            <div className="flex flex-row justify-between items-center py-2 border-b border-gray-100">
              <div>
                <div className="font-medium text-gray-800">Sound Notifications</div>
                <div className="text-sm text-gray-500">Play sound when new notifications arrive</div>
              </div>
              <NxSwitch
                size="lg"
                checked={localSettings.soundEnabled}
                onChange={(checked) => handleSettingChange("soundEnabled", checked)}
                disabled={isTransitioning || isSaving}
              />
            </div>

            <div className="flex flex-row justify-between items-center py-2 border-b border-gray-100">
              <div>
                <div className="font-medium text-gray-800">Desktop Notifications</div>
                <div className="text-sm text-gray-500">Show browser desktop notifications</div>
              </div>
              <NxSwitch
                size="lg"
                checked={localSettings.desktopNotificationsEnabled}
                onChange={(checked) => handleSettingChange("desktopNotificationsEnabled", checked)}
                disabled={isTransitioning || isSaving}
              />
            </div>

            <div className="flex flex-row justify-between items-center py-2 border-b border-gray-100">
              <div className="flex-1 mr-4">
                <div className="font-medium text-gray-800">Display Type</div>
                <div className="text-sm text-gray-500">
                  {displayTypeDescriptions[localSettings.displayType] || "Select how notifications appear"}
                </div>
              </div>
              <NxSelect
                value={localSettings.displayType}
                onChange={(value) => handleSettingChange("displayType", value)}
                disabled={isTransitioning || isSaving}
                style={{ width: 150 }}
                options={displayTypeOptions.map(type => ({
                  value: type,
                  label: type.charAt(0).toUpperCase() + type.slice(1),
                }))}
              />
            </div>

            <div className="flex flex-row justify-between items-center py-2">
              <div>
                <div className="font-medium text-gray-800">Max Notifications</div>
                <div className="text-sm text-gray-500">Maximum notifications to display (10-500)</div>
              </div>
              <InputNumber
                min={10}
                max={500}
                value={localSettings.maxNotifications}
                onChange={(value) => handleSettingChange("maxNotifications", value)}
                disabled={isTransitioning || isSaving}
                style={{ width: 100 }}
              />
            </div>
          </div>
        </NxPanel>

        <Collapse
          defaultActiveKey={["modules", "types"]}
          className="mt-4 bg-white rounded-lg shadow-sm"
          expandIconPosition="end"
        >
          <Panel
            header={
              <div className="flex items-center">
                <AppstoreOutlined className="mr-2 text-blue-500" />
                <span className="font-medium">Module Preferences</span>
                <Tag color="blue" className="ml-2">
                  {Object.values(localSettings.modulePreferences).filter(Boolean).length} / {availableModules.length} enabled
                </Tag>
              </div>
            }
            key="modules"
          >
            <div className="space-y-3">
              {availableModules.map((module) => (
                <div
                  key={module.moduleCode}
                  className="flex flex-row justify-between items-center py-2 px-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <div className="font-medium text-gray-800">{module.moduleName}</div>
                    {module.description && (
                      <div className="text-sm text-gray-500">{module.description}</div>
                    )}
                  </div>
                  <NxSwitch
                    size="md"
                    checked={localSettings.modulePreferences[module.moduleCode] ?? true}
                    onChange={(checked) => handleModulePreferenceChange(module.moduleCode, checked)}
                    disabled={isTransitioning || isSaving}
                  />
                </div>
              ))}
              {availableModules.length === 0 && (
                <div className="text-center text-gray-500 py-4">No modules available</div>
              )}
            </div>
          </Panel>

          <Panel
            header={
              <div className="flex items-center">
                <BellOutlined className="mr-2 text-purple-500" />
                <span className="font-medium">Notification Type Preferences</span>
                <Tag color="purple" className="ml-2">
                  {availableTypes.filter(type => getTypeEnabledStatus(type.typeCode)).length} / {availableTypes.length} enabled
                </Tag>
              </div>
            }
            key="types"
          >
            <div className="space-y-3">
              {availableTypes.map((type) => (
                <div
                  key={type.typeCode}
                  className="flex flex-col py-2 px-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <div className="flex flex-row justify-between items-center mb-2">
                    <div className="flex items-center flex-1">
                      {renderIcon(type.icon, type.color)}
                      <div>
                        <div className="font-medium text-gray-800">{type.typeName}</div>
                        {type.description && (
                          <div className="text-sm text-gray-500">{type.description}</div>
                        )}
                      </div>
                    </div>
                    <NxSwitch
                      size="md"
                      checked={getTypeEnabledStatus(type.typeCode)}
                      onChange={(checked) => handleTypePreferenceChange(type.typeCode, checked)}
                      disabled={isTransitioning || isSaving}
                    />
                  </div>

                  {getTypeEnabledStatus(type.typeCode) && (
                    <div className="flex flex-row justify-between items-center pl-7 pt-2 border-t border-gray-200">
                      <div className="text-sm text-gray-600">Display as:</div>
                      <NxSelect
                        value={getTypeDisplayTypeValue(type.typeCode)}
                        onChange={(value) => handleTypeDisplayTypeChange(type.typeCode, value)}
                        disabled={isTransitioning || isSaving}
                        style={{ width: 130 }}
                        options={displayTypeOptions.map(opt => ({
                          value: opt,
                          label: opt.charAt(0).toUpperCase() + opt.slice(1),
                        }))}
                      />
                    </div>
                  )}
                </div>
              ))}
              {availableTypes.length === 0 && (
                <div className="text-center text-gray-500 py-4">No notification types available</div>
              )}
            </div>
          </Panel>
        </Collapse>

        <div className="flex flex-row gap-3 mt-6 mb-5">
          <Button
            type="primary"
            onClick={handleSave}
            loading={isSaving}
            disabled={isTransitioning || !hasChanges}
            className="min-w-[120px]"
            style={{
              backgroundColor: hasChanges ? "#0075bf" : undefined,
              borderColor: hasChanges ? "#0075bf" : undefined,
            }}
          >
            Save Settings
          </Button>

          <Button
            onClick={handleResetToDefaults}
            disabled={isTransitioning || isSaving}
          >
            Reset to Defaults
          </Button>

          <Button
            onClick={handleBackClick}
            disabled={isTransitioning || isSaving}
          >
            Back
          </Button>

          {hasChanges && (
            <span className="text-sm text-amber-600 flex items-center ml-2">
              <ExclamationCircleOutlined className="mr-1" />
              Unsaved changes
            </span>
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationSettings;
