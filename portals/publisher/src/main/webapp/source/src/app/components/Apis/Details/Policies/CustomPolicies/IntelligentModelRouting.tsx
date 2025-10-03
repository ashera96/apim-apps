import React, { FC, useState, useEffect, useCallback } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Button from '@mui/material/Button';
import AddCircle from '@mui/icons-material/AddCircle';
import { styled } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import { Link } from 'react-router-dom';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import API from 'AppData/api';
import { Progress } from 'AppComponents/Shared';
import { useAPI } from 'AppComponents/Apis/Details/components/ApiContext';
import { Endpoint, IntelligentRoutingConfig, DefaultModel, Category, EnvironmentConfig } from './Types';
import DefaultModelCard from './DefaultModelCard';
import CategoryCard from './CategoryCard';
import CONSTS from 'AppData/Constants';

// Utility function to normalize model values
const normalizeModelValue = (mv: any): string => {
    if (typeof mv === 'string') return mv;
    if (mv && typeof mv === 'object') {
        if (mv.name) return String(mv.name);
        if (mv.id) return String(mv.id);
        // Avoid JSON.stringify as it can create complex strings that cause issues
        if (mv.value) return String(mv.value);
        // If it's an object without clear string properties, use Object toString
        return `[Object ${Object.keys(mv).join(',')}]`;
    }
    return mv == null ? '' : String(mv);
};

// Remove the old RoundRobinConfig interface - using IntelligentRoutingConfig instead

interface IntelligentModelRoutingProps {
    setManualPolicyConfig: React.Dispatch<React.SetStateAction<string>>;
    manualPolicyConfig: string;
}

const StyledAccordionSummary = styled(AccordionSummary)(() => ({
    minHeight: 48,
    maxHeight: 48,
    '&.Mui-expanded': {
        minHeight: 48,
        maxHeight: 48,
    },
    '& .MuiAccordionSummary-content': {
        margin: 0,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        '&.Mui-expanded': {
            margin: 0,
        }
    }
}));

