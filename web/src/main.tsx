import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles/theme.css";
import "./index.css";

// `import.meta.env.BASE_URL` segue o `base` do vite.config.ts:
//   - dev: "/"
//   - prod (GitHub Pages): "/brandRiot/"
// O React Router precisa disso para que os links e o histórico funcionem
// corretamente quando o site mora num subpath.
const basename = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
