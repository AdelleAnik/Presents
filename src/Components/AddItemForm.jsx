import React, { useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { Grid, TextField, Typography, Button, FormControl, Autocomplete, Dialog, DialogContent, DialogActions, DialogTitle, Grow, Snackbar, } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { motion } from 'framer-motion';
import './AddItemForm.css';


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


function AddItemForm({ onClose, onSuccess, setFlyCard, categoryRefs }) {
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
  const [formSubmitted, setFormSubmitted] = useState(false);

  const sparkleBurst = (x, y) => {
    for (let i = 0; i < 15; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle';
      sparkle.style.left = `${x}px`;
      sparkle.style.top = `${y}px`;

      const angle = Math.random() * 2 * Math.PI;
      const radius = 100;
      const offsetX = Math.cos(angle) * radius;
      const offsetY = Math.sin(angle) * radius;
      sparkle.style.setProperty('--x', `${offsetX}px`);
      sparkle.style.setProperty('--y', `${offsetY}px`);

      document.body.appendChild(sparkle);

      setTimeout(() => {
        sparkle.remove();
      }, 1000);
    }
  };

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
      // confetti({
      //   particleCount: 100,
      //   spread: 70,
      //   origin: { y: 0.6 },
      // });
      // Get button center coordinates
      const button = document.querySelector('button[type="submit"]');
      const rect = button.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      sparkleBurst(x, y);
      setFormSubmitted(true);
      const categoryElement = categoryRefs.current[formData.category];
      if (categoryElement) {
        const toRect = categoryElement.getBoundingClientRect();
        setFlyCard({
          from: rect,
          to: toRect,
          category: formData.category,
        });
      }
      setTimeout(() => setFormSubmitted(false), 200);
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
        zIndex: 1300, // Add this or higher!
      }}
    >
      <motion.form
        key={formSubmitted ? 'submitted' : 'default'}
        onSubmit={handleSubmit}
        initial={{ scale: 1 }}
        animate={{ scale: 1.06 }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 12,
        }}
        whileHover={{ boxShadow: '0 0 25px rgba(124, 77, 255, 0.3)' }}
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
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
                          maxHeight: '200px',
                          overflowY: 'auto',
                          scrollbarWidth: 'thin',
                          scrollbarColor: '#999 #f0f0f0',
                          padding: 0,
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
        </motion.div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
          <Button
            type="button"
            onClick={onClose}
            variant="outlined"
            sx={{
              borderRadius: '999px',
              padding: '8px 20px',
              fontWeight: 'bold',
              borderColor: '#ccc',
              color: '#555',
              '&:hover': {
                borderColor: '#999',
                backgroundColor: '#f9f9f9',
              }
            }}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: '#f06292',
              borderRadius: '999px',
              padding: '8px 24px',
              fontWeight: 'bold',
              color: 'white',
              boxShadow: '0 4px 10px rgba(240, 98, 146, 0.4)',
              '&:hover': {
                backgroundColor: '#ec407a',
                boxShadow: '0 6px 14px rgba(240, 98, 146, 0.5)',
              }
            }}
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
              backdropFilter: 'blur(5px)',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
            },
          }}
          PaperProps={{
            sx: {
              borderRadius: 4,
              p: 3,
              boxShadow: 6,
              background: 'linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%)',
            },
          }}
        >
          <DialogTitle sx={{ fontWeight: 'bold', color: '#d32f2f' }}>
            ⚠️ Confirm Deletion
          </DialogTitle>

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
          message={`🎉 Gift added successfully!`}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />

      </motion.form>
    </div>
  );
}

export default AddItemForm;

