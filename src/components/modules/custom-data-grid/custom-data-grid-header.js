import React from 'react';
import PropTypes from 'prop-types';
import { TableHead, TableRow, TableCell } from '@material-ui/core';

export const CustomDataGridHeader = ({
  columns,
}) => (
  <TableHead>
    <TableRow>
      {columns.map(column => (
        <TableCell key={column.field}>{column.headerName}</TableCell>
      ))}
      <TableCell>
        Actions
      </TableCell>
    </TableRow>
  </TableHead>
);

CustomDataGridHeader.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string,
      headerName: PropTypes.string,
    })
  ).isRequired,
};
