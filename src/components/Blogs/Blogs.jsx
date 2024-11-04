import React, { useEffect, useState } from 'react'
import { IoIosArrowDropleftCircle, IoIosArrowDroprightCircle } from 'react-icons/io';
import { register } from 'swiper/element/bundle';
import "./Blogs.css"
import { Skeleton } from 'antd';
import TaskBar from '../TaskBar';
import Footer from '../Footer';
register();

function Blogs () {
    const [ blogs, setBlogs ] = useState( [] );
    const [ screen, setScreen ] = useState( "laptop" );

    async function onload () {
        fetch( "https://toolsbazaar-server-1036279390366.asia-south1.run.app/blogs" ).then( async res => {
            let data = await res.json();
            setBlogs( [ ...data ] );
        } );
    }

    useEffect( () => {
        
        onload();
        const handleResize = () => {
            setScreen( window.innerWidth <= 768 ? "mobile":"laptop" );
          };
          window.addEventListener( "resize", handleResize );
          handleResize();
        window.scrollTo( 0, 0 );
    }, [] )

    return (
        <div className='blogs-container2'>
        <div className='blogs-container'>
          <TaskBar/>
            <div className='blogs-swiper-container'>
                <h3>
                    <span>What's New</span>
                    <span>
                        <IoIosArrowDropleftCircle onClick={() => {
                            document.querySelector( "#swiper1" ).swiper.slidePrev();
                        }} />
                        <IoIosArrowDroprightCircle onClick={() => {
                            document.querySelector( "#swiper1" ).swiper.slideNext();
                        }} />
                    </span>
                </h3>
                {blogs.length !== 0 && <swiper-container slides-per-view={screen === "laptop" ? 3 : 1} space-between={screen === "laptop" ? 30 : 0} autoPlay autoPlay-delay={4000} id="swiper1">
                    {blogs.filter( ( element ) => element.category.includes( "New" ) ).map( ( element, index ) => (
                        <swiper-slide onClick={() => window.open( "/blogs/" + element.id, "_self" )}>
                            <div>
                                <img src={"https://t4.ftcdn.net/jpg/05/68/98/15/360_F_568981524_2irG4VUSs06xbahAihTpkuSfxKkw8FqX.jpg"} alt={element.title} />
                            </div>
                            <span>{element.title}</span>
                            <p>{element.short_description}</p>
                        </swiper-slide>
                    ) )}
                </swiper-container>}
                {blogs.length === 0 && <Skeleton.Input active />}
            </div>
            <div className='blogs-swiper-container'>
                <h3>
                    <span>General Updates</span>
                    <span>
                        <IoIosArrowDropleftCircle onClick={() => {
                            document.querySelector( "#swiper2" ).swiper.slidePrev();
                        }} />
                        <IoIosArrowDroprightCircle onClick={() => {
                            document.querySelector( "#swiper2" ).swiper.slideNext();
                        }} />
                    </span>
                </h3>
                {blogs.length !== 0 && <swiper-container slides-per-view={screen === "laptop" ? 3 : 1} space-between={screen === "laptop" ? 30 : 0} autoPlay autoPlay-delay={4000} id="swiper2">
                    {blogs.filter( ( element ) => element.category.includes( "Updates" ) ).map( ( element, index ) => (
                        <swiper-slide onClick={() => window.open( "/blogs/" + element.id, "_self" )}>
                            <div>
                                <img src={"https://t4.ftcdn.net/jpg/05/68/98/15/360_F_568981524_2irG4VUSs06xbahAihTpkuSfxKkw8FqX.jpg"} alt={element.title} />
                            </div>
                            <span>{element.title}</span>
                            <p>{element.short_description}</p>
                        </swiper-slide>
                    ) )}
                </swiper-container>}
                {blogs.length === 0 && <Skeleton.Input active />}
            </div>
            <div className='blogs-swiper-container'>
                <h3>
                    <span>Newly Launched</span>
                    <span>
                        <IoIosArrowDropleftCircle onClick={() => {
                            document.querySelector( "#swiper3" ).swiper.slidePrev();
                        }} />
                        <IoIosArrowDroprightCircle onClick={() => {
                            document.querySelector( "#swiper3" ).swiper.slideNext();
                        }} />
                    </span>
                </h3>
                {blogs.length !== 0 && <swiper-container slides-per-view={screen === "laptop" ? 3 : 1} space-between={screen === "laptop" ? 30 : 0} autoPlay autoPlay-delay={4000} id="swiper3">
                    {blogs.filter( ( element ) => element.category.includes( "Launch" ) ).map( ( element, index ) => (
                        <swiper-slide onClick={() => window.open( "/blogs/" + element.id, "_self" )}>
                            <div>
                                <img src={"https://t4.ftcdn.net/jpg/05/68/98/15/360_F_568981524_2irG4VUSs06xbahAihTpkuSfxKkw8FqX.jpg"} alt={element.title} />
                            </div>
                            <span>{element.title}</span>
                            <p>{element.short_description}</p>
                        </swiper-slide>
                    ) )}
                </swiper-container>}
                {blogs.length === 0 && <Skeleton.Input active />}
            </div>
            </div>
            <Footer />
        </div>
    )
}

export default Blogs