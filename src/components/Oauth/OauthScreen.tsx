import { Warning } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
  capitalize,
} from "@mui/material";
import { constants } from "@src/config/constants";

export function OauthScreen({
  onLoginCLick,
  missingRequiredScopes,
}: {
  onLoginCLick: () => void;
  missingRequiredScopes: boolean;
}) {
  return (
    <Card variant="outlined" sx={{ pb: 1 }}>
      <CardContent>
        <Typography
          sx={{ fontSize: 14 }}
          textTransform="capitalize"
          color="text.secondary"
          gutterBottom
        >
          {constants.EXTENSION_NAME}
        </Typography>
        <Typography
          variant="h5"
          component="div"
          display={"flex"}
          alignItems={"center"}
        >
          {missingRequiredScopes && (
            <Warning fontSize="medium" color="warning" sx={{ mr: 0.5 }} />
          )}{" "}
          Google Authorization
        </Typography>
        {missingRequiredScopes ? (
          <Typography variant="body2">
            You did not provide the required permissions to use{" "}
            {capitalize(constants.EXTENSION_NAME)}. Please try again and make
            sure to check all the required boxes.
          </Typography>
        ) : (
          <Typography variant="body2">
            In order to use {capitalize(constants.EXTENSION_NAME)} browser
            extension, you need to give authorize your account with Google.
          </Typography>
        )}
      </CardContent>
      <CardActions>
        <Button onClick={onLoginCLick} size="small">
          Authorize
        </Button>
      </CardActions>
    </Card>
  );
}
