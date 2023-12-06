import React, { useState, useMemo } from 'react';
import { useTable, usePagination, useSortBy } from 'react-table';
import { NavLink } from 'react-router-dom';
import mockedEmployees from '../assets/mockedEmployees';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import "../styles/EmployeeList.scss";

const EmployeeList = () => {
    const [pageSize, setPageSize] = useState(10);
    const [searchInput, setSearchInput] = useState('');

    const filteredEmployees = useMemo(() => {
        if (!searchInput) return mockedEmployees;

        return mockedEmployees.filter(employee => {
            const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
            const searchLower = searchInput.toLowerCase();
            return (
                employee.firstName.toLowerCase().includes(searchLower) ||
                employee.lastName.toLowerCase().includes(searchLower) ||
                fullName.includes(searchLower) ||
                employee.state.toLowerCase().includes(searchLower) ||
                employee.zipCode.toLowerCase().includes(searchLower) ||
                employee.city.toLowerCase().includes(searchLower) ||
                employee.department.toLowerCase().includes(searchLower)
            );
        });
    }, [searchInput, mockedEmployees]);

    const columns = React.useMemo(
        () => [
            { accessor: 'firstName', Header: 'First Name' },
            { accessor: 'lastName', Header: 'Last Name' },
            { accessor: 'startDate', Header: 'Start Date' },
            { accessor: 'department', Header: 'Department' },
            { accessor: 'dateOfBirth', Header: 'Date of Birth' },
            { accessor: 'street', Header: 'Street' },
            { accessor: 'city', Header: 'City' },
            { accessor: 'state', Header: 'State' },
            { accessor: 'zipCode', Header: 'Zip Code' },
        ],
        []
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        canPreviousPage,
        canNextPage,
        nextPage,
        previousPage,
        setPageSize: setPageSizeReactTable,
        state: { pageIndex },
    } = useTable(
        { columns, data: filteredEmployees, initialState: { pageIndex: 0, pageSize } },
        useSortBy,
        usePagination
    );

    const handleSearchChange = (e) => {
        setSearchInput(e.target.value);
    };

    const handlePageSizeChange = (event) => {
        const newSize = Number(event.target.value);
        setPageSize(newSize);
        setPageSizeReactTable(newSize);
    };

    const from = pageIndex * pageSize + 1;
    const to = Math.min((pageIndex + 1) * pageSize, filteredEmployees.length);
    const total = filteredEmployees.length;

    return (
        <div className="tablePage">
            <h1>Current Employees</h1>

            <div className="tableWithLegend">
                <div className="tableFeatures">
                    <div className="showButton">
                        <label htmlFor="pageSize">Show</label>
                        <select id="pageSize" value={pageSize} onChange={handlePageSizeChange}>
                            {[10, 25, 50, 100].map(size => (
                                <option key={size} value={size}>{size}</option>
                            ))}
                        </select>
                        <label> entries</label>
                    </div>
                    <div className="searchBar">
                        <label htmlFor="searchInput">Search:</label>
                        <input
                            type="text"
                            id="searchInput"
                            value={searchInput}
                            onChange={handleSearchChange}
                        />
                    </div>
                </div>
                <table {...getTableProps()}>
                    <thead>
                        {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                <div className="header-content">
                                    {column.render('Header')}
                                    <div className="arrows">
                                        <span className={column.isSorted && !column.isSortedDesc ? "sorted-asc" : ""}>
                                            <FontAwesomeIcon icon={faCaretUp} />
                                        </span>
                                        <span className={column.isSorted && column.isSortedDesc ? "sorted-desc" : ""}>
                                            <FontAwesomeIcon icon={faCaretDown} />
                                        </span>
                                    </div>
                                </div>
                            </th>
                        ))}
                    </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {page.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length}>No data available in table</td>
                            </tr>
                        ) : (
                            page.map(row => {
                                prepareRow(row);
                                return (
                                    <tr {...row.getRowProps()}>
                                        {row.cells.map(cell => (
                                            <td {...cell.getCellProps()}>
                                                {cell.render('Cell')}
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
                <div className="pagination">
                    <div className="entriesInfo">
                        <span>
                            Showing {total > 0 ? from : 0} to {to} of {total} entries
                        </span>
                    </div>
                    <div className="paginationNav">
                        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                            Previous
                        </button>
                        <button onClick={() => nextPage()} disabled={!canNextPage}>
                            Next
                        </button>
                    </div>
                </div>
                <NavLink className="NavLink" to="/">Home</NavLink>
            </div>
        </div>
    );
};

export default EmployeeList;
