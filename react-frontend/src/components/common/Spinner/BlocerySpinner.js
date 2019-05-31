import React from 'react'
import Style from './BlocerySpinner.module.scss'
import { Spinner, BloceryLogoGreen } from '../../common'
const BlocerySpinner = () => {
    return(

        <div className={Style.wrap}>
            <div className={Style.modal}>
                <div>
                    <BloceryLogoGreen/>
                </div>
                <div className={'small'}><Spinner/></div>
            </div>
        </div>
    )
}
export default BlocerySpinner