import React from 'react'
import { Route } from 'wouter';
import MarkmapLoader from "@/pages/MarkmapLoader"
import 'assets/markmap.css'


export default function Home() {
  return (
    <>
      <Route path={`${import.meta.env.VITE_BASE_URL}/:username?/:dir?/:filename?`} component={MarkmapLoader} />
    </>
  )
}