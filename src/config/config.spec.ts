import { expect } from 'chai';
import { Logger } from '../infrastructure/logger';
import { Config } from './Config';

describe('Application Config', () => {
  let config: any;
  beforeEach(() => {
    config = new Config('fake_config_file.json', new Logger('fake_logger'));
  });
  it('Should create instance', () => {
    expect(config).to.be.instanceOf(Config);
    expect(config).to.have.property('filePath', 'fake_config_file.json');
  });

  it('Should load default config', async () => {
    await config.load();
    expect(config).to.be.instanceOf(Config);
    expect(config).to.have.property('filePath', 'config.default.json');
  });
});
