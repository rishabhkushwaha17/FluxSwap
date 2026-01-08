// Polyfills for Node.js modules used by Web3 libraries
import { Buffer } from 'buffer';
import process from 'process';

// Make polyfills available globally
window.Buffer = Buffer;
window.process = process;

import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import App from "./App.jsx";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
