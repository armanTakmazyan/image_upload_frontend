import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { routeCodes } from 'routes/routeCodes';
import { useHistory } from "react-router-dom";
import { TableBody, TableRow, TableCell, IconButton, Grid, makeStyles } from '@material-ui/core';
import RemoveIcon from '@material-ui/icons/Delete';
import HistoryIcon from '@material-ui/icons/History';
import { CustomDataGridCellFactory } from './custom-data-grid-cell-factory';
import DeleteConfirmModal from '../delete-confirm-modal';
import _ from 'lodash';

const useStyles = makeStyles({
  removeModalRow: {
    display: 'none'
  }
})

export const CustomDataGridBody = ({
  columns,
  rows,
  handleRemoveItems,
  removeIsLoading,
}) => {
  const classes = useStyles();
  const history = useHistory();
  const [deleteConfirmModal, setDeleteConfirmModal] = useState({
    open: false,
  });

  return <>
    {
      _.isEmpty(rows) ? (
        <TableBody>
          <TableRow>
            <TableCell colSpan='100%' align='center'>
              No Result
        </TableCell>
          </TableRow>
        </TableBody>
      ) : (
        <>
          <TableBody>
            {rows.map(row => {
              return (
                <TableRow
                  hover
                  tabIndex={-1}
                  key={row.id}
                >
                  {columns.map((column) => (
                    <CustomDataGridCellFactory
                      key={`${row.id}_${column.field}_${row[column.field]}`}
                      column={column}
                      row={row}
                    />
                  ))}
                  <TableCell>
                    <Grid container>
                      <Grid item>
                        <IconButton onClick={() => setDeleteConfirmModal({
                          open: true,
                          id: row.id
                        })}>
                          <RemoveIcon color='secondary' />
                        </IconButton>
                      </Grid>
                      <Grid item>
                        <IconButton onClick={() => history.push(`${routeCodes.IMAGES}/${row.id}/logs`)}>
                          <HistoryIcon color='primary' />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </TableCell>
                </TableRow>
              );
            })}
            <TableRow className={classes.removeModalRow}>
              <TableCell colSpan={3}>
                <DeleteConfirmModal
                  open={deleteConfirmModal.open}
                  onClose={() => setDeleteConfirmModal({
                    open: false,
                  })}
                  onDelete={() => handleRemoveItems({
                    image_id: deleteConfirmModal.id,
                    cb: () => {
                      setDeleteConfirmModal({
                        open: false
                      })
                    }
                  })}
                  loading={removeIsLoading}
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </>
      )
    }
  </>
};

CustomDataGridBody.defaultProps = {
  rows: [],
  removeIsLoading: false,
  handleRemoveItems: () => { },
};

CustomDataGridBody.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string,
      headerName: PropTypes.string,
    })
  ).isRequired,
  rows: PropTypes.array,
  handleRemoveItems: PropTypes.func,
  removeIsLoading: PropTypes.bool,
};
