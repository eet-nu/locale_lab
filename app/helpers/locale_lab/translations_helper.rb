module LocaleLab
  module TranslationsHelper
    def keys
      if params[:search].present?
        @navigation.search_keys
      elsif @navigation.key?
        @navigation.keys
      else
        @navigation.matching_keys
      end
    end

    def translations
      @translations ||= Hash[
        keys.map do |key|
          [key, @navigation.with_key(key)]
        end
      ]
    end
  end
end
