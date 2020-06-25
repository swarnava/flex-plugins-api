export type Script<O, R> = (options: O) => Promise<R>;

export { default as deployScript, DeployScript, DeployOption, DeployPlugin } from './deploy';
export {
  default as createConfigurationScript,
  CreateConfigurationScript,
  CreateConfigurationOption,
  CreateConfiguration,
  InstalledPlugin,
} from './createConfiguration';
export { default as releaseScript, ReleaseScript, ReleaseOption, Release } from './release';
export { default as listPluginsScript, ListPluginsScripts, ListPlugins } from './listPlugins';
export {
  default as describePluginScript,
  DescribePluginScript,
  DescribePluginOption,
  DescribePlugin,
} from './describePlugin';
export {
  default as listPluginVersionsScript,
  ListPluginVersionsScripts,
  ListPluginVersionsOption,
  ListPluginVersions,
} from './listPluginVerions';
export {
  default as describePluginVersionScript,
  DescribePluginVersionScript,
  DescribePluginVersionOption,
  DescribePluginVersion,
} from './describePluginVersion';
export {
  default as listConfigurationsScript,
  ListConfigurationsScript,
  ListConfigurations,
} from './listConfigurations';
export {
  default as describeConfigurationScript,
  DescribeConfigurationScript,
  DescribeConfigurationOption,
  DescribeConfiguration,
} from './describeConfiguration';
export { default as listReleasesScript, ListReleasesScript, ListReleases } from './listReleases';
export {
  default as describeReleaseScript,
  DescribeReleaseScript,
  DescribeReleaseOption,
  DescribeRelease,
} from './describeRelease';
