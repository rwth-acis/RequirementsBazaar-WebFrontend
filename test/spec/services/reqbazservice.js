'use strict';

describe('Service: reqBazService', function () {

  // load the service's module
  beforeEach(module('requirementsBazaarWebFrontendApp'));

  // instantiate service
  var reqBazService;
  beforeEach(inject(function (_reqBazService_) {
    reqBazService = _reqBazService_;
  }));

  it('should do something', function () {
    expect(!!reqBazService).toBe(true);
  });

});
