import { formatEther } from "viem";

export const getListingPrice = (listing, label) => {
    const { prices } = listing;
    if (prices.length > 0) {
        for (const price of prices) {
            if (price.letters === label.length) {
                return parsePrice(price.price);
            }
        }
    }
    return parsePrice(listing.basePrice);
}

// wei string to eth string
export const parsePrice = (value) => {
    const _weiValue = BigInt(value);
    return {
        ETH: formatEther(_weiValue, "wei"),
        WEI: _weiValue
    }
}