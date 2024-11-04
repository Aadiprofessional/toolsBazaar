import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

import { Skeleton } from 'antd';
import parse from 'html-react-parser';
import TaskBar from '../TaskBar';

function BlogsInfo () {
    const [ details, setDetails ] = useState( {} );
    const [ more, setMore ] = useState( [] );
    const { id } = useParams();

    async function onload () {
        fetch( "https://toolsbazaar-server-1036279390366.asia-south1.run.app/blogs/" + id ).then( async res => {
            let data = await res.json();
            setDetails( { ...data.details } );
            setMore( [ ...data.blogs ] );
        } );
    }

    useEffect( () => {
        onload();
    }, [] )

    return (
        <div className='blogs-container'>
            <TaskBar/>
           
            <div className='blogs-info-container'>
                {Object.keys( details ).length !== 0 && <div className='blogs-info-content'>
                    <h1>{details.title}</h1>
                    <div>
                        <img src={( "https://t4.ftcdn.net/jpg/05/68/98/15/360_F_568981524_2irG4VUSs06xbahAihTpkuSfxKkw8FqX.jpg" )} height={340} alt={details.title} />
                        <span>
                            {parse( details.description )}
                        </span>
                    </div>
                </div>}
                {Object.keys( details ).length === 0 && <div className='blogs-info-content'>
                    <Skeleton.Input active />
                    <div>
                        <Skeleton.Image active />
                        <Skeleton.Input active />
                    </div>
                </div>}
                <div className='blogs-info-more'>
                    <h5>More Like This</h5>
                    {more.length !== 0 && <div>
                        {more.filter( ( element ) => element.id !== details.id ).map( ( element, index ) => (
                            <div onClick={() => window.open( "/blogs/" + element.id, "_self" )}>
                                <div>
                                    <img src={"https://t4.ftcdn.net/jpg/05/68/98/15/360_F_568981524_2irG4VUSs06xbahAihTpkuSfxKkw8FqX.jpg"} alt={details.title} />
                                </div>
                                <span>{element.title}</span>
                                <p>{element.short_description}</p>
                            </div>
                        ) )}
                    </div>}
                    {more.length === 0 && <Skeleton.Input active />}
                </div>
            </div>
        </div>
    )
}

export default BlogsInfo