import React, { useState, useEffect } from "react";
import {Dialog,DialogTitle,DialogContent,DialogActions,Button,TextField,Select,MenuItem,FormControl,InputLabel,FormHelperText} from "@mui/material";
import axios from "axios";
import {baseUrl} from '../environment/Baseurl'

const AddNewDialog = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    Date: new Date().toISOString(),ItemId: "",LedgerId: "",SubTotal: "",Discount: 0,Total: "",ReceivedAmount: 0,Narration: "", PaymentType: "",BankId: 0,SaleId: 0});

  const resetForm = () => setFormData({ Date: new Date().toISOString(), ItemId: "", LedgerId: "", SubTotal: "", Discount: 0, Total: "", ReceivedAmount: 0, Narration: "", PaymentType: "", BankId: 0, SaleId: 0 });

  useEffect(() => {
    if (open) {
      resetForm();
    }
  }, [open]);


  const [customers, setCustomers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [items, setItems] = useState([]);
  const [errors, setErrors] = useState({});
  const [discountErrorDialogOpen, setDiscountErrorDialogOpen] = useState(false);
  const [receivedAmountErrorDialogOpen, setReceivedAmountErrorDialogOpen] =useState(false);

  useEffect(() => {
    axios
      .post(`${baseUrl}customer/getCustomer`)
      .then((response) => {
        if (response.data.ResponseCode === 200) {
          setCustomers(response.data.Response);
        }
      })
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    axios
      .post(`${baseUrl}product/getCetegory`)
      .then((response) => {
        if (response.data.ResponseCode === 200) {
          setCategories(response.data.Response);
        }
      })
      .catch((error) => console.error(error));
  }, []);

  const handleCategoryChange = (event) => {
    const categoryId = event.target.value;
    setFormData({
      ...formData,
      CategoryId: categoryId,
      SubcategoryId: "",
      ItemId: "",
    });
    setSubcategories([]);
    setItems([]);
    axios
      .post(
        `${baseUrl}product/getSubcetegoryByCategory?categoryId=${categoryId}`
      )
      .then((response) => {
        if (response.data.ResponseCode === 200) {
          setSubcategories(response.data.Response);
        }
      })
      .catch((error) => console.error(error));
  };

  const handleSubcategoryChange = (event) => {
    const subcategoryId = event.target.value;
    setFormData({ ...formData, SubcategoryId: subcategoryId, ItemId: "" });
    setItems([]);
    axios
      .post(
        `${baseUrl}product/getItemBySubcategory?subcategoryId=${subcategoryId}`
      )
      .then((response) => {
        if (response.data.ResponseCode === 200) {
          setItems(response.data.Response);
        }
      })
      .catch((error) => console.error(error));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    const numericFields = ["SubTotal", "Discount", "Total", "ReceivedAmount", "BankId", "SaleId"];
    const parsedValue = numericFields.includes(name) ? parseFloat(value) || 0 : value;
  
    if (name === "ItemId") {
      const selectedItem = items.find((item) => item.ItemId === value);
      if (selectedItem) {
        setFormData({
          ...formData,
          [name]: value,
          SubTotal: selectedItem.Price,
          Total: selectedItem.Price - (formData.Discount || 0),
        });
      }
    } else if (name === "Discount") {
      if (parsedValue > formData.SubTotal) {
        setDiscountErrorDialogOpen(true);
      } else {
        setFormData({
          ...formData,
          Discount: parsedValue,
          Total: formData.SubTotal - parsedValue,
        });
      }
    } else if (name === "ReceivedAmount") {
      if (parsedValue > formData.Total) {
        setReceivedAmountErrorDialogOpen(true);
      } else {
        setFormData({
          ...formData,
          ReceivedAmount: parsedValue,
        });
      }
    } else {
      setFormData({ ...formData, [name]: parsedValue });
    }
  };
  
  const handleSubmit = () => {
    const validationErrors = {};
    if (!formData.LedgerId) validationErrors.LedgerId = "Customer is required";
    if (!formData.ItemId) validationErrors.ItemId = "Item is required";
    if (formData.SubTotal <= 0) validationErrors.SubTotal = "Subtotal must be greater than zero";
    if (formData.Total <= 0) validationErrors.Total = "Total must be greater than zero";
    setErrors(validationErrors);
  
    if (Object.keys(validationErrors).length === 0) {
      const payload = {
        ...formData,
        Discount: parseFloat(formData.Discount) || 0,
        SubTotal: parseFloat(formData.SubTotal) || 0,
        Total: parseFloat(formData.Total) || 0,
        ReceivedAmount: parseFloat(formData.ReceivedAmount) || 0,
        SaleDetail: [
          {
            ItemId: formData.ItemId,
            Price: formData.SubTotal, // Assuming Price is the same as SubTotal
          }
        ]
      };
      axios
        .post(`${baseUrl}order/insertOrder`, payload)
        .then((response) => {
          console.log(response.data);
          onClose();
        })
        .catch((error) => console.error(error));
    }
  };
  
  const handleDiscountErrorDialogClose = () => {
    setDiscountErrorDialogOpen(false);
  };

  const handleReceivedAmountErrorDialogClose = () => {
    setReceivedAmountErrorDialogOpen(false);
  };

  const handleDialogClose = (event, reason) => {
    if (reason !== "backdropClick") {
      onClose();
    }
  };

  return (
    <>
      <Dialog open={open} onClose={handleDialogClose}>
        <DialogTitle>Add New Service Entry</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <TextField
              label="Date"
              type="datetime-local"
              name="Date"
              value={formData.Date}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl fullWidth margin="dense" error={!!errors.LedgerId}>
            <InputLabel shrink>Customer</InputLabel>
            <Select
              name="LedgerId"
              value={formData.LedgerId}
              onChange={handleChange}
              displayEmpty
              label='Customer'
            >
              {customers.map((customer) => (
                <MenuItem key={customer.LedgerId} value={customer.LedgerId}>
                  {customer.CustomerName}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors.LedgerId}</FormHelperText>
          </FormControl>

          <FormControl fullWidth margin="dense">
            <InputLabel shrink>Category</InputLabel>
            <Select
              name="CategoryId"
              value={formData.CategoryId || ""}
              onChange={handleCategoryChange}
              displayEmpty
              label='Category'
            >
              {categories.map((category) => (
                <MenuItem key={category.CategoryId} value={category.CategoryId}>
                  {category.CategoryName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense">
            <InputLabel shrink>Subcategory</InputLabel>
            <Select
              name="SubcategoryId"
              value={formData.SubcategoryId || ""}
              onChange={handleSubcategoryChange}
              displayEmpty
              disabled={!formData.CategoryId}
              label='Subcategory'

            >
              {subcategories.map((subcategory) => (
                <MenuItem
                  key={subcategory.SubcategoryId}
                  value={subcategory.SubcategoryId}
                >
                  {subcategory.SubcategoryName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense" error={!!errors.ItemId}>
            <InputLabel shrink>Item</InputLabel>
            <Select
              name="ItemId"
              value={formData.ItemId || ""}
              onChange={handleChange}
              displayEmpty
              disabled={!formData.SubcategoryId}
              label='Item'
            >
              {items.map((item) => (
                <MenuItem key={item.ItemId} value={item.ItemId}>
                  {item.ItemName}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors.ItemId}</FormHelperText>
          </FormControl>

          <FormControl fullWidth margin="dense" error={!!errors.SubTotal}>
            <TextField
              label="Subtotal"
              type="number"
              min={0}
              name="SubTotal"
              value={formData.SubTotal}
              onChange={handleChange}
              InputProps={{
                readOnly: true,
              }}
            />
            <FormHelperText>{errors.SubTotal}</FormHelperText>
          </FormControl>

          <FormControl fullWidth margin="dense">
            <TextField
              label="Discount"
              type="number"
              name="Discount"
              value={formData.Discount}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl fullWidth margin="dense" error={!!errors.Total}>
            <TextField
              label="Total"
              type="number"
              name="Total"
              value={formData.Total}
              onChange={handleChange}
              InputProps={{
                readOnly: true,
              }}
            />
            <FormHelperText>{errors.Total}</FormHelperText>
          </FormControl>

          <FormControl fullWidth margin="dense">
            <TextField
              label="Received Amount"
              type="number"
              name="ReceivedAmount"
              value={formData.ReceivedAmount}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl fullWidth margin="dense">
            <TextField
              label="Narration"
              name="Narration"
              value={formData.Narration}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl fullWidth margin="dense">
            <TextField
              label="Payment Type"
              name="PaymentType"
              value={formData.PaymentType}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl fullWidth margin="dense">
            <TextField
              label="Bank ID"
              type="number"
              name="BankId"
              value={formData.BankId}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl fullWidth margin="dense">
            <TextField
              label="Sale ID"
              type="number"
              name="SaleId"
              value={formData.SaleId}
              onChange={handleChange}
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* for disount  */}
      <Dialog
        open={discountErrorDialogOpen}
        onClose={handleDiscountErrorDialogClose}
      >
        <DialogTitle>Discount Error</DialogTitle>
        <DialogContent>
          <p>Discount cannot exceed the SubTotal value.</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDiscountErrorDialogClose} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>

      {/* for receivedamount   */}
      <Dialog
        open={receivedAmountErrorDialogOpen}
        onClose={handleReceivedAmountErrorDialogClose}
      >
        <DialogTitle>Received Amount Error</DialogTitle>
        <DialogContent>
          <p>Received Amount is  less than the Total value.</p>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleReceivedAmountErrorDialogClose}
            color="primary"
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddNewDialog;
