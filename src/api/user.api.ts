import { useServices } from "@src/components/Providers/ServicesProvider";
import {
  UserSettings,
  userSettingsDefaults,
} from "@src/config/userSettingsDefaults";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useUserSettings() {
  const { user: userService } = useServices();

  return useQuery({
    queryKey: ["userSettings"],
    queryFn: async () => {
      const userSettings = await userService.getUserSettings();

      return userSettings;
    },
    initialData: userSettingsDefaults,
  });
}

export function useUpdateUserSettings() {
  const { user: userService } = useServices();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: UserSettings) => {
      return userService.updateUserSettings(settings);
    },
    onMutate: async (newSettings: UserSettings) => {
      await queryClient.cancelQueries({ queryKey: ["userSettings"] });
      const previousSettings = queryClient.getQueryData(["userSettings"]);
      queryClient.setQueryData(["userSettings"], newSettings);
      return { previousSettings };
    },
    /**
     * ⚠️ failures in userSettings should not cause disruption to user flow so we ignore them
     */
    // onError: (err, newSettings, context) => {
    //   queryClient.setQueryData(["userSettings"], context?.previousSettings);
    // },
    // onSuccess: () => {
    //   queryClient.invalidateQueries({ queryKey: ["userSettings"] });
    // },
    // mutationKey: ["userSettings"],
  });
}
