import { Route } from 'wouter';
import MarkmapLoader from "./pages/MarkmapLoader"
import './assets/markmap.css'

function App() {

  return (
    <>
      <Route path="/@markmap/:username?/:dir?/:filename?" component={MarkmapLoader} />
      <Route>404, Not Found!</Route>
    </>
  )
}

export default App
