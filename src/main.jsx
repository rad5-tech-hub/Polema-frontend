import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./tailwind/output.css";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
// import { persistor, store } from "./components/store/store.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <Provider store={store}> */}
    <App />
    {/* </Provider> */}
  </StrictMode>
);
