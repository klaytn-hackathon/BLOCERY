import React from 'react'
import PropTypes from 'prop-types'
import LogoGreen from '../../../../src/images/logo/Blocery_logo_green.png'
import LogoWhite from '../../../../src/images/logo/Blocery_logo_white.png'
import LogoBlack from '../../../../src/images/logo/Blocery_logo_black.png'
import LogoGreenVertical from '../../../../src/images/logo/Blocery_logo_green_vertical.png'
import SymbolGreen from '../../../../src/images/logo/Blocery_symbol_green.png'

const BloceryLogoGreen = (props) => <img src={LogoGreen} style={props.style} />
const BloceryLogoWhite = (props) => <img src={LogoWhite} style={props.style} />
const BloceryLogoBlack = (props) => <img src={LogoBlack} style={props.style} />
const BloceryLogoGreenVertical = (props) => <img src={LogoGreenVertical} style={props.style} />
const BlocerySymbolGreen = (props) => <img src={SymbolGreen} style={props.style} />

BloceryLogoGreen.propTypes = {
    style: PropTypes.object
}
BloceryLogoGreen.defaultProps = {
    style: {width: '100px', height: '100%'}
}
BloceryLogoWhite.propTypes = {
    style: PropTypes.object
}
BloceryLogoWhite.defaultProps = {
    style: {width: '100px', height: '100%'}
}
BloceryLogoBlack.propTypes = {
    style: PropTypes.object
}
BloceryLogoBlack.defaultProps = {
    style: {width: '100px', height: '100%'}
}
BloceryLogoGreenVertical.propTypes = {
    style: PropTypes.object
}
BloceryLogoGreenVertical.defaultProps = {
    style: {width: '100px', height: '100%'}
}
BlocerySymbolGreen.propTypes = {
    style: PropTypes.object
}
BlocerySymbolGreen.defaultProps = {
    style: {width: '100px', height: '100%'}
}
export {
    BloceryLogoGreen,
    BloceryLogoWhite,
    BloceryLogoBlack,
    BloceryLogoGreenVertical,
    BlocerySymbolGreen
}