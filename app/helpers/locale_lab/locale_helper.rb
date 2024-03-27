module LocaleLab
  module LocaleHelper
    def translation_files
      @translation_files ||= Dir[Rails.root.join('config', 'locales', '**', '*.yml')]
    end

    def translation_yaml
      @translation_yaml ||= translation_files.map do |path|
        YAML.load_file(path)
      end
    end

    def translation_locales
      @translation_locales ||= translation_yaml.map do |contents|
        contents.keys
      end.flatten
    end

    def translation_contents
      @translation_contents ||= begin
        result = { }

        translation_yaml.each do |translations|
          translations.each do |locale, contents|
            result[locale] ||= {}

            root_keys = contents.keys
            keys_and_values = Hash[
              root_keys.flat_map do |key|
                value = contents[key]
                if value.is_a?(Hash)
                  traverse_translation_key(value, key)
                else
                  [[key, value]]
                end
              end
            ]

            result[locale].merge! keys_and_values
          end
        end

        result
      end
    end

    def translation_keys
      @translation_keys ||= begin
        translation_contents.values.flat_map(&:keys).uniq
      end
    end

    def traverse_translation_key(hash, parent_key = nil)
      path = []

      hash.each do |key, value|
        current_key = parent_key ? "#{parent_key}.#{key}" : key.to_s
        if value.is_a?(Hash)
          path.concat(traverse_translation_key(value, current_key))
        else
          path << [current_key, value]
        end
      end

      path
    end
  end
end
