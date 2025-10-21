import { useEffect } from "react";
import { useState } from "react";

export const useDynamicTableInlineHooks = (value) => {
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (value !== "" || value !== null) {
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
  }, [value]);

  return isEditing;
};
