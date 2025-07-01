import React from "react";
import { motion } from "framer-motion";

interface ConnectionLineProps {
  sourcePos: { x: number; y: number };
  targetPos: { x: number; y: number };
  isTemporary?: boolean;
}

export default function ConnectionLine({
  sourcePos,
  targetPos,
  isTemporary = false,
}: ConnectionLineProps) {
  // Calculate the curved path
  const dx = targetPos.x - sourcePos.x;
  const dy = targetPos.y - sourcePos.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  // Control points for bezier curve
  const controlPointOffset = Math.min(distance * 0.3, 100);
  const cp1x = sourcePos.x + controlPointOffset;
  const cp1y = sourcePos.y;
  const cp2x = targetPos.x - controlPointOffset;
  const cp2y = targetPos.y;

  const path = `M ${sourcePos.x} ${sourcePos.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${targetPos.x} ${targetPos.y}`;

  return (
    <motion.g
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: isTemporary ? 0.5 : 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Shadow/glow effect */}
      <path
        d={path}
        className="connection-line"
        strokeWidth="6"
        stroke="hsl(var(--connection-line))"
        opacity="0.2"
        filter="blur(2px)"
      />

      {/* Main line */}
      <motion.path
        d={path}
        className="connection-line"
        strokeWidth="2"
        stroke="hsl(var(--connection-line))"
        strokeDasharray={isTemporary ? "5,5" : "none"}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />

      {/* Arrow marker */}
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            fill="hsl(var(--connection-line))"
          />
        </marker>
      </defs>

      {!isTemporary && (
        <motion.path
          d={path}
          className="connection-line"
          strokeWidth="2"
          stroke="hsl(var(--connection-line))"
          markerEnd="url(#arrowhead)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, ease: "easeInOut", delay: 0.3 }}
        />
      )}

      {/* Animated flow dots */}
      {!isTemporary && (
        <motion.circle
          r="3"
          fill="hsl(var(--connection-line))"
          initial={{ offsetDistance: "0%" }}
          animate={{ offsetDistance: "100%" }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            offsetPath: `path('${path}')`,
          }}
        />
      )}
    </motion.g>
  );
}
