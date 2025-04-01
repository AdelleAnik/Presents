import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Typography } from "@mui/material";
import { sparkleBurst } from "../utils/SparkleBurst"; // adjust path as needed
import './FlyingCard.css';

function FlyingCard({ flyCard, onComplete }) {
    const trailRef = useRef([]);

    useEffect(() => {
        let animation;
        if (flyCard) {
            // Create sparkle trail
            const sparkleInterval = setInterval(() => {
                const sparkle = document.createElement('div');
                sparkle.className = 'trail-sparkle';
                sparkle.style.left = `${flyCard.from.left + 50 + Math.random() * 10 - 5}px`;
                sparkle.style.top = `${flyCard.from.top + 30 + Math.random() * 10 - 5}px`;
                document.body.appendChild(sparkle);
                trailRef.current.push(sparkle);

                setTimeout(() => {
                    sparkle.remove();
                }, 800);
            }, 50);

            animation = setTimeout(() => {
                clearInterval(sparkleInterval);
                trailRef.current.forEach((el) => el.remove());
                trailRef.current = [];
            }, 1400); // Extended trail to match delayed animation
        }

        return () => clearTimeout(animation);
    }, [flyCard]);

    if (!flyCard || !flyCard.to) return null;

    const { from, to, category } = flyCard;

    return (
        <motion.div
            className="flicker-card"
            initial={{
                position: "fixed",
                top: from.top,
                left: from.left,
                width: 160,
                height: 80,
                background: "linear-gradient(135deg, #fff0f5, #ffe0ec)",
                borderRadius: 16,
                boxShadow: "0 8px 20px rgba(240, 98, 146, 0.3)",
                zIndex: 1600,
                scale: 1,
                opacity: 1,
            }}
            animate={{
                top: to.top,
                left: to.left,
                opacity: 0,
                scale: 0.6,
            }}
            transition={{ delay: 0.6, duration: 0.8, ease: "easeInOut" }}
            onAnimationComplete={() => {
                const x = to.left + 80;
                const y = to.top + 40;
                sparkleBurst(x, y);

                // Rainbow ripple effect
                const ripple = document.createElement('div');
                ripple.className = 'rainbow-ripple';
                ripple.style.left = `${x - 40}px`;
                ripple.style.top = `${y - 40}px`;
                document.body.appendChild(ripple);
                setTimeout(() => ripple.remove(), 1000);

                // Flicker the category card on arrival
                const target = document.elementFromPoint(x, y);
                if (target && target.closest('.category-card')) {
                    const card = target.closest('.category-card');
                    card.classList.add('flicker-card');
                    setTimeout(() => card.classList.remove('flicker-card'), 600);
                }
            }}
        >
            <Typography
                fontSize="14px"
                fontWeight="bold"
                textAlign="center"
                p={2}
                color="deeppink"
            >
                🎁 New Gift for {category}
            </Typography>
        </motion.div>
    );
}

export default FlyingCard;
