import React, { useState } from "react";
import './Homepage.css';
import CardList from "../Components/CardsList";
import CategoryCard from "../Components/CategoryCard";
import AddItemForm from "../Components/AddItemForm";
import { useQuery, gql } from '@apollo/client';

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
  const { data, refetch } = useQuery(GET_PRESENTS);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showForm, setShowForm] = useState(false);

  if (!data || !data.presents) return <p>No data found!</p>;

  const groupedPresents = groupByCategory(data.presents);

  return (
    <div>
      {showForm && <AddItemForm onClose={() => setShowForm(false)} onSuccess={refetch} />}
      <h1 style={{ textAlign: 'center' }}>Gifts for Adelle</h1>
      {!selectedCategory ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
          {groupedPresents.map(([category, items]) => (
            <CategoryCard
              key={category}
              category={category}
              itemCount={items.length}
              onClick={() => setSelectedCategory(category)}
            />
          ))}
        </div>
      ) : (
        <div>
          <h1 style={{ textAlign: 'center' }}>{selectedCategory}</h1>
          <button onClick={() => setSelectedCategory(null)} style={{ marginBottom: '20px' }}>
            Back to Categories
          </button>
          <CardList items={groupedPresents.find(([category]) => category === selectedCategory)[1]} />
        </div>
      )}
      <button
        onClick={() => setShowForm(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          fontSize: '24px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        }}
      >
        +
      </button>
    </div>
  );
}

export default Homepage;
