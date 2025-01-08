import "./index.css";
import App from "./App.tsx";
import store from "./redux/store.tsx";
import { Provider } from "react-redux";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
