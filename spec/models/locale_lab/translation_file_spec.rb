require 'rails_helper'

RSpec.describe LocaleLab::TranslationFile, type: :model do
  let(:file1) { 'en.yml' }
  let(:file2) { 'nl.yml' }

  context 'class methods' do
    describe '.files' do
      it 'returns an array containing the i18n files' do
        files = LocaleLab::TranslationFile.files.map { |file| File.basename(file) }
        expect(files).to match_array([file1, file2])
      end
    end
  end
end
