import { Controller } from '@hotwired/stimulus'

export default class extends Controller {

  static targets = ['newTranslationDialog', 'input']

  showCreateForm() {
    this.newTranslationDialogTarget.showModal()

    this.inputTarget.focus();
    this.inputTarget.setSelectionRange(
      this.inputTarget.value.length,
      this.inputTarget.value.length
    );
  }

  hideCreateForm() {
    this.newTranslationDialogTarget.close()
  }
}
