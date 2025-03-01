import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { Grid, TextField, Typography, Button, CircularProgress  } from '@mui/material';

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
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'your_upload_preset'); // Replace with your Cloudinary upload preset

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/your_cloud_name/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setFormData((prev) => ({ ...prev, image_url: data.secure_url }));
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
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
        <Typography variant="h4" component="h2">
          Add New Item
        </Typography>
        <Grid container spacing={2}>
          {Object.keys(formData).map((field) => (
            <Grid item xs={12} sm={12} key={field}>
            {field === 'image_url' ? (
              <div>
                <Button variant="contained" component="label" disabled={uploading}>
                  {uploading ? <CircularProgress size={24} color="inherit" /> : 'Upload Image'}
                  <input type="file" hidden onChange={handleImageUpload} accept="image/*" />
                </Button>
                {formData.image_url && (
                  <img
                    src={formData.image_url}
                    alt="Uploaded"
                    style={{ width: '100%', marginTop: '10px', borderRadius: '8px' }}
                  />
                )}
              </div>
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
            color="secondary"
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
      </form>
    </div>
  );
}

export default AddItemForm;

