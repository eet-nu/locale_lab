require_relative './locale_lab/version'
require_relative './locale_lab/engine'

module LocaleLab
  mattr_writer :locale_files

  def self.locale_files
    @@locale_files ||= Dir[Rails.root.join('config', 'locales', '**', '*.yml')]
  end
end
