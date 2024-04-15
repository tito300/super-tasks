import { commonHeaders } from "@src/services/fetcher";
import axios from "axios";

export const setupToken = async () => {
    const tokenRes = await chrome.identity.getAuthToken({ interactive: false });
    if (tokenRes.token) {
        commonHeaders["Content-Oauth"] = tokenRes.token;
        axios.defaults.headers.common["Content-Oauth"] = tokenRes.token;
    }
    return tokenRes.token;
}

