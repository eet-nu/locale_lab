module LocaleLab
  class TranslationCollection
    include Enumerable

    attr_reader :translations, :path

    ### CLASS METHODS:

    def self.all
      LocaleLab.cache[:translation_collection] ||= new(
        TranslationFile.all.flat_map(&:translations)
      )
    end

    def self.navigate(path)
      matching = all.translations.find_all do |translation|
        path.present? && translation.key.starts_with?(path)
      end

      new(matching, path)
    end

    def self.search(query)
      matching = all.translations.find_all do |translation|
        translation.key.include?(query) || translation.value.include?(query)
      end

      new(matching, query)
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
      @folders ||= begin
        prefix  = path ? "#{path}." : ''

        puts "prefix: #{prefix.inspect}, translations: #{translations.size}"

        x = translations
          .select { |trans| trans.key.starts_with?(prefix)        }
          .map    { |trans| trans.key[prefix.length..-1].presence }
          .select { |objct| objct.present? && objct.include?('.') }
          .map    { |objct| "#{prefix}#{objct.split('.').first}"  }
          .uniq
      end
    end

    def keys
      @keys ||= translations.find_all do |translation|
        translation.folder == path || translation.key == path
      end.map(&:key).uniq
    end

    def search_keys
      @search_keys ||= map(&:key).uniq
    end

    def matching_keys(with_current_folder: false)
      translations.find_all do |translation|
        if with_current_folder
          translation.in_current_folder?(path) && (translation.folder == path || translation.folder.starts_with?("#{path}."))
        else
          translation.folder == path || translation.folder.starts_with?("#{path}.")
        end
      end.map(&:key).uniq
    end
  end
end
