import { useState, useEffect } from "react";

function getStorageValue(key: string, defaultValue: any) {
  const saved = localStorage.getItem(key);
  if (saved != null) return JSON.parse(saved);
  return defaultValue;
}

export const useLocalStorage = (key: string, defaultValue: any) => {
  const [value, setValue] = useState(() => {
    return getStorageValue(key, defaultValue);
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};