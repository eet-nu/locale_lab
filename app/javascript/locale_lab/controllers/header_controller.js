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

  hideErrorFlash() {
    // TODO: Refactor this selector so it uses an outlet/target
    this.element.querySelector('turbo-frame#flash').innerHTML = '';
  }

  hideCreateForm() {
    this.newTranslationDialogTarget.close()
    this.hideErrorFlash()
  }
}
