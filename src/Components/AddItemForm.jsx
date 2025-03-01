import React, { useState, useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import { Grid, TextField, Typography, Button, FormControl } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';

const GET_CATEGORIES = gql`
  query GetCategories {
    presents(distinct_on: category, order_by: { category: asc }) {
      category
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

  const { data, loading, error } = useQuery(GET_CATEGORIES);

  useEffect(() => {
    console.log('Fetched categories data:', data);
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCategoryChange = (event, newValue) => {
    setFormData((prev) => ({ ...prev, category: newValue || '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const missingFields = Object.entries(formData).filter(([key, value]) => !value);
    if (missingFields.length > 0) {
      alert(`Please fill out all fields: ${missingFields.map(([key]) => key).join(', ')}`);
      return;
    }
  };

  if (loading) return <p>Loading categories...</p>;
  if (error) return <p>Error loading categories: {error.message}</p>;

  const categories = data?.presents?.map((cat) => cat.category).filter(Boolean) || [];

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
        <Typography variant="h4" component="h2">
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
          <Button type="button" onClick={onClose} variant="outlined" color="secondary">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Add
          </Button>
        </div>
      </form>
    </div>
  );
}

export default AddItemForm;
