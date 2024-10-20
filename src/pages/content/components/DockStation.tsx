import { DockStationContainer } from "./DockStationContainer";
import { OauthRequired } from "@src/components/Oauth/OauthGate";
import { TasksApp } from "../../../components/Task/TasksApp";
import { CalendarApp } from "../../../components/Calendar/CalendarApp";
import { TabsManager } from "@src/components/TabsManager";
import { Box } from "@mui/material";
import { useLogRender } from "@src/hooks/useLogRender";
import { ChatGpt } from "@src/components/chatGpt/ChatGpt";
// import AppOauthPicker from "@src/components/Oauth/AppOauthPicker";

export function DockStation() {
  useLogRender("DockStation");

  return (
    <DockStationContainer>
      <OauthRequired style={{ width: 450 }}>
        <Box sx={{ width: 450 }}>
          <TabsManager
            flexGrow={1}
            tabs={{
              tasks: <TasksApp />,
              calendar: <CalendarApp />,
              chatGpt: <ChatGpt />,
              add: null,
            }}
          />
        </Box>
      </OauthRequired>
    </DockStationContainer>
  );
}
