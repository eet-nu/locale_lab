module LocaleLab
  class DashboardController < ApplicationController
    def show
      @files   = LocaleLab::TranslationFile.all
      @locales = @files.flat_map(&:locales).sort.uniq

      @translations        = LocaleLab::TranslationFile.available_translations
      @translations_by_key = @translations.group_by(&:key)
    end
  end
end
