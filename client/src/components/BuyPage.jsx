import React from 'react'
import { useLocation } from 'react-router';

function BuyPage() {
    let { state } = useLocation();
    let amount = state.finalAmount
    console.log(amount);
  return (
    <div>
      this is buy page
      <h1>Your total amount to pay {amount}</h1>
    </div>
  )
}

export default BuyPage
