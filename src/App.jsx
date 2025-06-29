import { useEffect, useRef, useState } from "react";
import {
  ArrowUp,
  ArrowDown,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react";

const App = () => {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [onBreak, setOnBreak] = useState(false);
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setOnBreak(false);
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(25 * 60);
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  const toggleTimer = () => {
    setIsRunning((prev) => !prev);
  };

  const handleIncrement = (type) => {
    if (isRunning) return;
    if (type === "break" && breakLength < 60) setBreakLength((prev) => prev + 1);
    if (type === "session" && sessionLength < 60) {
      const newSession = sessionLength + 1;
      setSessionLength(newSession);
      setTimeLeft(newSession * 60);
    }
  };

  const handleDecrement = (type) => {
    if (isRunning) return;
    if (type === "break" && breakLength > 1) setBreakLength((prev) => prev - 1);
    if (type === "session" && sessionLength > 1) {
      const newSession = sessionLength - 1;
      setSessionLength(newSession);
      setTimeLeft(newSession * 60);
    }
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === 0) {
            audioRef.current.play();
            if (onBreak) {
              setOnBreak(false);
              return sessionLength * 60;
            } else {
              setOnBreak(true);
              return breakLength * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, onBreak, sessionLength, breakLength]);

  return (
    <section className="w-full h-screen flex items-center flex-col justify-center gap-4">
      <audio
        id="beep"
        ref={audioRef}
        src="https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg"
        preload="auto"
      />

      <div className="flex gap-4">
        <div className="flex flex-col border-2 p-4 rounded-2xl">
          <h2 id="break-label">Break Length</h2>
          <div className="flex justify-between items-center gap-4">
            <button id="break-increment" onClick={() => handleIncrement("break")}>
              <ArrowUp />
            </button>
            <p id="break-length">{breakLength}</p>
            <button id="break-decrement" onClick={() => handleDecrement("break")}>
              <ArrowDown />
            </button>
          </div>
        </div>

        <div className="flex flex-col border-2 p-4 rounded-2xl">
          <h2 id="session-label">Session Length</h2>
          <div className="flex justify-between items-center gap-4">
            <button id="session-increment" onClick={() => handleIncrement("session")}>
              <ArrowUp />
            </button>
            <p id="session-length">{sessionLength}</p>
            <button id="session-decrement" onClick={() => handleDecrement("session")}>
              <ArrowDown />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col border-2 p-4 rounded-2xl gap-4 items-center">
        <h2 id="timer-label">{onBreak ? "Break" : "Session"}</h2>
        <p id="time-left" className="text-7xl">
          {formatTime(timeLeft)}
        </p>
        <div className="flex justify-between gap-4">
          <button id="start_stop" onClick={toggleTimer}>
            {isRunning ? <Pause /> : <Play />}
          </button>
          <button id="reset" onClick={resetTimer}>
            <RotateCcw />
          </button>
        </div>
      </div>
    </section>
  );
};

export default App;