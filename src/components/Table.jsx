import { createClassName } from '../utils/utils'

const Table = ({ className, children }) => {
    return (
        <div className={ createClassName('rounded-8 border border-neutral-200', className) }>
            <table className="w-full rounded-8 border-collapse text-body-l text-neutral-900 bg-neutral-0">
                { children }
            </table>
        </div>
    )
}

const TableRow = ({ className, ...rest }) => {
    return (
        <tr className={ createClassName('hover:bg-neutral-50 bg-neutral-0 border-b border-neutral-200', className) } { ...rest } />
    )
}

const TableHeaderRow = ({ className, children, ...rest }) => {
    return (
        <TableRow className={ createClassName('', className) } { ...rest }>
            { children }
        </TableRow>
    )
}

const TableHeaderCell = ({ fixedWidth, width, className, ...rest }) => {
    return (
        <th
            className={ createClassName('rounded-8 py-12 px-12 text-left whitespace-nowrap border-b border-neutral-200 bg-neutral-50 text-neutral-500 text-heading-content uppercase', className) }
            { ...rest } />
    )
}

const TableCell = ({ className, ...rest }) => {
    return (
        <td className={ createClassName('py-8 px-12 break-words rounded-8', className) } { ...rest } />
    )
}

const NoDataRow = (props) => {
    return (
        <TableRow className="border-b-0" { ...props }>
            <TableCell className="text-center rounded-8" colSpan={ 1000 }>
                No data available in table
            </TableCell>
        </TableRow>
    )
}

export {
    Table,
    TableHeaderCell,
    TableHeaderRow,
    TableCell,
    TableRow,
    NoDataRow
}
