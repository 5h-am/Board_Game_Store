import * as React from 'react'
import './App.css'
import Search from './assets/search.svg?react'
import cartIcon from './assets/cart-icon.png'
import { Home } from './home/home'
import { Explore } from './explore/explore'
import { Ranking  } from './rankings/rankings'
import { BuyPage } from './buypage/buypage'
import { Cart } from './cart/cart'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/ReactToastify.css';
import { toast } from 'react-toastify'

const apiUrl = import.meta.env.VITE_API_URL
const App = () => {
  const [display,setDisplay] = React.useState("HOME");
  const [gameId,setGameId] = React.useState(0);
  const [searchValue,setSearchValue] = React.useState("")
  const [searchResults,setSearchResults] = React.useState([])
  
  
  const handleHome =  () => {
    setDisplay("HOME")
  }
  
  const handleCart = () => {
    setDisplay("CART");
  }

  const handleAddToCart = (e,x) => {
    e.stopPropagation()
    toast.success("The Game has been added to Cart", { toastId: "cart-add" })
    const items = JSON.parse(localStorage.getItem("cart_items")) || [];
    items.push(x)
    localStorage.setItem("cart_items",JSON.stringify(items))
  }


  const handleExplore = () => {
    setDisplay("EXPLORE")
  }
  const handleAbout = () => {
    setDisplay("ABOUT")
  }
  const handleRanking = () => {
    setDisplay("RANKINGS") 
  }

  const handleBuyPage = (x) => {
    setDisplay("BUYPAGE")
    setGameId(x)
  }

  const handleBuyNow = () => {
    setDisplay("BUYNOW")
  }

  const handleSearchInput = (e) => {
    setSearchValue(e.target.value)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setDisplay("SEARCH")
    const searchCheck = async () => {
      try{
        const response = await fetch(apiUrl+"getProduct/"+searchValue)
        const result = await response.json();
        setSearchResults(result)
      }catch (err) {
        console.log("Error Occured ",err )
      }
    }
    searchCheck();
  }



  return (
    <>
    <Nav autoFocus handleHome={handleHome} handleCart={handleCart} handleExplore={handleExplore} handleAbout={handleAbout} handleSearch={handleSearch} handleSearchInput={handleSearchInput} />
    {(display==="HOME") && <Home handleRanking={handleRanking} initialApiUrl={apiUrl} handleBuyPage={handleBuyPage} handleAddToCart={handleAddToCart}/>}
    {(display==="EXPLORE") && <Explore initialApiUrl={apiUrl} initialFamily="" initialFamilyDisplay="" handleBuyPage={handleBuyPage} handleAddToCart={handleAddToCart} />}
    {(display==="ABOUT") && <About />}
    {(display==="RANKINGS") && <Ranking apiUrl={apiUrl} handleBuyPage={handleBuyPage}/>}
    {(display==="BUYPAGE") && <BuyPage initialApiUrl={apiUrl} gameId={gameId} handleAddToCart={handleAddToCart} />}
    {(display==="SEARCH") && <SearchPage handleBuyPage={handleBuyPage} searchResults={searchResults} handleAddToCart={handleAddToCart} /> }
    {(display==="CART") && <Cart handleBuyPage={handleBuyPage} handleBuyNow={handleBuyNow} />}
    {(display==="BUYNOW") && <div className="loader-box"><h1>This Feature Is Not Availabe Yet</h1></div>}
       <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </>
  )
}

const Nav = ({ handleHome,handleCart,handleExplore,handleAbout,handleSearch,handleSearchInput }) => {
  return (
    <>
    <div className='navs'>
        <form className='search-form' onSubmit={handleSearch}> 
          <input type="search" placeholder='Search' className='search-input' onChange={handleSearchInput} />
          <button className='search-btn' type='submit'><Search className='search-icon'/></button>    
        </form>
        <div className='nav-options'>
          <button className='nav-btn cart-btn' onClick={handleCart}><img src={cartIcon} alt="A Cart Icon" className='cart-icon' /><p>Cart</p></button>
          <div className='nav-without-cart'>
            <button className='home-btn nav-btn' autoFocus onClick={handleHome}>Home</button>
            <button className='explore-btn nav-btn' onClick={handleExplore}>Explore</button>
            <button className='about-us-btn nav-btn' onClick={handleAbout}>About Us</button>
          </div>
      </div>
    </div>
    </>
  )

}

const About = () => {
  return (
    <>
    <div className='about-us'>
      <h2><u>About Us</u></h2>
      <p>Welcome to our board game hub — your go-to destination for discovering and comparing board games from around the world.
Our platform is powered by rich data sourced from BoardGameGeek, the world's largest board game database, combined with real-time pricing information fetched through our own custom-built data pipeline. This means you get accurate game details alongside up-to-date prices, all in one place.
Under the hood, we've built a modern, seamless experience using React on the frontend and Flask on the backend — so everything loads fast and works smoothly.
Whether you're a casual player or a seasoned tabletop enthusiast, we're here to help you find your next favorite game.</p>
      <p className='developer-contact'><strong>Name: </strong>Shubham Kumar</p>
      <p className='developer-contact'><strong>Email: </strong>reaper06rxl@gmail.com</p>
      <p className='developer-contact'><strong>Contact No: </strong>823xxxxxxx</p>
    </div>
    </>
  )
}

const SearchPage = ({ handleBuyPage,searchResults,handleAddToCart } ) => {
  return (
    <>
    {!(searchResults.length > 0) ? <div className="loader-box"><h1>Sorry, No Such Board Game in Our Database</h1></div> :
    <div className='search-box'>
      <div className="product-box blue-border" onClick={() => (handleBuyPage(searchResults[0]))}>
          <div className="info-block">
              <div className="img-block">
                  <img src={searchResults[3]} alt={searchResults[1]} />
              </div>
              <div className="details-block">
                  <h3>{searchResults[1]}</h3>
                  <h2>${(searchResults[4]).toFixed(2)}</h2>
                  <h4>Rating : {(searchResults[2]/2).toFixed(2)}</h4>
              </div>
          </div>
          <button className="add-to-cart-btn" value={searchResults} onClick={(e)=> handleAddToCart(e,searchResults)}>Add to Cart</button>
      </div>
    </div>
    }
    </> 

  )
}


export default App
