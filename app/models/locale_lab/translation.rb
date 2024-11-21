module LocaleLab
  class Translation

    attr_reader :file, :locale, :key

    attr_accessor :value

    def self.all
      TranslationCollection.all
    end

    def self.navigate(path)
      TranslationCollection.navigate(path)
    end

    def self.create(path)
      return false if path.empty?

      created_locales = []

      LocaleLab::TranslationFile.all.each do |file|
        (file.locales - created_locales).each do |locale|
          file.create(locale, path)
          created_locales << locale
        end
      end
    end

    def self.copy(from_path, to_path, is_folder: false)
      return false if from_path.empty?
      return false if to_path.empty?

      old_translations = self.navigate(from_path)

      if is_folder
        old_translations.translations.each do |old_translation|
          self.create(old_translation.key.gsub(from_path, to_path))
        end
      else
        self.create(to_path)
      end

      new_translations = self.navigate(to_path)

      old_translations.translations.each do |old_translation|
        new_translations.translations.find do |new_translation|
          if new_translation.locale == old_translation.locale
            new_translation.value = old_translation.value
            new_translation.save
          end
        end
      end
    end

    def self.move(from_path, to_path)
      return false if from_path.empty?
      return false if to_path.empty?

      if self.copy(from_path, to_path)
        self.destroy(from_path)
      end
    end

    def self.destroy(path, is_folder: false)
      LocaleLab::TranslationFile.all.each do |file|
        translations = if is_folder
          file.translations.find_all { |t| t.key.starts_with?(path) }
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

    def folder
      @folder = key.split('.').tap(&:pop).join('.').presence
    end

    def incomplete?
      value.blank?
    end

    def save
      file.save
    end

  end
end
