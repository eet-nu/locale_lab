source "https://rubygems.org"
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

# Specify your gem's dependencies in locale_lab.gemspec.
gemspec

gem "puma"

gem "sqlite3"

gem "sprockets-rails"

# Start debugger with binding.b [https://github.com/ruby/debug]
# gem "debug", ">= 1.0.0"

group :test do
  gem 'simplecov'
end

group :development do
  gem "better_errors"
  gem "binding_of_caller"
  gem "awesome_print"
end