import React, { Component } from 'react';
import SimpleStorageSC from "../contracts/SimpleStorageSC";
import SimpleStorageGethSC from "../contracts/SimpleStorageGethSC";
import axios from 'axios'
import { Server } from './Properties'

export default class SimpleStorageTest extends Component {


    constructor(props) {
        super(props);

        //react-native 탭선택 정보 수신 이벤트
        window.document.addEventListener('message', (e)=> {
            this.tabListener(e)
        })
    }

    componentWillMount() { //init영역 : 화면이 그려지기 전에 불리는 시스템함수임.
        //(화면이 뜨기전시점 : contract 생성 및 초기화

        //geth TEST
        this.simpleStorageGethSC = new SimpleStorageGethSC();
        this.simpleStorageGethSC.initContract('/SimpleStorageSC.json');
    }

    ////////////////////////////////////////////////////////////
    ///////geth TEST/////////////////////
    onSet2Click = () => { //SET 클릭시 컨트랙트의 setValue호출
        console.log('SET clicked:' + this.set2Input.value);
        this.simpleStorageGethSC.setValue(this.set2Input.value);

    }

    onGet2Click = () => { //GET 클릭시 컨트랙트의 getValue호출
        //getValue()는 promise형태 임.
        this.simpleStorageGethSC.getValue().then((value) => {
            this.get2Input.value = value;
        });
        console.log('GET2 clicked:' + this.get2Input.value);
    }

    ///// Image Upload TEST /////////////////////////////////
    uploadFile = (event) => {
        event.preventDefault();

        let formData = new FormData();
        formData.append('file', event.target[0].files[0]);

        axios(Server.getRestAPIHost() + '/file',
            {
                method: 'post',
                data:formData,
                withCredentials: true,
                credentials: 'same-origin'
            })
            .then((response) => {
                // alert(JSON.stringify(response));  //response출력
                if (response.status !== 200)
                    alert('upload 오류입니다.');
                else {
                    console.log(response.data)
                }
            })
    }

    // react-native에서 새로운 웹뷰를 띄울 때 새로 띄울 url을 data에 담아서 postMessage로 보내면 됨
    postMsg = () => {
        const data = {url: 'http://localhost:3000/goods?goodsNo=3'};
        window.postMessage(JSON.stringify(data))
    };

    // react-native에서 탭 선택시 data 받음
    tabListener = (e) => {
        const {tab} = JSON.parse(e.data);
        alert(tab);
    }

    render() {
        return (
            <div>
                <br/>
                <h5> Geth서버 Test</h5>
                <input type="text"
                       ref = {(input) => {this.set2Input = input}}
                />
                <button onClick = {this.onSet2Click}> SET2 </button>

                <br/>
                <br/>                       {/* GET버튼 + INPUT */}
                <button onClick = {this.onGet2Click}> GET2 </button>
                <input type="text"
                       ref = {(input) => {this.get2Input = input}}
                />

                <br/>
                <br/>
                <form onSubmit={this.uploadFile}>
                        File to upload : <input type="file" name="file" />
                        <br/>
                        <input type="submit" value="Upload" />
                </form>

                <br />
                <br />
                <button onClick={this.postMsg}> Open anotherWebView </button>

            </div>
        );
    }
}
