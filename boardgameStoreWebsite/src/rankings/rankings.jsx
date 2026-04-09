import * as React from 'react'
import './ranking.css'

const Ranking = ({ apiUrl,handleBuyPage }) => {

    const [rankings,setRankings] = React.useState([])
    const handleFetchProductsInfo = React.useCallback(async()=> {
        try {
            const response = await fetch(apiUrl+"getData")
            const result = await response.json()
            setRankings(result[0])
        } catch (err){
            console.log("Error Occured ",err)
        }
    },[])
    React.useEffect(()=> {
        handleFetchProductsInfo()
    },[handleFetchProductsInfo])



    return <>
    <div className='rankings-box'>
        <h2 className='top-games'>Top Board Games</h2>
        <ol className='rankings-list'>
            {rankings.map((i) => {
                return (
                    <li key={i[0]} className='rankings-games' onClick={()=> handleBuyPage(i[0])}>{i[1]} <span>{(i[2]/2).toFixed(2)}</span></li>
                )
            })}
        </ol>
    </div>
    </>
}

export { Ranking }