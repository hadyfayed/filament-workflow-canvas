import { FC } from 'react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Filter {
  field: string;
  operator: string;
  value: string;
}

interface TriggerNodePanelProps {
  config: {
    trigger_type?: 'event' | 'webhook' | 'schedule' | 'manual' | 'api';

    // Event configuration
    event_type?: string;
    event_name?: string;
    event_filters?: Record<string, string>;

    // Webhook configuration
    webhook_url?: string;
    webhook_method?: 'POST' | 'PUT' | 'PATCH';
    webhook_headers?: Record<string, string>;

    // Schedule configuration
    schedule_type?: 'interval' | 'cron' | 'daily' | 'weekly';
    cron_expression?: string;
    interval_value?: string;
    daily_time?: string;

    // API configuration
    api_endpoint?: string;
    require_auth?: boolean;
    api_params?: Record<string, string>;

    // Manual configuration
    manual_permissions?: 'admin' | 'editor' | 'user';
    manual_confirmation?: boolean;

    // Legacy filters (for backward compatibility)
    filters?: Filter[];
  };
  updateConfig: (path: string, value: any) => void;
}

const OPERATORS = ['==', '!=', '>', '<', '>=', '<=', 'contains', 'exists', 'in'];

export const TriggerNodePanel: FC<TriggerNodePanelProps> = ({ config, updateConfig }) => {
  const filters = config.filters || [];

  const addFilter = () => {
    const newFilters = [...filters, { field: '', operator: '==', value: '' }];
    updateConfig('filters', newFilters);
  };

  const removeFilter = (index: number) => {
    const newFilters = filters.filter((_, i) => i !== index);
    updateConfig('filters', newFilters);
  };

  const updateFilter = (index: number, field: keyof Filter, value: string) => {
    const newFilters = filters.map((f, i) => (i === index ? { ...f, [field]: value } : f));
    updateConfig('filters', newFilters);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          Trigger Type
        </label>
        <select
          value={config.trigger_type || ''}
          onChange={e => updateConfig('trigger_type', e.target.value)}
          className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">Select a trigger</option>
          <option value="event">Event - Triggered by website events</option>
          <option value="webhook">Webhook - External HTTP requests</option>
          <option value="schedule">Schedule - Time-based triggers</option>
          <option value="manual">Manual - User-initiated</option>
          <option value="api">API - API calls</option>
        </select>
      </div>

      {/* Event Trigger Configuration */}
      {config.trigger_type === 'event' && (
        <div className="space-y-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h4 className="font-medium text-blue-900 dark:text-blue-100">Event Configuration</h4>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Event Type
            </label>
            <select
              value={config.event_type || ''}
              onChange={e => updateConfig('event_type', e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
            >
              <option value="">Select event type</option>
              <option value="page_view">Page View</option>
              <option value="page_load">Page Load</option>
              <option value="click">Click Event</option>
              <option value="form_submit">Form Submission</option>
              <option value="form_start">Form Start</option>
              <option value="purchase">Purchase</option>
              <option value="add_to_cart">Add to Cart</option>
              <option value="user_signup">User Signup</option>
              <option value="user_login">User Login</option>
              <option value="custom">Custom Event</option>
            </select>
          </div>

          {config.event_type === 'custom' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Custom Event Name
              </label>
              <input
                type="text"
                value={config.event_name || ''}
                onChange={e => updateConfig('event_name', e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
                placeholder="my_custom_event"
              />
            </div>
          )}
        </div>
      )}

      {/* Webhook Trigger Configuration */}
      {config.trigger_type === 'webhook' && (
        <div className="space-y-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <h4 className="font-medium text-green-900 dark:text-green-100">Webhook Configuration</h4>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Webhook URL
            </label>
            <input
              type="url"
              value={config.webhook_url || ''}
              onChange={e => updateConfig('webhook_url', e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
              placeholder="https://your-app.com/webhook"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              HTTP Method
            </label>
            <select
              value={config.webhook_method || 'POST'}
              onChange={e => updateConfig('webhook_method', e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
            >
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="PATCH">PATCH</option>
            </select>
          </div>
        </div>
      )}

      {/* Schedule Trigger Configuration */}
      {config.trigger_type === 'schedule' && (
        <div className="space-y-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
          <h4 className="font-medium text-purple-900 dark:text-purple-100">
            Schedule Configuration
          </h4>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Schedule Type
            </label>
            <select
              value={config.schedule_type || ''}
              onChange={e => updateConfig('schedule_type', e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
            >
              <option value="">Select schedule type</option>
              <option value="interval">Interval (every X minutes/hours)</option>
              <option value="cron">Cron Expression</option>
              <option value="daily">Daily at specific time</option>
              <option value="weekly">Weekly on specific day</option>
            </select>
          </div>

          {config.schedule_type === 'cron' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Cron Expression
              </label>
              <input
                type="text"
                value={config.cron_expression || ''}
                onChange={e => updateConfig('cron_expression', e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
                placeholder="0 0 * * * (daily at midnight)"
              />
            </div>
          )}

          {config.schedule_type === 'interval' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Interval
              </label>
              <select
                value={config.interval_value || ''}
                onChange={e => updateConfig('interval_value', e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
              >
                <option value="">Select interval</option>
                <option value="5">Every 5 minutes</option>
                <option value="15">Every 15 minutes</option>
                <option value="30">Every 30 minutes</option>
                <option value="60">Every hour</option>
                <option value="360">Every 6 hours</option>
                <option value="720">Every 12 hours</option>
              </select>
            </div>
          )}

          {config.schedule_type === 'daily' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Time
              </label>
              <input
                type="time"
                value={config.daily_time || ''}
                onChange={e => updateConfig('daily_time', e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
              />
            </div>
          )}
        </div>
      )}

      {/* API Trigger Configuration */}
      {config.trigger_type === 'api' && (
        <div className="space-y-3 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
          <h4 className="font-medium text-orange-900 dark:text-orange-100">API Configuration</h4>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              API Endpoint
            </label>
            <input
              type="text"
              value={config.api_endpoint || ''}
              onChange={e => updateConfig('api_endpoint', e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
              placeholder="/api/workflows/trigger"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="require_auth"
              checked={config.require_auth ?? true}
              onChange={e => updateConfig('require_auth', e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label
              htmlFor="require_auth"
              className="ml-2 block text-sm text-gray-700 dark:text-gray-200"
            >
              Require Authentication
            </label>
          </div>
        </div>
      )}

      {/* Manual Trigger Configuration */}
      {config.trigger_type === 'manual' && (
        <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <h4 className="font-medium text-gray-900 dark:text-gray-100">Manual Configuration</h4>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Who can trigger manually?
            </label>
            <select
              value={config.manual_permissions || 'admin'}
              onChange={e => updateConfig('manual_permissions', e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
            >
              <option value="admin">Administrators only</option>
              <option value="editor">Editors and above</option>
              <option value="user">Any authenticated user</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="manual_confirmation"
              checked={config.manual_confirmation ?? false}
              onChange={e => updateConfig('manual_confirmation', e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label
              htmlFor="manual_confirmation"
              className="ml-2 block text-sm text-gray-700 dark:text-gray-200"
            >
              Require confirmation before execution
            </label>
          </div>
        </div>
      )}

      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
          Data Filters
        </label>
        <div className="space-y-3">
          {filters.map((filter, index) => (
            <div
              key={index}
              className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-md border border-gray-200 dark:border-gray-700 space-y-2"
            >
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Filter #{index + 1}
                </p>
                <button
                  onClick={() => removeFilter(index)}
                  className="text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Field"
                  value={filter.field}
                  onChange={e => updateFilter(index, 'field', e.target.value)}
                  className="col-span-3 sm:col-span-1 w-full px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm"
                />
                <select
                  value={filter.operator}
                  onChange={e => updateFilter(index, 'operator', e.target.value)}
                  className="col-span-3 sm:col-span-1 w-full px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm"
                >
                  {OPERATORS.map(op => (
                    <option key={op} value={op}>
                      {op}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Value"
                  value={filter.value}
                  onChange={e => updateFilter(index, 'value', e.target.value)}
                  className="col-span-3 sm:col-span-1 w-full px-2 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm"
                />
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={addFilter}
          className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-500 bg-primary-50 dark:bg-primary-900/50 rounded-md hover:bg-primary-100 dark:hover:bg-primary-900"
        >
          <PlusIcon className="w-4 h-4" />
          Add Filter
        </button>
      </div>
    </div>
  );
};
