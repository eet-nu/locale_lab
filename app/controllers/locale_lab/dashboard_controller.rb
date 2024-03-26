module LocaleLab
  class DashboardController < ApplicationController
    def show
      render plain: 'locale_lab'
    end
  end
end
