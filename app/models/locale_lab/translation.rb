module LocaleLab
  class Translation

    attr_reader :file, :locale, :key

    attr_accessor :value

    def self.locales
      I18nConfig::AVAILABLE_LOCALES.map(&:to_s)
    end

    def self.all
      TranslationCollection.all
    end

    def self.navigate(path)
      TranslationCollection.navigate(path)
    end

    def self.search(path)
      TranslationCollection.search(path)
    end

    def self.create(path)
      return false if path.empty? || path.starts_with?('.')

      created_locales = []

      LocaleLab::TranslationFile.all.each do |file|
        (file.locales - created_locales).each do |locale|
          file.create(locale, path)
          created_locales << locale
        end
      end
    end

    def self.copy_folder(from, to)
      self.navigate("#{from}.").translations.each do |translation|
        translation.copy_to(translation.key.gsub(from, to))
      end

      true
    end

    def self.move_folder(from, to)
      self.copy_folder(from, to)
      self.destroy(from, is_folder: true)

      true
    end

    def self.find(key, locale)
      self.navigate(key).translations.find do |translation|
        translation.key == key && translation.locale == locale
      end
    end

    def self.is_folder?(key)
      navigate(key).translations.size.positive?
    end

    def self.is_key?(key)
      locales.any? { |locale| find(key, locale) }
    end

    def self.exists?(key)
      is_key?(key) || is_folder?(key)
    end

    def self.destroy(path, is_folder: false)
      LocaleLab::TranslationFile.all.each do |file|
        translations = if is_folder
          file.translations.find_all { |t| t.key.starts_with?("#{path}.") }
        else
          file.translations.find_all { |t| t.key == path }
        end

        next unless translations.present?

        translations.each do |translation|
          file.translations.delete(translation)
        end

        file.save
      end
    end

    def initialize(file, locale, key, value)
      @file   = file
      @locale = locale
      @key    = key
      @value  = value
    end

    def update(value)
      self.value = value
      save

      # TODO: Return an actual bool based on the previous operation
      true
    end

    def copy_to(to_path)
      Translation.create(to_path)

      new_translation = Translation.find(to_path, locale)
      new_translation.value = value
      new_translation.save

      # TODO: Return an actual bool based on the previous operation
      true
    end

    def folder
      @folder = key.split('.').tap(&:pop).join('.').presence
    end

    def in_current_folder?(folder)
      !(key.gsub("#{folder}.", '').include?('.'))
    end

    def is_yaml?
      value.is_a?(Array)
    end

    def as_yaml
      value.to_yaml(line_width: 1024 * 1024).sub(/^---/, '').strip
    end

    def incomplete?
      value.blank?
    end

    def save
      file.save
    end

  end
end
