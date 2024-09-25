require_relative './locale_lab/version'
require_relative './locale_lab/engine'

module LocaleLab
  mattr_writer :locale_files

  def self.locale_files
    @@locale_files ||= Dir[Rails.root.join('config', 'locales', '**', '*.yml')]
  end

  mattr_writer :default_locale

  def self.default_locale
    @@default_locale ||= 'en'
  end
end
