import React, { useState } from "react";
import './Homepage.css';
import CardList from "../Components/CardsList";
import CategoryCard from "../Components/CategoryCard";
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
  const { data } = useQuery(GET_PRESENTS);
  const [selectedCategory, setSelectedCategory] = useState(null);

  if (!data || !data.presents) return <p>No data found!</p>;

  const groupedPresents = groupByCategory(data.presents);

  if (!selectedCategory) {
    return (
      <div>
        <h1 style={{ textAlign: 'center' }}>Gifts for Adelle</h1>
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
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>{selectedCategory}</h1>
      <button onClick={() => setSelectedCategory(null)} style={{ marginBottom: '20px' }}>
        Back to Categories
      </button>
      <CardList items={groupedPresents.find(([category]) => category === selectedCategory)[1]} />
    </div>
  );
}

export default Homepage;
