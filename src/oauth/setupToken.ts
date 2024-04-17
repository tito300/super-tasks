import { commonHeaders } from "@src/services/fetcher";
import axios from "axios";

export const setupToken = async (token?: string | null) => {
  commonHeaders["Content-Oauth"] = token;
  axios.defaults.headers.common["Content-Oauth"] = token;
};
