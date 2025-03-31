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

const CardList = ({ items, onEdit, onDelete, highlightGiftId }) => {
  const renderRow = (rowItems) => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '24px',
        flexWrap: 'nowrap',
        marginBottom: '24px',
      }}
    >
      {rowItems.map(item => (
        <motion.div key={item.id} variants={itemVariants}>
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

  const shouldSplit = items.length > 4;

  const midpoint = shouldSplit ? Math.ceil(items.length / 2) : items.length;
  const topRow = items.slice(0, midpoint);
  const bottomRow = shouldSplit ? items.slice(midpoint) : [];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      style={{ padding: '20px' }}
    >
      {renderRow(topRow)}
      {bottomRow.length > 0 && renderRow(bottomRow)}
    </motion.div>
  );
};

export default CardList;
