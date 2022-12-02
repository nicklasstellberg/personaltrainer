import { Button } from "@mui/material";
import React from "react";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";

export default function EditTraining({ updateTraining, params }) {
  // KOMPONENTTIIN TÄYTY LUODA TILA, JOLLA SAADAAN KONTROLLOITUA
  // DIALOGI TOIMII IKKUNANA JA AUKEAA MODAALISESTI
  const [open, setOpen] = React.useState(false);
  const [training, setTraining] = React.useState({
    date: "",
    duration: "",
    activity: "",
  });

  const handleClickOpen = () => {
    console.log("PAINETTIIN MUOKKAA TREENIÄ");
    setOpen(true);
    setTraining({
      date: params.data.date,
      duration: params.data.duration,
      activity: params.data.activity,
    });
  };

  const handleClose = () => {
    console.log("HANDLE CLOSE KUTSUTTU");
    setOpen(false);
  };

  const handleCancel = () => {
    console.log("PAINETTIIN CANCEL");
    setOpen(false);
  };

  const handleSave = () => {
    updateTraining(training, params.value);
    setOpen(false);
  };

  const inputChanged = (event) => {
    console.log("YRITETÄÄN TALLENTAA ATTRIBUUTIN ARVOA");
    setTraining({ ...training, [event.target.name]: event.target.value });
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        EDIT
      </Button>

      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>Edit training</DialogTitle>
        <DialogContent>
        <TextField
            name="date"
            value={training.date}
            autoFocus
            margin="dense"
            label="Date"
            type="text"
            fullWidth
            variant="standard"
            onChange={inputChanged}
          />
          <TextField
            name="duration"
            margin="dense"
            value={training.duration}
            label="Duration"
            type="text"
            fullWidth
            variant="standard"
            onChange={inputChanged}
          />
          <TextField
            name="activity"
            value={training.activity}
            margin="dense"
            label="Activity"
            type="text"
            fullWidth
            variant="standard"
            onChange={inputChanged}
          />
          <DialogActions>
            <Button onClick={handleSave}>Save</Button>
            <Button onClick={handleCancel}>Cancel</Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
}
