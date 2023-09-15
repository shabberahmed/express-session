import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Cart = () => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

 
    // Make a GET request to the server's endpoint
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

  return (
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
  );
};

export default Cart;
