import React from 'react';
import Card from './Card';

const CardList = ({ items }) => {
    console.log(items)
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
      {items.map(item => <Card key={item.id} item={item} />)}
    </div>
  );
}

export default CardList;
