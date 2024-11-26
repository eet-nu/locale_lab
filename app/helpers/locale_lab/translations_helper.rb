module LocaleLab
  module TranslationsHelper
    def locales
      @locales ||= Translation.locales
    end

    def form_with(**options, &block)
      options[:html] ||= {}
      options[:html][:autocomplete] ||= 'off'
      super(**options, &block)
    end

    def browser
      if @navigation.key?
        Translation.navigate(@navigation.parent_folder)
      else
        @navigation
      end
    end

    def keys(with_current_folder: false)
      if params[:search].present?
        @navigation.search_keys
      elsif @navigation.key?
        @navigation.keys
      else
        @navigation.matching_keys(with_current_folder: with_current_folder)
      end
    end

    def translations
      @translations ||= Hash[
        keys.map do |key|
          [key, @navigation.with_key(key)]
        end
      ]
    end

    def current_path
      "#{params[:id]}."
    end
  end
end
