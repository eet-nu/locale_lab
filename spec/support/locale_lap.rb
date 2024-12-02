require 'spec_helper'

RSpec.configure do |config|
  config.before(:each) do
    Thread.current[:locale_lab] = nil
  end
end