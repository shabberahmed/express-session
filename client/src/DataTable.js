import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const DataTable = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(2);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loading, setLoading] = useState(true);


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
            credentials: 'include', 
          });
          
      console.log(res.data);
      console.log('added to the cart');
      afun()
  
    } catch (err) {
      console.log("error",err);
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
//   

let afun=async()=>{
   
    try {
        const res= await axios.get('http://localhost:9090/get-added-products-from-session', { withCredentials: true })
        setSelectedProducts(res.data.selectedProducts);
        console.log(res.data
            )
  
        setLoading(false);
      }
      catch(error)  {
        console.error('Error fetching selected products:', error);
        setLoading(false);
      };

   }
   let deleteItem = async (productId) => {
    try {
      const res = await axios.delete('http://localhost:9090/remove-item', {
        data: { productId }, // Include productId in the request body
        withCredentials: true, // Send cookies with the request
      });
      console.log(res.data);
      afun()
    } catch (err) {
      console.log(err);
    }
  };
  
   useEffect(()=>{
    afun()
   },[])

  if (loading) {
    return <div>Loading...</div>;
  }
// 
 

  return (
    <div>
        <div>
            <button onClick={logout}>logout</button>
        </div>
    
        <div>
   <h2>Selected Products</h2>

   

      <ul>
        {selectedProducts.map((product) => (
          <div
          style={{
            display: 'inline-grid',
            gridTemplateRows: 'repeat(3)', 
            gridTemplateColumns: 'repeat(3)', 
            width:'200px'
          }}
        >
            <h3>{product.name}</h3>
            <p>Price: ${product.price}</p>
            <h1>{product.quantity}</h1>
           <br/>
            <img width={'200px'} src={product.imgUrl} alt={product.name} />
            <button style={{width:'50px' ,height:'50px'}} onClick={()=>deleteItem(product._id)}>Delete Item </button>
          </div>
        ))}
      </ul>
      </div>
        <div>
       
        </div>
      <table border={'1px black'}>
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
