pin "locale_lab_application",     to: "locale_lab/application.js", preload: true
pin "@hotwired/turbo-rails",      to: "turbo.min.js",              preload: true
pin "@hotwired/stimulus",         to: "stimulus.min.js",           preload: true
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js",       preload: true

# CodeMirror:
pin "codemirror"
pin "@codemirror/autocomplete",   to: "@codemirror--autocomplete.js"
pin "@codemirror/commands",       to: "@codemirror--commands.js"
pin "@codemirror/language",       to: "@codemirror--language.js"
pin "@codemirror/lint",           to: "@codemirror--lint.js"
pin "@codemirror/search",         to: "@codemirror--search.js"
pin "@codemirror/state",          to: "@codemirror--state.js"
pin "@codemirror/view",           to: "@codemirror--view.js"
pin "@lezer/common",              to: "@lezer--common.js"
pin "@lezer/highlight",           to: "@lezer--highlight.js"
pin "crelt"
pin "style-mod"
pin "w3c-keyname"

pin_all_from LocaleLab::Engine.root.join("app/javascript/locale_lab/controllers"), under: "controllers", to: "locale_lab/controllers"
