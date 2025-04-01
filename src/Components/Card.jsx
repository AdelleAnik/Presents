import React from 'react';
import './Card.css';
import { Typography, Tooltip } from '@mui/material';

function Card({ item, onEdit, onDelete, cardRef, highlight }) {
  return (
    <div className={`card ${highlight ? 'highlighted' : ''}`}
      ref={cardRef}>
      <a href={item.url} className="card-link">
        <img src={item.image_url} alt={item.name} />
        <div className="card-content">
          <Typography>{item.name}</Typography>
          <Typography>CAD$ {item.price}</Typography>
          <Typography>{item.description}</Typography>
        </div>
      </a>
      <div className="card-actions">
        <Tooltip title="Edit Gift">
          <button onClick={() => onEdit(item)}>✏️</button>
        </Tooltip>
        <Tooltip title="Delete Gift">
          <button onClick={() => onDelete(item)}>🗑️</button>
        </Tooltip>
      </div>
    </div>
  );
}

export default Card;
