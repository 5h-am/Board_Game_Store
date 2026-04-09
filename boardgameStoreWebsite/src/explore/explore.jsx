import * as React from "react"
import "./explore.css"


const productReducer = (state,action) => {
    switch(action.type) {
        case "PRODUCTS_INFO_FETCH_INIT":
            return {
                ...state,
                isLoading:true,
                isError:false
            }
        case "PRODUCTS_INFO_FETCH_SUCCESS":
            return {
                ...state,
                isLoading:false,
                isError:false,
                data:action.payload,
                pagesList:action.pagesList
            }
        case "PRODUCTS_INFO_FETCH_FAILURE":
            return {
                ...state,
                isLoading:false,
                isError:true
            }
        default:
            throw new Error();
            
    }
}

const Explore = ({ initialApiUrl,initialFamily,initialFamilyDisplay,handleBuyPage,handleAddToCart }) => {

    const [productsInfo,dispatchProductsInfo] = React.useReducer(productReducer,
        {isLoading:false,isError:false,data:[],pagesList:[]}
    )

    const [page,setPage] = React.useState(1)
    const [apiUrl,setApiUrl] = React.useState(initialApiUrl+"getData/"+initialFamily)
    const [family,setFamily] = React.useState(initialFamily);
    const[familyDisplay,setFamilyDisplay] = React.useState(initialFamilyDisplay)
    const [sortBy,setSortBy] = React.useState("rank")
    const [sortingMethod,setSortingMethod] = React.useState("ASC")

    const handlePage = (e) => {
        setPage(e.target.value)
    }

    const handleFamily = (e) => {
        if (sortBy === "rank"){
            setApiUrl(initialApiUrl+"getData/"+e.target.value)
        } else {
            setApiUrl(initialApiUrl+`getData/${e.target.value}/${sortBy}/${sortingMethod}`)
        }   
        setFamily(e.target.value)
        setFamilyDisplay(e.target.labels[0].textContent)
    }

    const handleSortBy = (e) => {
        if (family) {
            setApiUrl(initialApiUrl+`getData/${family}/${e.target.value}/${sortingMethod}`)
        } else {
            setApiUrl(initialApiUrl+`getData/${e.target.value}/${sortingMethod}`)
        }
        setSortBy(e.target.value)
    }

    const handleSortingMethod = () => {
        if (sortingMethod === "ASC") {
            setSortingMethod("DESC");
            (family) ? setApiUrl(initialApiUrl+`getData/${family}/${sortBy}/DESC`) : setApiUrl(initialApiUrl+`getData/${sortBy}/DESC`) 
        } else {
            setSortingMethod("ASC");
            (family) ? setApiUrl(initialApiUrl+`getData/${family}/${sortBy}/ASC`) : setApiUrl(initialApiUrl+`getData/${sortBy}/ASC`)
        }


        
    }

    const handleFilterClearing = () => {
        setFamily("")
        if (sortBy === "rank") {
            setApiUrl(initialApiUrl+"getData")
        }else {
            setApiUrl(initialApiUrl+`getData/${sortBy}/${sortingMethod}`)
        }
        
    }

    const handleFetchProductsInfo = React.useCallback(async()=> {
        dispatchProductsInfo({type:"PRODUCTS_INFO_FETCH_INIT"})
        try {
            const response = await fetch(apiUrl)
            const result = await response.json()
            let pagesList = []
            for (let i = 0; i < result.length; i++) {
                pagesList.push(i+1)
            }
            dispatchProductsInfo({
                type: "PRODUCTS_INFO_FETCH_SUCCESS",
                payload:result[page-1],
                pagesList:pagesList
            }) 
        } catch (err){
            dispatchProductsInfo({
                type: "PRODUCTS_INFO_FETCH_FAILURE",
            })
            console.log("Error Occured ",err)
        }
    },[page,apiUrl])
    React.useEffect(()=> {
        handleFetchProductsInfo()
    },[handleFetchProductsInfo])


    
    return (
    <>
    {productsInfo.isLoading ? <div className="loader-box"><div className="loader"></div></div>:
    productsInfo.isError ? <div className="loader-box"><h1>Sorry, We Couldn't fetch the data</h1></div>: 
    <div className="explore-box">
        <Filter handleFamily={handleFamily} handleSortBy={handleSortBy} handleSortingMethod={handleSortingMethod} family={family} handleFilterClearing={handleFilterClearing} familyDisplay={familyDisplay}/>
        <ProductWindow games={productsInfo.data} pagesList={productsInfo.pagesList} handlePage={handlePage} handleBuyPage={handleBuyPage} handleAddToCart={handleAddToCart} />
    </div>}
    </>
        
    )
}

