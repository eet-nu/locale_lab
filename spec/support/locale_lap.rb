require 'spec_helper'

module LocaleLabTestHelper
  def self.restore_backup
    @original_i18n_files.each do |file|
      File.write(file[:path], file[:content])
    end
  end

  def self.take_backup
    @original_i18n_files = LocaleLab::TranslationFile.all.map do |file|
      { path: file.path, content: file.to_yaml }
    end
  end
end

RSpec.configure do |config|
  config.before(:suite) do
    LocaleLabTestHelper.take_backup
  end

  config.before(:each) do
    Thread.current[:locale_lab] = nil
  end

  config.after(:each) do
    LocaleLabTestHelper.restore_backup
  end
end