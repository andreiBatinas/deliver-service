import { expect } from 'chai';

import { HttpException } from './HttpException';

describe('Application Config', () => {
  let config: any;
  beforeEach(() => {
    config = new HttpException(0, 'fake_exception');
  });
  it('Should create instance', () => {
    expect(config).to.be.instanceOf(HttpException);
    expect(config).to.have.property('status', 0);
    expect(config).to.have.property('message', 'fake_exception');
  });
});
