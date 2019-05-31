import React, { Fragment } from 'react';
import { Col, Button, Form, FormGroup, Label, Input} from 'reactstrap'
import { Link, withRouter } from 'react-router-dom';
import Login from '../Login';

export default class ConsumerLogin extends Login {

    constructor(props) {
        super(props);
        this.targetLocation = '/dashboardConsumer'
        this.userType = 'consumer';
    }

    render(){
        return(
            <Fragment>
                <Form onSubmit={this.formValidation}>
                    <br/><br/>
                    <FormGroup row>
                        <Label for="email" sm={{ size: 2, offset: 1 }}> 이메일 ID </Label>
                        <Col sm={4}>
                            <Input type="text" name="email" value="ctest1@ezfarm.co.kr"/>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="password" sm={{ size: 2, offset: 1 }}> 비밀번호 </Label>
                        <Col sm={4}>
                            <Input type="password" name="password" value="ezfarm3414" />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Col sm={{ size: 6, offset: 3 }}>
                            <Button type='submit' color='primary' style={{ width:150 }} > 로그인 </Button>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <Button tag={Link} to={'/consumerRegister/'} color='primary' style={{ width:150 }} > 소비자가입 </Button>
                        </Col>
                    </FormGroup>
                </Form>
            </Fragment>
        );
    }
}

