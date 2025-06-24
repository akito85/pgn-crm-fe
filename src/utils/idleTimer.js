import React, { useEffect, useRef, useState } from "react";
import { IdleTimerProvider } from "react-idle-timer";


const IdleTimerContainer = (props) => {
    const idleTimerRef = useRef(null);
    const config = localStorage.getItem('config') || window.sessionStorage.getItem('config');
    const configParsed = parseInt(JSON.parse(config)?.filter(item => (item?.name === 'IDLE_TIME'))[0]?.vale)
    const [timeoutDuration, setTimeoutDuration] = useState(1000 * 60 * configParsed);

    // disable reload window
    useEffect(() => {
        const handleBeforeUnload = (event) => {
            event.preventDefault();
            event.returnValue = '';
        };
        const handleKeyDown = (event) => {
            if (
                (event.ctrlKey && event.key === 'r' && !event.shiftKey) ||
                (event.ctrlKey && event.shiftKey && event.key === 'R') ||
                (event.metaKey && event.key === 'r' && !event.shiftKey) ||
                (event.metaKey && event.shiftKey && event.key === 'R') ||
                (event?.key === 'F5') ||
                event.key === 'Enter'
            ) {
                event.preventDefault();
            }
        };

        if (props?.timeout) {
            window.addEventListener('beforeunload', handleBeforeUnload);
            window.addEventListener('keydown', handleKeyDown);

        }
    }, [props]);


    const onIdleHandler = () => {
        if (props.timeout) {
            props.handleLogout();
        } else {
            props.timeoutModal();
            idleTimerRef.current?.reset();
            props.timedoutHandler(true);
        }
    };

    const onActiveHandler = () => {
        props.timedoutHandler(false);
    };

    return (
        <IdleTimerProvider
            ref={idleTimerRef}
            timeout={timeoutDuration}
            onIdle={onIdleHandler}
            onActive={onActiveHandler}
        // onAction={onActionHandler}
        />
    );
};

export default IdleTimerContainer;
