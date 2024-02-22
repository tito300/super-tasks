import { Box } from '@mui/material';
import { TaskListManager } from '@src/components/TaskListManager/TaskListManager';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import axios from "axios";

const queryClient = new QueryClient();

axios.defaults.baseURL = import.meta.env.PROD
  ? "https://api.example.com"
  : "http://localhost:3444/api";

export default function Popup(): JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <Box sx={{ px: 2, py: 1, minHeight: 400 }}>
        <TaskListManager />
      </Box>
    </QueryClientProvider>
  );
}
