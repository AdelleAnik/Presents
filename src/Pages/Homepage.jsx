import React from "react";
import CardList from "../Components/CardsList";

// Dummy data
const items = [
    { id: 1, name: 'Clear Sparkling Crown Solitaire Ring', price:'CAD$ 100' ,description: 'Size 5', url:'https://ca.pandora.net/en/rings/rings/promise-rings/clear-sparkling-crown-solitaire-ring/198289CZ.html#cgid=rings&sz=20', imageUrl: 'https://res.cloudinary.com/dfn11pasm/image/upload/v1723488438/198289CZ_RGB_d3ggvb.jpg' },
    { id: 2, name: 'Square Sparkle Halo Ring', price:'CAD$ 100' ,description: 'Size 5', url:'https://ca.pandora.net/en/rings/rings/promise-rings/square-sparkle-halo-ring/198863C01.html', imageUrl: 'https://res.cloudinary.com/dfn11pasm/image/upload/v1723488608/198863C01_RGB_auizbk.jpg' },
    { id: 3, name: 'Shooting Stars Sparkling Ring', price:'CAD$ 55' ,description: 'Size 5', url:'https://ca.pandora.net/en/rings/rings/stackable-rings/shooting-stars-sparkling-ring/192365C01.html', imageUrl: 'https://res.cloudinary.com/dfn11pasm/image/upload/v1723488676/198863C01_RGB_u8ycdr.jpg' },
    { id: 4, name: 'Clear Heart Solitaire Ring', price:'CAD$ 65' ,description: 'Size 5', url:'https://ca.pandora.net/en/rings/rings/promise-rings/clear-heart-solitaire-ring/198691C01.html', imageUrl: 'https://res.cloudinary.com/dfn11pasm/image/upload/v1723488758/198863C01_RGB_sp3qqp.jpg' },
    { id: 5, name: 'Tiara Wishbone Ring', price:'CAD$ 55', description: 'Latest tech gadget that...', url:'https://ca.pandora.net/en/rings/rings/stackable-rings/tiara-wishbone-ring/198282CZ.html#navigation', imageUrl: 'https://res.cloudinary.com/dfn11pasm/image/upload/v1723489031/198863C01_RGB_kn7z39.jpg' },
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