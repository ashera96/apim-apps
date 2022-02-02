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

import React, { FC } from 'react';
import DraggablePolicyCard from '../DraggablePolicyCard';
import type { Policy } from '../Types';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: any;
    selectedTab: number;
}

/**
 * Tab panel component to render content of a particular tab.
 * Renders the available policy list under the relevant flow related tab (i.e. request, response or fault).
 * @param {JSON} props Input props from parent components.
 * @returns {TSX} Tab panel.
 */
const TabPanel: FC<TabPanelProps> = ({
    index, value, selectedTab
}) => {
    const flowNames = ['request', 'response', 'fault'];
    const currentFlow = flowNames[index];

    return (
        <div
            role='tabpanel'
            hidden={selectedTab !== index}
            id={`${currentFlow}-tabpanel`}
            aria-labelledby={`${currentFlow}-tab`}
        >
            {selectedTab === index && (
                value?.map((singlePolicy: Policy) => {
                    return (
                        <DraggablePolicyCard
                            policyObj={singlePolicy}
                            showCopyIcon
                        />
                    );
                })
            )}
        </div>
    );
}

export default TabPanel;
