import React, { useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { Grid, TextField, Typography, Button, FormControl, Autocomplete, Dialog, DialogContent, DialogActions, DialogTitle, Grow, Snackbar, } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';


const GET_CATEGORIES = gql`
  query GetCategories {
    presents(distinct_on: category, order_by: { category: asc }) {
      category
    }
  }
`;

const ADD_PRESENT = gql`
  mutation AddPresent(
    $name: String
    $image_url: String
    $description: String
    $category: String
    $price: String
    $url: String
  ) {
    insert_presents(
      objects: {
        name: $name
        image_url: $image_url
        description: $description
        category: $category
        price: $price
        url: $url
      }
    ) {
      affected_rows
      returning {
        id
        name
        category
        price
        description
        image_url
        url
      }
    }
  }
`;

const DELETE_PRESENTS_BY_CATEGORY = gql`
  mutation DeletePresentsByCategory($category: String!) {
    delete_presents(where: { category: { _eq: $category } }) {
      affected_rows
    }
  }
`;


function AddItemForm({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    image_url: '',
    url: '',
  });
  const [addPresent] = useMutation(ADD_PRESENT);
  const [deletePresents] = useMutation(DELETE_PRESENTS_BY_CATEGORY);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState('');

  //graphql
  const { data } = useQuery(GET_CATEGORIES);
  const categories = data?.presents?.map((cat) => cat.category).filter(Boolean) || [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCategoryChange = async (event, newValue, reason) => {
    const previousCategory = formData.category;

    if (reason === 'clear' && categories.includes(previousCategory)) {
      const confirmed = window.confirm(
        `Do you want to delete the category "${previousCategory}" and all its items?`
      );
      if (confirmed) {
        try {
          await deletePresents({
            variables: { category: previousCategory },
            refetchQueries: [{ query: GET_CATEGORIES }],
          });
          alert(`Category "${previousCategory}" has been deleted.`);
        } catch (error) {
          console.error('Error deleting category:', error);
          alert('Something went wrong while deleting.');
        }
      }
    }

    // Always update form data
    setFormData((prev) => ({ ...prev, category: newValue || '' }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const missingFields = Object.entries(formData).filter(([key, value]) => !value);
    if (missingFields.length > 0) {
      alert(`Please fill out all fields: ${missingFields.map(([key]) => key).join(', ')}`);
      return;
    }

    try {
      await addPresent({
        variables: {
          name: formData.name,
          image_url: formData.image_url,
          description: formData.description,
          category: formData.category,
          price: formData.price,
          url: formData.url,
        },
      });
      onSuccess(); // Refetch data
      onClose(); // Close form
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };


  return (
    <div
      style={{
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          width: '400px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography variant="h4" component="h2" textAlign={'center'}>
          Add New Item
        </Typography>
        <Grid container spacing={2}>
          {Object.keys(formData).map((field) => (
            <Grid item xs={12} sm={12} key={field}>
              {field === 'category' ? (
                <FormControl fullWidth variant="outlined">
                  <Autocomplete
                    freeSolo
                    options={categories}
                    value={formData.category}
                    onChange={handleCategoryChange}
                    renderOption={(props, option) => (
                      <li
                        {...props}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          paddingRight: '8px',
                        }}
                      >
                        <span>{option}</span>
                        <DeleteIcon
                          fontSize="small"
                          style={{ cursor: 'pointer', marginLeft: 8 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setCategoryToDelete(option);
                            setOpenDeleteModal(true);
                          }}
                        />
                      </li>
                    )}
                    ListboxProps={{
                      style: {
                        maxHeight: '200px', // sets max height
                        overflowY: 'auto',  // enables vertical scrolling
                      },
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Category"
                        variant="outlined"
                        name="category"
                        onChange={handleChange}
                      />
                    )}
                  />

                </FormControl>
              ) : (
                <TextField
                  fullWidth
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  variant="outlined"
                />
              )}
            </Grid>
          ))}
        </Grid>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
          <Button
            type="button"
            onClick={onClose}
            variant="outlined"
            color="tertiary"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
          >
            Add
          </Button>
        </div>
        <Dialog
          open={openDeleteModal}
          onClose={() => setOpenDeleteModal(false)}
          TransitionComponent={Grow}
          BackdropProps={{
            style: {
              backdropFilter: 'blur(4px)',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
            },
          }}
          PaperProps={{
            style: {
              borderRadius: '12px',
              padding: '20px',
            },
          }}
        >
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete all items under the category "<strong>{categoryToDelete}</strong>"?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeleteModal(false)} variant="outlined">
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={async () => {
                try {
                  await deletePresents({
                    variables: { category: categoryToDelete },
                    refetchQueries: [{ query: GET_CATEGORIES }],
                  });
                  if (formData.category === categoryToDelete) {
                    setFormData((prev) => ({ ...prev, category: '' }));
                  }
                  setOpenDeleteModal(false);
                  setSnackbarOpen(true); // Show success toast
                } catch (err) {
                  console.error('Error deleting category:', err);
                  alert('Something went wrong while deleting.');
                }
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          message={`Category "${categoryToDelete}" deleted.`}
        />
      </form>
    </div>
  );
}

export default AddItemForm;

