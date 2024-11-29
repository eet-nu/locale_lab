module LocaleLab
  class ApplicationController < ActionController::Base

    around_action :use_locale_lab_locale

    private

    def use_locale_lab_locale(&action)
      @original_i18n_config = I18n.config
      I18n.config = ::LocaleLab::I18nConfig.new
      I18n.with_locale(current_locale, &action)
    ensure
      I18n.config = @original_i18n_config
      @original_i18n_config = nil
    end

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

    def current_locale
      if request.GET['locale']
        request.GET['locale']
      elsif params[:locale]
        params[:locale]
      else
        I18n.default_locale
      end
    end

  end
end
