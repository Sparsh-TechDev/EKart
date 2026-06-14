import OrderCard from '@/components/OrderCard'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

const ShowUserOrders = () => {

  const params = useParams();

    const [userOrder, setUserOrder] = useState(null);

  const getUserOrders = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      
      const res = await axios.get(`${import.meta.env.VITE_URL}/orders/user-order/${params.userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      
      // LOG THE DATA TO SEE EXACTLY WHAT THE BACKEND SENDS
      console.log("Orders fetched successfully:", res.data);

      if (res.data.success) {
        setUserOrder(res.data.orders);
      }
    } catch (error) {
      // PROPERLY LOG THE ERROR SO IT ISN'T SILENT
      console.error("❌ API Fetch Error:", error.response?.data || error.message);
      // Fallback to an empty array so it at least says "No orders found" instead of staying blank
      setUserOrder([]); 
    }
  };

  useEffect(() => {
    getUserOrders();
  }, []);
  return (
    <div className='p-4 md:p-6 lg:p-8 pt-6 md:pt-8'>
      <OrderCard userOrder={userOrder} />
    </div>
  )
}

export default ShowUserOrders