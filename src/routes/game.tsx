import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/game")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>⚙️ Settings Game Zone</h1>
      <p>Test your reflexes — click the moving dot before time runs out!</p>
      <CatchTheDot />
    </div>
  );
}

function CatchTheDot() {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [dotPos, setDotPos] = useState({ x: 50, y: 50 });
  const [gameOver, setGameOver] = useState(false);

  // Move the dot every 800ms
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setDotPos({
        x: Math.random() * 90,
        y: Math.random() * 70,
      });
    }, 800);
    return () => clearInterval(interval);
  }, [gameOver]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      setGameOver(true);
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  // Reset game
  const restart = () => {
    setScore(0);
    setTimeLeft(30);
    setGameOver(false);
  };

  return (
    <div
      style={{
        position: "relative",
        margin: "2rem auto",
        width: "90%",
        height: "60vh",
        border: "2px solid var(--border-color)",
        borderRadius: "10px",
        backgroundColor: "var(--secondary-100)",
        overflow: "hidden",
      }}
    >
      {!gameOver ? (
        <>
          <div
            onClick={() => setScore((s) => s + 1)}
            style={{
              position: "absolute",
              top: `${dotPos.y}%`,
              left: `${dotPos.x}%`,
              transform: "translate(-50%, -50%)",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "var(--primary-100)",
              cursor: "pointer",
              transition: "top 0.2s ease, left 0.2s ease, background-color 0.3s",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              fontWeight: "bold",
              fontSize: "1.1rem",
            }}
          >
            ⏱ {timeLeft}s | 🎯 Score: {score}
          </div>
        </>
      ) : (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
            color: "white",
            borderRadius: "10px",
          }}
        >
          <h2>🏁 Game Over!</h2>
          <p>Your final score: <strong>{score}</strong></p>
          <button
            className="primary"
            onClick={restart}
            style={{ marginTop: "1rem" }}
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
