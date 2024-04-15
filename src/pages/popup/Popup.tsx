import { Box } from "@mui/material";
import { useMessageEngine } from "@src/components/Providers/MessageEngineProvider";
import { TaskListManager } from "@src/components/TaskListManager/TaskListManager";
import { urls } from "@src/config/urls";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";

axios.defaults.baseURL = urls.BASE_URL;

export default function Popup({}): JSX.Element {
  const messageEngine = useMessageEngine();

  return (
      <Box sx={{ px: 1, py: 1, minHeight: 400 }}>
        <TaskListManager />
      </Box>
  );
}
