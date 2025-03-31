import axios from "axios";
import {properties} from "../../properties.ts";

export const doLogout = async (values: unknown) => {
    const response = await axios.post(
        properties.login.baseUrl + properties.login.logoutUrl,
        {values}
    );

    if (response && response.data) {
        return response.data;
    }

    throw Error("Invalid response for logout");
}