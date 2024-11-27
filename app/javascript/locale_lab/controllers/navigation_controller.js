import { Controller } from '@hotwired/stimulus'

export default class extends Controller {

  static targets = ['moveForm', 'duplicateForm', 'input']

  static classes = ['hidden']

  hideErrorFlash() {
    // TODO: Refactor this selector so it uses an outlet/target
    this.element.querySelectorAll('turbo-frame.dialog_flash').forEach(frame => {
      frame.innerHTML = '';
    });
  }

  showMoveForm() {
    this.hideErrorFlash()
    this.moveFormTarget.showModal()
  }

  hideMoveForm() {
    this.moveFormTarget.close()
  }

  showDuplicateForm() {
    this.hideErrorFlash()
    this.duplicateFormTarget.showModal()
  }

  hideDuplicateForm() {
    this.duplicateFormTarget.close()
  }
}
