import React, { useEffect, useRef, useState } from "react";
import './Homepage.css';
import CardList from "../Components/CardsList";
import CategoryCard from "../Components/CategoryCard";
import AddItemForm from "../Components/AddItemForm";
import { useQuery, gql, useMutation } from '@apollo/client';
import { CircularProgress, Button, Typography, Fab } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import confetti from "canvas-confetti";
import FlyingCard from "../Components/FlyingCard";


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

const DELETE_PRESENT = gql`
  mutation DeletePresent($id: Int!) {
    delete_presents_by_pk(id: $id) {
      id
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
  const [showWelcome, setShowWelcome] = useState(false);
  const [flyCard, setFlyCard] = useState(null); // { from, to, category, id }
  const [editingItem, setEditingItem] = useState(null);
  const [deletePresent] = useMutation(DELETE_PRESENT);
  const categoryRefs = useRef({});

  useEffect(() => {
    const seenWelcome = localStorage.getItem('seenWelcome');
    if (!seenWelcome) {
      setShowWelcome(true);
      localStorage.setItem('seenWelcome', 'true');
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.3 }
      });
    }
  }, []);


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
  const handleDelete = async (item) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${item.name}"?`);
    if (!confirmDelete) return;

    try {
      await deletePresent({ variables: { id: item.id } });
      await refetch(); // refresh list
    } catch (err) {
      console.error("Failed to delete:", err);
      alert("Something went wrong while deleting.");
    }
  };

  return (
    <div>
      {/* <div className="sparkle-background" /> */}
      {showForm && (
        <AddItemForm
          onClose={() => {
            setShowForm(false);
            setEditingItem(null);
          }}
          onSuccess={refetch}
          initialData={editingItem} // ✨ pass the data here
          categoryRefs={categoryRefs}
          setFlyCard={setFlyCard}
        />
      )}
      {showWelcome && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          style={{ textAlign: 'center', marginBottom: '20px' }}
        >
          <Typography variant="h4" color="primary" fontWeight="bold">
            Hi Adelle 👋
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Ready to make someone smile today?
          </Typography>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <Typography variant="h3" align="center" sx={{ fontWeight: 'bold', color: 'purple' }}>
          🎁 Gifts for Adelle
        </Typography>
        <Typography variant="subtitle1" align="center" color="text.secondary" gutterBottom>
          Your magical wish list space ✨
        </Typography>
      </motion.div>
      {!selectedCategory ? (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '24px',
            padding: '20px',
            marginTop: '30px',
          }}
        >
          {groupedPresents.map(([category, items]) => (
            <CategoryCard
              ref={(el) => categoryRefs.current[category] = el}
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
          <CardList
            items={groupedPresents.find(([category]) => category === selectedCategory)[1]}
            onEdit={(item) => {
              setEditingItem(item);
              setShowForm(true);
            }}
            onDelete={(item) => handleDelete(item)} // we'll define this next
          />
        </div>
      )}
      <motion.div
        animate={{
          scale: [1, 1.1, 1], // pulse only, no boxShadow here
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: 'easeInOut'
        }}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 10
        }}
      >
        <Fab
          onClick={() => setShowForm(true)}
          sx={{
            backgroundColor: '#f06292',
            color: '#fff',
            boxShadow: '0 4px 12px rgba(240, 98, 146, 0.4)', // soft pink shadow
            '&:hover': {
              backgroundColor: '#ec407a',
              boxShadow: '0 6px 14px rgba(240, 98, 146, 0.6)', // glow on hover
            }
          }}
        >
          +
        </Fab>
      </motion.div>
      <FlyingCard flyCard={flyCard} onComplete={() => setFlyCard(null)} />
    </div>
  );
}

export default Homepage;
