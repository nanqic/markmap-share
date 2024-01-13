import { Route, Switch } from 'wouter';
import MarkmapLoader from "@/pages/MarkmapLoader"
import Repl from './Repl';

export default function Home() {
  return (
    <>
      <Switch>
        <Route path={`${import.meta.env.VITE_BASE_URL}/repl`} component={Repl} />
        <Route path={`${import.meta.env.VITE_BASE_URL}/:foldername?/:dir?/:filename?`} component={MarkmapLoader} />
      </Switch>
    </>
  )
}
