class ApplicationController < ActionController::Base
  # Adds a few additional behaviors into the application controller
  include Blacklight::Controller
  layout :determine_layout if respond_to? :layout

  def after_sign_in_path_for(_resource)
    request.env['omniauth.origin']
  end

end
