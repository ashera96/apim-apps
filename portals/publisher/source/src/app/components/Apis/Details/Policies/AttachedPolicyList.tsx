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
import {
    DndContext, 
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    horizontalListSortingStrategy,
    SortableContext,
} from '@dnd-kit/sortable';
import AttachedPolicyCard from './AttachedPolicyCard';
import type { Policy } from './Types';

interface AttachedPolicyListProps {
    currentPolicyList: Policy[];
    setCurrentPolicyList: React.Dispatch<React.SetStateAction<Policy[]>>;
    policyDisplayStartDirection: string;
    currentFlow: string;
}

/**
 * Renders the Gateway selection section.
 * @param {JSON} props Input props from parent components.
 * @returns {TSX} Radio group for the API Gateway.
 */
const AttachedPolicyList: FC<AttachedPolicyListProps> = ({
    currentPolicyList, setCurrentPolicyList, policyDisplayStartDirection, currentFlow
}) => {
    const reversedPolicyList = [...currentPolicyList].reverse();
    const policyListToDisplay = policyDisplayStartDirection === 'left' ? currentPolicyList : reversedPolicyList;
    const sensors = useSensors(
        useSensor(PointerSensor),
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const {active, over} = event;
        
        if (active.id !== over?.id) {
            setCurrentPolicyList((items) => {
                const oldIndex = items.findIndex(item => item.id === active.id);
                const newIndex = items.findIndex(item => item.id === over?.id);

                return arrayMove(items, oldIndex, newIndex);
            });
        }
    }

    return (
        <>
            <DndContext 
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext 
                    items={currentPolicyList.map(item => item.id)}
                    strategy={horizontalListSortingStrategy}
                >
                    {policyListToDisplay.map((policy: Policy, index: number) => (
                        <AttachedPolicyCard
                            key={policy.id}
                            index={index}
                            policyObj={policy}
                            currentPolicyList={currentPolicyList}
                            setCurrentPolicyList={setCurrentPolicyList}
                            currentFlow={currentFlow}
                        />
                    ))}
                </SortableContext>
            </DndContext>
        </>
    );
}

export default AttachedPolicyList;
