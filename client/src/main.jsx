import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";
// import dotenv from 'dotenv';

// dotenv.config();

const domain =  "dev-0c6ttoypv2r72y7h.us.auth0.com";
const clientId =  "fGXHF2S3mZDWlnv9MLpTbotdsbAvxWIZ";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: "https://homey-alpha.vercel.app",
        // Removed audience and scope since we're not using tokens
      }}
      useRefreshTokens={true}
      cacheLocation="localstorage"
      sessionCheckExpiryDays={7}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
);
