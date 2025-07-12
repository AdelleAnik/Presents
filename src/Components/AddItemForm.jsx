import React, { useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { Grid, TextField, Typography, Button, FormControl, Autocomplete, Dialog, DialogContent, DialogActions, DialogTitle, Grow, Snackbar } from '@mui/material';
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

const UPDATE_PRESENT = gql`
  mutation UpdatePresent($id: Int!, $changes: presents_set_input!) {
    update_presents_by_pk(pk_columns: { id: $id }, _set: $changes) {
      id
    }
  }
`;

function AddItemForm({ onClose, onSuccess, setFlyCard, categoryRefs, initialData = null }) {
  const isEditMode = Boolean(initialData?.id);
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    category: initialData?.category || '',
    price: initialData?.price || '',
    description: initialData?.description || '',
    image_url: initialData?.image_url || '',
    url: initialData?.url || '',
  });

  const [addPresent] = useMutation(ADD_PRESENT);
  const [updatePresent] = useMutation(UPDATE_PRESENT);
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
    // 🔒 Block deletion if user is just clearing input
    if (reason === 'clear') {
      setFormData((prev) => ({ ...prev, category: '' }));
      return;
    }

    // ✅ Update input normally
    setFormData((prev) => ({ ...prev, category: newValue || '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const missingFields = Object.entries(formData).filter(([_, value]) => !value);
    if (missingFields.length > 0) {
      alert(`Please fill out all fields: ${missingFields.map(([key]) => key).join(', ')}`);
      return;
    }

    try {
      if (isEditMode) {
        await updatePresent({
          variables: {
            id: initialData.id,
            changes: { ...formData },
          },
        });
        onSuccess();
        onClose();
        return; // Skip flying animation for edit
      }

      await addPresent({ variables: { ...formData } });

      const button = document.querySelector('button[type="submit"]');
      const rect = button.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      sparkleBurst(x, y);
      setFormSubmitted(true);

      const categoryElement = categoryRefs.current[formData.category];
      if (categoryElement) {
        const toRect = categoryElement.getBoundingClientRect();
        setFlyCard({ from: rect, to: toRect, category: formData.category });
      }

      setTimeout(() => setFormSubmitted(false), 200);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error submitting item:', error);
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
        zIndex: 1300,
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
          borderRadius: '16px',
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
          maxHeight: '90vh',
          overflowY: 'auto',
          margin: '0 16px',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography
            variant="h4"
            component="h2"
            textAlign="center"
            sx={{
              fontWeight: 'bold',
              background: 'linear-gradient(90deg, #ff6ec4, #7873f5)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 1px 2px rgba(0,0,0,0.1)',
              mb: 3,
            }}
          >
            {/* ✨ Add New Item ✨ */}
            {isEditMode ? 'Edit' : 'Add'} New Item
          </Typography>
        </motion.div>


        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Grid container spacing={1.5}>
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
                            padding: '8px 16px',
                            margin: '4px 8px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            backgroundColor: props['aria-selected'] ? '#f3e5f5' : 'transparent',
                            transition: 'background-color 0.2s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#fce4ec';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = props['aria-selected'] ? '#f3e5f5' : 'transparent';
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
                          backgroundColor: '#fdf6fd',
                          borderRadius: '12px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                          padding: '6px 0',
                          fontSize: '0.95rem',
                          color: '#444',
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Category"
                          variant="outlined"
                          name="category"
                          onChange={handleChange}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '12px',
                              backgroundColor: '#fdf6fd',
                              '& fieldset': {
                                borderColor: '#ce93d8',
                              },
                              '&:hover fieldset': {
                                borderColor: '#ab47bc',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#7e57c2',
                                boxShadow: '0 0 0 2px rgba(126, 87, 194, 0.1)',
                              },
                            },
                            '& .MuiInputLabel-root': {
                              fontWeight: 'bold',
                              color: '#9c27b0',
                            },
                          }}
                        />
                      )}

                    />
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 1,
                        fontSize: '0.8rem',
                        color: '#9c27b0', // a nice purple from your theme
                        fontStyle: 'italic',
                        textAlign: 'left',
                      }}
                    >
                      💡 You can type to create a new category or select from the list.
                    </Typography>


                  </FormControl>
                ) : (
                  <TextField
                    fullWidth
                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: '#fdf6fd',
                        '& fieldset': {
                          borderColor: '#ce93d8',
                        },
                        '&:hover fieldset': {
                          borderColor: '#ab47bc',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#7e57c2',
                          boxShadow: '0 0 0 2px rgba(126, 87, 194, 0.1)',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        fontWeight: 'bold',
                        color: '#9c27b0',
                      },
                    }}
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
              padding: '8px 24px',
              fontWeight: 'bold',
              color: '#ab47bc',
              borderColor: '#ab47bc',
              backgroundColor: 'transparent',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: '#f3e5f5',
                borderColor: '#9c27b0',
                color: '#9c27b0',
                boxShadow: '0 0 8px rgba(156, 39, 176, 0.2)',
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
            {isEditMode ? 'Update' : 'Add'}
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

