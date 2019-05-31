import React, { Component, Fragment } from 'react'
import { NavLink as RouterLink } from 'react-router-dom'
import { Container, Row, Col} from 'reactstrap'

export default class MainCategory extends Component {
    constructor(props) {
    super(props);
        this.state = {
            activeClassName: 'text-info'
        }
  }
  render() {
    return(
        <Container>
            <Row>
                <Col xs={'3'}><RouterLink to={'/main/recommend'} activeClassName={this.state.activeClassName}>오늘의추천</RouterLink></Col>
                <Col xs={'3'}><RouterLink to={'/main/resv'} activeClassName={this.state.activeClassName} >예약구매</RouterLink></Col>
                <Col xs={'3'}><RouterLink to={'/main/farmDiary'} activeClassName={this.state.activeClassName} >재배일지</RouterLink></Col>
                <Col xs={'3'}><RouterLink to={'/main/transGoods'} activeClassName={this.state.activeClassName} >양도거래소</RouterLink></Col>
            </Row>
        </Container>
    )
  }
}