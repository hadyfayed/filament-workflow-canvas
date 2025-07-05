import { FC } from 'react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Mapping {
  source: string;
  target: string;
  transform: 'none' | 'uppercase' | 'lowercase' | 'hash' | 'base64';
}

interface TransformNodePanelProps {
  config: {
    transform_type?: 'mapping' | 'javascript' | 'template' | 'merge' | 'filter';
    mappings?: Mapping[];
    code?: string;
    template?: string;
  };
  updateConfig: (path: string, value: any) => void;
}

const TRANSFORMS = ['none', 'uppercase', 'lowercase', 'hash', 'base64'];

export const TransformNodePanel: FC<TransformNodePanelProps> = ({ config, updateConfig }) => {
  const mappings = config.mappings || [];

  const addMapping = () => {
    const newMappings = [...mappings, { source: '', target: '', transform: 'none' }];
    updateConfig('mappings', newMappings);
  };

  const removeMapping = (index: number) => {
    const newMappings = mappings.filter((_, i) => i !== index);
    updateConfig('mappings', newMappings);
  };

  const updateMapping = (index: number, field: keyof Mapping, value: string) => {
    const newMappings = mappings.map((m, i) => (i === index ? { ...m, [field]: value } : m));
    updateConfig('mappings', newMappings);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          Transform Type
        </label>
        <select
          value={config.transform_type || 'mapping'}
          onChange={e => updateConfig('transform_type', e.target.value)}
          className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="mapping">Field Mapping</option>
          <option value="javascript">JavaScript Code</option>
          <option value="template">Template</option>
          <option value="merge">Merge Data</option>
          <option value="filter">Filter Fields</option>
        </select>
      </div>

      {config.transform_type === 'mapping' && (
        <div className="space-y-3">
          {mappings.map((mapping, index) => (
            <div
              key={index}
              className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-md border border-gray-200 dark:border-gray-700 space-y-2"
            >
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Mapping #{index + 1}
                </p>
                <button
                  onClick={() => removeMapping(index)}
                  className="text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Source Field"
                  value={mapping.source}
                  onChange={e => updateMapping(index, 'source', e.target.value)}
                  className="col-span-3 sm:col-span-1 w-full px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm"
                />
                <input
                  type="text"
                  placeholder="Target Field"
                  value={mapping.target}
                  onChange={e => updateMapping(index, 'target', e.target.value)}
                  className="col-span-3 sm:col-span-1 w-full px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm"
                />
                <select
                  value={mapping.transform}
                  onChange={e => updateMapping(index, 'transform', e.target.value)}
                  className="col-span-3 sm:col-span-1 w-full px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm"
                >
                  {TRANSFORMS.map(t => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
          <button
            onClick={addMapping}
            className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-500 bg-primary-50 dark:bg-primary-900/50 rounded-md hover:bg-primary-100 dark:hover:bg-primary-900"
          >
            <PlusIcon className="w-4 h-4" />
            Add Mapping
          </button>
        </div>
      )}

      {config.transform_type === 'javascript' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            JavaScript Code
          </label>
          <textarea
            value={config.code || ''}
            onChange={e => updateConfig('code', e.target.value)}
            rows={10}
            className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm font-mono text-sm"
            placeholder={
              '// Access input with `data`\n// Return new data object\nreturn { ...data, new_field: "value" }'
            }
          />
        </div>
      )}

      {config.transform_type === 'template' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Template
          </label>
          <textarea
            value={config.template || ''}
            onChange={e => updateConfig('template', e.target.value)}
            rows={10}
            className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm font-mono text-sm"
            placeholder={'Hello {{ user.name }}, your order is {{ order.id }}.'}
          />
          <p className="text-xs text-gray-500 mt-1">
            Use Mustache-style templates with `{'{{ field }}'}`.
          </p>
        </div>
      )}
    </div>
  );
};
