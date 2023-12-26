import { Route } from 'wouter';
import MarkmapLoader from "./pages/MarkmapLoader"
import './assets/markmap.css'

function App() {

  return (
    <>
      <Route path="/@markmap/:username?/:dir?/:filename?" component={MarkmapLoader} />
    </>
  )
}

export default App
