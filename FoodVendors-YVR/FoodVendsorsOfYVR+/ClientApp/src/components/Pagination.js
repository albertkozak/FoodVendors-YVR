import React, { useState, useEffect } from "react";

function Pagination(props) {
    const [disablePrevious, setdisablePrevious] = useState("");
    const [disableNext, setdisableNext] = useState("");

    useEffect(() => {
        setdisableNext(
            props.currentPage + 1 >
                Math.ceil(props.totalVendors / props.vendorsPerPage)
                ? "disabled"
                : ""
        );
        setdisablePrevious(props.currentPage - 1 < 1 ? "disabled" : "");
    }, [props]);

    function paginate(paginate) {
        paginate == "previous"
            ? props.paginate(props.currentPage - 1)
            : props.paginate(props.currentPage + 1);
    }

    return (
        <div class="btn-toolbar justify-content-center">
            <nav>
                <ul className="pagination">
                    <li className="page-item">
                        <a
                            className={`btn btn-dark btn-sm btn-space ${disablePrevious}`}
                            href="javascript:void(0);"
                            onClick={() => paginate("previous")}
                        >
                            Previous
            </a>
                    </li>
                    <li className="page-item">
                        <a
                            className={`btn btn-dark btn-sm ${disableNext}`}
                            href="javascript:void(0);"
                            onClick={() => paginate("next")}
                        >
                            Next
            </a>
                    </li>
                </ul>
            </nav>
        </div>
    );
}
export default Pagination;
