import { Controller } from '@hotwired/stimulus'

export default class extends Controller {

  static targets = ['moveForm', 'duplicateForm', 'input']

  static classes = ['hidden']

  showMoveForm() {
    this.moveFormTarget.showModal()
  }

  hideMoveForm() {
    this.moveFormTarget.close()
  }

  showDuplicateForm() {
    this.duplicateFormTarget.showModal()
  }

  hideDuplicateForm() {
    this.duplicateFormTarget.close()
  }
}
