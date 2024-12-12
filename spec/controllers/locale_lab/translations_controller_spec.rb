require 'rails_helper'

RSpec.describe LocaleLab::TranslationsController, type: :controller do
  routes { LocaleLab::Engine.routes }

  it 'redirects to the root url' do
    get :index
    expect(response).to redirect_to(root_url)
    expect(response).to redirect_to('/locale_lab/')
  end
end
