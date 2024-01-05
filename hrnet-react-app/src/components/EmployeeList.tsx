import React, { useState, useMemo } from 'react';
import { useTable, usePagination, useSortBy, TableInstance, UsePaginationInstanceProps, Column } from 'react-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { RootState } from '../redux/store';
import { Employee } from '../redux/employeesSlice';
import { useSelector } from 'react-redux';
import '../styles/EmployeeList.scss';
import 'react-table';

interface CustomTableState {
    pageIndex: number;
}

const EmployeeList = () => {
    const employees = useSelector((state: RootState) => state.employees.employees);

    // Step 1: Create a state variable for search input
    const [pageSize, setPageSize] = useState(10);
    const [searchInput, setSearchInput] = useState('');

    // Step 2: Add an input for search
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Step 3: Update the search input state
        setSearchInput(e.target.value);
    };

    const filteredEmployees = useMemo(() => {
        if (!searchInput) return employees;

        return employees.filter((employee) => {
            // Implement your search logic here
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
    }, [searchInput, employees]);

    const columns: Column<Employee>[] = useMemo(
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

    const tableInstance = useTable(
        {
            columns,
            data: filteredEmployees,
        },
        useSortBy,
        usePagination
    ) as TableInstance<Employee> & UsePaginationInstanceProps<Employee>;

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        nextPage,
        previousPage,
        setPageSize: setPageSizeReactTable,
        state,
    } = tableInstance;

    const customState = state as CustomTableState;
    const pageIndex = customState.pageIndex;

    const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newSize = Number(event.target.value);
        setPageSize(newSize);
        setPageSizeReactTable(newSize);
    };

    const from = pageIndex * pageSize + 1;
    const to = Math.min((pageIndex + 1) * pageSize, filteredEmployees.length);
    const total = filteredEmployees.length;

    return (
        <div className="tablePage">
            <h2>Current Employees</h2>

            {/* Step 2: Add an input for search */}
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search employees..."
                    value={searchInput}
                    onChange={handleSearchChange}
                />
            </div>

            <div className="tableWithLegend">
                <table {...getTableProps()}>
                    <thead>
                        {headerGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                    <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                        <div className="header-content">
                                            {column.render('Header')}
                                            <div className="arrows">
                                                {column.isSorted ? (
                                                    column.isSortedDesc ? (
                                                        <FontAwesomeIcon icon={faCaretDown} />
                                                    ) : (
                                                        <FontAwesomeIcon icon={faCaretUp} />
                                                    )
                                                ) : null}
                                            </div>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {page.map((row) => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()}>
                                    {row.cells.map((cell) => (
                                        <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                <div className="pagination">
                    <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                        Previous
                    </button>
                    <button onClick={() => nextPage()} disabled={!canNextPage}>
                        Next
                    </button>
                    <span>
                        Showing {from} to {to} of {total} entries
                    </span>
                    <select value={pageSize} onChange={handlePageSizeChange}>
                        {[10, 20, 30, 40, 50].map((size) => (
                            <option key={size} value={size}>
                                Show {size}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default EmployeeList;
