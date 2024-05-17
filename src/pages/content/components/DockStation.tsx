import { DockStationContainer } from "./DockStationContainer";
import { OauthRequired } from "@src/components/Oauth/OauthGate";
import { TasksApp } from "../../../components/Task/TasksApp";
import { CalendarApp } from "../../../components/Calendar/CalendarApp";
import { TabsManager } from "@src/components/TabsManager";
import { useScriptType } from "@src/components/Providers/ScriptTypeProvider";
import { useEffect } from "react";
import { Box } from "@mui/material";

export function DockStation() {
  useEffect(() => {
    console.log("mounted DockStation");
  }, []);

  return (
    <DockStationContainer>
      <OauthRequired>
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
