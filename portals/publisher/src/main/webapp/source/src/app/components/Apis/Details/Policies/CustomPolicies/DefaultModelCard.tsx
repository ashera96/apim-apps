/*
 * Copyright (c) 2025, WSO2 LLC. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
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

import React, { FC, useState, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Tooltip from '@mui/material/Tooltip';
import { Paper, Typography } from '@mui/material';
import { Endpoint, DefaultModel } from './Types';

interface DefaultModelCardProps {
    defaultModel: DefaultModel;
    providers: string[];
    getModelsForProvider: (providerName: string) => Promise<any[]>;
    endpointList: Endpoint[];
    onUpdate: (updatedModel: DefaultModel) => void;
    title: string;
}

const DefaultModelCard: FC<DefaultModelCardProps> = ({
    defaultModel,
    providers,
    getModelsForProvider,
    endpointList,
    onUpdate,
    title,
}) => {
    const intl = useIntl();
    const { provider, model, endpointId } = defaultModel;
    const [availableModels, setAvailableModels] = useState<any[]>([]);

    // Remove auto-selection of first provider - let user choose manually

    useEffect(() => {
        if (provider) {
            getModelsForProvider(provider).then((models) => {
                setAvailableModels(models);
            });
        }
    }, [provider]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target as unknown as { name: string, value: any };
        const updatedModel: DefaultModel = { ...defaultModel };

        if (name === 'endpointId') {
            updatedModel.endpointId = value as string;
        } else if (name === 'provider') {
            updatedModel.provider = value as string;
            updatedModel.model = ''; // Reset model when provider changes
        } else if (name === 'model') {
            updatedModel.model = typeof value === 'string' ? value : (value?.name || value?.id || String(value));
        }

        onUpdate(updatedModel);
    };

    return (
        <Paper elevation={2} sx={{ padding: 2, margin: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
                {title}
            </Typography>
            <Grid item xs={12}>
                <FormControl size='small' fullWidth sx={{ mb: 1.5 }}>
                    <InputLabel id='default-provider-label' shrink>
                        <FormattedMessage
                            id='Apis.Details.Policies.CustomPolicies.IntelligentRouting.default.provider'
                            defaultMessage='Provider'
                        />
                    </InputLabel>
                    <Select
                        labelId='default-provider-label'
                        id='default-provider'
                        value={provider || ''}
                        label='Provider'
                        name='provider'
                        onChange={(e: any) => handleChange(e)}
                        displayEmpty
                        renderValue={(selected) => {
                            if (!selected) {
                                return (
                                    <span style={{ color: '#666' }}>
                                        Select Provider
                                    </span>
                                );
                            }
                            return selected;
                        }}
                    >
                        {providers.map((providerName) => (
                            <MenuItem
                                key={providerName}
                                value={providerName}
                            >
                                {providerName}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl size='small' fullWidth sx={{ mb: 1.5 }}>
                    <InputLabel id='default-model-label' shrink>
                        <FormattedMessage
                            id='Apis.Details.Policies.CustomPolicies.IntelligentRouting.default.model'
                            defaultMessage='Model'
                        />
                    </InputLabel>
                    <Select
                        labelId='default-model-label'
                        id='default-model'
                        value={model || ''}
                        label='Model'
                        name='model'
                        onChange={(e: any) => handleChange(e)}
                        disabled={!provider}
                        displayEmpty
                        renderValue={(selected) => {
                            if (!selected) {
                                return (
                                    <span style={{ color: '#666' }}>
                                        {provider ? 
                                            'Select Model' : 
                                            'Select Provider First'
                                        }
                                    </span>
                                );
                            }
                            return (
                                <Tooltip title={selected} placement='top'>
                                    <Typography noWrap component='div'>
                                        {selected}
                                    </Typography>
                                </Tooltip>
                            );
                        }}
                    >
                        {availableModels.map((mv: any) => {
                            const valueStr = typeof mv === 'string'
                                ? mv
                                : (mv?.name || mv?.id || String(mv));
                            return (
                                <MenuItem
                                    key={valueStr}
                                    value={valueStr}
                                >
                                    {valueStr}
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>
                <FormControl
                    size='small'
                    fullWidth
                    sx={{ mb: 1.5 }}
                >
                    <InputLabel id='default-endpoint-label' shrink>
                        <FormattedMessage
                            id='Apis.Details.Policies.CustomPolicies.IntelligentRouting.default.endpoint'
                            defaultMessage='Endpoint'
                        />
                    </InputLabel>
                    <Select
                        labelId='default-endpoint-label'
                        id='default-endpoint'
                        value={endpointId || ''}
                        label='Endpoint'
                        name='endpointId'
                        onChange={(e: any) => handleChange(e)}
                        displayEmpty
                        renderValue={(selected) => {
                            if (!selected) {
                                return (
                                    <span style={{ color: '#666' }}>
                                        Select Endpoint
                                    </span>
                                );
                            }
                            const endpoint = endpointList.find(
                                ep => ep.id === selected
                            );
                            return endpoint?.name || selected;
                        }}
                    >
                        {endpointList.map((endpoint) => (
                            <MenuItem
                                key={endpoint.id}
                                value={endpoint.id}
                            >
                                {endpoint.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
        </Paper>
    );
};

export default DefaultModelCard;
