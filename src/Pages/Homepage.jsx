import React, { useState } from "react";
import './Homepage.css';
import CardList from "../Components/CardsList";
import CategoryCard from "../Components/CategoryCard";
import AddItemForm from "../Components/AddItemForm";
import { useQuery, gql } from '@apollo/client';
import { CircularProgress, Button, Typography, Box } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

const GET_PRESENTS = gql`
  query GetPresents {
    presents {
      id
      category
      description
      image_url
      name
      price
      url
    }
  }
`;

function groupByCategory(items) {
  return Array.from(
    items.reduce((acc, item) => {
      if (!acc.has(item.category)) {
        acc.set(item.category, []);
      }
      acc.get(item.category).push(item);
      return acc;
    }, new Map())
  );
}

function Homepage() {
  const { data, loading, refetch } = useQuery(GET_PRESENTS);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showForm, setShowForm] = useState(false);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <CircularProgress />
      </div>
    );
  }

  if (!data || !data.presents) return <p>No data found!</p>;

  const groupedPresents = groupByCategory(data.presents);

  return (
    <div>
      {showForm && <AddItemForm onClose={() => setShowForm(false)} onSuccess={refetch} />}

      <Box sx={{ textAlign: 'center', my: 4 }}>
        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontWeight: 'bold',
            background: 'linear-gradient(45deg,rgb(204, 0, 255),rgb(55, 0, 255))',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            marginBottom: '10px',
          }}
        >
          Gifts for Adelle
        </Typography>
        <Box
          sx={{
            width: '60px',
            height: '4px',
            backgroundColor: '#007bff',
            margin: '0 auto',
            borderRadius: '2px',
          }}
        />
      </Box>

      {!selectedCategory ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
          {groupedPresents.map(([category, items]) => (
            <CategoryCard
              key={category}
              category={category}
              itemCount={items.length}
              onClick={() => setSelectedCategory(category)}
            />
          ))}
        </div>
      ) : (
        <div>
          <h1 style={{ textAlign: 'center' }}>{selectedCategory}</h1>
          <Button
            variant="contained"
            color="primary"
            startIcon={<ArrowBackIcon />}
            onClick={() => setSelectedCategory(null)}
            sx={{
              marginBottom: '20px',
              backgroundColor: '#007bff',
              '&:hover': {
                backgroundColor: '#0056b3',
              },
            }}
          >
            Back to Categories
          </Button>
          <CardList items={groupedPresents.find(([category]) => category === selectedCategory)[1]} />
        </div>
      )}
      <button
        onClick={() => setShowForm(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          fontSize: '24px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        }}
      >
        +
      </button>
    </div>
  );
}

export default Homepage;
