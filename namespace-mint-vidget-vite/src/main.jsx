import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { NamespaceWidget } from './namespace-widget.jsx'


const createButtonAndRenderApp = () => {
  const widget = document.createElement("div");
  widget.setAttribute("id", "widget");
  document.getElementsByTagName("body")[0].appendChild(widget);
  ReactDOM.createRoot(widget).render(
    <React.StrictMode>
      <NamespaceWidget />
    </React.StrictMode>,
  )
}

createButtonAndRenderApp();