import * as React from 'react';
import './buypage.css'


const InfoReducer = (state,action) => {
    switch(action.type) {
        case "PRODUCT_INFO_FETCH_INIT":
            return {
                ...state,
                isLoading:true,
                isError:false
            }
        case "PRODUCT_INFO_FETCH_SUCCESS":
            return {
                ...state,
                isLoading:false,
                isError:false,
                data:action.payload,
                video:action.video,
                details :action.details
            }
        case "PRODUCT_INFO_FETCH_FAILURE":
            return {
                ...state,
                isLoading:false,
                isError:true
            }
        default:
            throw new Error();
            
    }
}

function cleanText(rawText) {
   try {
  return rawText
    .replace(/\[edit\]/gi, "")

    .replace(/\[\d+\]/g, "")

    .replace(/\^.*$/gm, "")

    .replace(/\s+/g, " ")
    .trim()

    .replace(/^\S+\s*/, "");
   } catch (err) {
    return ""
   }
}


const BuyPage = ({ initialApiUrl,gameId,handleAddToCart }) => {

    const [productDetails,dispatchProductDetails] = React.useReducer(InfoReducer,
        {isLoading:false,isError:false,data:[],video:"",details:""}
    )



    const handleFetchProductDetails = React.useCallback(async()=> {
        dispatchProductDetails({type:"PRODUCT_INFO_FETCH_INIT"})
        try {
            const response = await fetch(initialApiUrl+"getProductInfo/"+gameId);
            const result = await response.json();
            dispatchProductDetails({
                type: "PRODUCT_INFO_FETCH_SUCCESS",
                payload:result["result"],
                video:result["video"],
                details:result["details"]
            })

        } catch (err){
            dispatchProductDetails({
                type: "PRODUCT_INFO_FETCH_FAILURE",
            })
            console.log("Error Occured ",err)
        }
    },[gameId])
    React.useEffect(()=> {
        handleFetchProductDetails()
    },[handleFetchProductDetails])



    return (
        <>
        {productDetails.isLoading ? <div className='loader-box'><div className="loader"></div></div> :
        productDetails.isError ? <div className="loader-box"><h1>Sorry, We Couldn't fetch the data</h1></div> :
        <>
            <div className="bg-img" style={{ backgroundImage: `url(${productDetails.data[13]})`, backgroundRepeat:"no-repeat", backgroundSize:"cover",backgroundPosition:"center" }}>
                <div className='text-on-img'>
                    <h2>${productDetails.data[15]}</h2>
                    <h4>Rating : {(productDetails.data[5]/2).toFixed(2)}</h4>
                    <h2>{productDetails.data[2]}</h2>
                    <button className='add-to-cart-btn buy-page-cart-btn'  onClick={(e) => handleAddToCart(e,[productDetails.data[1],productDetails.data[2],productDetails.data[5],productDetails.data[14],productDetails.data[15]])} >Add to Cart</button>
                </div>
            </div>
            <div className='about'>
                <img src={productDetails.data[14]} alt="A image of the Board Game" />
                <div className='about-text'>
                    <h2>About</h2>
                    <p>{productDetails.details["about"]}</p>
                </div>
            </div>
            <div className="howtoplay">
                <h2>How To Play</h2>
                <div className='howtoplay-box'>
                    <p>{cleanText(productDetails.details["howtoplay"])}</p>
                    <div className="video-box">
                        <iframe src={productDetails.video} title='How to Play This Game' frameBorder="0" allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'>
                        </iframe>
                    </div>
                </div>
            </div>
        </>
        }
        </>
    )
}

export { BuyPage }