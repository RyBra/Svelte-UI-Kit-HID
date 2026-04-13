import { mount } from "svelte";
import App from "./App.svelte";

import "../src/styles/tokens.css";
import "../src/styles/theme.css";
import "../src/styles/motion.css";
import "../src/styles/components.css";

const target = document.getElementById("app");

if (!target) {
  throw new Error("Showcase mount target not found");
}

mount(App, { target });
