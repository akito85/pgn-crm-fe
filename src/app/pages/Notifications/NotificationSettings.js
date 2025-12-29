import { useState } from "react"
import { useNavigate } from "react-router"

import LayoutMenu from "../../../components/SidebarMenu/LayoutMenu"
import NxPanel from "../../../components/Nx/NxPanel"
import NxSwitch from "../../../components/Nx/NxSwitch"

const NotificationSettings = () => {
  const [isOn, setIsOn] = useState(false);

  const navigate = useNavigate()

  return(
    <LayoutMenu>
      <NxPanel
        title="Notification Settings"
      >
        <div className="w-full flex flex-row justify-between items-center">
          <div>Approval Confirmation</div>
          <NxSwitch 
            size="lg"
            checked={isOn}
            onChange={setIsOn}
          />
        </div>
      </NxPanel>

      <button
        onClick={() => {
            navigate("/notifications/view");
        }}
        className={`w-[146px] mb-5 px-4 py-2 rounded-md text-[15px] leading-[22px] transition-all bg-[#0075bf] text-white font-semibold shadow-none border-none`}
        style={{ boxShadow: 'none', outline: 'none' }}
      >
        Back
      </button>
    </LayoutMenu> 
  )
}

export default NotificationSettings
