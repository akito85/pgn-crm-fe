import React, { useState, useMemo, useCallback } from 'react';
import { Button, Dropdown, Checkbox, Radio, Divider } from 'antd';
import { SettingOutlined, PushpinOutlined } from '@ant-design/icons';

const FixableTable = ({
  columns,
  defaultFixed = {},
  children,
  showButton = true,
  buttonText = 'Fix Columns',
  buttonPlacement = 'outside', // 'outside' atau 'inside'
}) => {
  // State hanya di memory - tidak pakai localStorage
  const [fixedColumns, setFixedColumns] = useState(defaultFixed);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  // Handler toggle fix column
  const handleColumnFixChange = useCallback(
    (columnKey, checked) => {
      if (checked) {
        const columnIndex = columns.findIndex((col) => col.key === columnKey);
        const isLastColumn = columnIndex === columns.length - 1;

        let defaultPosition = 'left';
        if (isLastColumn) {
          defaultPosition = 'right';
        }

        setFixedColumns((prev) => ({ ...prev, [columnKey]: defaultPosition }));
      } else {
        setFixedColumns((prev) => {
          const newFixed = { ...prev };
          delete newFixed[columnKey];
          return newFixed;
        });
      }
    },
    [columns]
  );

  // Handler change position
  const handleColumnPositionChange = useCallback((columnKey, position) => {
    setFixedColumns((prev) => ({ ...prev, [columnKey]: position }));
  }, []);

  // Handler clear all
  const handleClearAll = useCallback(() => {
    setFixedColumns({});
  }, []);

  // Helper functions
  const canFixLeft = useCallback(
    (columnIndex) => columnIndex !== columns.length - 1,
    [columns.length]
  );

  const canFixRight = useCallback((columnIndex) => columnIndex !== 0, []);

  // Compute columns dengan fixed
  const columnsWithFixed = useMemo(() => {
    const leftFixed = [];
    const rightFixed = [];
    const normal = [];

    columns.forEach((col) => {
      const fixedPos = fixedColumns[col.key];
      const colWithFixed = { ...col, fixed: fixedPos || undefined };

      if (fixedPos === 'left') {
        leftFixed.push(colWithFixed);
      } else if (fixedPos === 'right') {
        rightFixed.push(colWithFixed);
      } else {
        normal.push(colWithFixed);
      }
    });

    return [...leftFixed, ...normal, ...rightFixed];
  }, [columns, fixedColumns]);

  // Menu component
  const fixColumnMenu = (
    <div
      style={{
        padding: '12px',
        minWidth: '320px',
        maxHeight: '500px',
        overflowY: 'auto',
        border: '1px solid #ddd',
        borderRadius: '6px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        backgroundColor: '#fff',
      }}
    >
      <div
        style={{
          marginBottom: '12px',
          fontWeight: '600',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: '#262626',
        }}
      >
        <PushpinOutlined />
        Fix Columns Position
      </div>
      <Divider style={{ margin: '8px 0' }} />

      {columns.map((col, index) => {
        const isFixed = !!fixedColumns[col.key];
        const position = fixedColumns[col.key] || 'left';
        const isFirstColumn = index === 0;
        const isLastColumn = index === columns.length - 1;

        return (
          <div
            key={col.key}
            style={{
              marginBottom: '16px',
              padding: '12px',
              backgroundColor: isFixed ? '#f0f5ff' : '#fafafa',
              borderRadius: '6px',
              border: isFixed ? '1px solid #d6e4ff' : '1px solid #f0f0f0',
              transition: 'all 0.3s',
            }}
          >
            <div style={{ marginBottom: isFixed ? '8px' : '0' }}>
              <Checkbox
                checked={isFixed}
                onChange={(e) => handleColumnFixChange(col.key, e.target.checked)}
                style={{ fontWeight: '500' }}
              >
                {col.title}
              </Checkbox>
            </div>

            {isFixed && (
              <div style={{ marginLeft: '24px', marginTop: '8px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '4px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '12px',
                      color: '#595959',
                      fontWeight: '500',
                    }}
                  >
                    Position:
                  </span>
                  <Radio.Group
                    value={position}
                    onChange={(e) =>
                      handleColumnPositionChange(col.key, e.target.value)
                    }
                    size="small"
                    buttonStyle="solid"
                    style={{ display: 'flex', gap: '6px' }}
                  >
                    <Radio.Button value="left" disabled={!canFixLeft(index)}>
                      Left
                    </Radio.Button>
                    <Radio.Button value="right" disabled={!canFixRight(index)}>
                      Right
                    </Radio.Button>
                  </Radio.Group>
                </div>
                {(isFirstColumn || isLastColumn) && (
                  <div
                    style={{
                      fontSize: '11px',
                      color: '#8c8c8c',
                      marginTop: '4px',
                      fontStyle: 'italic',
                    }}
                  >
                    {isFirstColumn && '* First column can only be fixed left'}
                    {isLastColumn && '* Last column can only be fixed right'}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      <Divider style={{ margin: '12px 0' }} />

      <div
        style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}
      >
        <Button size="small" onClick={handleClearAll} style={{ flex: 1 }}>
          Clear All
        </Button>
        <Button
          size="small"
          type="primary"
          onClick={() => setDropdownVisible(false)}
          style={{ flex: 1 }}
        >
          Done
        </Button>
      </div>
    </div>
  );

  const fixedCount = Object.keys(fixedColumns).length;

  const buttonElement = showButton && (
    <Dropdown
      menu={fixColumnMenu}
      trigger={['click']}
      visible={dropdownVisible}
      onVisibleChange={setDropdownVisible}
      placement="bottomRight"
    >
      <Button icon={<SettingOutlined />}>
        {buttonText} ({fixedCount})
      </Button>
    </Dropdown>
  );

  // Jika button di outside, return button + children
  if (buttonPlacement === 'outside') {
    return (
      <>
        {buttonElement}
        {children(columnsWithFixed, { fixedColumns, fixedCount, buttonElement })}
      </>
    );
  }

  // Jika button di inside, hanya return children (button dihandle di children)
  return children(columnsWithFixed, { fixedColumns, fixedCount, buttonElement });
};

export default FixableTable;