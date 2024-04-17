import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
  capitalize,
} from "@mui/material";
import { constants } from "@src/config/constants";

export function OauthScreen({ onLoginCLick }: { onLoginCLick: () => void }) {
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
        <Typography variant="h5" component="div">
          Google Authorization
        </Typography>
        <Typography variant="body2">
          In order to use {capitalize(constants.EXTENSION_NAME)} browser
          extension, you need to give authorize your account with Google.
        </Typography>
      </CardContent>
      <CardActions>
        <Button onClick={onLoginCLick} size="small">
          Authorize
        </Button>
      </CardActions>
    </Card>
  );
}
