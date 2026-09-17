import React from 'react'
import ReactDOM from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App.jsx'
import './index.css' // <-- YEH LINE APPI NAYI FILE MEIN HONI CHAHIYE

const GOOGLE_CLIENT_ID = '696744926599-htpj1ibi6nu1jmg8k9lpr6esj95hv3ds.apps.googleusercontent.com';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>,
)