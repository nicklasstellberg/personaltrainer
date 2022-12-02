import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Addcustomer from "./Addcustomer";
import EditCustomer from "./Editcustomer";

function Customerlist() {
  // PITÄISI LUODA TILA, JOHON SAADAAN LISTA ASIAKKAITA
  const [customers, setCustomers] = useState([]);
  // PITÄISI HAKEA REST-RAJAPINNASTA ASIAKKAAT
  // MIKÄ HOOK-FUNKTIO?

  useEffect(() => {
    console.log("OLLAAN HOOK FUNKTIOSSA");
    fetchCustomers();
    console.log(customers);
  }, []);

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

  const fetchCustomers = () => {
    // TÄHÄN TULEE FETCH, JOLLA HAETAAN TIEDOT
    // ASIAKKAISTA
    fetch("https://customerrest.herokuapp.com/api/customers")
      .then((response) => response.json())
      .then((data) => setCustomers(data.content));
  };

  const deleteCustomer = (link) => {
    if (window.confirm("Are you sure?")) {
      console.log("DELETE FUNKTIO");
      fetch(link, { method: "DELETE" }).then((response) => {
        if (response.ok) {
          fetchCustomers();
        }
      });
    }
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
    { field: "firstname", sortable: true, filter: true },
    { field: "lastname", sortable: true, filter: true },
    { field: "streetaddress", sortable: true, filter: true },
    { field: "postcode", sortable: true, filter: true },
    { field: "city", sortable: true, filter: true },
    { field: "email", sortable: true, filter: true },
    { field: "phone", sortable: true, filter: true },
    {
      headerName: "Actions",
      width: 100,
      field: "links.0.href",
      cellRenderer: (params) => (
        <IconButton color="error" onClick={() => deleteCustomer(params.value)}>
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
  ]);

  return (
    <>
      <Addcustomer addCustomer={addCustomer} />
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
          />
        </div>
      </div>
    </>
  );
}

export default Customerlist;
