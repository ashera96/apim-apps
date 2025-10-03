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
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Tooltip from '@mui/material/Tooltip';
import { Paper, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Endpoint, Category } from './Types';

interface CategoryCardProps {
    category: Category;
    providers: string[];
    getModelsForProvider: (providerName: string) => Promise<any[]>;
    endpointList: Endpoint[];
    onUpdate: (updatedCategory: Category) => void;
    onDelete?: () => void;
}

const CategoryCard: FC<CategoryCardProps> = ({
    category,
    providers,
    getModelsForProvider,
    endpointList,
    onUpdate,
    onDelete,
}) => {
    const intl = useIntl();
    const {
        provider, name, context, model, endpointId,
    } = category;
    const [availableModels, setAvailableModels] = useState<any[]>([]);

    useEffect(() => {
        if (provider) {
            getModelsForProvider(provider).then((models) => {
                setAvailableModels(models);
            });
        }
    }, [provider]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name: fieldName, value } = event.target as unknown as { name: string, value: any };
        const updatedCategory: Category = { ...category };

        if (fieldName === 'endpointId') {
            updatedCategory.endpointId = value as string;
        } else if (fieldName === 'provider') {
            // When provider changes, reset model
            updatedCategory.provider = String(value);
            updatedCategory.model = ''; // Reset model when provider changes
        } else if (fieldName === 'model') {
            updatedCategory.model = typeof value === 'string' ? value : (value?.name || value?.id || String(value));
        } else if (fieldName === 'name') {
            updatedCategory.name = String(value);
        } else if (fieldName === 'context') {
            updatedCategory.context = String(value);
        }

        onUpdate(updatedCategory);
    };

    return (
        <>
            <Paper elevation={2} sx={{ padding: 2, margin: 1, position: 'relative' }}>
                <Grid item xs={12}>
                    <FormControl
                        size='small'
                        fullWidth
                        sx={{ mb: 1.5 }}
                    >
                        <InputLabel id='category-provider-label' shrink>
                            <FormattedMessage
                                id='Apis.Details.Policies.CustomPolicies.IntelligentRouting.category.provider'
                                defaultMessage='Provider'
                            />
                        </InputLabel>
                        <Select
                            labelId='category-provider-label'
                            id='category-provider'
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
                    <FormControl
                        size='small'
                        fullWidth
                        sx={{ mb: 1.5 }}
                    >
                        <InputLabel id='category-model-label' shrink>
                            <FormattedMessage
                                id='Apis.Details.Policies.CustomPolicies.IntelligentRouting.category.model'
                                defaultMessage='Model'
                            />
                        </InputLabel>
                        <Select
                            labelId='category-model-label'
                            id='category-model'
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
                    <TextField
                        id='category-name'
                        label={intl.formatMessage({
                            id: 'Apis.Details.Policies.CustomPolicies.IntelligentRouting.category.name',
                            defaultMessage: 'Category Name'
                        })}
                        size='small'
                        variant='outlined'
                        name='name'
                        value={name}
                        onChange={(e: any) => handleChange(e)}
                        fullWidth
                        sx={{ mb: 1.5 }}
                    />
                    <TextField
                        id='category-context'
                        label={intl.formatMessage({
                            id: 'Apis.Details.Policies.CustomPolicies.IntelligentRouting.category.context',
                            defaultMessage: 'Context Description'
                        })}
                        size='small'
                        variant='outlined'
                        name='context'
                        value={context}
                        onChange={(e: any) => handleChange(e)}
                        fullWidth
                        multiline
                        rows={2}
                        sx={{ mb: 1.5 }}
                        placeholder="Describe when this model should be used..."
                    />
                    <FormControl
                        size='small'
                        fullWidth
                        sx={{ mb: 1.5 }}
                    >
                        <InputLabel id='category-endpoint-label' shrink>
                            <FormattedMessage
                                id='Apis.Details.Policies.CustomPolicies.IntelligentRouting.category.endpoint'
                                defaultMessage='Endpoint'
                            />
                        </InputLabel>
                        <Select
                            labelId='category-endpoint-label'
                            id='category-endpoint'
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
                {onDelete && (
                    <Grid
                        item
                        xs={12}
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                        }}
                    >
                        <IconButton
                            color='error'
                            data-testid='category-delete'
                            onClick={onDelete}
                            size="small"
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Grid>
                )}
            </Paper>
        </>
    );
};

export default CategoryCard;
