"use client";

import React, { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";

type SmartImageProps = Omit<ImageProps, "src"> & {
    src?: ImageProps["src"];
    fallbackSrc?: string;
};

const SmartImage = ({ src, fallbackSrc = "/images/slide4.jpg", alt, ...props }: SmartImageProps) => {
    // Only use fallback if src is truly missing or empty
    const isValidSrc = src && (typeof src === 'string' ? src.trim() !== '' : true);
    const [currentSrc, setCurrentSrc] = useState(isValidSrc ? src : fallbackSrc);
    const [hasError, setHasError] = useState(false);

    // Update currentSrc when src prop changes
    useEffect(() => {
        const isValid = src && (typeof src === 'string' ? src.trim() !== '' : true);
        if (isValid) {
            setCurrentSrc(src);
            setHasError(false);
        }
    }, [src]);

    return (
        <Image
            {...props}
            alt={alt}
            src={hasError || !isValidSrc ? fallbackSrc : currentSrc}
            onError={() => {
                if (!hasError) {
                    setHasError(true);
                    setCurrentSrc(fallbackSrc);
                }
            }}
        />
    );
};

export default SmartImage;


