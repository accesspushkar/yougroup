import Dashboard from "@material-ui/icons/Dashboard";
import DashboardPage from "views/Graphs.js";
import TableList from "views/TableList.js";

const dashboardRoutes = [
  {
    path: "/table",
    name: "Table List",
    icon: "content_paste",
    component: TableList,
    layout: "/admin",
  },
  {
    path: "/graph",
    name: "Graph",
    icon: Dashboard,
    component: DashboardPage,
    layout: "/admin",
  },
];

export default dashboardRoutes;
