import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "./components/ui/sonner";
import { Provider } from "react-redux";

// Import default store and named persistor
import store, { persistor } from "./redux/store"; 
import { PersistGate } from "redux-persist/integration/react";

createRoot(document.getElementById("root")).render(

    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
        <Toaster />
      </PersistGate>
    </Provider>

);