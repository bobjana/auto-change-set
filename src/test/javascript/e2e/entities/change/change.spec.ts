import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { ChangeComponentsPage, ChangeDeleteDialog, ChangeUpdatePage } from './change.page-object';

const expect = chai.expect;

describe('Change e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let changeComponentsPage: ChangeComponentsPage;
  let changeUpdatePage: ChangeUpdatePage;
  let changeDeleteDialog: ChangeDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Changes', async () => {
    await navBarPage.goToEntity('change');
    changeComponentsPage = new ChangeComponentsPage();
    await browser.wait(ec.visibilityOf(changeComponentsPage.title), 5000);
    expect(await changeComponentsPage.getTitle()).to.eq('autoChangeSetApp.change.home.title');
  });

  it('should load create Change page', async () => {
    await changeComponentsPage.clickOnCreateButton();
    changeUpdatePage = new ChangeUpdatePage();
    expect(await changeUpdatePage.getPageTitle()).to.eq('autoChangeSetApp.change.home.createOrEditLabel');
    await changeUpdatePage.cancel();
  });

  it('should create and save Changes', async () => {
    const nbButtonsBeforeCreate = await changeComponentsPage.countDeleteButtons();

    await changeComponentsPage.clickOnCreateButton();
    await promise.all([
      changeUpdatePage.setTitleInput('title'),
      changeUpdatePage.setSummaryInput('summary'),
      changeUpdatePage.setAuthorsInput('authors'),
      changeUpdatePage.setIssueTrackingKeyInput('issueTrackingKey'),
      changeUpdatePage.changeSetSelectLastOption()
    ]);
    expect(await changeUpdatePage.getTitleInput()).to.eq('title', 'Expected Title value to be equals to title');
    expect(await changeUpdatePage.getSummaryInput()).to.eq('summary', 'Expected Summary value to be equals to summary');
    const selectedHidden = changeUpdatePage.getHiddenInput();
    if (await selectedHidden.isSelected()) {
      await changeUpdatePage.getHiddenInput().click();
      expect(await changeUpdatePage.getHiddenInput().isSelected(), 'Expected hidden not to be selected').to.be.false;
    } else {
      await changeUpdatePage.getHiddenInput().click();
      expect(await changeUpdatePage.getHiddenInput().isSelected(), 'Expected hidden to be selected').to.be.true;
    }
    expect(await changeUpdatePage.getAuthorsInput()).to.eq('authors', 'Expected Authors value to be equals to authors');
    expect(await changeUpdatePage.getIssueTrackingKeyInput()).to.eq(
      'issueTrackingKey',
      'Expected IssueTrackingKey value to be equals to issueTrackingKey'
    );
    await changeUpdatePage.save();
    expect(await changeUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await changeComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Change', async () => {
    const nbButtonsBeforeDelete = await changeComponentsPage.countDeleteButtons();
    await changeComponentsPage.clickOnLastDeleteButton();

    changeDeleteDialog = new ChangeDeleteDialog();
    expect(await changeDeleteDialog.getDialogTitle()).to.eq('autoChangeSetApp.change.delete.question');
    await changeDeleteDialog.clickOnConfirmButton();

    expect(await changeComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
