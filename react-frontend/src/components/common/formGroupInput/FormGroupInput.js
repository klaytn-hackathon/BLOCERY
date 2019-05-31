import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Input, FormGroup, Label, FormText } from 'reactstrap'

const FormGroupInput = (props) => {
    const star = <span className='text-danger'>*</span>
    return (
        <FormGroup>
            <Label>{props.title}{props.isRequired && star}</Label>
            {
                props.isRequired ? (
                    <Input
                        valid={props.value ? true : false}
                        invalid={!props.value ? true : false}
                        name={props.name}
                        value={props.value}
                        placeholder={props.placeholder} onChange={props.onChange}
                    />
                ) : (
                    <Input
                        name={props.name}
                        value={props.value}
                        placeholder={props.placeholder} onChange={props.onChange}
                    />
                )
            }

            {/*<FormFeedback invalid>필수 입력값입니다</FormFeedback>*/}
            {
                props.explain && <FormText>{props.explain}</FormText>
            }
            {/*<FormFeedback valid>성공!</FormFeedback>*/}
        </FormGroup>
    )
}

FormGroupInput.propTypes = {
    name: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,     //제목
    value: PropTypes.string.isRequired,
    isRequired: PropTypes.bool,             //필수여부
    placeholder: PropTypes.string,
    explain: PropTypes.string,
    onChange: PropTypes.func.isRequired,
}

FormGroupInput.defaultProps = {
    name: '',
    title: '',
    value: '',
    isRequired: false,
    placeholder: '',
    explain: '',
}

export default FormGroupInput