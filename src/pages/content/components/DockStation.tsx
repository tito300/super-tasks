import { DockStationContainer } from "./DockStationContainer";
import { OauthRequired } from "@src/components/Oauth/OauthGate";
import { TasksApp } from "../../../components/Task/TasksApp";
import { CalendarApp } from "../../../components/Calendar/CalendarApp";
import { TabsManager } from "@src/components/TabsManager";
import { useScriptType } from "@src/components/Providers/ScriptTypeProvider";
import { useEffect } from "react";
import { Box } from "@mui/material";
import { useLogRender } from "@src/hooks/useLogRender";

export function DockStation() {
  useLogRender("DockStation");

  return (
    <DockStationContainer>
      <OauthRequired style={{ width: 385 }}>
        <Box sx={{ width: 385 }}>
          <TabsManager
            flexGrow={1}
            tabs={{
              tasks: <TasksApp />,
              calendar: <CalendarApp />,
            }}
          />
        </Box>
      </OauthRequired>
    </DockStationContainer>
  );
}
