import React, { Component } from 'react'

import ImageUploader from '../../common/ImageUploader/ImageUploader'

class ImageCompressor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uploading: false
        }
    }

    //업로드된 이미지 경로 받기
    onUploadCompleted = ({name, src}) => {
        console.log(name, src)
    }


    render() {
        return (
            <div className='text-center'>
                <h6>src/components/sample/ImageCompressor.js</h6>
                <h4>이미지 업로드(압축하기)</h4>
                <div className='text-left'>Single 업로드</div>
                <ImageUploader onUploaded={this.onUploadCompleted}/>
                <div className='text-left'>Multi 업로드</div>
                <ImageUploader onUploaded={this.onUploadCompleted} multiple/>
            </div>
        );
    }
}

export default ImageCompressor