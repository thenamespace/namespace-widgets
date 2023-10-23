import { Row, Input, Typography } from "antd"
import { useEffect, useState } from "react"
import { getMintableListings } from "../api/get-mintable-listings";
import "./search-and-mint.css";
import { MintSubname } from "./mint-subname";
import { getListingPrice } from "./utils";
import { ENV } from "../env";
import { normalize } from "viem/ens";

export const SearchAndMint = ({ connectedAddress }) => {

    const [mintableListings, setMintableListings] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [labelValue, setLabelValue] = useState("");
    const [searchSubname, setSearchSubname] = useState("");
    const [mintProcess, setMintProcess] = useState({
        isStarted: false,
    });
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        getMintableListings().then(listings => {
            setInitialSuggestions(listings)
        })
    }, [])

    const setInitialSuggestions = (apiListings) => {
        if (ENV.names && ENV.names.length > 0) {
            const namesMap = {};
            ENV.names.forEach(name => {
                namesMap[name] = true;
            })
            const filtered = apiListings.filter(listing => namesMap[listing.name])
            setMintableListings(filtered);
            setSuggestions(filtered.length > 5 ? filtered : filtered.slice(0, 5));
        } else {
            setMintableListings(apiListings);
            setSuggestions(apiListings.length < 6 ? apiListings : apiListings.slice(0, 5));
        }
    }

    const onSearch = (value) => {
        const _value = value.toLowerCase();
        if (!_value.endsWith(".")) {
            try {
                normalize(_value)
            } catch (error) {
                // if we come here, name has illegal character
                return;
            }
        }
        const splited = _value.split(".");
        let subnameValue = "";
        let parentValue = "";
        if (splited.length < 2) {
            subnameValue = splited.length === 1 ? splited[0] : "";
        } else if (splited.length >= 2) {
            subnameValue = splited[0];
            parentValue = splited[1];
        }

        setSearchSubname(subnameValue);
        setLabelValue(_value);
        filterSuggestions(parentValue);

    }

    const filterSuggestions = (parentName) => {
        if (parentName.length > 0) {
            const sorted = mintableListings.sort((a, b) => {
                const firstContains = a.name.includes(parentName);
                const secondContains = b.name.includes(parentName);
               
                if (firstContains && !secondContains) {
                    return -1;
                } else if (!firstContains && secondContains) {
                    return 1;
                } else {
                    return 0;
                }
            })
            setSuggestions(sorted.length > 5 ? sorted.slice(0, 5) : sorted);
        }
    }

    const startMintProcess = (parentListing, labelName) => {
        setMintProcess({
            isStarted: true,
            parentListing,
            labelName
        })
    }
    const cancelMintProcess = () => {
        setMintProcess({
            isStarted: false
        })
    }

    return <>
        {!mintProcess.isStarted && <>
            <div style={{ textAlign: "center", margin: 15 }}>
                <Typography style={{ fontSize: 15, fontWeight: "bold" }}>Find your perfect subname</Typography>
                <Typography style={{ fontSize: 12, color: "#ACACAC" }}>Type at least 2 characters</Typography>
            </div>
            <Input
                value={labelValue}
                className="subname-widget-input"
                onChange={(e) => onSearch(e.target.value)}
                placeholder="Find your perfect subname" size="large" />
            <div className="subnames-suggestions-container">
                {searchSubname.length >= 2 && suggestions.map(suggestion => <Row
                    onClick={() => startMintProcess(suggestion, searchSubname)}
                    key={suggestion.namehash}
                    className="subname-option">
                    <Typography style={{ fontSize: 12 }}>{`${searchSubname}.${suggestion.fullName}`}</Typography>
                    <Typography style={{ fontSize: 12, fontWeight: "bolder" }}>
                        {getListingPrice(suggestion, searchSubname).ETH} ETH</Typography>
                </Row>)}
            </div>
        </>}
        {mintProcess.isStarted &&
            <MintSubname
                onCancel={() => cancelMintProcess()}
                parentListing={mintProcess.parentListing}
                labelName={mintProcess.labelName} />}
    </>
}
