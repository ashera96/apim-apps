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
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
// import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
// import Checkbox from '@material-ui/core/Checkbox';
import Select from '@material-ui/core/Select';
import FormHelperText from '@material-ui/core/FormHelperText';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
import { FormattedMessage } from 'react-intl';
import { capitalizeFirstLetter } from 'AppData/stringFormatter';

const useStyles = makeStyles((theme) => ({
    form: {
        display: 'flex',
        flexDirection: 'column',
        margin: 'auto',
        width: 'fit-content',
    },
    formControl: {
        marginTop: theme.spacing(2),
        minWidth: 120,
    },
    formControlLabel: {
        marginTop: theme.spacing(1),
    },
    subtleText: {
        color: theme.palette.grey[400],
    },
}));

/**
 *
 * Renders the form to add an operation level mediation policy
 * @export
 * @param {*} props
 * @returns
 */
export default function AddMediationPolicy(props) {
    const {
        addPolicyOpen, setAddPolicyOpen, flow,
    } = props;

    const [fragment, setFragment] = useState('Header');
    // const [action, setAction] = useState('');

    // /**
    //  *
    //  *
    //  * @param {*} currentParameter
    //  * @param {*} paramAction
    //  */
    // function parameterActionReducer(currentParameter, paramAction) {
    //     const { action, value } = paramAction;
    //     const nextParameter = currentParameter.schema
    //         ? { ...currentParameter, schema: { ...currentParameter.schema } } : { ...currentParameter };
    //     switch (action) {
    //         case 'description':
    //         case 'required':
    //             nextParameter[action] = value;
    //             break;
    //         case 'type':
    //             if (nextParameter.schema) {
    //                 nextParameter.schema[action] = value;
    //             } else {
    //                 nextParameter[action] = value;
    //             }
    //             break;
    //         case 'format':
    //             if (nextParameter.schema) {
    //                 if (value) {
    //                     nextParameter.schema[action] = value;
    //                 } else {
    //                     delete nextParameter.schema[action];
    //                 }
    //             } else if (value) {
    //                 nextParameter[action] = value;
    //             } else {
    //                 delete nextParameter[action];
    //             }
    //             break;
    //         default:
    //             break;
    //     }
    //     return nextParameter;
    // }
    // const [parameter, parameterActionDispatcher] = useReducer(parameterActionReducer, addPolicyParameter);
    const classes = useStyles();

    const handleClose = () => {
        setAddPolicyOpen(false);
    };

    const supportedFragments = ['Header', 'Query Param', 'Path', 'Verb', 'Endpoint', 'Response'];

    /**
     *
     *
     */
    function handelDone() {
        // operationsDispatcher({ action: 'parameter', data: { target, verb, value: parameter } });
        handleClose();
    }

    return (
        <Dialog fullWidth maxWidth='sm' open={addPolicyOpen} onClose={handleClose} aria-labelledby='edit-parameter'>
            <DialogTitle disableTypography id='edit-parameter'>
                <Typography variant='h6'>{'Add ' + flow + ' Policy'}</Typography>
            </DialogTitle>
            <DialogContent>
                <Grid container direction='row' spacing={2} justify='flex-start' alignItems='center'>
                    {/* <Grid item md={6}>
                        <TextField
                            value={capitalizeFirstLetter(parameter.in)}
                            disabled
                            fullWidth
                            label={(
                                <FormattedMessage
                                    id='Apis.Details.Resources.components.operationComponents.EditParameter.type'
                                    defaultMessage='Parameter Type'
                                />
                            )}
                            margin='dense'
                            variant='outlined'
                        />
                    </Grid>
                    <Grid item md={6}>
                        <TextField
                            value={parameter.name}
                            disabled
                            fullWidth
                            label={(
                                <FormattedMessage
                                    id='Apis.Details.Resources.components.operationComponents.EditParameter.name'
                                    defaultMessage='Name'
                                />
                            )}
                            margin='dense'
                            variant='outlined'
                        />
                    </Grid> */}
                    <Grid item md={12}>
                        <FormControl
                            required
                            fullWidth
                            margin='dense'
                            variant='outlined'
                            className={classes.formControl}
                        >
                            <InputLabel required id='add-policy-fragment'>
                                <FormattedMessage
                                    id='Temp.operationComponents.EditParameter.data.type'
                                    defaultMessage='Fragment'
                                />
                            </InputLabel>

                            <Select
                                value={fragment}
                                label='fragment'
                                onChange={(e) => setFragment(e.target.value)}
                                // inputProps={{
                                //     name: 'type',
                                //     id: 'edit-parameter-type',
                                // }}
                                // MenuProps={{
                                //     getContentAnchorEl: null,
                                //     anchorOrigin: {
                                //         vertical: 'bottom',
                                //         horizontal: 'left',
                                //     },
                                // }}
                            >
                                {supportedFragments.map((supportedFragment) => (
                                    <MenuItem value={supportedFragment} dense>
                                        {capitalizeFirstLetter(supportedFragment)}
                                    </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>
                                <FormattedMessage
                                    id='Temp.operationComponents.EditParameter.select.schema.data.type'
                                    defaultMessage='Select the Fragment of the Mediation Policy'
                                />
                            </FormHelperText>
                        </FormControl>
                    </Grid>
                    {/* <Grid item md={6}>
                        <FormControl
                            fullWidth
                            margin='dense'
                            variant='outlined'
                            className={classes.formControl}
                            disabled={parameter.schema
                                ? iff(
                                    parameter.schema.type === 'boolean' || parameter.schema.type === 'object',
                                    true,
                                    false,
                                )
                                : iff(
                                    parameter.type === 'boolean' || parameter.type === 'object',
                                    true,
                                    false,
                                )}
                        >
                            <InputLabel id='edit-parameter-format'>
                                <FormattedMessage
                                    id={'Apis.Details.Resources.components.operationComponents.EditParameter.'
                                        + 'data.format'}
                                    defaultMessage='Data Format'
                                />
                            </InputLabel>
                            <Select
                                value={parameter.schema ? parameter.schema.format : parameter.format}
                                onChange={
                                    ({ target: { name, value } }) => parameterActionDispatcher({ action: name, value })
                                }
                                inputProps={{
                                    name: 'format',
                                    id: 'edit-parameter-format',
                                }}
                                MenuProps={{
                                    getContentAnchorEl: null,
                                    anchorOrigin: {
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                    },
                                }}
                            >
                                <MenuItem value='' dense className={classes.subtleText}>
                                    <FormattedMessage
                                        id={'Apis.Details.Resources.components.operationComponents.EditParameter.'
                                            + 'select.format.of.data.type.none.option'}
                                        defaultMessage='No Data Type'
                                    />
                                </MenuItem>
                                {getDataFormats(
                                    parameter.schema ? parameter.schema.type : parameter.type,
                                ).map((dataType) => (
                                    <MenuItem value={dataType} dense>
                                        {capitalizeFirstLetter(dataType)}
                                    </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>
                                <FormattedMessage
                                    id={'Apis.Details.Resources.components.operationComponents.EditParameter.'
                                        + 'select.format.of.data.type'}
                                    defaultMessage='Select the Format of Data Type'
                                />
                            </FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item>
                        <FormControl component='fieldset'>
                            <FormControlLabel
                                control={(
                                    <Checkbox
                                        checked={parameter.required}
                                        onChange={(
                                            { target: { name, checked } },
                                        ) => parameterActionDispatcher({ action: name, value: checked })}
                                        value={parameter.required}
                                        inputProps={{
                                            name: 'required',
                                        }}
                                    />
                                )}
                                label={(
                                    <FormattedMessage
                                        id={'Apis.Details.Resources.components.operationComponents.EditParameter.'
                                            + 'required'}
                                        defaultMessage='Required'
                                    />
                                )}
                            />
                        </FormControl>
                    </Grid> */}
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button size='small' onClick={handleClose} color='primary'>
                    <FormattedMessage
                        id='Temp.operationComponents.EditParameter.close'
                        defaultMessage='Close'
                    />
                </Button>
                <Button size='small' onClick={handelDone} variant='contained' color='primary'>
                    <FormattedMessage
                        id='Temp.operationComponents.EditParameter.done'
                        defaultMessage='Add'
                    />
                </Button>
            </DialogActions>
        </Dialog>
    );
}

AddMediationPolicy.propTypes = {
    // operationsDispatcher: PropTypes.func.isRequired,
    // target: PropTypes.string.isRequired,
    // verb: PropTypes.string.isRequired,
    addPolicyOpen: PropTypes.shape({}).isRequired,
    setAddPolicyOpen: PropTypes.func.isRequired,
    flow: PropTypes.string.isRequired,
    // version: PropTypes.string.isRequired,
};
