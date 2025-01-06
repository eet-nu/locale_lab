module LocaleLab
  class ApplicationController < ActionController::Base
    private

    def locales
      @locales ||= Translation.locales
    end
    helper_method :locales

    def browser
      if @navigation.key?
        Translation.navigate(@navigation.parent_folder)
      else
        @navigation
      end
    end
    helper_method :browser

    def keys(with_current_folder: false)
      if params[:search].present?
        @navigation.search_keys
      elsif @navigation.key?
        @navigation.keys
      else
        @navigation.matching_keys(with_current_folder: with_current_folder)
      end
    end
    helper_method :keys

    def current_path
      "#{params[:id]}."
    end
    helper_method :current_path

    def yamls
      keys = if params[:id].present?
        params[:id].to_s.split('.')
      else
        request.referer.split('/').last.split('.')
      end

      keys.empty? ? [] : TranslationFile.at(keys)
    end
    helper_method :yamls

    def yaml_is_valid?(possible_yaml_string)
      YAML.safe_load(possible_yaml_string)
      true
    rescue Psych::SyntaxError
      false
    end
  end
end
