import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  Table,
  TableContainer,
  Paper,
  CircularProgress,
  TableRow,
  TableFooter,
  TableCell
} from '@material-ui/core';
import { useBottomScrollListener } from 'react-bottom-scroll-listener';
import { CustomDataGridBody } from './custom-data-grid-body';
import { CustomDataGridHeader } from './custom-data-grid-header';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  tableContainer: {
    maxHeight: 500
  },
  table: {
    minWidth: 700,
  },
}));

export const CustomDataGrid = ({
  columns,
  rows,
  handleRemoveItems,
  removeIsLoading,
  handleOnBottomScroll,
  fetchingMoreData,
}) => {
  const classes = useStyles();

  const scrollRef = useBottomScrollListener(handleOnBottomScroll);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <TableContainer className={classes.tableContainer} ref={scrollRef}>
          <Table
            className={classes.table}
            size={'medium'}
            aria-label="enhanced table"
          >
            <CustomDataGridHeader
              columns={columns}
              rowsCount={rows.length}
            />
            <CustomDataGridBody
              columns={columns}
              rows={rows}
              handleRemoveItems={handleRemoveItems}
              removeIsLoading={removeIsLoading}
              handleOnBottomScroll={handleOnBottomScroll}
              fetchingMoreData={fetchingMoreData}
            />
            <TableFooter>
              <TableRow padding='checkbox'>
                <TableCell colSpan={3} align='center'>
                  {
                    fetchingMoreData && <CircularProgress />
                  }
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}

CustomDataGrid.defaultProps = {
  columns: [],
  rows: [],
  handleRemoveItems: () => { },
  removeIsLoading: false,
  handleOnBottomScroll: () => { },
  fetchingMoreData: false,
};

CustomDataGrid.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.shape({
    field: PropTypes.string,
    headerName: PropTypes.string,
    disabled: PropTypes.bool
  })),
  rows: PropTypes.array,
  handleRemoveItems: PropTypes.func,
  removeIsLoading: PropTypes.bool,
  handleOnBottomScroll: PropTypes.func,
  fetchingMoreData: PropTypes.bool,
};