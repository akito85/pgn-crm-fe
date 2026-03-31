// src/components/Nx/NxTable/features/SearchBar.js
import React, { useCallback } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import { debounce } from 'lodash';
import { SEARCH_DEBOUNCE_MS, BORDER_COL, FONT_FAMILY } from '../constants';

const SearchBar = React.memo(({ placeholder = 'Search content here ....', onSearch }) => {
  const [localValue, setLocalValue] = React.useState('');
  const inputRef = React.useRef(null);
  const onSearchRef = React.useRef(onSearch);
  React.useEffect(() => { onSearchRef.current = onSearch; }, [onSearch]);

  const debouncedNotify = React.useMemo(
    () => debounce((val) => { onSearchRef.current?.(val); }, SEARCH_DEBOUNCE_MS),
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );
  React.useEffect(() => () => debouncedNotify.cancel(), [debouncedNotify]);

  const handleChange = useCallback((e) => {
    const val = e.target.value;
    setLocalValue(val);
    debouncedNotify(val);
  }, [debouncedNotify]);

  const handleClear = useCallback(() => {
    setLocalValue('');
    debouncedNotify.cancel();
    onSearchRef.current?.('');
  }, [debouncedNotify]);

  return (
    <div style={{ position: 'relative' }}>
      <SearchOutlined
        style={{
          position: 'absolute',
          left: '8px',
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: '14px',
          color: '#9CA3AF',
          zIndex: 30,
        }}
      />
      <Input
        ref={inputRef}
        placeholder={placeholder}
        value={localValue}
        style={{
          height: '32px',
          paddingLeft: '28px',
          border: `1px solid ${BORDER_COL}`,
          borderRadius: '8px',
          fontSize: '12px',
          fontFamily: FONT_FAMILY,
        }}
        onChange={handleChange}
        allowClear
        onClear={handleClear}
      />
    </div>
  );
});

export default SearchBar;
