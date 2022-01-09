/*
 * Copyright (c) 2018, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAPI } from 'AppComponents/Apis/Details/components/ApiContext';
import ResourceNotFound from 'AppComponents/Base/Errors/ResourceNotFound';
// import EditScope from './EditScope';
import Policies from './Policies';
import CreatePolicy from './CreatePolicy';

const Policy = () => {
    const [api, updateAPI] = useAPI();
    return (
        <Switch>
            <Route
                exact
                path='/apis/:api_uuid/policies'
                component={() => <Policies api={api} updateAPI={updateAPI} />}
            />
            <Route
                exact
                path='/apis/:api_uuid/policies/create'
                component={() => <CreatePolicy api={api} />}
                // component={(props) => <CreatePolicy api={api} {...props} updateAPI={updateAPI} />}
            />
            {/* <Route
                exact
                path={'/' + urlPrefix + '/:api_uuid/scopes/edit'}
                component={(props) => <EditScope api={api} {...props} updateAPI={updateAPI} />}
            /> */}
            <Route component={ResourceNotFound} />
        </Switch>
    );
};

Policy.propTypes = {
    api: PropTypes.shape({
        id: PropTypes.string,
        additionalProperties: PropTypes.shape({
            key: PropTypes.string,
            value: PropTypes.string,
        }).isRequired,
    }).isRequired,
};

export default Policy;
