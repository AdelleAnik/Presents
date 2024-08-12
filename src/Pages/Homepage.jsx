import React from "react";
import './Homepage.css';
import CardList from "../Components/CardsList";
import { useQuery, gql } from '@apollo/client';

const GET_PRESENTS = gql`
  query GetPresents {
  presents {
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
    const { loading, error, data } = useQuery(GET_PRESENTS);
    console.log(data.presents)
    if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :</p>;
    return(
        <div>
           <h1 style={{ textAlign: 'center' }}>Gifts for Adelle</h1>
           <CardList items={data.presents} />
        </div>
    )
}
export default Homepage