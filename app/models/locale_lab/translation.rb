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
