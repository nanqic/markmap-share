import { Route } from 'wouter';
import MarkmapLoader from "@/pages/MarkmapLoader"
export default function Home() {
  return (
    <>
      <Route path={`${import.meta.env.VITE_BASE_URL}/:username?/:dir?/:filename?`} component={MarkmapLoader} />
    </>
  )
}
