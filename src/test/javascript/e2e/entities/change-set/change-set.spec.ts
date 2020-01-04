import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { ChangeSetComponentsPage, ChangeSetDeleteDialog, ChangeSetUpdatePage } from './change-set.page-object';

const expect = chai.expect;

describe('ChangeSet e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let changeSetComponentsPage: ChangeSetComponentsPage;
  let changeSetUpdatePage: ChangeSetUpdatePage;
  let changeSetDeleteDialog: ChangeSetDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load ChangeSets', async () => {
    await navBarPage.goToEntity('change-set');
    changeSetComponentsPage = new ChangeSetComponentsPage();
    await browser.wait(ec.visibilityOf(changeSetComponentsPage.title), 5000);
    expect(await changeSetComponentsPage.getTitle()).to.eq('autoChangeSetApp.changeSet.home.title');
  });

  it('should load create ChangeSet page', async () => {
    await changeSetComponentsPage.clickOnCreateButton();
    changeSetUpdatePage = new ChangeSetUpdatePage();
    expect(await changeSetUpdatePage.getPageTitle()).to.eq('autoChangeSetApp.changeSet.home.createOrEditLabel');
    await changeSetUpdatePage.cancel();
  });

  it('should create and save ChangeSets', async () => {
    const nbButtonsBeforeCreate = await changeSetComponentsPage.countDeleteButtons();

    await changeSetComponentsPage.clickOnCreateButton();
    await promise.all([
      changeSetUpdatePage.setTitleInput('title'),
      changeSetUpdatePage.setSummaryInput('summary'),
      changeSetUpdatePage.setDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM')
    ]);
    expect(await changeSetUpdatePage.getTitleInput()).to.eq('title', 'Expected Title value to be equals to title');
    expect(await changeSetUpdatePage.getSummaryInput()).to.eq('summary', 'Expected Summary value to be equals to summary');
    const selectedReleased = changeSetUpdatePage.getReleasedInput();
    if (await selectedReleased.isSelected()) {
      await changeSetUpdatePage.getReleasedInput().click();
      expect(await changeSetUpdatePage.getReleasedInput().isSelected(), 'Expected released not to be selected').to.be.false;
    } else {
      await changeSetUpdatePage.getReleasedInput().click();
      expect(await changeSetUpdatePage.getReleasedInput().isSelected(), 'Expected released to be selected').to.be.true;
    }
    expect(await changeSetUpdatePage.getDateInput()).to.contain('2001-01-01T02:30', 'Expected date value to be equals to 2000-12-31');
    await changeSetUpdatePage.save();
    expect(await changeSetUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await changeSetComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last ChangeSet', async () => {
    const nbButtonsBeforeDelete = await changeSetComponentsPage.countDeleteButtons();
    await changeSetComponentsPage.clickOnLastDeleteButton();

    changeSetDeleteDialog = new ChangeSetDeleteDialog();
    expect(await changeSetDeleteDialog.getDialogTitle()).to.eq('autoChangeSetApp.changeSet.delete.question');
    await changeSetDeleteDialog.clickOnConfirmButton();

    expect(await changeSetComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
