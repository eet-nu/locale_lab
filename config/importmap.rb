pin "locale_lab_application",     to: "locale_lab/application.js", preload: true
pin "@hotwired/turbo-rails",      to: "turbo.min.js",              preload: true
pin "@hotwired/stimulus",         to: "stimulus.min.js",           preload: true
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js",       preload: true

pin_all_from LocaleLab::Engine.root.join("app/javascript/locale_lab/controllers"), under: "controllers", to: "locale_lab/controllers"

### CODEMIRROR DEPENDENCIES:
pin "codemirror" # @6.0.1
pin "@codemirror/autocomplete", to: "@codemirror--autocomplete.js" # @6.18.3
pin "@codemirror/commands", to: "@codemirror--commands.js" # @6.7.1
pin "@codemirror/language", to: "@codemirror--language.js" # @6.10.3
pin "@codemirror/lint", to: "@codemirror--lint.js" # @6.8.2
pin "@codemirror/search", to: "@codemirror--search.js" # @6.5.7
pin "@codemirror/state", to: "@codemirror--state.js" # @6.4.1
pin "@codemirror/view", to: "@codemirror--view.js" # @6.34.2
pin "@lezer/common", to: "@lezer--common.js" # @1.2.3
pin "@lezer/highlight", to: "@lezer--highlight.js" # @1.2.1
pin "crelt" # @1.0.6
pin "style-mod" # @4.1.2
pin "w3c-keyname" # @2.2.8
### END OF CODEMIRROR DEPENDENCIES
