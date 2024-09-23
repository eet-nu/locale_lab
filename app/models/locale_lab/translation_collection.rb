module LocaleLab
  class TranslationCollection
    include Enumerable

    attr_reader :translations, :path

    ### CLASS METHODS:

    def self.all
      Thread.current[
        :locale_lab_translation_collection
      ] ||= new(
        TranslationFile.all.flat_map(&:translations)
      )
    end

    def self.navigate(path)
      matching = all.translations.find_all do |translation|
        translation.key.starts_with?(path)
      end

      new(matching, path)
    end

    ### INSTANCE METHODS:

    def initialize(translations, path = nil)
      @translations = translations
      @path         = path
    end

    def root?
      path.empty?
    end

    def folder?
      !key?
    end

    def key?
      with_key(path).present?
    end

    def each(&block)
      translations.each { |t| yield t }
    end

    def by_key
      @by_key ||= translations.group_by(&:key)
    end

    def with_key(key)
      translations.find_all do |translation|
        translation.key == key
      end
    end

    def locales
      translations.map(&:locale).uniq
    end

    def missing
      by_key.find_all do |key, translations|
        translations.size < locales.size || translations.any?(&:incomplete?)
      end.map(&:first)
    end

    def parent_folder
      @parent_folder ||= path && path.split('.').tap(&:pop).join('.').presence
    end

    def folders
      @folders = (translations.map(&:key) - keys).map do |key|
        relative = path ? key.delete_prefix(path).delete_prefix('.')
                        : key
        relative.split('.').first
      end.uniq.map do |folder|
        path ? "#{path}.#{folder}" : folder
      end
    end

    def keys
      @keys ||= translations.find_all do |translation|
        translation.folder == path || translation.key == path
      end.map(&:key).uniq
    end

    def matching_keys
      @matching_keys ||= translations.find_all do |translation|
        translation.folder == path || translation.folder.starts_with?("#{path}.")
      end.map(&:key).uniq
    end
  end
end
