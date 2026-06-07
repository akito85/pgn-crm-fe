import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Select, InputNumber, Button, Spin, message, Tag } from "antd";
import { SettingOutlined, ArrowLeftOutlined } from "@ant-design/icons";

import BreadCrumb from "../../../../components/BreadCrumb";
import NxCardContainer from "../../../../components/Nx/NxCardContainer";
import NxBaseContainer from "../../../../components/Nx/NxBaseContainer";
import NxSwitch from "../../../../components/Nx/NxSwitch";
import notificationApi from "../../../../services/notificationApi";
import {
  fetchGlobalSettings,
  selectGlobalSettings,
  selectSettingsLoading,
} from "../../../../redux/slices/notifications";

/**
 * Admin editor for the system-wide notification defaults
 * (M_NOTIFICATION_GLOBAL_SETTINGS). Group-access gated — not whitelisted.
 * Reads via the notifications slice, writes through the global-settings endpoint.
 */
const GlobalNotificationSettings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const globalSettings = useSelector(selectGlobalSettings);
  const isLoading = useSelector(selectSettingsLoading);

  const [local, setLocal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    dispatch(fetchGlobalSettings());
  }, [dispatch]);

  useEffect(() => {
    if (globalSettings) {
      setLocal({
        defaultDisplayType: globalSettings.defaultDisplayType ?? "standard",
        defaultMaxNotifications: globalSettings.defaultMaxNotifications ?? 50,
        defaultSoundEnabled: globalSettings.defaultSoundEnabled ?? true,
        defaultDesktopNotificationsEnabled:
          globalSettings.defaultDesktopNotificationsEnabled ?? true,
      });
      setHasChanges(false);
    }
  }, [globalSettings]);

  const change = (key, value) => {
    setLocal((p) => ({ ...p, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await notificationApi.updateGlobalSettings(local);
      message.success("Global settings saved");
      setHasChanges(false);
      dispatch(fetchGlobalSettings());
    } catch (e) {
      message.error(e?.message || "Failed to save global settings");
    } finally {
      setSaving(false);
    }
  };

  const displayTypeOptions = globalSettings?.displayTypeOptions || [
    "standard",
    "toast",
    "popup",
    "inline",
  ];

  if (isLoading && !local) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spin size="large" tip="Loading global settings..." />
      </div>
    );
  }

  if (!local) return null;

  return (
    <>
      <BreadCrumb
        routes={[
          { breadcrumbName: "Notifications" },
          { breadcrumbName: "Global Settings" },
        ]}
      />
      <NxCardContainer header="GLOBAL NOTIFICATION SETTINGS">
      <NxBaseContainer header="System Defaults" bodyClassName="pt-3">
        <div className="w-full space-y-6">
          <div className="flex items-center text-gray-500 text-sm">
            <SettingOutlined className="mr-2" />
            System-wide defaults applied when a user has no personal preference.
          </div>

          <div className="flex flex-row justify-between items-center py-2 border-b border-gray-100">
            <div>
              <div className="font-medium text-gray-800">Default Sound</div>
              <div className="text-sm text-gray-500">Play sound on new notifications by default</div>
            </div>
            <NxSwitch
              size="lg"
              checked={local.defaultSoundEnabled}
              onChange={(checked) => change("defaultSoundEnabled", checked)}
              disabled={saving}
            />
          </div>

          <div className="flex flex-row justify-between items-center py-2 border-b border-gray-100">
            <div>
              <div className="font-medium text-gray-800">Default Desktop Notifications</div>
              <div className="text-sm text-gray-500">Show browser desktop notifications by default</div>
            </div>
            <NxSwitch
              size="lg"
              checked={local.defaultDesktopNotificationsEnabled}
              onChange={(checked) => change("defaultDesktopNotificationsEnabled", checked)}
              disabled={saving}
            />
          </div>

          <div className="flex flex-row justify-between items-center py-2 border-b border-gray-100">
            <div className="flex-1 mr-4">
              <div className="font-medium text-gray-800">Default Display Type</div>
              <div className="text-sm text-gray-500">Default presentation for notifications</div>
            </div>
            <Select
              value={local.defaultDisplayType}
              onChange={(v) => change("defaultDisplayType", v)}
              disabled={saving}
              style={{ width: 160 }}
              options={displayTypeOptions.map((t) => ({
                value: t,
                label: t.charAt(0).toUpperCase() + t.slice(1),
              }))}
            />
          </div>

          <div className="flex flex-row justify-between items-center py-2">
            <div>
              <div className="font-medium text-gray-800">Default Max Notifications</div>
              <div className="text-sm text-gray-500">Default cap on retained notifications (10-500)</div>
            </div>
            <InputNumber
              min={10}
              max={500}
              value={local.defaultMaxNotifications}
              onChange={(v) => change("defaultMaxNotifications", v)}
              disabled={saving}
              style={{ width: 100 }}
            />
          </div>
        </div>
      </NxBaseContainer>

      <div className="flex items-center justify-between mt-6">
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
          Back
        </Button>
        <div className="flex items-center gap-3">
          {hasChanges && <Tag color="warning" className="self-center">Unsaved changes</Tag>}
          <Button
            type="primary"
            loading={saving}
            disabled={!hasChanges}
            onClick={handleSave}
            style={{
              backgroundColor: hasChanges ? "#0075bf" : undefined,
              borderColor: hasChanges ? "#0075bf" : undefined,
            }}
          >
            Save Global Settings
          </Button>
        </div>
      </div>
      </NxCardContainer>
    </>
  );
};

export default GlobalNotificationSettings;
