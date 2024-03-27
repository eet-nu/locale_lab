module LocaleLab
  class TranslationCollection
    include Enumerable

    attr_reader :translations

    ### CLASS METHODS:

    def self.all
      Thread.current[
        :locale_lab_translation_collection
      ] ||= new(TranslationFile.all.flat_map(&:translations))
    end

    ### INSTANCE METHODS:

    def initialize(translations)
      @translations = translations
    end

    def each(&block)
      translations.each { |t| yield t }
    end

    def by_key
      @by_key ||= translations.group_by(&:key)
    end

    def locales
      translations.map(&:locale).uniq
    end

    def missing
      by_key.find_all do |key, translations|
        translations.size < locales.size || translations.any?(&:incomplete?)
      end.map(&:first)
    end
  end
end
