require 'importmap-rails'
require 'turbo-rails'
require 'stimulus-rails'

module LocaleLab
  class Engine < ::Rails::Engine
    isolate_namespace LocaleLab

    config.generators do |g|
      g.test_framework :rspec
    end

    initializer 'locale_lab.assets' do |app|
      app.config.assets.paths << root.join('app/javascript')
      app.config.assets.paths << root.join('vendor/javascript')
      app.config.assets.precompile += %w[ locale_lab_manifest ]
    end

    initializer 'locale_lab.importmap', before: 'importmap' do |app|
      app.config.importmap.paths << root.join('config/importmap.rb')
      app.config.importmap.cache_sweepers << root.join('app/javascript')
    end
  end
end
