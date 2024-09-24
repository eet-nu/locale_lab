pin "locale_lab_application",     to: "locale_lab/application.js", preload: true
pin "@hotwired/turbo-rails",      to: "turbo.min.js",              preload: true
pin "@hotwired/stimulus",         to: "stimulus.min.js",           preload: true
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js",       preload: true

pin_all_from LocaleLab::Engine.root.join("app/javascript/locale_lab/controllers"), under: "controllers", to: "locale_lab/controllers"
