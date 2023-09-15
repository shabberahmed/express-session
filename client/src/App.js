import React from 'react'
import{BrowserRouter,Routes,Route} from 'react-router-dom'
import Login from './Login'
import DataTable from './DataTable'
import Cart from './Cart'
const App = () => {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login/>}></Route>
        <Route path='/products' element={<DataTable/>}></Route>
        <Route path='/cart' element={<Cart/>}></Route>
      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App