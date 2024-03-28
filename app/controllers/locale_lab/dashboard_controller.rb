module LocaleLab
  class DashboardController < ApplicationController
    def show
      @files   = LocaleLab::TranslationFile.all
      @locales = @files.flat_map(&:locales).sort.uniq

      @translations = LocaleLab::Translation.all
      @incomplete   = @translations.missing
      @folders      = @translations.folders
      @root_keys    = @translations.keys

      @translations_by_key = Hash[
        @root_keys.map do |key|
          [key, @translations.with_key(key)]
        end
      ]
    end
  end
end
