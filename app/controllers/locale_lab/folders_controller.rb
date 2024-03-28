module LocaleLab
  class FoldersController < ApplicationController
    def show
      @translations = LocaleLab::Translation.navigate(params[:id])
      @folders      = @translations.folders
      @keys         = @translations.keys

      @translations_by_key = Hash[
        @keys.map do |key|
          [key, @translations.with_key(key)]
        end
      ]
    end
  end
end
