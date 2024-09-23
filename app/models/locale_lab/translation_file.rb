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

    def reload
      @data         = nil
      @translations = nil
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

    def to_hash
      result = {}

      translations.each do |translation|
        path    = "#{translation.locale}.#{translation.key}"
        keys    = path.split('.')
        last    = keys.pop
        current = result

        keys.each do |key|
          current = current[key] ||= {}
        end

        current[last] = translation.value
      end

      result
    end

    def to_yaml
      to_hash.to_yaml(line_width: 1024 * 1024)
    end

    def save
      contents = to_yaml

      file = File.open(path, 'w')
      file.puts contents
      file.close

      reload
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
