import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { CommitComponentsPage, CommitDeleteDialog, CommitUpdatePage } from './commit.page-object';

const expect = chai.expect;

describe('Commit e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let commitComponentsPage: CommitComponentsPage;
  let commitUpdatePage: CommitUpdatePage;
  let commitDeleteDialog: CommitDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Commits', async () => {
    await navBarPage.goToEntity('commit');
    commitComponentsPage = new CommitComponentsPage();
    await browser.wait(ec.visibilityOf(commitComponentsPage.title), 5000);
    expect(await commitComponentsPage.getTitle()).to.eq('autoChangeSetApp.commit.home.title');
  });

  it('should load create Commit page', async () => {
    await commitComponentsPage.clickOnCreateButton();
    commitUpdatePage = new CommitUpdatePage();
    expect(await commitUpdatePage.getPageTitle()).to.eq('autoChangeSetApp.commit.home.createOrEditLabel');
    await commitUpdatePage.cancel();
  });

  it('should create and save Commits', async () => {
    const nbButtonsBeforeCreate = await commitComponentsPage.countDeleteButtons();

    await commitComponentsPage.clickOnCreateButton();
    await promise.all([
      commitUpdatePage.setTitleInput('title'),
      commitUpdatePage.setAuthorInput('author'),
      commitUpdatePage.setDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
      commitUpdatePage.changeSelectLastOption()
    ]);
    expect(await commitUpdatePage.getTitleInput()).to.eq('title', 'Expected Title value to be equals to title');
    expect(await commitUpdatePage.getAuthorInput()).to.eq('author', 'Expected Author value to be equals to author');
    expect(await commitUpdatePage.getDateInput()).to.contain('2001-01-01T02:30', 'Expected date value to be equals to 2000-12-31');
    await commitUpdatePage.save();
    expect(await commitUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await commitComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Commit', async () => {
    const nbButtonsBeforeDelete = await commitComponentsPage.countDeleteButtons();
    await commitComponentsPage.clickOnLastDeleteButton();

    commitDeleteDialog = new CommitDeleteDialog();
    expect(await commitDeleteDialog.getDialogTitle()).to.eq('autoChangeSetApp.commit.delete.question');
    await commitDeleteDialog.clickOnConfirmButton();

    expect(await commitComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
