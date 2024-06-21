import {
  Box,
  Paper,
  TableContainer,
  Table,
  TablePagination,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  TableSortLabel,
} from '@mui/material'
import type { ChangeEvent, MouseEvent } from 'react'
import React, { useState } from 'react'
import { visuallyHidden } from '@mui/utils'

export type HeadCell<T> =
  | {
      disablePadding: boolean
      id: keyof T
      label: string | JSX.Element
      numeric: boolean
      align: 'right' | 'left'
    }
  | {
      id: keyof T
      emptyCell: boolean
    }

type Props<T> = {
  rows: T[]
  headCells: HeadCell<T>[]
  renderRow: (row: T, index: number) => JSX.Element
}

type EnhancedTableProps<T> = {
  headCells: HeadCell<T>[]
  onRequestSort: (event: MouseEvent<unknown>, property: keyof T) => void
  order: Order
  orderBy: keyof T
}

function EnhancedTableHead<T>({ headCells, onRequestSort, order, orderBy }: EnhancedTableProps<T>) {
  const createSortHandler = (property: keyof T) => (event: MouseEvent<unknown>) => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow>
        {headCells.map(headCell => {
          if ('emptyCell' in headCell) {
            return <TableCell key={headCell.id.toString()} />
          }
          return (
            <TableCell
              key={headCell.id.toString()}
              align={headCell.align}
              padding={headCell.disablePadding ? 'none' : 'normal'}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          )
        })}
      </TableRow>
    </TableHead>
  )
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

type Order = 'asc' | 'desc'

function getComparator<T, Key extends keyof T>(
  order: Order,
  orderBy: Key,
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) {
      return order
    }
    return a[1] - b[1]
  })
  return stabilizedThis.map(el => el[0])
}

const showAllRows = 1_000_000

export function ExpandTable<T>({ rows, headCells, renderRow }: Props<T>) {
  const [order, setOrder] = useState<Order>('asc')
  const [orderBy, setOrderBy] = useState<keyof T>(headCells[0].id)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(showAllRows)

  const handleRequestSort = (event: MouseEvent<unknown>, property: keyof T) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-label="collapsible table" aria-labelledby="tableTitle">
            <EnhancedTableHead<T>
              headCells={headCells}
              onRequestSort={handleRequestSort}
              order={order}
              orderBy={orderBy}
            />
            <TableBody>
              {/* @ts-ignore */}
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                // @ts-ignore
                .map((row, index) => renderRow(row, index))}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, { value: showAllRows, label: 'All' }]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  )
}
