import { useState, useEffect, useRef, useCallback } from "react";

const useCenteredTree = (selectedNode) => {
    const [dimensions, setDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });
    const [translate, setTranslate] = useState({ x: 0, y: 0 });
    const containerUseRef = useRef(null);
    const containerRef = useCallback((containerElem) => {
        if (containerElem !== null) {
            const { width, height } = containerElem.getBoundingClientRect();
            setDimensions({ width, height });
            setTranslate({ x: width / 2, y: height / 2 });
        }
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        if (containerUseRef.current) {
            const containerRect = containerUseRef.current.getBoundingClientRect();
            let x, y;

            if (selectedNode) {
                const selectedNodeElement = containerUseRef.current.querySelector(`[data-id="${selectedNode}"]`);
                if (selectedNodeElement) {
                    const selectedNodeRect = selectedNodeElement.getBoundingClientRect();
                    x = containerRect.width / 2 - (selectedNodeRect.left - containerRect.left + selectedNodeRect.width / 2) / 2;
                    y = containerRect.height / 2 - (selectedNodeRect.top - containerRect.top + selectedNodeRect.height / 2) / 2;
                }
            } else {
                x = dimensions.width / 2 - 150;
                y = dimensions.height / 120;
            }

            setTranslate({ x, y });
        }
    }, [selectedNode, dimensions]);

    return [dimensions, translate, containerRef, containerUseRef];
};

export default useCenteredTree;
