import React, { useEffect, useRef, useState } from "react";
import './Homepage.css';
import CardList from "../Components/CardsList";
import CategoryCard from "../Components/CategoryCard";
import AddItemForm from "../Components/AddItemForm";
import { useQuery, gql, useMutation } from '@apollo/client';
import { CircularProgress, Button, Typography, Fab, Box } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import confetti from "canvas-confetti";
import FlyingCard from "../Animations/FlyingCard";
import GiftSpinner from "../Animations/GiftSpinner";


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
  const [highlightGiftId, setHighlightGiftId] = useState(null);
  const [showWheel, setShowWheel] = useState(true);

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

  const goToGift = (gift) => {
    setShowWheel(false);
    setSelectedCategory(gift.category);
    setHighlightGiftId(gift.id);
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
              onClick={() => {
                setSelectedCategory(category);
                setHighlightGiftId(null);
                setShowWheel(false);
              }}
            />
          ))}
        </div>
      ) : (
        <div>
          <Typography
            variant="h4"
            align="center"
            sx={{
              fontWeight: 'bold',
              color: '#5e35b1',
              mt: 4,
              mb: 2,
              textShadow: '0 1px 4px rgba(94, 53, 177, 0.3)',
              letterSpacing: '0.5px',
            }}
          >
            ✨ {selectedCategory} ✨
          </Typography>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => {
              setSelectedCategory(null);
              setShowWheel(true);
              setHighlightGiftId(null); // optional cleanup
            }}
            sx={{
              margin: '20px',
              padding: '8px 20px',
              borderRadius: '30px',
              fontWeight: 'bold',
              textTransform: 'none',
              background: 'linear-gradient(90deg, #ff8a9d, #ffb1e6)',
              color: 'white',
              boxShadow: '0 4px 14px rgba(255, 105, 180, 0.4)',
              '&:hover': {
                background: 'linear-gradient(90deg, #ff6f91, #ffa3d7)',
              }
            }}
          >
            Back to Categories
          </Button>

          {/* <CardList
            items={groupedPresents.find(([category]) => category === selectedCategory)[1]}
            onEdit={(item) => {
              setEditingItem(item);
              setShowForm(true);
            }}
            onDelete={(item) => handleDelete(item)} // we'll define this next
          /> */}
          {(() => {
            const selectedGroup = groupedPresents.find(([category]) => category === selectedCategory);
            const selectedItems = selectedGroup ? selectedGroup[1] : [];

            return selectedItems.length > 0 ? (
              <CardList items={selectedItems} onDelete={(item) => handleDelete(item)} onEdit={(item) => {
                setEditingItem(item);
                setShowForm(true);
              }} highlightGiftId={highlightGiftId} />
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Box
                  sx={{
                    textAlign: 'center',
                    py: 6,
                    px: 2,
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #fff8fb, #f2f7ff)',
                    maxWidth: 500,
                    margin: 'auto',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                  }}
                >
                  <Typography variant="h5" fontWeight="bold" gutterBottom color="secondary">
                    🪄 This category is empty...
                  </Typography>
                  <Typography variant="body1" color="text.secondary" gutterBottom>
                    Why not add something magical? ✨
                    If you don't want to add anyhting that's okay, just go back to the page before and this category will automatically be deleted
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{
                      mt: 2,
                      borderRadius: '999px',
                      backgroundColor: '#f06292',
                      textTransform: 'none',
                      px: 4,
                      py: 1,
                      fontWeight: 'bold',
                      '&:hover': {
                        backgroundColor: '#ec407a',
                      },
                    }}
                    onClick={() => setShowForm(true)}
                  >
                    + Add a Gift
                  </Button>
                </Box>
              </motion.div>
            );
          })()}

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
      {showWheel && (
        <GiftSpinner presents={data.presents} goToGift={goToGift} />
      )}



    </div>
  );
}

export default Homepage;
