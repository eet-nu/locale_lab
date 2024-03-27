module LocaleLab
  class Translation

    attr_reader :file, :locale, :key

    attr_accessor :value

    def initialize(file, locale, key, value)
      @file   = file
      @locale = locale
      @key    = key
      @value  = value
    end

    def incomplete?
      value.blank?
    end

  end
end
