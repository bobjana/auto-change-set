import { element, by, ElementFinder } from 'protractor';

export class CommitComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-commit div table .btn-danger'));
  title = element.all(by.css('jhi-commit div h2#page-heading span')).first();

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

export class CommitUpdatePage {
  pageTitle = element(by.id('jhi-commit-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));
  titleInput = element(by.id('field_title'));
  authorInput = element(by.id('field_author'));
  dateInput = element(by.id('field_date'));
  changeSelect = element(by.id('field_change'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setTitleInput(title: string): Promise<void> {
    await this.titleInput.sendKeys(title);
  }

  async getTitleInput(): Promise<string> {
    return await this.titleInput.getAttribute('value');
  }

  async setAuthorInput(author: string): Promise<void> {
    await this.authorInput.sendKeys(author);
  }

  async getAuthorInput(): Promise<string> {
    return await this.authorInput.getAttribute('value');
  }

  async setDateInput(date: string): Promise<void> {
    await this.dateInput.sendKeys(date);
  }

  async getDateInput(): Promise<string> {
    return await this.dateInput.getAttribute('value');
  }

  async changeSelectLastOption(): Promise<void> {
    await this.changeSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async changeSelectOption(option: string): Promise<void> {
    await this.changeSelect.sendKeys(option);
  }

  getChangeSelect(): ElementFinder {
    return this.changeSelect;
  }

  async getChangeSelectedOption(): Promise<string> {
    return await this.changeSelect.element(by.css('option:checked')).getText();
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

export class CommitDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-commit-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-commit'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
