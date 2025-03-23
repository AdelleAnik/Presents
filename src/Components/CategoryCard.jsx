import React from 'react';
import { Card, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const CategoryCard = React.forwardRef(({ category, itemCount, onClick }, ref) => {
  return (
    <motion.div
      className="category-card"
      ref={ref} // <--- this line is key!
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 300 }}
      style={{
        margin: '20px',
      }}
    >
      <Card
        onClick={onClick}
        sx={{
          minWidth: 160,
          maxWidth: 220,
          height: 120,
          p: 2,
          borderRadius: '20px',
          background: 'linear-gradient(145deg, #ffffff, #f9f9f9)',
          boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
          textAlign: 'center',
          cursor: 'pointer',
          position: 'relative',
          display: 'flex',              // <-- NEW
          flexDirection: 'column',      // <-- NEW
          justifyContent: 'center',     // <-- NEW
          alignItems: 'center',         // <-- NEW
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 10px 30px rgba(255, 105, 180, 0.3)',
          },
        }}
      >

        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{
            background: 'linear-gradient(45deg, #ff4081, #7c4dff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            transition: 'all 0.3s ease',
            '&:hover': {
              textShadow: '0 0 8px rgba(255, 64, 129, 0.6), 0 0 15px rgba(124, 77, 255, 0.4)',
              transform: 'scale(1.03)',
            }
          }}
        >
          {category}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: '#a78bfa', // pastel purple (you can try #ffb6c1, #90caf9, or any dreamy shade)
            fontWeight: 500,
            letterSpacing: '0.5px',
            mt: 0.5,
            transition: 'color 0.3s',
            '&:hover': {
              color: '#c084fc',
            }
          }}
        >
          {itemCount} items
        </Typography>


      </Card>
    </motion.div>
  );
});
export default CategoryCard;

