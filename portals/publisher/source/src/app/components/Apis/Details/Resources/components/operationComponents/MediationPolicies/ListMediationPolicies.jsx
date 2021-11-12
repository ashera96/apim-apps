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

import React from 'react';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
// import { capitalizeFirstLetter } from 'AppData/stringFormatter';
import { FormattedMessage } from 'react-intl';
// import { isRef } from 'AppComponents/Apis/Details/Resources/operationUtils';
// import RequestBody from 'AppComponents/Apis/Details/Resources/components/operationComponents/RequestBody';
// import Banner from 'AppComponents/Shared/Banner';
// import EditParameter from './EditParameter';

const useStyles = makeStyles({
    root: {
        width: '100%',
        overflowX: 'auto',
    },
    table: {
        minWidth: 650,
        marginTop: '10px',
    },
});

/**
 *
 * Renders the list of operation level mediation policies
 * @export
 * @param {*} props The props that are being passed to the component
 * @returns {any} HTML view of the exisiting mediation policies
 */
export default function ListParameters(props) {
    const {
        disableUpdate, requestMediationPolicies,
    } = props;
    const classes = useStyles();
    // const [editingParameter, setEditingParameter] = useState(null);
    return (
        <>
            {requestMediationPolicies !== null && (
                <Table className={classes.table} aria-label='parameters list'>
                    <TableHead>
                        <TableRow>
                            <TableCell align='left'>
                                <FormattedMessage
                                    id='Temp.operationComponents.ListParameter.parameter.type'
                                    defaultMessage='Policy Type'
                                />
                            </TableCell>
                            <TableCell>
                                <FormattedMessage
                                    id='Temp.operationComponents.ListParameter.parameter.name'
                                    defaultMessage='Parameters'
                                />
                            </TableCell>
                            {!disableUpdate && (
                                <TableCell align='left'>
                                    <FormattedMessage
                                        id='Temp.operationComponents.ListParameter.actions'
                                        defaultMessage='Actions'
                                    />
                                </TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {/* Temp data */}
                        <TableRow key={0}>
                            <TableCell align='left'>Set Header</TableCell>
                            <TableCell align='left'>Header Name: Test, Header Value: foo</TableCell>
                            {!disableUpdate && (
                                <TableCell align='left'>
                                    <Tooltip title={(
                                        <FormattedMessage
                                            id={'Temp.operationComponents.'
                                                + 'ListParameter.edit'}
                                            defaultMessage='Edit'
                                        />
                                    )}
                                    >
                                        <IconButton
                                            // onClick={() => setEditingParameter(parameter)}
                                            fontSize='small'
                                        >
                                            <EditIcon fontSize='small' />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title={(
                                        <FormattedMessage
                                            id={'Temp.operationComponents'
                                                + '.ListParameter.delete'}
                                            defaultMessage='Delete'
                                        />
                                    )}
                                    >
                                        <IconButton
                                            disabled={disableUpdate}
                                            // onClick={() => operationsDispatcher({
                                            //     action: 'deleteParameter',
                                            //     data: { target, verb, value: paramCopy },
                                            // })}
                                            fontSize='small'
                                        >
                                            <DeleteIcon fontSize='small' />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            )}
                        </TableRow>
                        {/* Temp data */}
                    </TableBody>
                </Table>
            )}
        </>
    );
}

ListParameters.defaultProps = {
    disableUpdate: false,
};

ListParameters.propTypes = {
    // operation: PropTypes.shape({}).isRequired,
    // spec: PropTypes.shape({}).isRequired,
    // hideParameterEdit: PropTypes.bool,
    // operationsDispatcher: PropTypes.func.isRequired,
    // target: PropTypes.string.isRequired,
    // verb: PropTypes.string.isRequired,
    disableUpdate: PropTypes.bool,
    requestMediationPolicies: PropTypes.shape({}).isRequired,
    // specVersion: PropTypes.string.isRequired,
    // resolvedSpec: PropTypes.shape({}).isRequired,
};
