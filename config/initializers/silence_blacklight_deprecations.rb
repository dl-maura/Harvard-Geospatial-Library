# @see: https://github.com/cbeer/deprecation#reporting
# Deprecation.default_deprecation_behavior = :stderr # the default
# Deprecation.default_deprecation_behavior = :log # put deprecation warnings into the Rails / ActiveSupport log
# DeprecationModule.debug = true # put the full callstack in the logged message
# Deprecation.default_deprecation_behavior = :notify # use ActiveSupport::Notifications to log the message
# Deprecation.default_deprecation_behavior = :raise # Raise an exception when using deprecated behavior
Deprecation.default_deprecation_behavior = :silence # ignore all deprecations

