import React from "react";
import { createRoot } from "react-dom/client";
import Options from "./Options";
import "@pages/options/index.css";
import "@assets/styles/tailwind.css";

function init() {
  const rootContainer = document.querySelector("#__root");
  if (!rootContainer) throw new Error("Can't find Options root element");
  const root = createRoot(rootContainer);
  root.render(<Options />);
}

init();
