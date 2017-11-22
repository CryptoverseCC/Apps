const TestRpc = require('ethereumjs-testrpc');

// var TestRPC = require("ethereumjs-testrpc");
// var server = TestRPC.server();
// server.listen(30888, (err, blockchain) => {
//   console.log(err, blockchain);
// });


describe('Banner', () => {

  it('should be visible', () => {
    browser.url('/');
    browser.waitForVisible('linkexchange-link');
  });

  it('should open details modal', () => {
    browser.moveToObject('[class^="banner__icon"]');
    browser.moveToObject('[class^="menu__self"]');
    browser.click('[class^="menu__self"]');

    expect(browser.isVisible('[class^="modal__self"]')).toBeTruthy();
  });

});