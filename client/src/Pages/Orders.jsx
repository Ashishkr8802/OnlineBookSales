import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Box,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SortIcon from "@mui/icons-material/Sort";
import RefreshIcon from "@mui/icons-material/Refresh";
import Preloader from "../Components/Preloader";

function OrderList() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/orders");
      setData(response.data);
    } catch (error) {
      console.error("There was an error fetching the orders!", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSort = () => {
    const sortedData = [...data].sort((a, b) => {
      if (sortOrder === "asc") {
        return a.item.localeCompare(b.item);
      }
      return b.item.localeCompare(a.item);
    });
    setData(sortedData);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const filteredData = data.filter((order) =>
    order.item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
    <Preloader />
    <Container maxWidth="lg">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <TextField
          label="Search Orders"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Button variant="contained" startIcon={<SortIcon />} onClick={handleSort}>
          Sort
        </Button>
        <IconButton onClick={fetchData}>
          <RefreshIcon />
        </IconButton>
      </Box>
      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Item</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.item}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
    </>
  );
}

function OrderTracking() {
  const [isLoading, setIsLoading] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [orderData, setOrderData] = useState(null);

  const handleTrackOrder = () => {
    setIsLoading(true);
    // Simulate a fetch call to backend to get order status
    setTimeout(() => {
      // Simulate order data
      const mockOrderData = {
        id: orderId,
        status: "Shipped",
        expectedDelivery: "2024-07-10",
      };
      setOrderData(mockOrderData);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <Container maxWidth="sm">
      <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
        <TextField
          label="Enter Order ID"
          variant="outlined"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          fullWidth
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleTrackOrder}
          disabled={isLoading}
          style={{ marginTop: 16 }}
        >
          Track Order
        </Button>
        {isLoading && (
          <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
            <CircularProgress />
          </Box>
        )}
        {!isLoading && orderData && (
          <Paper elevation={3} style={{ padding: 16, marginTop: 16 }}>
            <h3>Order ID: {orderData.id}</h3>
            <p>Status: {orderData.status}</p>
            <p>Expected Delivery: {orderData.expectedDelivery}</p>
          </Paper>
        )}
        {!isLoading && !orderData && (
          <p style={{ marginTop: 16 }}>Please enter an Order ID to track your order.</p>
        )}
      </Box>
    </Container>
  );
}

export { OrderList, OrderTracking };
