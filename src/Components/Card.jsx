import React from 'react';
import './Card.css';
import { Typography } from '@mui/material';


function Card({ item }) {
  return (
    <a href={item.url} className="card-link">
      <div className="card">
        <img src={item.image_url} alt={item.name} />
        <div className="card-content">
        <Typography>{item.name}</Typography>
        <Typography>CAD$ {item.price}</Typography>
        <Typography>{item.description}</Typography>
        </div>
      </div>
    </a>
  );
}

export default Card;
