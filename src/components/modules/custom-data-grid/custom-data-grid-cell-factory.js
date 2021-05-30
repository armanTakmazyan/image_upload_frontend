import React from 'react';
import PropTypes from 'prop-types';
import { TableCell } from '@material-ui/core';

export const CustomDataGridCellFactory = ({ column, row }) => {
  return (
    <TableCell>
      {column.field === 'path' ?
        <a
          href={`${process.env.REACT_APP_SERVER_URL}/${row[column.field]}`}
          target='_blank'
          rel="noreferrer"
        >
          {`${process.env.REACT_APP_SERVER_URL}/${row[column.field]}`}
        </a> : row[column.field]
      }
    </TableCell>
  );
};

CustomDataGridCellFactory.defaultProps = {};

CustomDataGridCellFactory.propTypes = {
  column: PropTypes.shape({
    field: PropTypes.string,
    headerName: PropTypes.string,
  }).isRequired,
  row: PropTypes.object.isRequired,
};
