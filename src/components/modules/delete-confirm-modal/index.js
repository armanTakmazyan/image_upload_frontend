import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { CircularProgress, makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  content: {
    position: "relative"
  },
  loading: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "rgba(0,0,0,0.3)",
    zIndex: 20
  }
});

export default function DeleteConfirmModal({ open, onClose, onDelete, loading }) {
  const classes = useStyles();

  return (
    <div>
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="responsive-dialog-title"
        fullWidth={true}
        disableBackdropClick={loading}
      >
        <div className={classes.content}>
          {loading && (
            <div className={classes.loading}>
              <CircularProgress />
            </div>
          )}
          <DialogTitle id="responsive-dialog-title">Are you sure?</DialogTitle>
          <DialogActions>
            <Button onClick={onClose} color="default" variant="contained">
              Cancel
            </Button>
            <Button onClick={onDelete} color="secondary" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </div>
      </Dialog>
    </div>
  );
}
