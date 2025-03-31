import React, { useEffect, useRef, useState } from 'react';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip.tsx";

interface TruncatedCellProps {
    text: string;
    className?: string;
}

export const TruncatedCell: React.FC<TruncatedCellProps> = ({ text, className = '' }) => {
    const cellRef = useRef<HTMLDivElement>(null);
    const [isTruncated, setIsTruncated] = useState(false);

    useEffect(() => {
        const el = cellRef.current;
        if (el) {
            // Se il contenuto interno (scrollWidth) supera la larghezza visibile (clientWidth), è troncato.
            setIsTruncated(el.scrollWidth > el.clientWidth);
        }
    }, [text]);

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div ref={cellRef} className={`truncate ${className}`}>
                        {text}
                    </div>
                </TooltipTrigger>
                {isTruncated && (
                    <TooltipContent side="top" align="center">
                        {text}
                    </TooltipContent>
                )}
            </Tooltip>
        </TooltipProvider>
    );
};
