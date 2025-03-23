import React from 'react';
import Card from './Card';

const CardList = ({  items, onEdit, onDelete }) => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
      {items.map(item => <Card key={item.id} item={item} onEdit={onEdit} onDelete={onDelete}/>)}
    </div>
  );
}

export default CardList;
