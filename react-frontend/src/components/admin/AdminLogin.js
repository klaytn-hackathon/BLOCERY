import React, { Component, Fragment } from 'react'
import { Col, Button, Form, FormGroup, Label, Input} from 'reactstrap'
import axios from 'axios'
import { Server } from '../Properties'


export default class AdminLogin extends Component {

    constructor(props) {
        super(props);
        this.targetLocation = '/admin'
        this.userType = 'admin';
    }


    componentWillMount() {

    }

    formValidation = (event) => {
        event.preventDefault();

        let data = {};
        data.email = event.target[0].value;
        data.valword = event.target[1].value;
        data.userType = this.userType;

        if(data.email === ''){
            alert('이메일을 입력해 주세요');
            return false;
        }
        if(data.valword === ''){
            alert('비밀번호를 입력해주세 주세요');
            return false;
        }

        axios(Server.getRestAPIHost() + '/login',
            {
                method: "post",
                data:data,
                withCredentials: true,
                credentials: 'same-origin'
            })
            .then((response) => {
                console.log(response);
                if (response.data.status === Server.ERROR)             //100: login ERROR
                    alert('로그인 오류. 이메일과 비밀번호를 다시입력해주세요');
                else
                {

                    let loginInfo = response.data;

                    //쿠키(localStorage)에 login된 userType저장.
                    localStorage.setItem('loginUserType', loginInfo.userType);
                    localStorage.setItem('account', loginInfo.account);

                    console.log('loginInfo : ===========================',loginInfo)


                    this.props.history.push(this.targetLocation); //TopBar의 토큰 update가 안됨
                    //window.location = this.targetLocation;  //LeftBar등이 초기화됨
                }
            })
            .catch(function (error) {
                console.log(error);
                alert('로그인 오류:'+error);
            });
    }

    render(){
        return(
            <Fragment>
                <Form onSubmit={this.formValidation}>
                    <br/><br/>
                    <FormGroup row>
                        <Label for="email" sm={{ size: 2, offset: 1 }}> 이메일 ID </Label>
                        <Col sm={4}>
                            <Input type="text" name="email" value="admin@ezfarm.co.kr"/>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="password" sm={{ size: 2, offset: 1 }}> 비밀번호 </Label>
                        <Col sm={4}>
                            <Input type="password" name="password"  />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Col sm={{ size: 6, offset: 3 }}>
                            <Button type='submit' color='primary' style={{ width:150 }} > admin로그인 </Button>
                        </Col>
                    </FormGroup>
                </Form>
            </Fragment>
        );
    }
}
