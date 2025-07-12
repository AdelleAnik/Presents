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
  // Split items in half if more than 4
  const splitIndex = items.length > 4 ? Math.ceil(items.length / 2) : items.length;
  const firstRow = items.slice(0, splitIndex);
  const secondRow = items.slice(splitIndex);

  const renderRow = (rowItems) => (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '35px', // 👈 increased gap from 20px to 35px
        marginBottom: '35px', // 👈 also increased bottom margin
      }}
    >
      {rowItems.map((item) => (
        <motion.div
          key={item.id}
          variants={itemVariants}
          style={{
            flex: '0 1 220px', // consistent card width
            maxWidth: '220px',
          }}
        >
          <Card
            item={item}
            onEdit={onEdit}
            onDelete={onDelete}
            highlight={item.id === highlightGiftId}
          />
        </motion.div>
      ))}
    </div>
  );

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      style={{
        padding: '20px',
        maxWidth: '1000px',
        margin: '0 auto',
      }}
    >
      {renderRow(firstRow)}
      {secondRow.length > 0 && renderRow(secondRow)}
    </motion.div>
  );
};


export default CardList;
