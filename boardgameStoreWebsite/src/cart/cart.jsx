import * as React from 'react'
import './cart.css'


const Cart = ({ handleBuyPage,handleBuyNow }) => {
    const cart_items = JSON.parse(localStorage.getItem("cart_items"))
    const [cartItems,setCartItems] = React.useState(cart_items || [])
    let total = 0;

    const handleItemRemoval = (e) => {
        cart_items.splice(e.target.value,1)
        localStorage.setItem("cart_items",JSON.stringify(cart_items))
        setCartItems(cart_items)
    }

    return (
        <>
        <div className="cart">
            <div className='cart-items'>
                {cartItems.map((i,index) => {
                    return (
                        <div key={i[0]} className="cart-item-box" onClick={() => (handleBuyPage(i[0]))}>
                            <div className="cart-info-block">
                                <div className="cart-img-block">
                                    <img src={i[3]} alt={i[1]} />
                                    <button className="remove-from-cart-btn add-to-cart-btn" value={index} onClick={handleItemRemoval}>Remove From Cart</button>
                                </div>
                                <div className="cart-details-block">
                                    <h3>{i[1]}</h3>
                                    <h2>${(i[4]).toFixed(2)}</h2>
                                    <h4>Rating : {(i[2]/2).toFixed(2)}</h4>
                                </div>
                            </div>
                        </div>
                    )
                })}

            </div>
            <div className='billing-area'>
                <ul>
                    {cartItems.map((i) => {
                        total += Number((i[4]).toFixed(2))
                        return (
                            <li key={i[0]}>{i[1]}: <span>${(i[4]).toFixed(2)}</span></li>
                        )
                    })}
                    <li className='total'>Total <span>${total}</span></li>
                </ul>
            <button className='buy-now-btn' onClick={handleBuyNow}>Buy Now</button>
            </div>
        </div>
        </>
    )
}

export { Cart }