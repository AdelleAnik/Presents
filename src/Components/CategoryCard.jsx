import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

function CategoryCard({ category, itemCount, onClick }) {
  return (
    <Card
      onClick={onClick}
      sx={{
        borderRadius: '12px',
        padding: '16px',
        textAlign: 'center',
        margin: '10px',
        cursor: 'pointer',
        width: '160px',
        transition: 'transform 0.2s, box-shadow 0.2s',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
        },
      }}
    >
      <CardContent>
        <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>
          {category}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {itemCount} items
        </Typography>
      </CardContent>
    </Card>
  );
}

export default CategoryCard;
