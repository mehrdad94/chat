import 'popper.js'
import 'bootstrap'

import React from 'react'
import { hydrate, render } from 'react-dom'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
import { store, persistor } from './redux/store'
import { Loader } from './components/Loader/Loader'
import logger from './helpers/logger'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import './styles/index.scss'

const ActiveLoader = () => <Loader active={true}/>

const rootElement = document.getElementById('root')
const RenderContent = () => (
  <Provider store={store}>
    <PersistGate loading={<ActiveLoader/>} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
)

if (rootElement.hasChildNodes()) {
  hydrate(<RenderContent />, rootElement)
} else {
  render(<RenderContent />, rootElement)
}

serviceWorker.register({
  onUpdate: registration => {
    console.log('find me')
    if (window.confirm('New version available!  Ready to update?')) {
      if (registration && registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' })
      }
      window.location.reload()
    }
  }
})

window.addEventListener('error', function (event) {
  logger.push({ info: { message: event.message, fileName: event.filename, lineNo: event.lineno } })
  event.preventDefault()
})