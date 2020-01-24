import React, { Component } from "react";
import {GoogleMap, withScriptjs, withGoogleMap, Marker, InfoWindow} from "react-google-maps";
import Search from "./Search";
import Pagination from "./Pagination";

// Display Map
function Map(props) {
    return (
        <GoogleMap defaultZoom={15} defaultCenter={{ lat: 49.282, lng: -123.1171 }}>
            {props.foodVendors.map(vendor => (
                <Marker
                    key={vendor.key}
                    title={vendor.business_name}
                    position={{ lat: vendor.latitude, lng: vendor.longitude }}
                    onClick={() => {
                        props.onClickMarker(vendor);
                    }}
                />
            ))}
            {props.selectedVendor && (
                <InfoWindow
                    position={{
                        lat: props.selectedVendor.latitude,
                        lng: props.selectedVendor.longitude
                    }}
                    onCloseClick={props.onCloseClickMarker}
                >
                    <div>
                        <h6>{props.selectedVendor.business_name}</h6>
                        <p>{props.selectedVendor.description}</p>
                        <p>{props.selectedVendor.location}</p>
                    </div>
                </InfoWindow>
            )}
        </GoogleMap>
    );
}

const WrappedMap = withScriptjs(withGoogleMap(props => Map(props)));

export class FetchData extends Component {
    static displayName = FetchData.name;
    constructor(props) {
        super(props);
        this.state = {
            foodVendors: [],
            loading: true,
            selectedVendor: null,
            vendorsMarkers: []
        };
        this.onSortChange = this.onSortChange.bind(this);
        this.getSearch = this.getSearch.bind(this);
        this.Paginate = this.Paginate.bind(this);
        this.initialState = this.state;
    }

    onSortChange(sortParam) {
        let sortedVendors;
        if (sortParam === "name") {
            if (this.state.nameSort === "asc") {
                this.setState({ nameSort: "desc", descriptionSort: "asc" });
                sortedVendors = this.state.foodVendors.sort(function (a, b) {
                    return (
                        (a.business_name === null) - (b.business_name === null) ||
                        +(a.business_name > b.business_name) ||
                        -(a.business_name < b.business_name)
                    );
                });
            } else {
                this.setState({ nameSort: "asc", descriptionSort: "asc" });
                sortedVendors = this.state.foodVendors.sort(function (a, b) {
                    return (
                        (a.business_name === null) - (b.business_name === null) ||
                        -(a.business_name > b.business_name) ||
                        +(a.business_name < b.business_name)
                    );
                });
            }
        } else {
            if (this.state.descriptionSort === "asc") {
                this.setState({ nameSort: "asc", descriptionSort: "desc" });
                sortedVendors = this.state.foodVendors.sort(function (a, b) {
                    return (
                        (a.description === null) - (b.description === null) ||
                        +(a.description > b.description) ||
                        -(a.description < b.description)
                    );
                });
            } else {
                this.setState({ nameSort: "asc", descriptionSort: "asc" });
                sortedVendors = this.state.foodVendors.sort(function (a, b) {
                    return (
                        (a.description === null) - (b.description === null) ||
                        -(a.description > b.description) ||
                        +(a.description < b.description)
                    );
                });
            }
        }
        this.setState({ foodVendors: sortedVendors });
    }

    componentDidMount() {
        this.populateFoodVendorsData();
    }

    // Map Markers (Click Functions)
    handleClickMarker(vendor) {
        this.setState({ selectedVendor: vendor });
    }
    handleCloseClickMarker() {
        this.setState({ selectedVendor: null });
    }

    // Search Handling
    getSearch(searchValue) {
        this.setState({ search: searchValue });
        this.populateFoodVendorsData();
    }
    getSearched(foodVendors) {
        const targetedFoodVendors = foodVendors.filter(foodVendor => {
            if (foodVendor.business_name != null) {
                return (
                    foodVendor.business_name
                        .toLowerCase()
                        .indexOf(this.state.search.toLowerCase()) != -1 ||
                    foodVendor.description
                        .toLowerCase()
                        .indexOf(this.state.search.toLowerCase()) != -1
                );
            } else {
                return (
                    foodVendor.description
                        .toLowerCase()
                        .indexOf(this.state.search.toLowerCase()) != -1
                );
            }
        });
        return targetedFoodVendors;
    }

    // Pagination
    Paginate(currentPage) {
        this.setState({ currentPage: currentPage });
    }

    renderFoodVendorsTable(foodVendors) {
        let currentFoodVendors;

        if (typeof this.state.search != "undefined" && this.state.search != "") {
            foodVendors = this.getSearched(foodVendors);
        }
        // Pagination Consts
        const indexOfLastFoodVendor =
            this.state.currentPage * this.state.maxFoodVendors;
        const indexOfFirstFoodVendor =
            indexOfLastFoodVendor - this.state.maxFoodVendors;
        currentFoodVendors = foodVendors.slice(
            indexOfFirstFoodVendor,
            indexOfLastFoodVendor
        );

        return (
            <div>
                <div class="col-sm-12 text-right">
                    <button
                        className="btn btn-warning btn-sm"
                        type="button"
                        onClick={() => {
                            this.getSearch("");
                        }}
                    >
                        Refresh
          </button>
                    <Search getValue={this.getSearch} />
                </div>
                <br />
                <table className="table table-striped" aria-labelledby="tabelLabel">
                    <thead>
                        <tr>
                            <th onClick={() => this.onSortChange("name")}>Name</th>
                            <th onClick={() => this.onSortChange("description")}>
                                Description
              </th>
                            <th>Location</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentFoodVendors.map(vendor => (
                            <tr key={vendor.key}>
                                <td>{vendor.business_name}</td>
                                <td>{vendor.description}</td>
                                <td>{vendor.location}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Pagination
                    paginate={this.Paginate}
                    currentPage={this.state.currentPage}
                    totalVendors={foodVendors.length}
                    vendorsPerPage={this.state.maxFoodVendors}
                />
            </div>
        );
    }

    render() {
        let contents = this.state.loading ? (
            <p>
                <em>Loading...</em>
            </p>
        ) : (
                this.renderFoodVendorsTable(this.state.foodVendors)
            );
        return (
            <div>
                <h1 id="tabelLabel">Vancouver Eats</h1>
                <WrappedMap
                    foodVendors={this.state.vendorsMarkers}
                    // IMPORTANT: PLEASE ADD YOUR OWN PERSONAL GOOGLE MAP API KEY BELOW:
                    googleMapURL="https://maps.googleapis.com/maps/api/js"
                    loadingElement={<div style={{ height: "100%" }} />}
                    containerElement={<div style={{ height: "600px" }} />}
                    mapElement={<div style={{ height: "100%" }} />}
                    onClickMarker={this.handleClickMarker.bind(this)}
                    onCloseClickMarker={this.handleCloseClickMarker.bind(this)}
                    selectedVendor={this.state.selectedVendor}
                />
                <br />
                {contents}
            </div>
        );
    }

    async populateFoodVendorsData() {
        const response = await fetch("api/FoodVendor/FoodVendors");
        const data = await response.json();
        this.setState({
            foodVendors: data,
            loading: false,
            nameSort: "asc",
            descriptionSort: "asc",
            maxFoodVendors: 4,
            currentPage: 1,
            selectedPlace: null,
            vendorsMarkers: !this.state.search
                ? this.state.foodVendors
                : this.getSearched(this.state.foodVendors)
        });
    }
}