import { Route, Switch } from 'wouter';
import MarkmapLoader from "@/pages/MarkmapLoader"
import Repl from './Repl';
import SubtitlePlayer from './SubtitlePlayer';

export default function Home() {
  return (
    <>
      <Switch>
        <Route path={`${import.meta.env.VITE_BASE_URL}/video`} component={SubtitlePlayer} />
        <Route path={`${import.meta.env.VITE_BASE_URL}/new`} component={Repl} />
        <Route path={`${import.meta.env.VITE_BASE_URL}/repl`} component={Repl} />
        <Route path={`${import.meta.env.VITE_BASE_URL}/:foldername?/:dir?/:filename?`} component={MarkmapLoader} />
      </Switch>
    </>
  )
}
