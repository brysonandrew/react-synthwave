import { useEffect, useMemo, useState } from "react";

type Serializer<T> = (object: T | undefined) => string;
type Parser<T> = (val: string) => T | undefined;
export type TSetter<T> = React.Dispatch<
  React.SetStateAction<T | undefined>
>;

type TRewindHandler = () => void;

type Options<T> = Partial<{
  serializer: Serializer<T>;
  parser: Parser<T>;
  logger: (error: any) => void;
  syncData: boolean;
}>;

export function useLocalStorage<T>(
  key: string,
  defaultValue: T,
  options?: Options<T>
): [T, TSetter<T>, TRewindHandler];
export function useLocalStorage<T>(
  key: string,
  defaultValue?: T,
  options?: Options<T>
) {
  const opts = useMemo(
    () => ({
      serializer: JSON.stringify,
      parser: JSON.parse,
      logger: console.log,
      syncData: true,
      ...options,
    }),
    [options]
  );

  const { serializer, parser, logger, syncData } = opts;

  const [storedValue, setValue] = useState(() => {
    if (typeof window === "undefined") return defaultValue;

    try {
      const item = window.localStorage.getItem(key);
      const res: T = item ? parser(item) : defaultValue;
      return res;
    } catch (e) {
      logger(e);
      return defaultValue;
    }
  });

  // const handleBackup = (value: Record<string, any>) => {
  //   const date = new Date(Date.now()).toISOString();
  //   const configStr =
  //     window.localStorage.getItem(BACKUP_KEY);
  //   const config = JSON.parse(configStr ?? "{}");
  //   console.log(config);
  //   const items = [...config.items, { key, date, value }];
  //   const next = {
  //     ...config,
  //     items,
  //     activeIndex: items.length - 1,
  //   };
  //   window.localStorage.setItem(
  //     BACKUP_KEY,
  //     JSON.stringify(next)
  //   );
  // };

  // const handleRewind = () => {
  //   const configStr =
  //     window.localStorage.getItem(BACKUP_KEY);
  //   const config = JSON.parse(configStr ?? "{}");
  //   console.log(config);
  //   if (!config) return;
  //   const { items, activeIndex } = config;

  //   if (!items || items.length === 0) return;
  //   const prevIndex = activeIndex - 1;
  //   const next = items[prevIndex];
  //   if (!next) return;
  //   setValue(next);
  //   window.localStorage.setItem(
  //     BACKUP_KEY,
  //     JSON.stringify({ ...config, activeIndex: prevIndex })
  //   );
  // };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateLocalStorage = () => {
      if (storedValue !== undefined) {
        window.localStorage.setItem(
          key,
          serializer(storedValue)
        );
      } else {
        window.localStorage.removeItem(key);
      }
    };

    try {
      updateLocalStorage();
    } catch (e) {
      logger(e);
    }
  }, [storedValue]);

  useEffect(() => {
    if (!syncData) return;

    const handleStorageChange = (e: StorageEvent) => {
      if (
        e.key !== key ||
        e.storageArea !== window.localStorage
      )
        return;

      try {
        const next = e.newValue
          ? parser(e.newValue)
          : undefined;

        setValue(next);
      } catch (e) {
        logger(e);
      }
    };

    if (typeof window === "undefined") return;

    window.addEventListener("storage", handleStorageChange);
    return () =>
      window.removeEventListener(
        "storage",
        handleStorageChange
      );
  }, [key, syncData]);

  return [storedValue, setValue];
}
