/*
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import React, { useContext, useState }  from 'react';
import {
    Typography, makeStyles, Theme
} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { Link } from 'react-router-dom';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import LaunchIcon from '@material-ui/icons/Launch';
import { FormattedMessage} from 'react-intl';
import { Progress } from 'AppComponents/Shared';
import API from 'AppData/api.js';
import Alert from 'AppComponents/Shared/Alert';
import ApiContext from 'AppComponents/Apis/Details/components/ApiContext';
import PolicyStepper from './PolicyStepper';
import type { CreatePolicySpec } from './Types';

const useStyles = makeStyles((theme: Theme) => ({
    link: {
        color: theme.palette.primary.dark,
        marginLeft: theme.spacing(2),
        display: 'inline',
    }
}));

const DefaultPolicySpec = {
    category: 'Mediation',
    name: '',
    displayName: '',
    description: '',
    multipleAllowed: false,
    applicableFlows: ['request', 'response', 'fault'],
    supportedGateways: ['Synapse'],
    supportedApiTypes: ['REST'],
    policyAttributes: [],
};

interface CreatePolicyProps {
    handleDialogClose: () => void;
    dialogOpen: boolean;
    fetchPolicies: () => void;
}

/**
 * Renders the UI to create a new policy.
 * @param {JSON} props Input props from parent components.
 * @returns {TSX} Policy create UI.
 */
const CreatePolicy: React.FC<CreatePolicyProps> = ({
    handleDialogClose, dialogOpen, fetchPolicies
}) => {
    const classes = useStyles();
    const { api } = useContext<any>(ApiContext);

    const [policyDefinitionFile, setPolicyDefinitionFile] = useState<any[]>([]);
    const [policySpec, setPolicySpec] = useState<CreatePolicySpec | null>(DefaultPolicySpec);

    const savePolicy = (policySpecContent: CreatePolicySpec, policyDefinition: any) => {
        const promisedCommonPolicyAdd = API.addOperationPolicy(policySpecContent, policyDefinition, api.id);   
        promisedCommonPolicyAdd
            .then(() => {
                Alert.info('Policy created successfully!');
                setPolicyDefinitionFile([]);
                setPolicySpec(DefaultPolicySpec);
                handleDialogClose();
                fetchPolicies();
            })
            .catch((error) => {
                handleDialogClose();
                const { response } = error;
                if (response.body) {
                    const { description } = response.body;
                    console.log(description);
                    Alert.error('Something went wrong while creating policy');
                }
            });
    }

    const stopPropagation = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
    }

    if (!policySpec) {
        return <Progress />
    }

    const onPolicyCreateSave = () => {
        savePolicy(policySpec, policyDefinitionFile);
        handleDialogClose();
    }

    return (
        <>
            <Dialog
                maxWidth='md'
                open={dialogOpen}
                aria-labelledby='form-dialog-title'
                onClose={handleDialogClose}
                onClick={stopPropagation}
                fullWidth
            >
                <Box
                    display='flex'
                    justifyContent='space-between'
                    alignItems='center'
                    flexDirection='row'
                    px={3}
                    pt={3}
                >
                    <Box display='flex'>
                        <Typography variant='h4' component='h2'>
                            <FormattedMessage
                                id='Policies.CreatePolicy.listing.heading'
                                defaultMessage='Create New Policy'
                            />
                        </Typography>
                    </Box>
                    <Box display='flex'>
                        <IconButton color='inherit' onClick={handleDialogClose} aria-label='Close'>
                            <Icon>close</Icon>
                        </IconButton>
                    </Box>
                </Box>
                <DialogContent>
                    <DialogContentText>
                        <PolicyStepper
                            onSave={onPolicyCreateSave}
                            policyDefinitionFile={policyDefinitionFile}
                            setPolicyDefinitionFile={setPolicyDefinitionFile}
                            policySpec={policySpec}
                            setPolicySpec={setPolicySpec}
                        />
                    </DialogContentText>
                </DialogContent>
                <Box display='flex' flexDirection='row' justifyContent='right' px={3} pb={3}>
                    <Link to='/policies'>
                        <Typography className={classes.link} variant='caption'>
                            Want to create a common policy that will be visible to all APIs instead?
                            <LaunchIcon style={{ marginLeft: '2px' }} fontSize='small' />
                        </Typography>
                    </Link>
                </Box>
            </Dialog>
        </>
    );
};

export default CreatePolicy;
