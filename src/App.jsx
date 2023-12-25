import { Route } from 'wouter';
import MarkmapLoader from "./pages/MarkmapLoader"
import './assets/markmap.css'

function App() {

  return (
    <>
      <Route path="/:username?/:dir?/:filename?" component={MarkmapLoader} />
    </>
  )
}

export default App
