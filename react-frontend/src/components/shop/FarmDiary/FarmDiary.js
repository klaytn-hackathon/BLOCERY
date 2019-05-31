import React, { Component, Fragment } from 'react'
import { FarmDiaryGallery, Spinner, Sorter } from '../../common'
import {Container, Row, Col} from 'reactstrap'
import { getFarmDiary } from '../../../lib/farmDiaryApi'
import ComUtil from '../../../util/ComUtil'
import {Server} from '../../Properties'
import { Webview } from '../../../lib/webviewApi'
const colStyle = { paddingLeft: 0, paddingRight: 0 }

export default class FarmDiary extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            loading: true
        }
    }
    componentDidMount(){
        this.search()
    }
    search = async () => {

        //로딩중
        this.setState({loading: true})

        //ajax
        const { data } = await getFarmDiary()
        const bindData = this.makeBindData(data)
        this.setState({
            loading: false,
            data: bindData
        })
    }
    makeBindData = (data) => {
        return this.getFilteredData(data)   //새로운 배열 반환
    }
    //goods 에서 card 에 바인딩 할 object 반환
    getFilteredData = (data) => {
        const serverImageUrl = Server.getImageURL()
        return data.map((goods)=>{
            return {
                goodsNo: goods.goodsNo,
                goodsNm: goods.goodsNm,
                ...goods.cultivationDiary,
                imageUrl: goods.cultivationDiary.diaryImages.length > 0 ? serverImageUrl + goods.cultivationDiary.diaryImages[0].imageUrl : ''
            }
        })
    }

    onImageClicked = (item) => {
        Webview.openPopup('/FarmersDetailActivity?goodsNo='+item.goodsNo)
    }
    render() {
        return(
            <Container>
                <br/>
                <h6 className={'text-secondary'}>최신등록순</h6>
                <Row>
                    <Col style={colStyle}>
                        {
                            this.state.loading && <Spinner/>
                        }
                        <FarmDiaryGallery
                            data={this.state.data}
                            onClick={this.onImageClicked}
                            titleLength={20}
                            contentLength={40}
                        />
                    </Col>
                </Row>


            </Container>
        )
    }
}
