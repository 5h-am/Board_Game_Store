import * as React from 'react'
import './home.css';
import BackArrow from '../assets/back.svg?react';
import ForwardArrow from '../assets/forward.svg?react';
import { Explore } from "../explore/explore"

const Home = ({ handleRanking,initialApiUrl,handleBuyPage,handleAddToCart }) => {
    const [homeDisplay,setHomeDisplay] = React.useState("HOME_DEFAULT")
    const [family,setFamily] = React.useState("")
    const[familyDisplay,setFamilyDisplay] = React.useState("")
    const handleFamilyOptions = (e) => {
        setHomeDisplay("HOME_EXPLORE")
        setFamily(e.target.value)
        setFamilyDisplay(e.target.textContent)
    }

    const handleHomeBack = () => {
        setHomeDisplay("HOME_DEFAULT")
    }
    return(
        <>
        {(homeDisplay === "HOME_DEFAULT") && 
            <>
        <div className='circle circle1'></div>
        <div className='circle circle2'></div>
        <div className='circle circle3'></div>
        <div className='circle circle4'></div>
        <div className='container'>
            <div className='star4 star'></div>
        </div>
        <div className='container'>
            <div className='star1 star'></div>
        </div>
        <h1>Welcome to World of Board Games</h1>
        <div className='container'>
            <div className='star2 star'></div>
        </div>
        <div className='container'>
            <div className='star3 star'></div>
        </div>
        <div className='home-body'>
            <div className='family-left'>
                <button className='family-btn family0' value="familygames_rank" onClick={handleFamilyOptions}>Family Games</button>
                <button className='family-btn family1' value="abstracts_rank" onClick={handleFamilyOptions}>Abstracts Games</button>
                <button className='family-btn family2' value="partygames_rank" onClick={handleFamilyOptions}>Party Games</button>
            </div>
            <div className='family-right'>
                <button className='family-btn family3' value="strategygames_rank" onClick={handleFamilyOptions}>Strategy Games</button>
                <button className='family-btn family4' value="thematic_rank" onClick={handleFamilyOptions}>Thematic Games</button>
                <button className='family-btn family5' value="wargames_rank" onClick={handleFamilyOptions}>War Games</button>
            </div>
        </div>
        <div className='ranking-btn' onClick={handleRanking}><h2>Most Popular Games</h2></div>
        </>
        }
        {homeDisplay === "HOME_EXPLORE" && <> <button className='homeBack-btn' onClick={handleHomeBack}>Back</button> <Explore initialApiUrl={initialApiUrl} initialFamily={family} initialFamilyDisplay={familyDisplay} handleBuyPage={handleBuyPage} handleAddToCart={handleAddToCart}/> </>}
    </>
    )
}

export { Home }


