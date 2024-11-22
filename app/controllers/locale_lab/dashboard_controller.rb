module LocaleLab
  class DashboardController < ApplicationController
    helper TranslationsHelper

    def show
      @navigation = Translation.all
      @files      = TranslationFile.all

      @incomplete   = @navigation.missing
      @folders      = @navigation.folders
      @root_keys    = @navigation.keys
    end
  end
end
