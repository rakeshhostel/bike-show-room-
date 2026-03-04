import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Ping the server immediately so Render's free tier wakes up faster
// before the user's first API query fires
fetch("/api/bikes?category=Trending&_warmup=1", { credentials: "include" }).catch(() => { });

createRoot(document.getElementById("root")!).render(<App />);

