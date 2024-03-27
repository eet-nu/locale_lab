module LocaleLab
  class Engine < ::Rails::Engine
    isolate_namespace LocaleLab

    initializer "locale_lab.assets.precompile" do |app|
      app.config.assets.precompile += %w[ locale_lab/application.css ]
    end
  end
end
