import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Addtraining from "./Addtraining";
import dayjs from "dayjs";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import { Button } from "@mui/material";

function Traininglist() {
  // PITÄISI LUODA TILA, JOHON SAADAAN LISTA TREENEJÄ
  const [trainings, setTrainings] = useState([]);
  const [open, setOpen] = useState(false);
  const [trainingId, setTrainingId] = useState("");
  // PITÄISI HAKEA REST-RAJAPINNASTA TREENIT
  // MIKÄ HOOK-FUNKTIO?

  useEffect(() => {
    console.log("OLLAAN HOOK FUNKTIOSSA");
    fetchTrainings();
    console.log(trainings);
  }, []);

  const openDeleteCheck = (id) => {
    setTrainingId(id);
    setOpen(true);
  };

  const closeDeleteCheck = () => {
    setOpen(false);
  };

  const addTraining = (training) => {
    console.log("Traininglist.js tiedoston addTraining metodissa");
    // REST RAJAPINTAA KÄYTTÄEN PITÄISI SAADA TREENI LISÄTTYÄ
    fetch("https://customerrest.herokuapp.com/api/trainings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(training),
    }).then((response) => {
      if (response.ok) {
        fetchTrainings();
      }
    });
  };

  const fetchTrainings = () => {
    // TÄHÄN TULEE FETCH, JOLLA HAETAAN TIEDOT
    // TREENEISTÄ
    fetch("https://customerrest.herokuapp.com/gettrainings")
      .then((response) => response.json())
      .then((data) => setTrainings(data));
  };

  const deleteTraining = () => {
    closeDeleteCheck();
    fetch(`https://customerrest.herokuapp.com/api/trainings/${trainingId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          fetchTrainings();
        } else {
          alert("Something went wrong.");
        }
      })
      .catch((err) => console.error(err));
  };

  const updateTraining = (updateTraining, link) => {
    console.log(" UPDATE FUNKTIO");
    fetch(link, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateTraining),
    }).then((response) => {
      if (response.ok) {
        fetchTrainings();
      }
    });
  };

  const [columnDefs, setColumnDefs] = useState([
    { headerName: "Training ID", field: "id", sortable: true, filter: true },
    {
      field: "date",
      sortable: true,
      filter: true,
      valueFormatter: (params) =>
        dayjs(params.value).format("DD.MM.YYYY hh:mm a"),
    },
    {
      headerName: "Duration (min)",
      field: "duration",
      sortable: true,
      filter: true,
    },
    {
      field: "activity",
      sortable: true,
      filter: true,
    },
    {
      field: "customer",
      sortable: true,
      filter: true,
      cellRendererFramework: (params) => (
        <div>
          {params.value.firstname} {params.value.lastname}
        </div>
      ),
    },
    {
      field: "actions",
      cellRenderer: (params) => (
        <IconButton onClick={() => openDeleteCheck(params.data.id)}>
          <DeleteIcon />
        </IconButton>
      ),
    },
  ]);

  return (
    <>
      <Dialog open={open} onClose={closeDeleteCheck}>
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogActions>
          <Button onClick={deleteTraining} color="primary">
            Delete
          </Button>
          <Button onClick={closeDeleteCheck} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Addtraining addTraining={addTraining} />
      <div style={{ height: "100%", boxSizing: "border-box" }}>
        <div
          style={{ height: 600, width: "90%" }}
          className="ag-theme-material"
        >
          <AgGridReact
            rowData={trainings}
            columnDefs={columnDefs}
            paginationPageSize={10}
            pagination={true}
          />
        </div>
      </div>
    </>
  );
}

export default Traininglist;
