import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom'

import * as Admin from '../components/admin'

class AdminContainer extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return(
            <Switch>
                <Route path='/admin/login' component={Admin.AdminLogin} />
            </Switch>
        )
    }
}

export default AdminContainer