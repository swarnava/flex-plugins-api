import {
  ConfigurationsClient,
  ConfiguredPluginsClient,
  PluginsClient,
  PluginServiceHTTPClient,
  PluginVersionsClient,
  ReleasesClient,
} from 'flex-plugins-api-client';
import { TwilioError, TwilioApiError } from 'flex-plugins-api-utils';

import * as describeConfigurationScript from '../describeConfiguration';
import diffScript from '../diff';
import * as mockStore from './mockStore';
import * as diffTool from '../../tools/diff';

describe('Diff', () => {
  const diff = { configuration: [], plugins: {} };
  const httpClient = new PluginServiceHTTPClient('username', 'password');
  const pluginsClient = new PluginsClient(httpClient);
  const versionsClient = new PluginVersionsClient(httpClient);
  const configurationsClient = new ConfigurationsClient(httpClient);
  const configuredPluginsClient = new ConfiguredPluginsClient(httpClient);
  const releasesClient = new ReleasesClient(httpClient);

  const active = jest.spyOn(releasesClient, 'active');
  const describeConfiguration = jest.fn();
  const internalDescribeConfiguration = jest.spyOn(describeConfigurationScript, 'internalDescribeConfiguration');
  const findConfigurationsDiff = jest.spyOn(diffTool, 'findConfigurationsDiff');

  beforeEach(() => {
    jest.resetAllMocks();

    internalDescribeConfiguration.mockImplementation(() => describeConfiguration);
    findConfigurationsDiff.mockReturnValue(diff);
  });

  it('should find diff between two configs', async () => {
    const config1 = { ...mockStore.describeConfiguration };
    const config2 = { ...mockStore.describeConfiguration, sid: 'FJ0000000000000000000000000000001' };
    const script = diffScript(
      pluginsClient,
      versionsClient,
      configurationsClient,
      configuredPluginsClient,
      releasesClient,
    );
    describeConfiguration.mockImplementation((opt) => {
      if (opt.sid === config1.sid) {
        return config1;
      }

      return config2;
    });

    const theDiff = await script({ resource: 'configuration', oldIdentifier: config1.sid, newIdentifier: config2.sid });

    expect(theDiff).toEqual(diff);
    expect(active).not.toHaveBeenCalled();
    expect(describeConfiguration).toHaveBeenCalledTimes(2);
    expect(describeConfiguration).toHaveBeenCalledWith({ sid: config1.sid }, null);
    expect(describeConfiguration).toHaveBeenCalledWith({ sid: config2.sid }, null);
    expect(findConfigurationsDiff).toHaveBeenCalledTimes(1);
    expect(findConfigurationsDiff).toHaveBeenCalledWith(config1, config2);
  });

  it('should find diff for first config as active', async () => {
    const config1 = { ...mockStore.describeConfiguration };
    const config2 = { ...mockStore.describeConfiguration, sid: 'FJ0000000000000000000000000000001' };
    const release = { ...mockStore.release, configuration_sid: config1.sid };
    active.mockResolvedValue(release);
    const script = diffScript(
      pluginsClient,
      versionsClient,
      configurationsClient,
      configuredPluginsClient,
      releasesClient,
    );
    describeConfiguration.mockImplementation((opt) => {
      if (opt.sid === config1.sid) {
        return config1;
      }

      return config2;
    });

    const theDiff = await script({ resource: 'configuration', oldIdentifier: 'active', newIdentifier: config2.sid });

    expect(theDiff).toEqual(diff);
    expect(active).toHaveBeenCalledTimes(1);
    expect(describeConfiguration).toHaveBeenCalledTimes(2);
    expect(describeConfiguration).toHaveBeenCalledWith({ sid: config1.sid }, null);
    expect(describeConfiguration).toHaveBeenCalledWith({ sid: config2.sid }, null);
    expect(findConfigurationsDiff).toHaveBeenCalledTimes(1);
    expect(findConfigurationsDiff).toHaveBeenCalledWith(config1, config2);
  });

  it('should find diff for second config as active', async () => {
    const config1 = { ...mockStore.describeConfiguration };
    const config2 = { ...mockStore.describeConfiguration, sid: 'FJ0000000000000000000000000000001' };
    const release = { ...mockStore.release, configuration_sid: config2.sid };
    active.mockResolvedValue(release);
    const script = diffScript(
      pluginsClient,
      versionsClient,
      configurationsClient,
      configuredPluginsClient,
      releasesClient,
    );
    describeConfiguration.mockImplementation((opt) => {
      if (opt.sid === config1.sid) {
        return config1;
      }

      return config2;
    });

    const theDiff = await script({ resource: 'configuration', oldIdentifier: config1.sid, newIdentifier: 'active' });

    expect(theDiff).toEqual(diff);
    expect(active).toHaveBeenCalledTimes(1);
    expect(describeConfiguration).toHaveBeenCalledTimes(2);
    expect(describeConfiguration).toHaveBeenCalledWith({ sid: config1.sid }, null);
    expect(describeConfiguration).toHaveBeenCalledWith({ sid: config2.sid }, null);
    expect(findConfigurationsDiff).toHaveBeenCalledTimes(1);
    expect(findConfigurationsDiff).toHaveBeenCalledWith(config1, config2);
  });

  it('should throw exception if no active release found', async (done) => {
    active.mockResolvedValue(null);
    const script = diffScript(
      pluginsClient,
      versionsClient,
      configurationsClient,
      configuredPluginsClient,
      releasesClient,
    );

    try {
      await script({ resource: 'configuration', oldIdentifier: 'active', newIdentifier: 'active' });
    } catch (e) {
      expect(e).toBeInstanceOf(TwilioApiError);
      expect(e.message).toContain('active release');
      done();
    }
  });

  it('should throw exception if resource is incorrect', async (done) => {
    try {
      const script = diffScript(
        pluginsClient,
        versionsClient,
        configurationsClient,
        configuredPluginsClient,
        releasesClient,
      );
      // @ts-ignore
      await script({ resource: 'unknown', oldIdentifier: '', newIdentifier: '' });
    } catch (e) {
      expect(e).toBeInstanceOf(TwilioError);
      expect(e.message).toContain('must be');
      done();
    }
  });
});