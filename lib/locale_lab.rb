require_relative './locale_lab/version'
require_relative './locale_lab/engine'
require 'digest/sha1'

module LocaleLab
  mattr_writer :locale_files

  def self.locale_files
    @@locale_files ||= Dir[Rails.root.join('config', 'locales', '**', '*.yml')]
  end

  mattr_writer :default_locale

  def self.default_locale
    @@default_locale ||= 'en'
  end

  def self.cache_key
    Digest::SHA1.hexdigest(
      locale_files.map do |path|
        Digest::SHA1.file(path).hexdigest
      end.join
    )
  end

  def self.reload
    Thread.current[:locale_lab] = {}
  end

  def self.cache
    Thread.current[:locale_lab] ||= {}
    Thread.current[:locale_lab][cache_key] ||= {}
    Thread.current[:locale_lab][cache_key]
  end
end
