import React from 'react';
import './Card.css'; // This will be our CSS file for styling

function Card({ item }) {
  return (
    <a href={item.url} className="card-link">
      <div className="card">
        <img src={item.imageUrl} alt={item.name} />
        <div className="card-content">
          <h3>{item.name}</h3>
          <p>{item.price}</p>
          <p>{item.description}</p>
        </div>
      </div>
    </a>
  );
}

export default Card;
