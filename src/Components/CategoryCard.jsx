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
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 10px 30px rgba(255, 105, 180, 0.3)', // pink glow
          },
        }}
      >
        <Typography variant="h6" fontWeight="bold" color="primary">
          {category}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {itemCount} items
        </Typography>
      </Card>
    </motion.div>
  );
});
export default CategoryCard;

