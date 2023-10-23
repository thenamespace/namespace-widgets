import axios from "axios"
import { ENV } from "../env";

// todo implement filtering based on names or owner address
export const getMintableListings = async (names = [], ownerAddress = "0x0") => {
    const url = `${ENV.backendAPI}/api/v1/listings/mintable-listings?count=500`
    return axios.get(url).then(res => res.data);
}