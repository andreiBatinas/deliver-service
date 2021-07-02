import { expect } from 'chai';
import sinon from 'sinon';

import { HttpController } from './';

class TestController extends HttpController {
  public async executeImpl(): Promise<any> {
    return true;
  }
}

describe('Infrastructure', () => {
  describe('Http Controller', () => {
    it('Should create instance', () => {
      const r = new TestController();

      const res: any = {};
      const req: any = {};
      r.execute(req, res);

      expect(r).to.be.instanceOf(HttpController);
    });

    const r = new TestController();
    let res: any = {};
    let req: any = {};

    beforeEach(() => {
      res = {};
      req = {};
      res.status = sinon.stub().returns(res);
      res.json = sinon.stub().returns(res);
      res.sendStatus = sinon.stub().returns(res);
      r.execute(req, res);
    });

    it('Should expect res to have status and json ok', () => {
      r.ok(res, true);
      res.status.calledWith(200);
      res.json.calledWith(true);
    });

    it('Should expect send status to be called ', () => {
      r.ok(res);
      res.sendStatus.calledWith(200);
    });

    it('Should expect status to be called with 500 code and fake_error', () => {
      r.fail('fake_error');
      res.status.calledWith(500);
      res.json.calledWith('fake_error');
    });

    it('Should expect status to be called with 404 code ', () => {
      r.notFound();
      res.status.calledWith(404);
      res.json.calledWith('Not found');
    });

    it('Should expect status to be called with 404 code and fake_error ', () => {
      r.notFound('fake_error');
      res.status.calledWith(404);
      res.json.calledWith('fake_error');
    });

    it('Should expect status to be called with 404 code and fake_error ', () => {
      r.unauthorized();
      res.status.calledWith(401);
      res.json.calledWith('Unauthorized');
    });

    it('Should expect status to be called with 404 code and fake_error ', () => {
      r.unauthorized('fake_error');
      res.status.calledWith(401);
      res.json.calledWith('fake_error');
    });

    it('Should expect status to be called with 404 code and fake_error ', () => {
      r.badRequest();
      res.status.calledWith(400);
      res.json.calledWith('Bad Request');
    });

    it('Should expect status to be called with 404 code and fake_error ', () => {
      r.badRequest('fake_error');
      res.status.calledWith(400);
      res.json.calledWith('fake_error');
    });
  });
});
