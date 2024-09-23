LocaleLab::Engine.routes.draw do
  root to: 'dashboard#show'
  resources :translations, constraints: { id: /[^\/]+(?=\.html\z|\.json\z)|[^\/]+/ }
end
