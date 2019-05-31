import React, { Component } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { Server } from '../../Properties'
import ImageUploadButton from './ImageUploadButton'
import { Gallery } from '../Gallery'
import { Spinner } from '../Spinner'
import ComUtil from "../../../util/ComUtil"

export default class ImageUploader extends Component {
    constructor(props) {
        super(props)
        this.state = {
            uploading: false,
            images: []
        }
    }

    //이미지 선택 이벤트  & props.onChange() 콜백 실행
    onFileChange = async e => {
        //로딩중..
        this.setState({
            uploading: true,
            images: []
        })

        const { directory, onChange } = this.props
        let files = e.target.files

        //이미지압축 & 업로드 지시
        const responses = await this.processArray(files)

        //에러검증
        const errData = responses.filter((data)=>data.status !== 200)
        if(errData.length > 0){
            alert('upload 오류 입니다')
        }else{
            // const fullUrl = Server.getServerURL() + `/${directory}/`  //images or thumbnails

            const images = responses.map(({data:name}, i) => {
                return {
                    imageNo: i,
                    imageUrl: name, //변환된 명칭
                    imageNm: '원본명칭'
                }
            })

            //로딩끝..
            this.setState({
                uploading: false,
                images: images
            })

            //콜백 실행
            onChange(images)
        }
    }

    //이미지압축 & 업로드 지시
    processArray = async (files) => {

        const { limit } = this.props
        let response = [];

        //file은 map으로 돌릴 수 없음(에러)
        for(let i=0;i<files.length; i++){
            if(limit <= i){
                alert(limit + '장 까지 업로드 가능 합니다')
                break
            }

            const formData = this.compressor(files[i])

            //업로드
            const result = await this.upload(formData)
            response.push(result)
        }

        return response

    }

    //이미지압축
    compressor = (file) => {
        if (!file) {
            return;
        }

        //이미지 압축하기
        const compressedFile = ComUtil.imageCompressor({file: file})

        const formData = new FormData();
        // The third parameter is required for server
        formData.append('file', compressedFile, compressedFile.name);

        return formData
    }

    //이미지업로드
    upload = (formData) => axios(Server.getRestAPIHost() + '/file',
        {
            method: 'post',
            data:formData,
            withCredentials: true,
            credentials: 'same-origin'
        })

    //클릭된 이미지의 인덱스 반환
    getClickedImageIndex = (name) => {
        const images = Object.assign([], this.state.images)
        let idx = 0
        for(let i=0;i<images.length; i++){
            if(images[i].name === name){
                return i
            }
        }
    }

    //이미지 클릭 시 이미지 삭제 & props.onChange() 콜백 실행
    onImageClick = (e) => {
        const { onChange } = this.props
        const images = Object.assign([], this.state.images)
        const name = e.target.name
        const clickedIndex = this.getClickedImageIndex(name)

        images.splice(clickedIndex, 1) //선택된 이미지 제거

        //파일 제거
        axios.delete(Server.getRestAPIHost() + '/file',
        {
            params: {fileName: name}
        })
        .then((response)=>{
            //console.log(response)
        })

        //렌더링
        this.setState({
            ...this.state,
            images
        })

        //콜백 실행
        onChange(images)
    }

    render() {
        const { multiple, style } = this.props
        // const rootUrl = Server.getServerURL() + `/${this.props.directory}/`
        return(
            <div>
                {
                    this.state.images.length <= 0 && <ImageUploadButton multiple={multiple} onChange={this.onFileChange} />
                }
                <Gallery directory={this.props.directory} images={this.state.images} onClick={this.onImageClick} style={style} />
                {
                    this.state.uploading && <Spinner />
                }
            </div>
        )
    }
}

ImageUploader.propTypes = {
    onChange: PropTypes.func.isRequired,
    multiple: PropTypes.bool,
    limit: PropTypes.number,    //파일 선택 개수
    directory: PropTypes.string //images : 원본, thumnail : 썸네일
}
ImageUploader.defaultProps = {
    multiple: false,
    limit: 3,
    directory: 'thumbnails'
}