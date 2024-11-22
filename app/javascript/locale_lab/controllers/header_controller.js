import { Controller } from '@hotwired/stimulus'

export default class extends Controller {

  static targets = ['newTranslationDialog']

  showCreateForm() {
    this.newTranslationDialogTarget.showModal()
  }

  hideCreateForm() {
    this.newTranslationDialogTarget.close()
  }
}
