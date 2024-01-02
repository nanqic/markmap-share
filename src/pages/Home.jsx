import { Route, Switch } from 'wouter';
import MarkmapLoader from "@/pages/MarkmapLoader"
import Raw from './Raw';

export default function Home() {
  return (
    <>
      <Switch>
        <Route path='/raw' component={Raw} />
        <Route path={`${import.meta.env.VITE_BASE_URL}/:username?/:dir?/:filename?`} component={MarkmapLoader} />
      </Switch>
    </>
  )
}
