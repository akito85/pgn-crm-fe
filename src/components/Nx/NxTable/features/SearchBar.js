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
    // Emptying the field (incl. the allowClear "×" button, which antd v4 fires
    // through onChange — there is no onClear prop on v4 Input) notifies
    // immediately instead of waiting out the debounce window.
    if (val === '') {
      debouncedNotify.cancel();
      onSearchRef.current?.('');
    } else {
      debouncedNotify(val);
    }
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
      />
    </div>
  );
});

export default SearchBar;