const IntelligentModelRouting: FC<IntelligentModelRoutingProps> = ({
    setManualPolicyConfig,
    manualPolicyConfig,
}) => {
    const intl = useIntl();
    const [apiFromContext] = useAPI();
    const [config, setConfig] = useState<IntelligentRoutingConfig>({
        production: {
            defaultModel: { provider: '', model: '', endpointId: '' },
            categories: []
        },
        sandbox: {
            defaultModel: { provider: '', model: '', endpointId: '' },
            categories: []
        },
    });
    const [llmProviders, setLLMProviders] = useState<any>(null);
    const [productionEndpoints, setProductionEndpoints] = useState<Endpoint[]>([]);
    const [sandboxEndpoints, setSandboxEndpoints] = useState<Endpoint[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [productionEnabled, setProductionEnabled] = useState<boolean>(false);
    const [sandboxEnabled, setSandboxEnabled] = useState<boolean>(false);
    // Add cache for model data to prevent excessive API calls
    const [modelCache, setModelCache] = useState<Map<string, any[]>>(new Map());

    const getUniqueProviders = (): string[] => {
        if (!llmProviders || !llmProviders.list) return [];
        const providerNames = new Set<string>(llmProviders.list.map((p: any) => p.name as string));
        return Array.from(providerNames);
    };

    const getModelsForProvider = useCallback(async (providerName: string) => {
        if (!llmProviders || !llmProviders.list || !providerName) return [];
        
        // Check cache first
        if (modelCache.has(providerName)) {
            return modelCache.get(providerName) || [];
        }
        
        // Find a provider with this name to get the ID
        const provider = llmProviders.list.find((p: any) => p.name === providerName);
        if (!provider) return [];

        try {
            const response = await API.getLLMProviderModelList(provider.id);
            const providerData = response.body.find((p: any) => p.name === providerName);
            const models = providerData ? providerData.models : [];
            
            // Cache the result
            setModelCache(prev => new Map(prev).set(providerName, models));
            return models;
        } catch (error) {
            console.error('Error fetching models for provider:', error);
            return [];
        }
    }, [llmProviders, modelCache]);

    const addCategory = (env: 'production' | 'sandbox') => {
        const newCategory: Category = {
            provider: '', // Don't auto-select provider - let user choose
            name: '',
            context: '',
            model: '',
            endpointId: env === 'production' 
                ? (productionEndpoints.length > 0 ? productionEndpoints[0].id : '')
                : (sandboxEndpoints.length > 0 ? sandboxEndpoints[0].id : ''),
        };

        setConfig((prev) => ({
            ...prev,
            [env]: {
                ...prev[env],
                categories: [...prev[env].categories, newCategory],
            },
        }));
    };

    const fetchEndpoints = () => {
        setLoading(true);
        const endpointsPromise = API.getApiEndpoints(apiFromContext.id);
        endpointsPromise
            .then((response) => {
                const endpoints = response.body.list;
                const defaultEndpoints = [];

                if (apiFromContext.endpointConfig?.production_endpoints) {
                    defaultEndpoints.push({
                        id: CONSTS.DEFAULT_ENDPOINT_ID.PRODUCTION,
                        name: 'Default Production Endpoint',
                        deploymentStage: 'PRODUCTION',
                        serviceUrl: apiFromContext.endpointConfig.production_endpoints.url || 
                                   (Array.isArray(apiFromContext.endpointConfig.production_endpoints) && 
                                    apiFromContext.endpointConfig.production_endpoints.length > 0 
                                    ? apiFromContext.endpointConfig.production_endpoints[0].url 
                                    : 'N/A'),
                    });
                }

                if (apiFromContext.endpointConfig?.sandbox_endpoints) {
                    defaultEndpoints.push({
                        id: CONSTS.DEFAULT_ENDPOINT_ID.SANDBOX,
                        name: 'Default Sandbox Endpoint',
                        deploymentStage: 'SANDBOX',
                        serviceUrl: apiFromContext.endpointConfig.sandbox_endpoints.url || 
                                   (Array.isArray(apiFromContext.endpointConfig.sandbox_endpoints) && 
                                    apiFromContext.endpointConfig.sandbox_endpoints.length > 0 
                                    ? apiFromContext.endpointConfig.sandbox_endpoints[0].url 
                                    : 'N/A'),
                    });
                }

                const allEndpoints = [...defaultEndpoints, ...endpoints];
                const prodEndpoints = allEndpoints.filter(ep => ep.deploymentStage === 'PRODUCTION');
                const sbEndpoints = allEndpoints.filter(ep => ep.deploymentStage === 'SANDBOX');

                setProductionEndpoints(prodEndpoints);
                setSandboxEndpoints(sbEndpoints);
            })
            .catch((error) => {
                console.error('Error fetching endpoints:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const fetchProviders = () => {
        API.getLLMProviders()
            .then((response) => {
                setLLMProviders(response.body);
            })
            .catch((error) => {
                console.error('Error loading LLM providers:', error);
            });
    };

    useEffect(() => {
        fetchEndpoints();
        fetchProviders();
    }, []);

    useEffect(() => {
        if (manualPolicyConfig !== '') {
            try {
                const parsed = JSON.parse(manualPolicyConfig.replace(/'/g, '"'));
                const normalizeEnvironmentConfig = (envConfig: any): EnvironmentConfig => {
                    if (!envConfig || typeof envConfig !== 'object') {
                        return { defaultModel: { provider: '', model: '', endpointId: '' }, categories: [] };
                    }
                    
                    const defaultModel: DefaultModel = {
                        provider: envConfig.defaultModel?.provider || '',
                        model: envConfig.defaultModel?.model || '',
                        endpointId: envConfig.defaultModel?.endpointId || '',
                    };
                    
                    const categories: Category[] = Array.isArray(envConfig.categories) 
                        ? envConfig.categories.map((cat: any) => ({
                            provider: cat.provider || '',
                            name: cat.name || '',
                            context: cat.context || '',
                            model: cat.model || '',
                            endpointId: cat.endpointId || '',
                        }))
                        : [];
                    
                    return { defaultModel, categories };
                };

                const next: IntelligentRoutingConfig = {
                    production: normalizeEnvironmentConfig(parsed.production),
                    sandbox: normalizeEnvironmentConfig(parsed.sandbox),
                };
                setConfig(next);
                setProductionEnabled(next.production.defaultModel.provider !== '' || next.production.defaultModel.model !== '' || next.production.categories.length > 0);
                setSandboxEnabled(next.sandbox.defaultModel.provider !== '' || next.sandbox.defaultModel.model !== '' || next.sandbox.categories.length > 0);
            } catch (e) {
                console.error('Error parsing manual policy config:', e);
            }
        }
    }, [manualPolicyConfig]);

    useEffect(() => {
        setManualPolicyConfig(JSON.stringify(config).replace(/"/g, "'"));
    }, [config]);

    const handleProductionToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
        setProductionEnabled(event.target.checked);
        if (!event.target.checked) {
            setConfig(prev => ({ 
                ...prev, 
                production: { 
                    defaultModel: { provider: '', model: '', endpointId: '' }, 
                    categories: [] 
                } 
            }));
        }
    };

    const handleSandboxToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSandboxEnabled(event.target.checked);
        if (!event.target.checked) {
            setConfig(prev => ({ 
                ...prev, 
                sandbox: { 
                    defaultModel: { provider: '', model: '', endpointId: '' }, 
                    categories: [] 
                } 
            }));
        }
    };

    const handleAccordionChange = (env: 'production' | 'sandbox') => (event: React.SyntheticEvent, expanded: boolean) => {
        if (env === 'production') {
            handleProductionToggle({ target: { checked: expanded } } as React.ChangeEvent<HTMLInputElement>);
        } else {
            handleSandboxToggle({ target: { checked: expanded } } as React.ChangeEvent<HTMLInputElement>);
        }
    };

    const updateDefaultModel = (env: 'production' | 'sandbox', updatedModel: DefaultModel) => {
        setConfig((prev) => ({
            ...prev,
            [env]: {
                ...prev[env],
                defaultModel: updatedModel,
            },
        }));
    };

    const updateCategory = (env: 'production' | 'sandbox', index: number, updatedCategory: Category) => {
        setConfig((prev) => ({
            ...prev,
            [env]: {
                ...prev[env],
                categories: prev[env].categories.map((c, i) => (i === index ? updatedCategory : c)),
            },
        }));
    };

    const deleteCategory = (env: 'production' | 'sandbox', index: number) => {
        setConfig((prev) => ({
            ...prev,
            [env]: {
                ...prev[env],
                categories: prev[env].categories.filter((_, i) => i !== index),
            },
        }));
    };



    if (loading) {
        return <Progress />;
    }

    return (
        <>
            <Grid item xs={12}>

                <Accordion 
                    expanded={productionEnabled} 
                    onChange={handleAccordionChange('production')}
                >
                    <StyledAccordionSummary
                        aria-controls='production-content'
                        id='production-header'
                    >
                        <Typography variant='subtitle2' color='textPrimary'>
                            <FormattedMessage
                                id='Apis.Details.Policies.CustomPolicies.IntelligentModelRouting.production.title'
                                defaultMessage='Production Configuration'
                            />
                        </Typography>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={productionEnabled}
                                    onChange={handleProductionToggle}
                                    name="production-toggle"
                                />
                            }
                            label=""
                            sx={{ mr: -1 }}
                        />
                    </StyledAccordionSummary>
                    <AccordionDetails>
                        {getUniqueProviders().length === 0 && (
                            <Alert severity="warning" sx={{ mb: 2 }}>
                                <FormattedMessage
                                    id='Apis.Details.Policies.CustomPolicies.IntelligentModelRouting.no.providers'
                                    defaultMessage='No LLM providers available. Please configure LLM providers first.'
                                />
                            </Alert>
                        )}
                        {productionEndpoints.length === 0 && (
                            <Alert severity="warning" sx={{ mb: 2 }}>
                                <Typography variant="body2">
                                    <FormattedMessage
                                        id='Apis.Details.Policies.CustomPolicies.IntelligentModelRouting.no.production.endpoints.text'
                                        defaultMessage='No production endpoints available. Please '
                                    />
                                    <Link to={`/apis/${apiFromContext.id}/endpoints`}>
                                        configure endpoints
                                    </Link>
                                    <FormattedMessage
                                        id='Apis.Details.Policies.CustomPolicies.IntelligentModelRouting.no.production.endpoints.suffix'
                                        defaultMessage=' first.'
                                    />
                                </Typography>
                            </Alert>
                        )}
                        
                        {/* Default Model Configuration */}
                        <Typography variant='subtitle2' sx={{ mt: 1, mb: 1 }}>
                            <FormattedMessage
                                id='Apis.Details.Policies.CustomPolicies.IntelligentModelRouting.default.model.title'
                                defaultMessage='Default Model'
                            />
                        </Typography>
                        <DefaultModelCard
                            defaultModel={config.production.defaultModel}
                            providers={getUniqueProviders()}
                            getModelsForProvider={getModelsForProvider}
                            endpointList={productionEndpoints}
                            onUpdate={(updated) => updateDefaultModel('production', updated)}
                            title="Production Default Model"
                        />

                        {/* Categories Configuration */}
                        <Typography variant='subtitle2' sx={{ mt: 3, mb: 1 }}>
                            <FormattedMessage
                                id='Apis.Details.Policies.CustomPolicies.IntelligentModelRouting.categories.title'
                                defaultMessage='Categories'
                            />
                        </Typography>
                        <Button
                            variant='outlined'
                            color='primary'
                            data-testid='add-production-category'
                            sx={{ ml: 1, mb: 2 }}
                            onClick={() => addCategory('production')}
                            disabled={getUniqueProviders().length === 0 || productionEndpoints.length === 0}
                        >
                            <AddCircle sx={{ mr: 1 }} />
                            <FormattedMessage
                                id='Apis.Details.Policies.CustomPolicies.IntelligentModelRouting.add.category'
                                defaultMessage='Add Category'
                            />
                        </Button>
                        {config.production.categories.map((category, index: number) => (
                            <CategoryCard
                                key={`production-category-${index}`}
                                category={category}
                                providers={getUniqueProviders()}
                                getModelsForProvider={getModelsForProvider}
                                endpointList={productionEndpoints}
                                onUpdate={(updated) => updateCategory('production', index, updated)}
                                onDelete={() => deleteCategory('production', index)}
                            />
                        ))}
                    </AccordionDetails>
                </Accordion>
                
                <Accordion 
                    expanded={sandboxEnabled} 
                    onChange={handleAccordionChange('sandbox')}
                >
                    <StyledAccordionSummary
                        aria-controls='sandbox-content'
                        id='sandbox-header'
                    >
                        <Typography variant='subtitle2' color='textPrimary'>
                            <FormattedMessage
                                id='Apis.Details.Policies.CustomPolicies.IntelligentModelRouting.sandbox.title'
                                defaultMessage='Sandbox Configuration'
                            />
                        </Typography>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={sandboxEnabled}
                                    onChange={handleSandboxToggle}
                                    name="sandbox-toggle"
                                />
                            }
                            label=""
                            sx={{ mr: -1 }}
                        />
                    </StyledAccordionSummary>
                    <AccordionDetails>
                        {getUniqueProviders().length === 0 && (
                            <Alert severity="warning" sx={{ mb: 2 }}>
                                <FormattedMessage
                                    id='Apis.Details.Policies.CustomPolicies.IntelligentModelRouting.no.providers'
                                    defaultMessage='No LLM providers available. Please configure LLM providers first.'
                                />
                            </Alert>
                        )}
                        {sandboxEndpoints.length === 0 && (
                            <Alert severity="warning" sx={{ mb: 2 }}>
                                <Typography variant="body2">
                                    <FormattedMessage
                                        id='Apis.Details.Policies.CustomPolicies.IntelligentModelRouting.no.sandbox.endpoints.text'
                                        defaultMessage='No sandbox endpoints available. Please '
                                    />
                                    <Link to={`/apis/${apiFromContext.id}/endpoints`}>
                                        configure endpoints
                                    </Link>
                                    <FormattedMessage
                                        id='Apis.Details.Policies.CustomPolicies.IntelligentModelRouting.no.sandbox.endpoints.suffix'
                                        defaultMessage=' first.'
                                    />
                                </Typography>
                            </Alert>
                        )}
                        
                        {/* Default Model Configuration */}
                        <Typography variant='subtitle2' sx={{ mt: 1, mb: 1 }}>
                            <FormattedMessage
                                id='Apis.Details.Policies.CustomPolicies.IntelligentModelRouting.default.model.title'
                                defaultMessage='Default Model'
                            />
                        </Typography>
                        <DefaultModelCard
                            defaultModel={config.sandbox.defaultModel}
                            providers={getUniqueProviders()}
                            getModelsForProvider={getModelsForProvider}
                            endpointList={sandboxEndpoints}
                            onUpdate={(updated) => updateDefaultModel('sandbox', updated)}
                            title="Sandbox Default Model"
                        />

                        {/* Categories Configuration */}
                        <Typography variant='subtitle2' sx={{ mt: 3, mb: 1 }}>
                            <FormattedMessage
                                id='Apis.Details.Policies.CustomPolicies.IntelligentModelRouting.categories.title'
                                defaultMessage='Categories'
                            />
                        </Typography>
                        <Button
                            variant='outlined'
                            color='primary'
                            data-testid='add-sandbox-category'
                            sx={{ ml: 1, mb: 2 }}
                            onClick={() => addCategory('sandbox')}
                            disabled={getUniqueProviders().length === 0 || sandboxEndpoints.length === 0}
                        >
                            <AddCircle sx={{ mr: 1 }} />
                            <FormattedMessage
                                id='Apis.Details.Policies.CustomPolicies.IntelligentModelRouting.add.category'
                                defaultMessage='Add Category'
                            />
                        </Button>
                        {config.sandbox.categories.map((category, index: number) => (
                            <CategoryCard
                                key={`sandbox-category-${index}`}
                                category={category}
                                providers={getUniqueProviders()}
                                getModelsForProvider={getModelsForProvider}
                                endpointList={sandboxEndpoints}
                                onUpdate={(updated) => updateCategory('sandbox', index, updated)}
                                onDelete={() => deleteCategory('sandbox', index)}
                            />
                        ))}
                    </AccordionDetails>
                </Accordion>
            </Grid>
        </>
    );
};

export default IntelligentModelRouting;