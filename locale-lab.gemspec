require_relative "lib/locale_lab/version"

Gem::Specification.new do |spec|
  spec.name        = "locale_lab"
  spec.version     = LocaleLab::VERSION
  spec.authors     = ["Tom-Eric Gerritsen"]
  spec.email       = ["tomeric@eet.nu"]
  spec.homepage    = "https://github.com/eet-nu/locale_lab"
  spec.summary     = "Manage your I18n yml files from your Rails application."
  spec.description = spec.summary

  spec.license     = "MIT"

  # Prevent pushing this gem to RubyGems.org. To allow pushes either set the "allowed_push_host"
  # to allow pushing to a single host or delete this section to allow pushing to any host.
  spec.metadata["allowed_push_host"] = "TODO: Set to 'http://mygemserver.com'"

  spec.metadata["homepage_uri"]    = spec.homepage
  spec.metadata["source_code_uri"] = "https://github.com/eet-nu/locale_lab"
  spec.metadata["changelog_uri"]   = "https://github.com/eet-nu/locale_lab/master/CHANGELOG.md"

  spec.files = Dir.chdir(File.expand_path(__dir__)) do
    Dir["{app,config,db,lib}/**/*", "MIT-LICENSE", "Rakefile", "README.md"]
  end

  spec.add_dependency 'rails', '>= 7.0'
  spec.add_dependency 'importmap-rails'
  spec.add_dependency 'turbo-rails'
  spec.add_dependency 'stimulus-rails'
end
