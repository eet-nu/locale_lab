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

  end
end
