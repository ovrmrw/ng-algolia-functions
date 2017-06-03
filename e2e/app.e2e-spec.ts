import { NgAlgoliaFunctionsPage } from './app.po';

describe('ng-algolia-functions App', () => {
  let page: NgAlgoliaFunctionsPage;

  beforeEach(() => {
    page = new NgAlgoliaFunctionsPage();
  });

  it('should display welcome message', done => {
    page.navigateTo();
    page.getParagraphText()
      .then(msg => expect(msg).toEqual('Welcome to app!!'))
      .then(done, done.fail);
  });
});
