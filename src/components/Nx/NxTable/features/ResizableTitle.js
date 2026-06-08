// src/components/Nx/NxTable/features/ResizableTitle.js
import React from 'react';
import { MIN_COL_WIDTH_PX, RESIZE_RESET_MS } from '../constants';

// Resizable + draggable header cell.
// React.memo: AntD re-creates onHeaderCell on every column recompute.
// Without memo, every header cell re-renders on any column state change.
const ResizableTitle = React.memo((props) => {
  const { onResize, width, noResize, minWidth, ...restProps } = props;
  const isResizingRef = React.useRef(false);

  // Fix 2.3: timer stored in ref so useEffect cleanup can cancel it on unmount.
  const timerRef = React.useRef(null);
  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleClick = (e) => {
    if (isResizingRef.current) {
      e.stopPropagation();
      e.preventDefault();
      isResizingRef.current = false;
    } else if (restProps.onClick) {
      restProps.onClick(e);
    }
  };

  // Fix 1.1: No early return — both paths are inside a single return statement.
  // This removes the maintainer trap where a hook added after an early return
  // would silently violate Rules of Hooks.
  return width ? (
    <th
      {...restProps}
      onClick={handleClick}
      style={{ ...restProps.style, position: 'relative' }}
      draggable={restProps.draggable}
      onDragStart={restProps.onDragStart}
      onDragOver={restProps.onDragOver}
      onDrop={restProps.onDrop}
      onDragEnd={restProps.onDragEnd}
    >
      {restProps.children}
      {!noResize && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: '10px',
            cursor: 'col-resize',
            userSelect: 'none',
            zIndex: 1,
          }}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            isResizingRef.current = false;
            const startX = e.pageX;
            const startWidth = width;
            let hasMoved = false;

            const cleanup = () => {
              document.removeEventListener('mousemove', handleMouseMove);
              document.removeEventListener('mouseup', handleMouseUp);
              document.body.style.cursor = 'default';
              document.body.style.userSelect = 'auto';
              // Fix 2.3: clear the timer if it is still pending.
              if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
              }
            };

            const handleMouseMove = (moveEvt) => {
              hasMoved = true;
              const newWidth = startWidth + (moveEvt.pageX - startX);
              if (newWidth > (minWidth ?? MIN_COL_WIDTH_PX)) {
                onResize(newWidth);
              }
            };

            const handleMouseUp = () => {
              cleanup();
              if (hasMoved) {
                isResizingRef.current = true;
                // Fix 2.3: store timer in ref so unmount cleanup can cancel it.
                // Fix 1.2: _cleanup property on ref removed entirely — dead code.
                timerRef.current = setTimeout(() => {
                  isResizingRef.current = false;
                  timerRef.current = null;
                }, RESIZE_RESET_MS);
              }
            };

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.borderRight = '2px solid #1890ff';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderRight = 'none';
          }}
        />
      )}
    </th>
  ) : (
    // Fix 1.1: plain header cell — same return level, no early return needed.
    <th {...restProps} />
  );
});

export default ResizableTitle;
