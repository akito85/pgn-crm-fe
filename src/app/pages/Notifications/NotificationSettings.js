import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router"

import LayoutMenu from "../../../components/SidebarMenu/LayoutMenu"
import NxPanel from "../../../components/Nx/NxPanel"
import NxSwitch from "../../../components/Nx/NxSwitch"

const NotificationSettings = () => {
  const [isOn, setIsOn] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionClass, setTransitionClass] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  // Page enter animation
  useEffect(() => {
    // Determine entry direction based on navigation state
    const fromHistory = location.state?.from === 'history';
    setTransitionClass(fromHistory ? 'page-transition-enter-from-left' : 'page-transition-enter-from-right');
  }, [location]);

  const handleBackClick = () => {
    setIsTransitioning(true);
    setTransitionClass('page-transition-exit-to-left');

    setTimeout(() => {
      navigate("/notifications/view", { state: { from: 'settings' } });
    }, 200);
  };

  return(
    <LayoutMenu>
      <div className={transitionClass}>
        <NxPanel
          title="Notification Settings"
        >
          <div className="w-full flex flex-row justify-between items-center">
            <div>Approval Confirmation</div>
            <NxSwitch
              size="lg"
              checked={isOn}
              onChange={setIsOn}
              disabled={isTransitioning}
            />
          </div>
        </NxPanel>

        <button
          onClick={handleBackClick}
          disabled={isTransitioning}
          className={`w-[146px] mb-5 px-4 py-2 rounded-md text-[15px] leading-[22px] transition-all bg-[#0075bf] text-white font-semibold shadow-none border-none ${isTransitioning ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          style={{ boxShadow: 'none', outline: 'none' }}
        >
          Back
        </button>
      </div>
    </LayoutMenu>
  )
}

export default NotificationSettings
