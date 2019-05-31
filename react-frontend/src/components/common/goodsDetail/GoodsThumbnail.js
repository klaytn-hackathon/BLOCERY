import React from 'react'
import {Server} from '../../Properties'
import Style from './GoodsDetail.module.scss'
const GoodsThumbnail = (props) => {

    //const thumbnailUrl = 'http://localhost:8080/thumbnails/'

    return (
        <div className={Style.containerGoodsImgList}>
            {
                props.images.map(({imageNo, imageNm, imageUrl}, index)=>{
                    return(
                    <img
                        key={'thumbnail_'+imageUrl}
                        id={imageNo}
                        src={Server.getThumbnailURL() +imageUrl}
                        className={props.selectedIndex === index ? Style.active : ''}
                        onClick={props.onClick}
                    />
                    )
                })
            }
        </div>
    )
}

export default GoodsThumbnail