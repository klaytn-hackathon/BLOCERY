import React, { Component } from 'react'
import { Col, Button, Form, FormGroup, Label, Input, Row, Collapse, Card, CardBody } from 'reactstrap'

import PropTypes from 'prop-types'

export default class Terms extends Component {
    constructor(props) {
        super(props);
        this.state = {
            termsCollapse: false,
            personalInfoCollapse: false,
            data: this.props.data,
            isAllChecked: false
        }

    }

    //전체체크
    onCheckAllBoxChange = (e) => {
        const data = Object.assign([], this.state.data)
        const checked = e.target.checked

        data.map((item)=>{
            item.checked = checked
        })

        this.setState({
            data: data,
            isAllChecked: checked
        })

        this.props.onCheckAll(e)
    }

    //체크박스
    onCheckBoxChange = (index) => {
        const data = Object.assign([], this.state.data)

        const checked = data[index].checked || false
        data[index].checked = !checked

        this.setState({
            data: data
        })

        this.props.onClickCheck(data, index)
    }

    // 약관 전체보기 클릭
    toggle = (index) => {
        const data = Object.assign([], this.state.data)
        const isOpen = data[index].isOpen || false
        data[index].isOpen = !isOpen

        this.setState({
            data: data
        })

    }

    render() {
        const data = this.state.data;
        return (
            <Form>
                <Row>
                    <Col>
                        <FormGroup check>
                            <Label check>
                                <Input type="checkbox" name="checkAll" checked={this.state.isAllChecked} value="checkAll" onChange={this.onCheckAllBoxChange} />{' '}
                                <h6>전체 동의{' '}</h6>
                            </Label>
                        </FormGroup>
                    </Col>
                </Row>
                {
                    data.map(({name, title, content, isOpen, checked}, index)=>{
                        return (
                            <Row key={index}>
                                <Col>
                                    <FormGroup check>
                                        <Label check>
                                            <Input type="checkbox" name={name} checked={checked} onChange={this.onCheckBoxChange.bind(this, index)} />
                                            <h6>{title}{' '}<span className={'text-danger'}>(필수)</span><Button color="link" onClick={this.toggle.bind(this, index)}>전체보기</Button></h6>
                                            <Collapse isOpen={isOpen}>
                                                <Card><CardBody>{content}</CardBody></Card>
                                            </Collapse>
                                        </Label>
                                    </FormGroup>
                                </Col>
                            </Row>
                        )
                    })
                }
            </Form>
        )
    }
}

Terms.propTypes = {
    data: PropTypes.array.isRequired
}
Terms.defaultProps = {

}