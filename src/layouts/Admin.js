import React from "react";
import Papa from "papaparse";
import { v4 as uuid } from "uuid";
import { Switch, Route, Redirect } from "react-router-dom";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import { makeStyles } from "@material-ui/core/styles";
import Navbar from "components/Navbars/Navbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";

import routes from "routes.js";

import styles from "assets/jss/material-dashboard-react/layouts/adminStyle.js";

import image from "assets/img/sidebar-2.jpg";
import logo from "assets/img/reactlogo.png";
import Dashboard from "views/Graphs";
import TableList from "views/TableList";
import csvData from "../../src/data.csv";
const useStyles = makeStyles(styles);

export default function Admin({ ...rest }) {
  const classes = useStyles();
  const color = "blue";
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    function getData() {
      const papaConfig = {
        complete: (results) => {
          const dataSet = results.data.map((i) => {
            delete i[""];
            i._id = uuid();
            return i;
          });
          setData(dataSet);
        },
        download: true,
        header: true,
        dynamicTyping: true,
      };
      Papa.parse(csvData, papaConfig);
    }
    if (!data.length) {
      getData();
    }
  }, []);

  return (
    <div className={classes.wrapper}>
      <Sidebar
        routes={routes}
        logoText={"You Group"}
        logo={logo}
        image={image}
        handleDrawerToggle={handleDrawerToggle}
        open={mobileOpen}
        color={color}
        {...rest}
      />
      <div className={classes.mainPanel}>
        <Navbar
          routes={routes}
          handleDrawerToggle={handleDrawerToggle}
          {...rest}
        />
        <div className={classes.content}>
          <div className={classes.container}>
            <Switch>
              <Route
                path="/admin/graph"
                render={() => <Dashboard dataSet={data} />}
              />
              <Route
                path="/admin/table"
                render={() => <TableList dataSet={data} />}
              />
              <Redirect from="/admin" to="/admin/table" />
            </Switch>
          </div>
        </div>
      </div>
    </div>
  );
}
