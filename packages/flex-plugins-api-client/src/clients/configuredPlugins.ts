import PluginServiceHttpClient, { PaginationMeta } from './client';

export interface ConfiguredPluginResource {
  plugin_sid: string;
  plugin_version_sid: string;
  configuration_sid: string;
  unique_name: string;
  version: string;
  plugin_url: string;
  phase: number;
  private: boolean;
  date_created: string;
}

export interface ConfiguredPluginResourcePage extends PaginationMeta {
  plugins: ConfiguredPluginResource[];
}

/**
 * Configured Plugin Configuration Public API Http client for the Configuration resource
 * @link https://www.twilio.com/docs/flex/plugins/api/plugin-configuration
 */
export default class ConfiguredPluginsClient {
  private readonly client: PluginServiceHttpClient;

  constructor(client: PluginServiceHttpClient) {
    this.client = client;
  }

  /**
   * Helper method to generate the URI for ConfiguredPlugins
   * @param configId    the configuration identifier
   * @param pluginId    the plugin identifier
   */
  private static getUrl(configId: string, pluginId?: string) {
    const url = `Configurations/${configId}/Plugins`;
    if (pluginId) {
      return `${url}/${pluginId}`;
    }

    return url;
  }

  /**
   * Fetches the list of {@link ConfiguredPluginResourcePage}
   * @param configId the config identifier
   */
  public async list(configId: string): Promise<ConfiguredPluginResourcePage> {
    return this.client.get<ConfiguredPluginResourcePage>(ConfiguredPluginsClient.getUrl(configId));
  }

  /**
   * Fetches an instance of the {@link ConfiguredPluginResource}
   * @param configId the config identifier
   * @param id the plugin identifier
   */
  public async get(configId: string, id: string): Promise<ConfiguredPluginResource> {
    return this.client.get<ConfiguredPluginResource>(ConfiguredPluginsClient.getUrl(configId, id));
  }
}