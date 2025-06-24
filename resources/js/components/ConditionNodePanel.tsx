import { FC } from 'react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Condition {
    field: string;
    operator: string;
    value: string;
}

interface ConditionNodePanelProps {
    config: {
        conditions?: Condition[];
        logic?: 'AND' | 'OR';
    };
    updateConfig: (path: string, value: any) => void;
}

const OPERATORS = ['==', '!=', '>', '<', '>=', '<=', 'contains', 'exists', 'in'];

export const ConditionNodePanel: FC<ConditionNodePanelProps> = ({ config, updateConfig }) => {
    const conditions = config.conditions || [];
    const logic = config.logic || 'AND';

    const addCondition = () => {
        const newConditions = [...conditions, { field: '', operator: '==', value: '' }];
        updateConfig('conditions', newConditions);
    };

    const removeCondition = (index: number) => {
        const newConditions = conditions.filter((_, i) => i !== index);
        updateConfig('conditions', newConditions);
    };

    const updateCondition = (index: number, field: keyof Condition, value: string) => {
        const newConditions = conditions.map((c, i) => (i === index ? { ...c, [field]: value } : c));
        updateConfig('conditions', newConditions);
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Logic</label>
                <select
                    value={logic}
                    onChange={(e) => updateConfig('logic', e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                >
                    <option value="AND">AND (All must be true)</option>
                    <option value="OR">OR (Any can be true)</option>
                </select>
            </div>

            <div className="space-y-3">
                {conditions.map((condition, index) => (
                    <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-md border border-gray-200 dark:border-gray-700 space-y-2">
                        <div className="flex justify-between items-center">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Condition #{index + 1}</p>
                            <button onClick={() => removeCondition(index)} className="text-gray-400 hover:text-red-500 dark:hover:text-red-400">
                                <TrashIcon className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <input
                                type="text"
                                placeholder="Field (e.g. user.id)"
                                value={condition.field}
                                onChange={(e) => updateCondition(index, 'field', e.target.value)}
                                className="col-span-3 sm:col-span-1 w-full px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm"
                            />
                            <select
                                value={condition.operator}
                                onChange={(e) => updateCondition(index, 'operator', e.target.value)}
                                className="col-span-3 sm:col-span-1 w-full px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm"
                            >
                                {OPERATORS.map(op => <option key={op} value={op}>{op}</option>)}
                            </select>
                            <input
                                type="text"
                                placeholder="Value"
                                value={condition.value}
                                onChange={(e) => updateCondition(index, 'value', e.target.value)}
                                className="col-span-3 sm:col-span-1 w-full px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm"
                            />
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={addCondition}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-500 bg-primary-50 dark:bg-primary-900/50 rounded-md hover:bg-primary-100 dark:hover:bg-primary-900"
            >
                <PlusIcon className="w-4 h-4" />
                Add Condition
            </button>
        </div>
    );
}; 