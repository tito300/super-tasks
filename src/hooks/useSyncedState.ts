import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { StorageData, storageService } from "@src/storage/storage.service";
import { capitalize } from "@mui/material";

// type SyncedState<T> = {
//   data: T;
//   updateData: (newData: Partial<T>) => void;
// };

export function useSyncedState<T extends {}, K extends any = {}>(
  resourceName: keyof StorageData,
  resourceSettings: K,
  defaultValues: T
) {
  const [data, setData] = useState<T>(() => ({ ...defaultValues }));
  const [dataSyncing, setDataSyncing] = useState(true);

  useEffect(() => {
    storageService.get(resourceName).then((storedData) => {
      if (!storedData) {
        storageService.set({ [resourceName]: defaultValues });
      }
      startTransition(() => {
        setData((prevData) => ({ ...prevData, ...storedData }));
        setDataSyncing(false);
      });
    });
    // defaultValues is not a dependency because it should not change
  }, [resourceName]);

  useEffect(() => {
    const removeListener = storageService.onChange(resourceName, (changes) => {
      function setSyncedState(existingValues: T, newValues: Partial<T>): T {
        const mergedValues = { ...existingValues };
        Object.keys(existingValues).forEach((key) => {
          // @ts-ignore
          if (resourceSettings[`sync${capitalize(key)}`]) {
            // @ts-ignore
            mergedValues[key] = newValues[key];
          }
        });

        return mergedValues;
      }

      if (changes?.[resourceName]) {
        startTransition(() => {
          setData((prevData) =>
            // @ts-ignore
            setSyncedState(prevData, changes[resourceName].newValue ?? {})
          );
        });
      }
    });

    return () => {
      removeListener();
    };
  }, [resourceName, resourceSettings]);

  const updateData = useCallback(
    (newData: Partial<T>) => {
      setData((prevData) => {
        let updatedData: Partial<T> | undefined;
        Object.keys(newData).forEach((key) => {
          // @ts-ignore
          if (resourceSettings[`sync${capitalize(key)}`]) {
            updatedData = {
              ...updatedData,
              // @ts-ignore
              [key]: newData[key],
            };
          }
        });
        if (updatedData) {
          storageService.set({ [resourceName]: updatedData });
        }
        return { ...prevData, ...newData };
      });
    },
    [resourceName, resourceSettings]
  );

  return useMemo(
    () => ({ data, updateData, dataSyncing }),
    [data, updateData, dataSyncing]
  );
}
