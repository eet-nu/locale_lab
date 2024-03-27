module LocaleLab
  class DashboardController < ApplicationController
    def show
      @files   = LocaleLab::TranslationFile.all
      @locales = @files.flat_map(&:locales).sort.uniq

      @translations        = LocaleLab::TranslationFile.available_translations
      @translations_by_key = @translations.group_by(&:key)

      @incomplete = @translations_by_key.find_all do |key, translations|
        translations.size < @locales.size || translations.any?(&:incomplete?)
      end.map(&:first)
    end
  end
end