const Filter = ({ handleFamily,handleSortBy,handleSortingMethod,family,handleFilterClearing,familyDisplay }) => {
    return (
        <>
        <div className="filter-box">
            {(family)? <AppliedFamily handleFilterClearing={handleFilterClearing} familyDisplay={familyDisplay}/> : 
                <>
                    <h2>Apply Filters</h2>
                    <form className="family-filters" onChange={handleFamily}>
                        <div>
                            <input type="checkbox" value="familygames_rank" id="familyGames"/>
                            <label htmlFor="familyGames">Family Games</label>
                        </div>
                        
                        <div>
                            <input type="checkbox" value="abstracts_rank" id="abstractsGames" />
                            <label htmlFor="abstractsGames">Abstract Games</label>
                        </div>
                        <div>
                            <input type="checkbox" value="partygames_rank" id="partyGames" />
                            <label htmlFor="partyGames">Party Games</label>
                        </div>
                        <div>
                            <input type="checkbox" value="strategygames_rank" id="strategyGames"/>
                            <label htmlFor="strategyGames">Strategy Games</label>
                        </div>
                        <div>
                            <input type="checkbox" value="thematic_rank" id="thematicGames" />
                            <label htmlFor="thematicGames">Thematic Games</label>
                        </div>
                        <div>
                            <input type="checkbox" value="wargames_rank" id="warGames" />
                            <label htmlFor="warGames">War Games</label>
                        </div>
                    </form>
                </>
            }
            <div className="sortBy-box">
                <label htmlFor="sortBy">Sort by : </label>
                <select name="sortBy" id="sortBy" onChange={handleSortBy}>
                    <option value="rank">Rank</option>
                    <option value="yearpublished">Year Published</option>
                    <option value="average">Average</option>
                    <option value="usersrated">Number of Ratings</option>
                    <option value="prices">Prices</option>
                </select>
            </div>
            <div className="sorting-method">
                <button className="sorting-btn" onClick={handleSortingMethod}>Reverse</button>
            </div>
            
        </div>
        </>
    )
}

const AppliedFamily = ({ handleFilterClearing,familyDisplay }) => {
    return (
        <>
        <p className="appliedFamily">{familyDisplay}</p>
        <button className="sorting-btn" onClick={handleFilterClearing}>Clear Filters</button>
        </>
    )

}
const ProductWindow = ({ games,pagesList,handlePage,handleBuyPage,handleAddToCart }) => {
    return (
        <>
        <div className="games-box">
            <div className="games-list">
                {games.map((i)=> {
                    return (
                        <div key={i[0]} className="product-box" onClick={() => (handleBuyPage(i[0]))}>
                            <div className="info-block">
                                <div className="img-block">
                                    <img src={i[3]} alt={i[1]} />
                                </div>
                                <div className="details-block">
                                    <h3>{i[1]}</h3>
                                    <h2>${(i[4]).toFixed(2)}</h2>
                                    <h4>Rating : {(i[2]/2).toFixed(2)}</h4>
                                </div>
                            </div>
                            <button className="add-to-cart-btn" value={i} onClick={()=> handleAddToCart(i)}>Add to Cart</button>
                        </div>
                    )
                })}
            </div>
            <div className="pages-list">
                {pagesList.map((i) => {
                    return (
                        <button value={i} key={i} onClick={handlePage} className="page-btn">{i}</button>
                    )
                })}
            </div>
        </div>        
        </>
    )
}
export { Explore,AppliedFamily,ProductWindow,Filter }