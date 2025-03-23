import React from 'react';
import { motion } from 'framer-motion';
import Card from './Card';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const CardList = ({ items, onEdit, onDelete }) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '24px',
        padding: '20px'
      }}
    >
      {items.map(item => (
        <motion.div key={item.id} variants={itemVariants}>
          <Card item={item} onEdit={onEdit} onDelete={onDelete} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default CardList;
