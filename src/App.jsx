import { Suspense, lazy } from "react"
import ErrorBoundary from "./components/ErrorBoundary"
import { NotificationProvider } from './components/NotificationContext';
import 'assets/markmap.css'
import Home from "@/pages/Home"
// const Home = lazy(() => import("./pages/Home"))

function App() {

  return (
    <ErrorBoundary
      fallback={(err) => {
        console.error("error", err)
        return <div>出错了，请尝试刷新页面或等待修复</div>
      }}
    >
      <NotificationProvider duration={3000}>
        <Suspense fallback={<div>loading ...</div>}>
          <Home />
        </Suspense>
      </NotificationProvider>
    </ErrorBoundary>
  )
}

export default App
