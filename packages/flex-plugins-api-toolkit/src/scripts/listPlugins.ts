import { ConfiguredPluginsClient, PluginsClient, ReleasesClient } from 'flex-plugins-api-client';

import { ListResource, Page, ResourceNames, Script } from '.';

export type ListPluginsOption = Page;

export interface ListPlugins {
  sid: string;
  name: string;
  friendlyName: string;
  description: string;
  isActive: boolean;
  dateCreated: string;
  dateUpdated: string;
}

export type ListPluginsResource = ListResource<ResourceNames.Plugins, ListPlugins>;
export type ListPluginsScripts = Script<ListPluginsOption, ListPluginsResource>;

/**
 * The .listPlugins script. This script returns overall information about a Plugin
 * @param pluginsClient        the Public API {@link PluginsClient}
 * @param configuredPluginsClient the Public API {@link ConfiguredPluginsClient}
 * @param releasesClient the Public API {@link ReleasesClient}
 */
export default function listPlugins(
  pluginsClient: PluginsClient,
  configuredPluginsClient: ConfiguredPluginsClient,
  releasesClient: ReleasesClient,
): ListPluginsScripts {
  return async (option) => {
    const [result, release] = await Promise.all([pluginsClient.list(option.page), releasesClient.active()]);

    const plugins = result.plugins.map((plugin) => ({
      sid: plugin.sid,
      name: plugin.unique_name,
      friendlyName: plugin.friendly_name,
      description: plugin.description,
      isActive: false,
      dateCreated: plugin.date_created,
      dateUpdated: plugin.date_updated,
    }));

    if (release && plugins.length) {
      const installedPlugins = (await configuredPluginsClient.list(release.configuration_sid)).plugins;
      plugins.forEach((plugin) => (plugin.isActive = installedPlugins.some((p) => p.plugin_sid === plugin.sid)));
    }

    return {
      meta: result.meta,
      plugins,
    };
  };
}
