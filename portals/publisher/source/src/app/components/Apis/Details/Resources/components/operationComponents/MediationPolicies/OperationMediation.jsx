/*
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
// import { getVersion } from 'AppComponents/Apis/Details/Resources/operationUtils';
// import AddParameter from './AddParameter';
// import ListParameters from './ListParameters';
import { FormattedMessage } from 'react-intl';
import Box from '@material-ui/core/Box';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Tooltip from '@material-ui/core/Tooltip';
import HelpOutline from '@material-ui/icons/HelpOutline';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AddCircle from '@material-ui/icons/AddCircle';
import ListMediationPolicies from './ListMediationPolicies';
import AddMediationPolicy from './AddMediationPolicy';

const useStyles = makeStyles((theme) => ({
    paddingTooltip: {
        paddingLeft: 5,
    },
    addPolicyButton: {
        marginLeft: theme.spacing(2),
    },
    buttonIcon: {
        marginRight: theme.spacing(1),
    },
}));

/**
 *
 * Renders the mediation policies section in the operation collapsed page
 * @export
 * @param {*} props
 * @returns
 */
export default function OperationMediation(props) {
    const {
        disableUpdate,
    } = props;

    const classes = useStyles();
    const [selectedTab, setSelectedTab] = useState(0); // Request mediation related tab is active by default
    const [addPolicyOpen, setAddPolicyOpen] = useState(false);
    const haveRequestMediationPolicies = true; // operation.requestMediationPolicies;
    const requestMediationPolicies = 1;
    // const addRequestMediationPolicyTitle = 'Add Request Mediation Policy';
    // const addResponseMediationPolicyTitle = 'Add Response Mediation Policy';

    return (
        <>
            {addPolicyOpen !== false && (
                <AddMediationPolicy
                    // operationsDispatcher={operationsDispatcher}
                    // target={target}
                    // verb={verb}
                    addPolicyOpen={addPolicyOpen}
                    setAddPolicyOpen={setAddPolicyOpen}
                    flow={selectedTab === 0 ? 'Request' : 'Response'}
                    // version={specVersion}
                />
            )}
            <Grid item xs={12} md={12}>
                <Typography variant='subtitle1'>
                    <FormattedMessage
                        id='Apis.Details.Resources.OperationMediation.title'
                        defaultMessage='Operation Mediation'
                    />
                    <Divider variant='middle' />
                </Typography>
            </Grid>
            <Grid item md={1} />
            <Grid item md={11}>
                <Box>
                    <Box>
                        <Tabs
                            value={selectedTab}
                            onChange={(event, tab) => setSelectedTab(tab)}
                            indicatorColor='primary'
                            textColor='primary'
                            aria-label='Operation level mediation policy tabs for request/response'
                        >
                            <Tab label='Request' />
                            <Tab label='Response' />
                        </Tabs>
                    </Box>
                    <div role='tabpanel' hidden={selectedTab !== 0} id={`simple-tabpanel-${0}`}>
                        {selectedTab === 0 && (
                            <Box mt={3}>
                                <Box display='flex' flexDirection='row' alignItems='center'>
                                    <Typography variant='subtitle2'>
                                        <FormattedMessage
                                            id='Apis.Details.Resources.OperationMediation.requestMediation.title'
                                            defaultMessage='Request Mediation Policies'
                                        />
                                    </Typography>
                                    <Tooltip
                                        title={(
                                            <FormattedMessage
                                                id={'Apis.Details.Resources.OperationMediation.requestMediation'
                                                + '.tooltip'}
                                                defaultMessage='Manage request mediation policies that are local to
                                                this resource'
                                            />
                                        )}
                                        fontSize='small'
                                        placement='top-end'
                                        className={classes.paddingTooltip}
                                        interactive
                                    >
                                        <HelpOutline />
                                    </Tooltip>
                                    <Button
                                        variant='outlined'
                                        color='primary'
                                        size='small'
                                        onClick={() => setAddPolicyOpen(true)}
                                        className={classes.addPolicyButton}
                                    >
                                        <AddCircle className={classes.buttonIcon} />
                                        <FormattedMessage
                                            id='Apis.Details.Resources.OperationMediation.requestMediation.addPolicy'
                                            defaultMessage='Add Request Policy'
                                        />
                                    </Button>
                                </Box>
                                {haveRequestMediationPolicies && (
                                    <ListMediationPolicies
                                        disableUpdate={disableUpdate}
                                        requestMediationPolicies={requestMediationPolicies}
                                    />
                                )}
                            </Box>
                        )}
                    </div>
                    <div role='tabpanel' hidden={selectedTab !== 1} id={`simple-tabpanel-${1}`}>
                        {selectedTab === 1 && (
                            <Box mt={3}>
                                <Box display='flex' flexDirection='row' alignItems='center'>
                                    <Typography variant='subtitle2'>
                                        <FormattedMessage
                                            id='Apis.Details.Resources.OperationMediation.responseMediation.title'
                                            defaultMessage='Response Mediation Policies'
                                        />
                                    </Typography>
                                    <Tooltip
                                        title={(
                                            <FormattedMessage
                                                id={'Apis.Details.Resources.OperationMediation.responseMediation'
                                                + '.tooltip'}
                                                defaultMessage='Manage response mediation policies that are local to
                                                this resource'
                                            />
                                        )}
                                        fontSize='small'
                                        placement='top-end'
                                        className={classes.paddingTooltip}
                                        interactive
                                    >
                                        <HelpOutline />
                                    </Tooltip>
                                    <Button
                                        variant='outlined'
                                        color='primary'
                                        size='small'
                                        onClick={() => setAddPolicyOpen(true)}
                                        className={classes.addPolicyButton}
                                    >
                                        <AddCircle className={classes.buttonIcon} />
                                        <FormattedMessage
                                            id='Apis.Details.Resources.OperationMediation.responseMediation.addPolicy'
                                            defaultMessage='Add Response Policy'
                                        />
                                    </Button>
                                </Box>
                                {haveRequestMediationPolicies && (
                                    <ListMediationPolicies
                                        disableUpdate={disableUpdate}
                                    />
                                )}
                            </Box>
                        )}
                    </div>
                </Box>
            </Grid>
        </>
    );
}

OperationMediation.propTypes = {
    disableUpdate: PropTypes.bool,
    // operation: PropTypes.shape({}).isRequired,
};

OperationMediation.defaultProps = {
    disableUpdate: false,
};
