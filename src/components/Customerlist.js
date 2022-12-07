import React, { useState, useEffect, useCallback, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Addcustomer from "./Addcustomer";
import AddTraining from "./Addtraining";
import EditCustomer from "./Editcustomer";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import { Button } from "@mui/material";

function Customerlist() {
  const [customers, setCustomers] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [open, setOpen] = useState(false);
  const [customerId, setCustomerId] = useState("");
  const gridRef = useRef();

  useEffect(() => {
    console.log("OLLAAN HOOK FUNKTIOSSA");
    fetchCustomers();
    console.log(customers);
  }, []);

  const openDeleteCheck = (url) => {
    setCustomerId(url);
    setOpen(true);
  };

  const closeDeleteCheck = () => {
    setOpen(false);
  };

  const addCustomer = (customer) => {
    console.log("Customerlist.js tiedoston addCustomer metodissa");
    // REST RAJAPINTAA KÄYTTÄEN PITÄISI SAADA ASIAKAS LISÄTTYÄ
    fetch("https://customerrest.herokuapp.com/api/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(customer),
    }).then((response) => {
      if (response.ok) {
        fetchCustomers();
      }
    });
  };

  const fetchTrainings = () => {
    fetch("https://customerrest.herokuapp.com/api/trainings")
      .then((response) => response.json())
      .then((data) => setTrainings(data.content))
      .catch((err) => console.error(err));
  };

  const addTraining = (training) => {
    console.log(training);
    fetch("https://customerrest.herokuapp.com/api/trainings", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(training),
    })
      .then((_) => fetchTrainings())
      .catch((err) => console.error(err));
  };

  const fetchCustomers = () => {
    // TÄHÄN TULEE FETCH, JOLLA HAETAAN TIEDOT
    // ASIAKKAISTA
    fetch("https://customerrest.herokuapp.com/api/customers")
      .then((response) => response.json())
      .then((data) => setCustomers(data.content));
  };

  const deleteCustomer = () => {
    closeDeleteCheck();
    fetch(customerId, { method: "DELETE" })
      .then((response) => {
        if (response.ok) {
          fetchCustomers();
        } else {
          alert("Something went wrong.");
        }
      })
      .catch((err) => console.error(err));
  };

  const updateCustomer = (updateCustomer, link) => {
    console.log(" UPDATE FUNKTIO");
    fetch(link, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateCustomer),
    }).then((response) => {
      if (response.ok) {
        fetchCustomers();
      }
    });
  };

  const [columnDefs, setColumnDefs] = useState([
    // Kentillle asetaan id, jotta niitä voi kutsua onBtnExportissa
    { colId: 1, field: "firstname", sortable: true, filter: true, width: 130},
    { colId: 2, field: "lastname", sortable: true, filter: true, width: 130 },
    { colId: 3, field: "streetaddress", sortable: true, filter: true, width: 160 },
    { colId: 4, field: "postcode", sortable: true, filter: true, width: 130 },
    { colId: 5, field: "city", sortable: true, filter: true, width: 130 },
    { colId: 6, field: "email", sortable: true, filter: true, width: 180 },
    { colId: 7, field: "phone", sortable: true, filter: true, width: 130 },
    {
      headerName: "Actions",
      width: 100,
      field: "links.0.href",
      cellRenderer: (params) => (
        <IconButton color="error" onClick={() => openDeleteCheck(params.value)}>
          <DeleteIcon />
        </IconButton>
      ),
    },
    {
      headerName: "",
      width: 100,
      field: "links.0.href",
      cellRenderer: (params) => (
        <EditCustomer updateCustomer={updateCustomer} params={params} />
      ),
    },
    {
      headerName: "",
      sortable: false,
      filter: false,
      width: 170,
      field: "links.0.href",
      cellRenderer: (params) => (
        <AddTraining addTraining={addTraining} customer={params.value} />
      ),
    },
  ]);

  const onBtnExport = useCallback(() => {
    // Otetaan vain kolumnit 1-7, jotta napit ei tule mukaan.
    gridRef.current.api.exportDataAsCsv({columnKeys: [1, 2, 3, 4, 5, 6, 7]});
  }, []);

  return (
    <>
      <Addcustomer addCustomer={addCustomer} />
      <Dialog open={open} onClose={closeDeleteCheck}>
        <DialogTitle>Delete customer?</DialogTitle>
        <DialogActions>
          <Button onClick={deleteCustomer} color="primary">
            Yes
          </Button>
          <Button onClick={closeDeleteCheck} color="primary">
            No
          </Button>
        </DialogActions>
      </Dialog>
      <div style={{ height: "100%", boxSizing: "border-box" }}>
        <div
          style={{ height: 600, width: "90%" }}
          className="ag-theme-material"
        >
          <AgGridReact
            rowData={customers}
            columnDefs={columnDefs}
            paginationPageSize={10}
            pagination={true}
            ref={gridRef}
          />
        </div>
      </div>
      <Button variant="outlined" onClick={onBtnExport}>Download CSV export file</Button>
    </>
  );
}

export default Customerlist;
