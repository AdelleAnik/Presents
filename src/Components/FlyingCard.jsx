import React from "react";
import { motion } from "framer-motion";
import { Typography } from "@mui/material";
import { sparkleBurst } from "../utils/SparkleBurst"; // adjust path as needed

function FlyingCard({ flyCard, onComplete }) {
    if (!flyCard || !flyCard.to) return null;

    const { from, to, category } = flyCard;

    return (
        <motion.div
            initial={{
                position: "fixed",
                top: from.top,
                left: from.left,
                width: 160, // ⬅️ larger size
                height: 80,
                background: "linear-gradient(135deg, #fff0f5, #ffe0ec)", // soft magical gradient
                borderRadius: 16,
                boxShadow: "0 8px 20px rgba(240, 98, 146, 0.3)",
                zIndex: 1600,
                scale: 1,
            }}
            animate={{
                top: to.top,
                left: to.left,
                opacity: 0,
                scale: 0.6,
            }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            onAnimationComplete={() => {
                const x = to.left + 80;
                const y = to.top + 40;
                sparkleBurst(x, y);
                onComplete();
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
