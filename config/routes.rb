CanvasRuby::Application.routes.draw do
  get "canvas" => "canvas#index"
  post "canvas" => "canvas#post"
  get "callback" => "static#callback"
end
