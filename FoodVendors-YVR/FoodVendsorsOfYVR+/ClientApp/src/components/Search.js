import React, { useState, useEffect } from "react";

function Search(props) {
    const [search, setSearch] = useState("");
    const [keyWord, setkeyWord] = useState("");

    useEffect(() => {
        const handleSearch = () => {
            props.getValue(search);
        };
        handleSearch();
    }, [search]);

    const handlekeyWord = event => {
        setkeyWord(event.target.value);
    };

    function handleSubmit(e) {
        e.preventDefault();
        setSearch(keyWord);
        props.getValue(search);
        setkeyWord("");
    }

    return (
        <form className="form-inline flex-nowrap" onSubmit={handleSubmit}>
            <input
                id="input"
                className="form-control-sm"
                type="search"
                placeholder="Craving something?"
                aria-label="Search"
                name="search"
                value={keyWord}
                onChange={handlekeyWord}
            />
            <button className="btn btn-warning btn-sm" type="submit" value="submit">
                Search
      </button>
        </form>
    );
}

export default Search;
