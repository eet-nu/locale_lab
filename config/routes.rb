LocaleLab::Engine.routes.draw do
  root to: 'dashboard#show'

  get :search, to: 'translations#search', as: 'search'

  resources :translations, constraints: { id: /.+(?=\.html\z|\.json\z)|.+/ } do
    member do
      put :move
      put :duplicate
      put :yaml
    end
  end
end
