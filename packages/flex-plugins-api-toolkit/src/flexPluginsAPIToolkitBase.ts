import {
  ConfigurationsClient,
  ConfiguredPluginsClient,
  PluginsClient,
  PluginVersionsClient,
  ReleasesClient,
  ServiceHttpClient,
} from 'flex-plugins-api-client';
import cloneDeep from 'lodash.clonedeep';

import {
  createConfigurationScript,
  CreateConfigurationScript,
  deployScript,
  DeployScript,
  describeConfigurationScript,
  DescribeConfigurationScript,
  describePluginScript,
  DescribePluginScript,
  describePluginVersionScript,
  DescribePluginVersionScript,
  describeReleaseScript,
  DescribeReleaseScript,
  diffScript,
  DiffScript,
  listConfigurationsScript,
  ListConfigurationsScript,
  listPluginsScript,
  ListPluginsScripts,
  listPluginVersionsScript,
  ListPluginVersionsScripts,
  listReleasesScript,
  ListReleasesScript,
  releaseScript,
  ReleaseScript,
  Script,
} from './scripts';

export default class FlexPluginsAPIToolkitBase {
  public readonly deploy: DeployScript;
  public readonly createConfiguration: CreateConfigurationScript;
  public readonly release: ReleaseScript;
  public readonly listPlugins: ListPluginsScripts;
  public readonly describePlugin: DescribePluginScript;
  public readonly listPluginVersions: ListPluginVersionsScripts;
  public readonly describePluginVersion: DescribePluginVersionScript;
  public readonly listConfigurations: ListConfigurationsScript;
  public readonly describeConfiguration: DescribeConfigurationScript;
  public readonly listReleases: ListReleasesScript;
  public readonly describeRelease: DescribeReleaseScript;
  public readonly diff: DiffScript;

  constructor(httpClient: ServiceHttpClient) {
    const pluginClient = new PluginsClient(httpClient);
    const pluginVersionsClient = new PluginVersionsClient(httpClient);
    const configurationsClient = new ConfigurationsClient(httpClient);
    const configuredPluginsClient = new ConfiguredPluginsClient(httpClient);
    const releasesClient = new ReleasesClient(httpClient);

    this.deploy = this.cloneArgs(deployScript(pluginClient, pluginVersionsClient));
    this.createConfiguration = this.cloneArgs(
      createConfigurationScript(
        pluginClient,
        pluginVersionsClient,
        configurationsClient,
        configuredPluginsClient,
        releasesClient,
      ),
    );
    this.release = this.cloneArgs(releaseScript(releasesClient));

    this.listPlugins = this.cloneArgs(listPluginsScript(pluginClient, configuredPluginsClient, releasesClient));
    this.describePlugin = this.cloneArgs(
      describePluginScript(pluginClient, pluginVersionsClient, configuredPluginsClient, releasesClient),
    );

    this.listPluginVersions = this.cloneArgs(
      listPluginVersionsScript(pluginVersionsClient, configuredPluginsClient, releasesClient),
    );
    this.describePluginVersion = this.cloneArgs(
      describePluginVersionScript(pluginClient, pluginVersionsClient, configuredPluginsClient, releasesClient),
    );

    this.listConfigurations = this.cloneArgs(listConfigurationsScript(configurationsClient, releasesClient));
    this.describeConfiguration = this.cloneArgs(
      describeConfigurationScript(
        pluginClient,
        pluginVersionsClient,
        configurationsClient,
        configuredPluginsClient,
        releasesClient,
      ),
    );

    this.listReleases = this.cloneArgs(listReleasesScript(releasesClient));
    this.describeRelease = this.cloneArgs(
      describeReleaseScript(
        pluginClient,
        pluginVersionsClient,
        configurationsClient,
        configuredPluginsClient,
        releasesClient,
      ),
    );

    this.diff = this.cloneArgs(
      diffScript(pluginClient, pluginVersionsClient, configurationsClient, configuredPluginsClient, releasesClient),
    );
  }

  // Clones the arguments before passing them to the script
  private cloneArgs = <O, R>(script: Script<O, R>) => async (option: O) => script(cloneDeep(option));
}
