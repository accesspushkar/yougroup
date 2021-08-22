import React, { useMemo } from "react";
import PropTypes from "prop-types";
import ChartistGraph from "react-chartist";
import { makeStyles } from "@material-ui/core/styles";
import { AsyncPaginate } from "react-select-async-paginate";
import {
  AppBar,
  Button,
  CircularProgress,
  Box,
  Grid,
  Select,
  InputLabel,
  MenuItem,
  Container,
  FormControl,
} from "@material-ui/core";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import { groupBy, isEmpty } from "lodash";
import { chartConfig } from "variables/charts.js";

import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";

const useStyles = makeStyles(styles);

import asyncLoaderUtil from "views/utils/asyncLoaderUtil";

export default function Graphs({ dataSet }) {
  const classes = useStyles();
  const loadOptions = async (search, prevOptions) => {
    await asyncLoaderUtil.sleep(1000);
    let filteredOptions;
    if (!search) {
      filteredOptions = products;
    } else {
      const searchLower = search.toLowerCase();
      filteredOptions = products.filter(({ label }) =>
        label?.toLowerCase().includes(searchLower)
      );
    }
    const hasMore = filteredOptions.length > prevOptions.length + 10;
    const slicedOptions = filteredOptions.slice(
      prevOptions.length,
      prevOptions.length + 10
    );
    return {
      options: slicedOptions,
      hasMore,
    };
  };
  const columns = ["price", "total_booking_count"];
  const columnLabel = {
    price: "Price",
    total_booking_count: "Booking",
  };

  const [chartData, setChartData] = React.useState({ labels: [], series: [] });
  const [isLoading, setLoading] = React.useState(false);

  const [product, setProductId] = React.useState("");
  const [products, setProducts] = React.useState([]);

  // eslint-disable-next-line no-unused-vars
  const [primaryColumn, setPrimaryColumn] = React.useState("");
  // eslint-disable-next-line no-unused-vars
  const [secondaryColumn, setSecondaryColumn] = React.useState("");

  const mappedData = useMemo(() => {
    return groupBy(dataSet, "id");
  }, [dataSet]);

  const productSelect = (event) => {
    setProductId(event);
    setPrimaryColumn(columns[0]);
  };

  const columnSelect = (event, column) => {
    column === "primary"
      ? setPrimaryColumn(event.target.value)
      : setSecondaryColumn(event.target.value);
  };

  const addSecondaryColumn = () => {
    columns.map((i) => {
      if (isEmpty(secondaryColumn) && i !== primaryColumn)
        setSecondaryColumn(i);
    });
  };

  React.useEffect(() => {
    const products = [];
    for (let product in mappedData) {
      products.push({
        value: product,
        label: mappedData[product][0].product_title,
      });
    }
    setProducts(products);
  }, [mappedData]);

  const getChartData = () => {
    if (product.value && !isEmpty(mappedData)) {
      setLoading(true);
      let labels = [];
      let seriesOne = [];
      let seriesTwo = [];
      for (let i = 0; i < mappedData[product.value].length; i++) {
        const item = mappedData[product.value][i];
        labels.push(item.date);
        seriesOne.push(item[primaryColumn]);
        if (!isEmpty(secondaryColumn)) seriesTwo.push(item[secondaryColumn]);
      }
      let series = [seriesOne];
      if (!isEmpty(secondaryColumn)) series.push(seriesTwo);
      setChartData({
        labels,
        series,
      });
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (primaryColumn && product.value && !isEmpty(mappedData)) {
      getChartData();
    }
  }, [product, primaryColumn, secondaryColumn, mappedData]);

  return (
    <div className={classes.root}>
      {isLoading ? (
        <Box position="relative" display="inline-flex">
          <CircularProgress disableShrink={true} />
        </Box>
      ) : (
        <div>
          <AppBar color="default" position="static">
            <FormControl className={classes.muiSelect}>
              <AsyncPaginate
                value={product}
                loadOptions={loadOptions}
                onChange={productSelect}
                shouldLoadMore={asyncLoaderUtil.shouldLoadMore}
              />
            </FormControl>
          </AppBar>
          <AppBar color="default" position="static">
            <Grid container>
              <Grid item xs={6} sm={3}>
                <Box m={1}>
                  <FormControl className={classes.margin}>
                    <InputLabel id="column-one">Column</InputLabel>
                    <Select
                      className={classes.muiSelect}
                      labelId="column-one"
                      value={primaryColumn}
                      onChange={($event) => columnSelect($event, "primary")}
                    >
                      {columns.map((column) => (
                        <MenuItem key={column} value={column}>
                          {columnLabel[column]}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                {!isEmpty(primaryColumn) && (
                  <Box m={1}>
                    {isEmpty(secondaryColumn) ? (
                      <Button onClick={addSecondaryColumn}>
                        Add Another Column
                      </Button>
                    ) : (
                      <FormControl className={classes.margin}>
                        <InputLabel id="column-two">Column</InputLabel>
                        <Select
                          className={classes.muiSelect}
                          labelId="column-two"
                          value={secondaryColumn}
                          onChange={($event) =>
                            columnSelect($event, "secondary")
                          }
                        >
                          <MenuItem key="" value="">
                            None
                          </MenuItem>
                          {columns.map(
                            (column) =>
                              column !== primaryColumn && (
                                <MenuItem key={column} value={column}>
                                  {columnLabel[column]}
                                </MenuItem>
                              )
                          )}
                        </Select>
                      </FormControl>
                    )}
                  </Box>
                )}
              </Grid>
            </Grid>
          </AppBar>
          <Container>
            <Card chart>
              <CardHeader color="success">
                <ChartistGraph
                  className="ct-chart"
                  data={chartData}
                  type="Line"
                  options={chartConfig.options}
                  listener={chartConfig.animation}
                />
              </CardHeader>
              <CardBody>
                <h4 className={classes.cardTitle}>{product.label}</h4>
              </CardBody>
            </Card>
          </Container>
        </div>
      )}
    </div>
  );
}

Graphs.propTypes = {
  dataSet: PropTypes.array,
};
