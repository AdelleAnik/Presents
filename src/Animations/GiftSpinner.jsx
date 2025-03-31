import React, { useState } from 'react';
import { Button, Box, Typography } from '@mui/material';
import { motion, useAnimation } from 'framer-motion';
import confetti from 'canvas-confetti';

function GiftSpinner({ presents }) {
  const itemHeight = 260;
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedGift, setSelectedGift] = useState(null);
  const [reelItems, setReelItems] = useState([]);
  const controls = useAnimation();

  const spin = async () => {
    if (isSpinning || presents.length === 0) return;

    setIsSpinning(true);
    setSelectedGift(null);

    const rounds = Math.floor(Math.random() * 4) + 4;
    const selectedIndex = Math.floor(Math.random() * presents.length);
    const totalItems = rounds * presents.length + selectedIndex;

    const paddedItems = [
      null, // spacer on top
      ...Array.from({ length: totalItems + 1 }, (_, i) => presents[i % presents.length]),
      null // spacer on bottom
    ];

    setReelItems(paddedItems);
    
    const finalY = -itemHeight * (totalItems + 1);

    await controls.start({
      y: finalY,
      transition: {
        duration: 2,
        ease: [0.15, 0.6, 0.35, 1],
      },
    });

    const winner = paddedItems[totalItems + 1]; // center item
    setSelectedGift(winner);
    setIsSpinning(false);
    confetti({ particleCount: 100, spread: 70 });
  };

  return (
    <Box sx={{ textAlign: 'center', my: 4 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        🎰 Spin the Gift Wheel
      </Typography>

      <Box
        sx={{
          width: 220,
          height: itemHeight,
          overflow: 'hidden',
          border: '5px solid #ce93d8',
          borderRadius: '12px',
          backgroundColor: '#fce4ec',
          margin: '0 auto',
          position: 'relative',
        }}
      >
        <motion.div animate={controls} initial={{ y: 0 }}>
          {reelItems.map((gift, i) => (
            <Box
              key={i}
              sx={{
                height: itemHeight,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {gift ? (
                <img
                  src={gift.image_url}
                  alt={gift.name}
                  style={{
                    maxHeight: '80%',
                    maxWidth: '80%',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  }}
                />
              ) : (
                <div style={{ height: itemHeight }} />
              )}
            </Box>
          ))}
        </motion.div>
      </Box>

      <Button
        onClick={spin}
        disabled={isSpinning}
        sx={{
          mt: 2,
          px: 4,
          py: 1,
          borderRadius: '999px',
          background: 'linear-gradient(90deg, #ba68c8, #f06292)',
          color: 'white',
          fontWeight: 'bold',
          '&:hover': {
            background: 'linear-gradient(90deg, #ab47bc, #ec407a)',
          },
        }}
      >
        {isSpinning ? 'Spinning...' : 'Spin'}
      </Button>

      {selectedGift && (
        <Typography sx={{ mt: 2 }} variant="subtitle1">
          🎁 You got: <strong>{selectedGift.name}</strong>!
        </Typography>
      )}
    </Box>
  );
}

export default GiftSpinner;
