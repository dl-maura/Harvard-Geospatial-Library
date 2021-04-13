# frozen_string_literal: true
class OmniauthCallbacksController < Devise::OmniauthCallbacksController
  prepend_before_action { request.env["devise.skip_timeout"] = true }

  def auth
    request.env['omniauth.auth']
  end

  def cas
    logger.info("CAS Login: #{auth.extra.displayName} (#{auth.extra.mail})")
    @user = User.where(provider: auth.provider, uid: auth.uid).first
    if @user.nil?
      @user = User.create(
          provider: auth.provider,
          uid: auth.uid,
          display_name: auth.extra.displayName,
          email: auth.extra.mail
        )
    end

    if @user
      sign_in @user, event: :authentication # this will throw if @user is not activated
      set_jwt_cookie(auth)
      redirect_to request.env['omniauth.origin'] || root_path
      set_flash_message(:notice, :success, kind: "CAS") if is_navigational_format?
    else
      redirect_to root_path
    end
  end

  protected

  def after_omniauth_failure_path_for(_resource)
    root_path
  end

  def set_jwt_cookie(auth)
    require 'jwt'
    payload = {
        displayName: auth.extra.displayName,
        mail: auth.extra.mail,
        memberOf: auth.extra.memberOf
      }

    token = JWT.encode payload, ENV['JWT_SECRET_KEY'], ENV['JWT_ALGORITHM']

    # Set the cookie
    cookies[:hgl] = { :value => token, :domain => ENV['COOKIE_DOMAIN'], :expires => Time.now + ENV['COOKIE_MAX_AGE_MINS'].to_i }
  end
end