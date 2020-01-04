import { element, by, ElementFinder } from 'protractor';

export class ChangeComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-change div table .btn-danger'));
  title = element.all(by.css('jhi-change div h2#page-heading span')).first();

  async clickOnCreateButton(): Promise<void> {
    await this.createButton.click();
  }

  async clickOnLastDeleteButton(): Promise<void> {
    await this.deleteButtons.last().click();
  }

  async countDeleteButtons(): Promise<number> {
    return this.deleteButtons.count();
  }

  async getTitle(): Promise<string> {
    return this.title.getAttribute('jhiTranslate');
  }
}

export class ChangeUpdatePage {
  pageTitle = element(by.id('jhi-change-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));
  titleInput = element(by.id('field_title'));
  summaryInput = element(by.id('field_summary'));
  hiddenInput = element(by.id('field_hidden'));
  authorsInput = element(by.id('field_authors'));
  issueTrackingKeyInput = element(by.id('field_issueTrackingKey'));
  changeSetSelect = element(by.id('field_changeSet'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setTitleInput(title: string): Promise<void> {
    await this.titleInput.sendKeys(title);
  }

  async getTitleInput(): Promise<string> {
    return await this.titleInput.getAttribute('value');
  }

  async setSummaryInput(summary: string): Promise<void> {
    await this.summaryInput.sendKeys(summary);
  }

  async getSummaryInput(): Promise<string> {
    return await this.summaryInput.getAttribute('value');
  }

  getHiddenInput(): ElementFinder {
    return this.hiddenInput;
  }
  async setAuthorsInput(authors: string): Promise<void> {
    await this.authorsInput.sendKeys(authors);
  }

  async getAuthorsInput(): Promise<string> {
    return await this.authorsInput.getAttribute('value');
  }

  async setIssueTrackingKeyInput(issueTrackingKey: string): Promise<void> {
    await this.issueTrackingKeyInput.sendKeys(issueTrackingKey);
  }

  async getIssueTrackingKeyInput(): Promise<string> {
    return await this.issueTrackingKeyInput.getAttribute('value');
  }

  async changeSetSelectLastOption(): Promise<void> {
    await this.changeSetSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async changeSetSelectOption(option: string): Promise<void> {
    await this.changeSetSelect.sendKeys(option);
  }

  getChangeSetSelect(): ElementFinder {
    return this.changeSetSelect;
  }

  async getChangeSetSelectedOption(): Promise<string> {
    return await this.changeSetSelect.element(by.css('option:checked')).getText();
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  getSaveButton(): ElementFinder {
    return this.saveButton;
  }
}

export class ChangeDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-change-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-change'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
