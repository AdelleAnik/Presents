import React from 'react';
import { motion } from 'framer-motion';
import Card from './Card';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const CardList = ({ items, onEdit, onDelete, highlightGiftId }) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      style={{
        padding: '20px',
        display:'flex' ,
        flexWrap: 'wrap',
        justifyContent:  'center',
        gap: '20px',
        gridTemplateColumns: items.length >= 3 ? 'repeat(auto-fit, minmax(230px, 1fr))' : undefined,
      }}
    >
      {items.map((item) => (
        <motion.div key={item.id} variants={itemVariants}>
          <Card
            item={item}
            onEdit={onEdit}
            onDelete={onDelete}
            highlight={item.id === highlightGiftId}
          />
        </motion.div>
      ))}
    </motion.div>

  );
};

export default CardList;
