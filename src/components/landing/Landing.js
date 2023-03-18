import React from 'react'
import './Landing.css'
import sale from './assets/sale.png'
import shopping from './assets/shopping-3.png'
import logo from './assets/logo.png'
import AnimatedText from '../utils/AnimatedText'
import { useHistory } from 'react-router-dom'

function Landing() {

    let history = useHistory()

    document.addEventListener("mousemove", parallax);

    function parallax(e) {
        this.querySelectorAll(".layer").forEach((layer) => {
            const speed = layer.getAttribute("data-speed");
    
            const x = (window.innerWidth - e.pageX * speed) / 150;
            const y = (window.innerHeight - e.pageY * speed) / 150;
    
            layer.style.transform = `translateX(${x}px) translateY(${y}px)`;
        });
    } 

    function handleClick() {
        history.push("/choose");
      }
    
    return (
        <div class="container">
        <div class="navbar">
                <div class="logo"><img src={logo} alt="" /></div>
                <div class="menu-btn">
                <button class="menu-btn" type="button" onClick={handleClick}>Menu</button>
                </div>
        </div>
        <div class="header">
            
            <AnimatedText text="Shop & Go" type="splashTitleTop" stagger={0.05} delay={500}></AnimatedText>
			<AnimatedText text='Simply better shopping' type="splashTitleBottom" stagger={0.05} delay={750}></AnimatedText>

        </div>
        <div class="marquee">
            <span>
            SHOP & GO. SHOP & GO. SHOP & GO. SHOP & GO. SHOP & GO. 
            SHOP & GO. SHOP & GO. SHOP & GO. SHOP & GO. SHOP & GO. 
            SHOP & GO. SHOP & GO. SHOP & GO. 
            </span>
        </div>
        
        <section>
            <img src={sale} data-speed="-10" class="layer img-1" alt=""/>
            <img src={shopping} data-speed="8" class="layer img-2" alt=""/>
        </section>
        </div>
  )
}
export default Landing
