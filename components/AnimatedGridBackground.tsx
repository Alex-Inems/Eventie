import { useEffect, useRef } from "react";

const AnimatedGrid = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const gridWidth = canvas.width / 5;
    const gridHeight = gridWidth / 2.5;
    let offset = 0;

    // Generate dynamic moving lines
    const movingLines = Array.from({ length: 10 }, () => ({
      x: Math.floor(Math.random() * 5) * gridWidth,
      y: Math.floor(Math.random() * (canvas.height / gridHeight)) * gridHeight,
      direction: Math.random() > 0.5 ? "horizontal" : "vertical",
      progress: Math.random() * gridWidth,
      speed: Math.random() * 3 + 5, // Different speeds for more dynamic movement
      length: gridWidth * (0.2 + Math.random() * 0.3), // Different lengths
    }));

    const drawGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let y = 0; y < canvas.height; y += gridHeight) {
        const opacity = 1 - y / canvas.height;
        ctx.strokeStyle = `rgba(34, 34, 34, ${opacity})`;
        ctx.lineWidth = 0.6;

        for (let x = 0; x < canvas.width; x += gridWidth) {
          ctx.strokeRect(x, y, gridWidth, gridHeight);
        }

        // Skip drawing circles at the top and left edges
        if (y > 0 && y + gridHeight < canvas.height) {
          for (let x = gridWidth; x < canvas.width; x += gridWidth) {
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(102, 102, 102, ${opacity})`;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(17, 17, 17, ${opacity})`;
            ctx.fill();
          }
        }
      }
    };

    const animateLines = () => {
      offset += 1;
      if (offset > gridWidth) offset = 0;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawGrid();

      for (const line of movingLines) {
        line.progress += line.speed;
        if (line.progress > gridWidth) {
          line.progress = 0;
          line.x = Math.floor(Math.random() * 5) * gridWidth;
          line.y = Math.floor(Math.random() * (canvas.height / gridHeight)) * gridHeight;
          line.direction = Math.random() > 0.5 ? "horizontal" : "vertical";
          line.speed = Math.random() * 3 + 5;
          line.length = gridWidth * (0.2 + Math.random() * 0.3);
        }

        const opacity = 1 - line.y / canvas.height;
        ctx.strokeStyle = `rgba(170, 170, 170, ${opacity})`;
        ctx.lineWidth = 0.6;

        ctx.beginPath();
        if (line.direction === "horizontal") {
          ctx.moveTo(line.x + line.progress, line.y);
          ctx.lineTo(line.x + line.progress - line.length, line.y);
        } else {
          ctx.moveTo(line.x, line.y + line.progress);
          ctx.lineTo(line.x, line.y + line.progress - line.length);
        }
        ctx.stroke();
      }

      requestAnimationFrame(animateLines);
    };

    drawGrid();
    animateLines();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full z-[-1]"
    />
  );
};

export default AnimatedGrid;
