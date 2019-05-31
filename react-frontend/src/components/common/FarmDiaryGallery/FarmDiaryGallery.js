import React, {Component, Fragment} from 'react'
import { FarmDiaryCard } from '../cards'
import Style from './FarmDiaryGallery.module.scss'


export default class FarmDiaryGallery extends Component{
    constructor(props){
        super(props)
    }
    //이미지 클릭시
    onClick = (e) => {
        const { data } = this.props
        const src = e.target.src
        const item = data.find(item => item.imageUrl === src)
        this.props.onClick(item)
    }
    render(){
        return(
            <Fragment>
                <div className={Style.wrap}>
                    {
                        this.props.data.map((item, index)=>{
                            return <FarmDiaryCard
                                key={item.imageUrl}
                                {...item}
                                onClick={this.onClick}
                                titleLength={this.props.titleLength}
                                contentLength={this.props.contentLength}
                            />
                        })
                    }
                </div>
            </Fragment>
        )
    }
}
