module LocaleLab
  class DashboardController < ApplicationController
    def show
      @files   = LocaleLab::TranslationFile.all
      @locales = @files.flat_map(&:locales).sort.uniq

      @translations        = LocaleLab::Translation.all
      @incomplete          = @translations.missing
      @translations_by_key = @translations.by_key
    end
  end
end
