import PluginServiceHttpClient, { PaginationMeta } from './client';

export interface ConfigurationResource {
  sid: string;
  account_sid: string;
  version: string;
  description: string;
  date_created: string;
}

export interface ConfigurationResourcePage extends PaginationMeta {
  configurations: ConfigurationResource[];
}

export interface CreateConfiguredPlugin {
  phase: number;
  plugin_version: string;
}

export interface CreateConfigurationResource {
  Version: string;
  Plugins: CreateConfiguredPlugin[];
  Description?: string;
}

/**
 * Plugin Configuration Public API Http client for the Configuration resource
 * @link https://www.twilio.com/docs/flex/plugins/api/plugin-configuration
 */
export default class ConfigurationsClient {
  private readonly client: PluginServiceHttpClient;

  constructor(client: PluginServiceHttpClient) {
    this.client = client;
  }

  private static getUrl(configId?: string) {
    if (configId) {
      return `Configurations/${configId}`;
    }

    return 'Configurations';
  }

  /**
   * Fetchs a list of {@link ConfigurationResource}
   */
  public async list(): Promise<ConfigurationResourcePage> {
    return this.client.get<ConfigurationResourcePage>(ConfigurationsClient.getUrl());
  }

  /**
   * Fetches an instance of the {@link ConfigurationResource}
   * @param configId  the configuration identifier
   */
  public async get(configId: string): Promise<ConfigurationResource> {
    return this.client.get<ConfigurationResource>(ConfigurationsClient.getUrl(configId));
  }

  /**
   * Creates a new {@link ConfigurationResource}
   * @param object the {@link CreateConfigurationResource} request
   */
  public async create(object: CreateConfigurationResource): Promise<ConfigurationResource> {
    return this.client.post<ConfigurationResource>(ConfigurationsClient.getUrl(), object);
  }
}