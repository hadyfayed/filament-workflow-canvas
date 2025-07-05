import { FC } from 'react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Rule {
  source_field: string;
  target_field: string;
  required: boolean;
}

interface AnalyticsNodePanelProps {
  config: {
    driver?: string;
    async?: boolean;
    fail_on_error?: boolean;
    event_name_mapping?: string;
    transform_rules?: Rule[];
  };
  updateConfig: (path: string, value: any) => void;
}

const DRIVERS = [
  'ga4',
  'meta_pixel',
  'mixpanel',
  'snapchat',
  'tiktok',
  'adobe_analytics',
  'moengage',
];

export const AnalyticsNodePanel: FC<AnalyticsNodePanelProps> = ({ config, updateConfig }) => {
  const rules = config.transform_rules || [];

  const addRule = () => {
    const newRules = [...rules, { source_field: '', target_field: '', required: false }];
    updateConfig('transform_rules', newRules);
  };

  const removeRule = (index: number) => {
    const newRules = rules.filter((_, i) => i !== index);
    updateConfig('transform_rules', newRules);
  };

  const updateRule = (index: number, field: keyof Rule, value: string | boolean) => {
    const newRules = rules.map((r, i) => (i === index ? { ...r, [field]: value } : r));
    updateConfig('transform_rules', newRules);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          Analytics Driver
        </label>
        <select
          value={config.driver || ''}
          onChange={e => updateConfig('driver', e.target.value)}
          className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
        >
          <option value="">Select a driver</option>
          {DRIVERS.map(d => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          Event Name Mapping
        </label>
        <input
          type="text"
          value={config.event_name_mapping || ''}
          onChange={e => updateConfig('event_name_mapping', e.target.value)}
          className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
          placeholder="e.g. purchase, add_to_cart"
        />
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
          <input
            type="checkbox"
            checked={config.async ?? true}
            onChange={e => updateConfig('async', e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          Async
        </label>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
          <input
            type="checkbox"
            checked={config.fail_on_error ?? true}
            onChange={e => updateConfig('fail_on_error', e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          Fail on Error
        </label>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
          Data Transform Rules
        </label>
        <div className="space-y-3">
          {rules.map((rule, index) => (
            <div
              key={index}
              className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-md border border-gray-200 dark:border-gray-700 space-y-2"
            >
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Rule #{index + 1}
                </p>
                <button
                  onClick={() => removeRule(index)}
                  className="text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Source Field"
                  value={rule.source_field}
                  onChange={e => updateRule(index, 'source_field', e.target.value)}
                  className="col-span-2 sm:col-span-1 w-full px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm"
                />
                <input
                  type="text"
                  placeholder="Target Field"
                  value={rule.target_field}
                  onChange={e => updateRule(index, 'target_field', e.target.value)}
                  className="col-span-2 sm:col-span-1 w-full px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm"
                />
              </div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                <input
                  type="checkbox"
                  checked={rule.required}
                  onChange={e => updateRule(index, 'required', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                Required
              </label>
            </div>
          ))}
        </div>

        <button
          onClick={addRule}
          className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-500 bg-primary-50 dark:bg-primary-900/50 rounded-md hover:bg-primary-100 dark:hover:bg-primary-900"
        >
          <PlusIcon className="w-4 h-4" />
          Add Rule
        </button>
      </div>
    </div>
  );
};
