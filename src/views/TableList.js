import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { DataGrid } from "@material-ui/data-grid";
import {
  Chip,
  Box,
  AppBar,
  Grid,
  Input,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
// import { isEmpty } from "lodash";
import styles from "assets/jss/material-dashboard-react/components/tableStyle.js";
const useStyles = makeStyles(styles);

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const tableColumns = [
  {
    field: "id",
    headerName: "ID",
    sortable: false,
    width: 75,
    hide: false,
    default: true,
  },
  {
    field: "product_title",
    headerName: "Product",
    sortable: false,
    width: 360,
    hide: false,
    default: true,
  },
  {
    field: "lat_long",
    headerName: "Location",
    sortable: false,
    width: 240,
    hide: false,
    default: true,
  },
  {
    field: "currency",
    headerName: "Currency",
    sortable: false,
    width: 120,
    hide: false,
    default: true,
  },
  {
    field: "destination",
    headerName: "Destination",
    sortable: false,
    width: 180,
    hide: true,
    default: false,
  },
  {
    field: "total_booking_count",
    headerName: "Bookings",
    sortable: false,
    width: 100,
    hide: true,
    default: false,
  },
  {
    field: "price",
    headerName: "Price",
    sortable: false,
    width: 100,
    hide: true,
    default: false,
  },
  {
    field: "date",
    headerName: "Date",
    sortable: false,
    width: 100,
    hide: false,
    default: true,
  },
];

// const filterLabel = {
//   destination: "Search for destination",
//   price: "Price less than",
//   total_booking_count: "Booking greater than",
// };

const choosableColumns = [
  ...new Set(
    tableColumns
      .map((i) => {
        if (!i.default) return i.field;
      })
      .filter((e) => e)
  ),
];

export default function TableList({ dataSet }) {
  const classes = useStyles();

  const [sortBy, setSort] = useState("id");
  // const [filterBy, setFilter] = useState("");
  // const [filterValue, setFilterValue] = useState("");
  const [data, updateData] = useState(dataSet);
  const [visibleColumns, setColumns] = useState(tableColumns);
  const [selectedColumns, selectColumns] = useState([]);

  React.useEffect(() => {
    let data = dataSet;
    // if (!isEmpty(filterBy) && !isEmpty(filterValue)) {
    //   switch (filterBy) {
    //     case "destination":
    //       data = data.filter((d) => {
    //         d.destination?.toLowerCase().includes(filterValue.toLowerCase());
    //       });
    //       break;
    //   }
    // }
    const sortedData = data
      .slice()
      .sort((a, b) =>
        a[sortBy] > b[sortBy] ? 1 : b[sortBy] > a[sortBy] ? -1 : 0
      );
    updateData(sortedData);
  }, [sortBy, dataSet]);

  useEffect(() => {
    let cols = [...visibleColumns];
    for (let i = 0; i < cols.length; i++) {
      if (!cols[i].default) {
        cols[i].hide = selectedColumns.includes(cols[i].field) ? false : true;
      }
    }
    setColumns(cols);
  }, [selectedColumns]);

  return (
    <div style={{ height: 800, width: "100%" }}>
      <AppBar color="default" position="static">
        <Grid container>
          <Grid item xs={6} sm={3}>
            <Box m={1}>
              <FormControl className={classes.margin}>
                <InputLabel id="sort">Column</InputLabel>
                <Select
                  className={classes.muiSelect}
                  labelId="sort"
                  value={sortBy}
                  onChange={($event) => setSort($event.target.value)}
                >
                  <MenuItem value="id">ID</MenuItem>
                  <MenuItem value="product_title">Product</MenuItem>
                  <MenuItem value="price">Price</MenuItem>
                  <MenuItem value="destination">Destination</MenuItem>
                  <MenuItem value="total_booking_count">Booking Count</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box m={1}>
              <FormControl className={classes.margin}>
                <InputLabel id="column">Columns</InputLabel>
                <Select
                  labelId="column"
                  id="column"
                  multiple
                  className={classes.muiSelect}
                  value={selectedColumns}
                  onChange={($event) => selectColumns($event.target.value)}
                  input={<Input id="select-multiple-chip" />}
                  renderValue={(selected) => (
                    <div className={classes.chips}>
                      {selected.map((value) => (
                        <Chip
                          key={value}
                          label={value}
                          className={classes.chip}
                        />
                      ))}
                    </div>
                  )}
                  MenuProps={MenuProps}
                >
                  {choosableColumns.map((column) => (
                    <MenuItem key={column} value={column}>
                      {column}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Grid>
          {/* <Grid item xs={6} sm={3}>
            <Box m={1}>
              <FormControl className={classes.margin}>
                <InputLabel id="fillter">Filter</InputLabel>
                <Select
                  className={classes.muiSelect}
                  labelId="filter"
                  value={filterBy}
                  onChange={($event) => setFilter($event.target.value)}
                >
                  <MenuItem value="">None</MenuItem>
                  {selectedColumns.map((column) => (
                    <MenuItem key={column} value={column}>
                      {column}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box m={1}>
              <FormControl className={classes.margin}>
                {filterBy.length > 0 && (
                  <div>
                    <InputLabel id="filterValue">
                      {filterLabel[filterBy]}
                    </InputLabel>
                    <Input
                      id="filterValue"
                      value={filterValue}
                      onChange={($event) => setFilterValue($event.target.value)}
                      label="lol"
                    />
                  </div>
                )}
              </FormControl>
            </Box>
          </Grid> */}
        </Grid>
      </AppBar>
      <DataGrid
        loading={!data.length}
        getRowId={(r) => r._id}
        columns={visibleColumns}
        rows={data}
        pageSize={10}
        disableColumnSelector
        disableColumnFilter
      />
    </div>
  );
}

TableList.propTypes = {
  dataSet: PropTypes.array,
};
