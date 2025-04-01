import React, { useState, useEffect } from 'react';
import { Button, Box, Typography } from '@mui/material';
import { motion, useAnimation } from 'framer-motion';
import confetti from 'canvas-confetti';
const dingSound = new Audio('/bell.mp3');
const drumRoll = new Audio('/drum-roll.mp3');



function GiftSpinner({ presents, goToGift }) {
    const itemHeight = 260;
    const [isSpinning, setIsSpinning] = useState(false);
    const [selectedGift, setSelectedGift] = useState(null);
    const [reelItems, setReelItems] = useState([]);
    const [previewGift, setPreviewGift] = useState(null);
    const [isBlurry, setIsBlurry] = useState(false);

    const controls = useAnimation();

    useEffect(() => {
        if (!presents.length) return;

        const initialIndex = Math.floor(Math.random() * presents.length);
        const randomGift = presents[initialIndex];
        setPreviewGift(randomGift);

        const padded = [null, randomGift, null];
        setReelItems(padded);
        controls.set({ y: -itemHeight });
    }, [presents, controls]);



    const spin = async () => {
        if (isSpinning || presents.length === 0) return;

        setIsSpinning(true);
        setSelectedGift(null);

        const itemHeight = 260;
        const selectedIndex = Math.floor(Math.random() * presents.length);
        const minRounds = 2;
        const extraSpins = Math.floor(Math.random() * 3); // 0–2 extra
        const totalItems = (minRounds + extraSpins) * presents.length + selectedIndex;

        const paddedItems = [
            null,
            ...Array.from({ length: totalItems + 1 }, (_, i) => presents[i % presents.length]),
            null
        ];

        // Reset scroll position to top before animating
        await controls.set({ y: 0 });
        setReelItems(paddedItems);
        setIsBlurry(true);

        setTimeout(async () => {
            const finalY = -itemHeight * (totalItems + 1);

            let tickInterval = setInterval(() => {
                // drumRoll.currentTime = 0;
                drumRoll.play();
            }, 110); // match your item change speed visually

            const halfwayY = finalY * 0.75; 

            await controls.start({
                y: halfwayY,
                transition: {
                    duration: 2.3,
                    ease: 'linear',
                },
            });

            await controls.start({
                y: finalY,
                transition: {
                    duration: 1.4,
                    ease: [0.15, 0.6, 0.35, 1], // nice ease-out
                },
            });

            clearInterval(tickInterval);

            const winner = paddedItems[totalItems + 1];
            setSelectedGift(winner);
            setIsSpinning(false);
            setIsBlurry(false);
            dingSound.play();
            confetti({ particleCount: 100, spread: 70 });
        }, 50); // short delay ensures layout is ready
    };


    const handleGoToPresent = (gift) => {
        if (!gift) return;

        // Assuming this function is passed down from Homepage via props
        if (typeof goToGift === 'function') {
            goToGift(gift);
        }
    };


    return (
        <Box sx={{ textAlign: 'center', my: 4 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
                🎰 Still unsure about what to pick? Spin the Gift Wheel 😉
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
                                        filter: isBlurry ? 'blur(3px)' : 'none',
                                        transition: 'filter 0.3s ease-in-out'
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

            {selectedGift && isSpinning === false && (
                <>
                    <Typography sx={{ mt: 2 }} variant="subtitle1">
                        🎁 You got: <strong>{selectedGift.name}</strong>!
                    </Typography>
                    <Button
                        onClick={() => handleGoToPresent(selectedGift)}
                        sx={{
                            mt: 1,
                            borderRadius: '20px',
                            backgroundColor: '#64b5f6',
                            color: 'white',
                            fontWeight: 'bold',
                            px: 3,
                            textTransform: 'none',
                            '&:hover': {
                                backgroundColor: '#42a5f5',
                            }
                        }}
                    >
                        🧭 Go to Present
                    </Button>
                </>
            )}

        </Box>
    );
}

export default GiftSpinner;
