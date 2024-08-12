import React from "react";
import CardList from "../Components/CardsList";

// Dummy data
const items = [
    { id: 1, name: 'Clear Sparkling Crown Solitaire Ring', price:'CAD$ 100' ,description: 'Size 5', imageUrl: 'https://res.cloudinary.com/dfn11pasm/image/upload/v1723488438/198289CZ_RGB_d3ggvb.jpg' },
    { id: 1, name: 'Square Sparkle Halo Ring', price:'CAD$ 100' ,description: 'Size 5', imageUrl: 'https://res.cloudinary.com/dfn11pasm/image/upload/v1723488608/198863C01_RGB_auizbk.jpg' },
    { id: 1, name: 'Shooting Stars Sparkling Ring', price:'CAD$ 55' ,description: 'Size 5', imageUrl: 'https://res.cloudinary.com/dfn11pasm/image/upload/v1723488676/198863C01_RGB_u8ycdr.jpg' },
    { id: 1, name: 'Clear Heart Solitaire Ring', price:'CAD$ 65' ,description: 'Size 5', imageUrl: 'https://res.cloudinary.com/dfn11pasm/image/upload/v1723488758/198863C01_RGB_sp3qqp.jpg' },
    { id: 2, name: 'Gadget', description: 'Latest tech gadget that...', imageUrl: 'https://example.com/gadget.jpg' },
  ];


function Homepage(){
    return(
        <div>
           <h1 style={{ textAlign: 'center' }}>Gifts for Adelle</h1>
           <CardList items={items} />
        </div>
    )
}
export default Homepage