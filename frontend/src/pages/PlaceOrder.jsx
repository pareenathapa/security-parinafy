import React, { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'

const PlaceOrder = () => {

  const [method, setMethod] = useState('cod');
  const {navigate} = useContext(ShopContext);
  
  const handleKhaltiPayment = async () => {
    try {
      const response = await axios.post(
        "https://dev.khalti.com/api/v2/epayment/initiate/",
        {
          return_url: "http://localhost:3000/orders", // Change this to your production return URL
          website_url: "http://localhost:3000", // Change as needed
          "amount": 1300,
  "purchase_order_id": "test12",
  "purchase_order_name": "test",
  "customer_info": {
      "name": "Khalti Bahadur",
      "email": "example@gmail.com",
      "phone": "9800000123"
  },
  "amount_breakdown": [
      {
          "label": "Mark Price",
          "amount": 1000
      },
      {
          "label": "VAT",
          "amount": 300
      }
  ],
  "product_details": [
      {
          "identity": "1234567890",
          "name": "Khalti logo",
          "total_price": 1300,
          "quantity": 1,
   "unit_price": 1300
      }
  ],
  "merchant_username": "merchant_name",
  "merchant_extra": "merchant_extra"
        },
        {
          headers: {
            Authorization: "Key aee33c8c07ad4b6bbbcb94452f3a75d2", // Replace with your Khalti secret key
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.payment_url) {
        window.location.href = response.data.payment_url; // Redirect user to Khalti
      }
    } catch (error) {
      console.error("Khalti payment failed", error);
    }
  };


  return (
    <div className='flex flex-col justify-between gap-4 pt-5 sm:flex-row sm:pt-14 min-h-[80vh] border-t'>
      {/* Left Side Content */}
      <div className='flex flex-col w-full gap-4 sm:max-w-[480px]'>
        <div className='my-3 text-xl sm:text-2xl'>
          <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>
        <div className='flex gap-3'>
          <input 
            className='w-full px-4 py-2 border border-gray-300 rounded' 
            type="text" 
            placeholder='First Name' 
          />
          <input 
            className='w-full px-4 py-2 border border-gray-300 rounded' 
            type="text" 
            placeholder='Last Name' 
          />
        </div>
        <input 
          className='w-full px-4 py-2 border border-gray-300 rounded' 
          type="email" 
          placeholder='Email Address' 
        />
        <input 
          className='w-full px-4 py-2 border border-gray-300 rounded' 
          type="text" 
          placeholder='Street' 
        />
        <div className='flex gap-3'>
          <input 
            className='w-full px-4 py-2 border border-gray-300 rounded' 
            type="text" 
            placeholder='City' 
          />
          <input 
            className='w-full px-4 py-2 border border-gray-300 rounded' 
            type="text" 
            placeholder='State' 
          />
        </div>
        <div className='flex gap-3'>
          <input 
            className='w-full px-4 py-2 border border-gray-300 rounded' 
            type="number" 
            placeholder='Zip Code' 
          />
          <input 
            className='w-full px-4 py-2 border border-gray-300 rounded' 
            type="text" 
            placeholder='Country' 
          />
        </div>
        <input 
          className='w-full px-4 py-2 border border-gray-300 rounded' 
          type="number" 
          placeholder='Mobile' 
        />
      </div>
      {/* Right Side Content */}
      <div className='mt-8'>
        <div className='mt-8 min-w-80'>
          <CartTotal />
        </div>
        {/* Payment Methods Selection */}
        <div className='mt-12'>
          <Title text1={'PAYMENT'} text2={'METHODS'} />
          <div className='flex flex-col gap-3 lg:flex-row'>
            <div onClick={() => setMethod('stripe')} className='flex items-center gap-3 p-2 px-3 border cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-600' : ''}`}></p>
              <img className='h-5 mx-4' src={assets.khalti_icon} alt="Stripe" />
            </div>
            {/* <div onClick={() => setMethod('razorpay')} className='flex items-center gap-3 p-2 px-3 border cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razorpay' ? 'bg-green-600' : ''}`}></p>
              <img className='h-5 mx-4' src={assets.razorpay_logo} alt="RazorPay" />
            </div>
            <div onClick={() => setMethod('cod')} className='flex items-center gap-3 p-2 px-3 border cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-600' : ''}`}></p>
              <p className='mx-4 text-sm font-medium text-gray-500'>CASH ON DELIVERY</p>
            </div> */}
          </div>
          <div className='w-full mt-8 text-end'>
            <button onClick={method === "stripe" ? handleKhaltiPayment : () => navigate("/orders")} className='px-16 py-3 text-sm text-white bg-black active:bg-gray-800'>PLACE ORDER</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlaceOrder
