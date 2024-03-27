module LocaleLab
  class TranslationFile

    attr_reader :path

    ### CLASS METHODS:

    def self.files
      Dir[Rails.root.join('config', 'locales', '**', '*.yml')]
    end

    def self.all
      Thread.current[
        :locale_lab_translation_files
      ] ||= files.map do |file|
        new(file)
      end
    end

    def self.translations_for(key)
      all.flat_map do |file|
        file.translations.find_all do |translation|
          translation.key == key
        end
      end
    end

    ### INSTANCE METHODS:

    def initialize(path)
      @path = path
    end

    def relative_path
      path.gsub("#{Rails.root}/", '')
    end

    def data
      @data ||= YAML.load_file(path)
    end

    def locales
      data.keys
    end

    def translations
      @translations ||= data.flat_map do |locale, hash|
        hash_to_translations(hash, locale)
      end
    end

    private

    def hash_to_translations(hash, locale, parent_key = nil)
      path = []

      hash.each do |key, value|
        current_key = parent_key ? "#{parent_key}.#{key}" : key.to_s

        if value.is_a?(Hash)
          path += hash_to_translations(value, locale, current_key)
        else
          path << Translation.new(self, locale, current_key, value)
        end
      end

      path
    end
  end
end
