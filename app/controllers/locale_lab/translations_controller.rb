module LocaleLab
  class TranslationsController < ApplicationController
    def show
      @navigation = LocaleLab::Translation.navigate(params[:id])

      if @navigation.key?
        @keys = @navigation.keys
      else
        @keys = @navigation.matching_keys
      end

      @translations = Hash[
        @keys.map do |key|
          [key, @navigation.with_key(key)]
        end
      ]
    end
  end
end
