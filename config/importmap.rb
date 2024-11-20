pin "locale_lab_application",     to: "locale_lab/application.js", preload: true
pin "@hotwired/turbo-rails",      to: "turbo.min.js",              preload: true
pin "@hotwired/stimulus",         to: "stimulus.min.js",           preload: true
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js",       preload: true

pin_all_from LocaleLab::Engine.root.join("app/javascript/locale_lab/controllers"), under: "controllers", to: "locale_lab/controllers"

# CodeMirror:
pin "codemirror"
pin "@codemirror/autocomplete", to: "@codemirror--autocomplete.js" # @0.20.3
pin "@codemirror/commands", to: "@codemirror--commands.js" # @0.20.0
pin "@codemirror/language", to: "@codemirror--language.js" # @6.10.3
pin "@codemirror/lint", to: "@codemirror--lint.js" # @0.20.3
pin "@codemirror/search", to: "@codemirror--search.js" # @0.20.1
pin "@codemirror/state", to: "@codemirror--state.js" # @6.4.1
pin "@codemirror/view", to: "@codemirror--view.js" # @6.34.2
pin "@lezer/common", to: "@lezer--common.js" # @1.2.3
pin "@lezer/highlight", to: "@lezer--highlight.js" # @1.2.1
pin "crelt" # @1.0.6
pin "style-mod" # @4.1.2
pin "w3c-keyname" # @2.2.8

pin "@codemirror/lang-html", to: "@codemirror--lang-html.js" # @6.4.9
pin "@codemirror/lang-css", to: "@codemirror--lang-css.js" # @6.3.0
pin "@codemirror/lang-javascript", to: "@codemirror--lang-javascript.js" # @6.2.2
pin "@lezer/css", to: "@lezer--css.js" # @1.1.9
pin "@lezer/html", to: "@lezer--html.js" # @1.3.10
pin "@lezer/javascript", to: "@lezer--javascript.js" # @1.4.19
pin "@lezer/lr", to: "@lezer--lr.js" # @1.4.2

pin "@codemirror/basic-setup", to: "@codemirror--basic-setup.js" # @0.20.0
pin "@codemirror/highlight", to: "@codemirror--highlight.js" # @0.19.8
pin "@codemirror/rangeset", to: "@codemirror--rangeset.js" # @0.19.9
pin "@codemirror/text", to: "@codemirror--text.js" # @0.19.6
pin "@codemirror/lang-yaml", to: "@codemirror--lang-yaml.js" # @6.1.1
pin "@lezer/yaml", to: "@lezer--yaml.js" # @1.0.3
pin "js-yaml" # @4.1.0
