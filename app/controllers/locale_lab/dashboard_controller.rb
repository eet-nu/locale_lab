module LocaleLab
  class DashboardController < ApplicationController
    def show
      @navigation = LocaleLab::Translation.all

      @browser = @navigation
      @files   = LocaleLab::TranslationFile.all
      @locales = @files.flat_map(&:locales).sort.uniq

      @incomplete   = @navigation.missing
      @folders      = @navigation.folders
      @root_keys    = @navigation.keys

      @translations_by_key = Hash[
        @root_keys.map do |key|
          [key, @navigation.with_key(key)]
        end
      ]
    end
  end
end
