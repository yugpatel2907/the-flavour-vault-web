"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FlipTextProps {
    /** Additional CSS classes for the wrapper */
    className?: string;
    /** The text content to animate */
    children: string;
    /** Duration of the flip animation in seconds */
    duration?: number;
    /** Initial delay before animation starts in seconds */
    delay?: number;
    /** Whether the animation should loop infinitely */
    loop?: boolean;
    /** Custom separator for splitting text (default is space) */
    separator?: string;
    /** Whether all characters should animate together (no stagger) */
    together?: boolean;
}

export function FlipText({
    className,
    children,
    duration = 2.5,
    delay = 0,
    loop = true,
    separator = " ",
    together = false,
}: FlipTextProps) {
    const words = useMemo(() => children.split(separator), [children, separator]);
    const totalChars = children.length;

    const getCharIndex = (wordIndex: number, charIndex: number) => {
        let index = 0;
        for (let i = 0; i < wordIndex; i++) {
            index += words[i].length + (separator === " " ? 1 : separator.length);
        }
        return index + charIndex;
    };

    return (
        <div
            className={cn(
                "flip-text-wrapper inline-flex flex-wrap leading-none select-none",
                className
            )}
            style={{ perspective: "1200px" }}
        >
            {words.map((word, wordIndex) => {
                const chars = word.split("");

                return (
                    <span
                        key={wordIndex}
                        className="word inline-flex whitespace-nowrap"
                        style={{ transformStyle: "preserve-3d" }}
                    >
                        {chars.map((char, charIndex) => {
                            const currentGlobalIndex = getCharIndex(wordIndex, charIndex);

                            let calculatedDelay = delay;
                            if (!together) {
                                const normalizedIndex = currentGlobalIndex / totalChars;
                                const sineValue = Math.sin(normalizedIndex * (Math.PI / 2));
                                calculatedDelay = sineValue * (duration * 0.25) + delay;
                            }

                            return (
                                <motion.span
                                    key={charIndex}
                                    className="flip-char inline-block relative"
                                    style={{ transformStyle: "preserve-3d" }}
                                    initial={{ rotateX: 0 }}
                                    animate={{
                                        rotateX: [0, 90, 180, 270, 360],
                                    }}
                                    transition={{
                                        duration: duration,
                                        repeat: loop ? Infinity : 0,
                                        repeatDelay: 2,
                                        delay: calculatedDelay,
                                        ease: "easeInOut",
                                    }}
                                >
                                    {char}
                                </motion.span>
                            );
                        })}
                        {separator === " " && wordIndex < words.length - 1 && (
                            <span className="whitespace inline-block">&nbsp;</span>
                        )}
                        {separator !== " " && wordIndex < words.length - 1 && (
                            <span className="separator inline-block">{separator}</span>
                        )}
                    </span>
                );
            })}
        </div>
    );
}

export default FlipText;
