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
