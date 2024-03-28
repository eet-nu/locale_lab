LocaleLab::Engine.routes.draw do
  root to: 'dashboard#show'
  resources :folders,
    constraints: { id: /[^\/]+(?=\.html\z|\.json\z)|[^\/]+/ }
end
