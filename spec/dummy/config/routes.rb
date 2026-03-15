Rails.application.routes.draw do
  root to: redirect('/locale_lab')
  mount LocaleLab::Engine => "/locale_lab"
end
