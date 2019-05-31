import React, { Component } from 'react'
import { Row, Col } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCarrot, faAppleAlt, faCartPlus, faCartArrowDown, faStar, faStarHalf } from '@fortawesome/free-solid-svg-icons'
import { Spinner } from '../../common'
import Card from './Card'

const style = {
    paddingLeft: 0,
    paddingRight: 0
}

export default class MdCategory extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            activeCd: null,
            data: []
        }
    }

    componentDidMount(){
        this.search()
    }

    search = () =>{
        this.setState({loading: true})

        setTimeout(()=>{


            this.setState({
                loading: false,
                data: [
                    {name:'사과', itemCd: '01'},
                    {name:'배', itemCd: '02'},
                    {name:'마늘', itemCd: '03'},
                    {name:'파프리카', itemCd: '04'},
                    {name:'오이', itemCd: '05'},
                    {name:'배추', itemCd: '06'},
                    {name:'밤', itemCd: '07'},
                    {name:'미나리', itemCd: '08'}
                ]
            })
        }, 1000)
    }

    onCardClicked = (props, e) => {
        this.setState({
            itemCd: props.itemCd
        })

        this.props.onClick(props)
    }

    render() {
        const icon = faAppleAlt
        return(
            <Row>
                <Col style={style}>
                    <div className="scrolling-wrapper-flexbox">
                        {
                            this.state.loading && <Spinner />
                        }
                        {
                            this.state.data.map(({name, itemCd})=>{
                                return(
                                    <Card
                                        key={itemCd}
                                        name={name}
                                        itemCd={itemCd}
                                        icon={icon}
                                        onClick={this.onCardClicked}
                                        active={this.state.itemCd == itemCd}
                                    />
                                )
                            })
                        }
                    </div>
                </Col>
            </Row>
        )
    }
}

