import React from 'react'
import{BrowserRouter,Routes,Route} from 'react-router-dom'
import Login from './Login'
import DataTable from './DataTable'
const App = () => {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login/>}></Route>
        <Route path='/products' element={<DataTable/>}></Route>
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App