import { Box } from "@mui/material";
import { useMessageEngine } from "@src/components/Providers/MessageEngineProvider";
import { TabsManager } from "@src/components/TabsManager";
import { TaskListManager } from "@src/components/Task/TaskListManager/TaskListManager";
import { urls } from "@src/config/urls";
import axios from "axios";
import { useEffect } from "react";
import { CalendarApp } from "../../components/Calendar/CalendarApp";
import { TasksApp } from "../../components/Task/TasksApp";
import { useGlobalState } from "@src/components/Providers/globalStateProvider";

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
        }}
      />
    </Box>
  );
}
