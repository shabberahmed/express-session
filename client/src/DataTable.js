import axios from "axios";
import React, { useEffect, useState } from "react";
import Cart from "./Cart";
import { useNavigate } from "react-router-dom";

const DataTable = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(2);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

const navigate=useNavigate()
  const getProducts = async () => {
    try {
      const res = await axios.get(`http://localhost:9090/getproducts?page=${page}&pageSize=${pageSize}`);
      console.log(res.data);
      setData(res.data.products);
      setTotalPages(Math.ceil(res.data.totalCount / pageSize));
      console.log('total',totalPages)
    } catch (err) {
      console.log(err);
    }
  };
  const addProduct = async (productId) => {
    
    try {
        const res = await axios.post(`http://localhost:9090/addproduct`,{productId}, {
            withCredentials: true,
            credentials: 'include', // Ensure cookies are included
          });
          
      console.log(res.data);
      console.log('added to the cart');
    } catch (err) {
      console.log("error",err);
      // Log the error response for more details
    }
  };
  
  
  

  useEffect(() => {
    getProducts();
  }, [page, pageSize]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };
  const logout=async()=>{
    try{
        const res = await axios.post(`http://localhost:9090/logout`,{
            withCredentials: true,
            credentials: 'include',
          });
          console.log(res.data)
          navigate('/')
          
    }
    catch(err){
        console.log(err)
    }
  }
 

  return (
    <div>
        <div>
            <button onClick={logout}>logout</button>
        </div>
        <Cart/>
      <table>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <td>add</td>
          </tr>
        </thead>
        <tbody>
          {data.map((val) => {
            return (
              <tr key={val._id}>
                <td><img style={{ width: '200px' }} src={val.imgUrl} alt="" /></td>
                <td>{val.name}</td>
                <td>{val.price} $</td>
                <td><button onClick={()=>addProduct(val._id)}>add to cart</button></td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="pagination">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        >
          Previous
        </button>
        <span>Page {page} of {3}</span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === 3}
        >
          Next
        </button>
      </div>

   
    </div>
  );
};

export default DataTable;
