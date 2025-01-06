import { Controller } from '@hotwired/stimulus'

export default class extends Controller {

  static targets = ['localeActions']

  static classes = ['hidden', 'visibleFlex']

  toggleLocaleActions(event) {
    let activeKeyLocale

    if (event.type === 'focus') {
      // The event got fired from focusing on the textarea
      activeKeyLocale = event.currentTarget.closest('li')
    } else {
      // The event got fired from clicking in the list item
      activeKeyLocale = event.currentTarget
    }

    const keyLocaleActions = this.localeActionsTargets.find((target) =>
      activeKeyLocale.contains(target)
    )

    this.localeActionsTargets.forEach((target) => {
      target.classList.remove(this.visibleFlexClass)
      target.classList.add(this.hiddenClass)
    })

    if (keyLocaleActions) {
      keyLocaleActions.classList.toggle(this.hiddenClass)
      keyLocaleActions.classList.toggle(this.visibleFlexClass)
    }
  }
}
