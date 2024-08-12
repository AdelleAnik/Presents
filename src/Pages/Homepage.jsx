import React from "react";
import './Homepage.css';
import CardList from "../Components/CardsList";
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


function Homepage(){
    const { data } = useQuery(GET_PRESENTS);
    if (data) {
        console.log(data.presents);
    }
    if (!data || !data.presents) return <p>No data found!</p>; 
    return(
        <div>
           <h1 style={{ textAlign: 'center' }}>Gifts for Adelle</h1>
           <CardList items={data.presents} />
        </div>
    )
}
export default Homepage