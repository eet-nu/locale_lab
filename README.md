# LocaleLab
Short description and motivation.

## Usage
How to use my plugin.

## Installation as a standalone application
`puma-dev link -n locale-lab`

`bundle install`

Visit [https://locale-lab.test](http://locale-lab.test)

## Installation as a gem in you project
Add this line to your application's Gemfile:

```ruby
gem 'locale_lab', git: 'https://github.com/eet-nu/locale_lab.git', branch: 'main'
```

And then execute:
```bash
$ bundle
```

Or install it yourself as:
```bash
$ gem install locale_lab
```

Finally, add the engine to your routes file to make it accessible:
```ruby
Rails.application.routes.draw do
  if Rails.env.development?
    mount LocaleLab::Engine => '/locale_lab'
  end
end
```

## Contributing
Contribution directions go here.

## License
The gem is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
