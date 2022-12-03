import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Addtraining from "./Addtraining";
import EditTraining from "./Edittraining";
import dayjs from 'dayjs';

function Traininglist() {
  // PITÄISI LUODA TILA, JOHON SAADAAN LISTA TREENEJÄ
  const [trainings, setTrainings] = useState([]);
  // PITÄISI HAKEA REST-RAJAPINNASTA TREENIT
  // MIKÄ HOOK-FUNKTIO?

  useEffect(() => {
    console.log("OLLAAN HOOK FUNKTIOSSA");
    fetchTrainings();
    console.log(trainings);
  }, []);

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
    fetch("https://customerrest.herokuapp.com/api/trainings")
      .then((response) => response.json())
      .then((data) => setTrainings(data.content));
  };

  const deleteTraining = (link) => {
    console.log("DELETE FUNKTIO");
    if (window.confirm("Are you sure?")) {
      fetch(link, { method: "DELETE" }).then((response) => {
        if (response.ok) {
          fetchTrainings();
        }
      });
    }
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
    { field: "date", sortable: true, filter: true, valueFormatter: params  => dayjs(params.value).format('DD.MM.YYYY hh:mm a')},
    { field: "duration", sortable: true, filter: true },
    { field: "activity", sortable: true, filter: true },
    {
      headerName: "Actions",
      width: 100,
      field: "links.0.href",
      cellRenderer: (params) => (
        <IconButton color="error" onClick={() => deleteTraining(params.value)}>
          <DeleteIcon />
        </IconButton>
      ),
    },
    {
      headerName: "",
      width: 100,
      field: "links.0.href",
      cellRenderer: (params) => (
        <EditTraining updateTraining={updateTraining} params={params} />
      ),
    },
  ]);

  return (
    <>
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
