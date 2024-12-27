import React from 'react';
import './Card.css';

function CategoryCard({ category, itemCount, onClick }) {
  return (
    <div
      className="card"
      onClick={onClick}
      style={{
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '20px',
        textAlign: 'center',
        margin: '10px',
        cursor: 'pointer',
        width: '150px',
      }}
    >
      <h3>{category}</h3>
      <p>{itemCount} items</p>
    </div>
  );
}

export default CategoryCard;
