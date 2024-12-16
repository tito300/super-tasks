import { Box } from "@mui/material";
import { TabsManager } from "@src/components/TabsManager";
import { urls } from "@src/config/urls";
import axios from "axios";
import { useEffect } from "react";
import { CalendarApp } from "../../components/Calendar/CalendarApp";
import { TasksApp } from "../../components/Task/TasksApp";
import { useGlobalState } from "@src/components/Providers/globalStateProvider";
import { AppPickerTab } from "@src/components/Oauth/AppPickerTab";
import { ChatGpt } from "@src/components/chatGpt/ChatGpt";

axios.defaults.baseURL = urls.BASE_URL;

export default function Popup({}): JSX.Element {
  const { open, toggleOpen } = useGlobalState();

  useEffect(() => {
    if (!open) {
      toggleOpen();
    }
  }, [open]);

  return (
    <Box sx={{ minHeight: 400 }}>
      <TabsManager
        tabs={{
          tasks: <TasksApp />,
          calendar: <CalendarApp />,
          chatGpt: <ChatGpt />,
          add: <AppPickerTab />,
        }}
      />
    </Box>
  );
}
