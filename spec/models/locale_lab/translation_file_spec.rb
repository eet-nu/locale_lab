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

    describe '.all' do
      it 'returns an array containing the i18n files' do
        expect(LocaleLab::TranslationFile.all).to match_array([
          kind_of(LocaleLab::TranslationFile),
          kind_of(LocaleLab::TranslationFile)
        ])
      end

      it 'memoizes the result' do
        expect { LocaleLab::TranslationFile.all }.to change {
          LocaleLab.cache[:translation_files]
        }.from(nil).to(kind_of(Array))
      end
    end

    describe '.translations_for' do
      it 'returns a collection containing the locale and yaml strings' do
        result = LocaleLab::TranslationFile.translations_for('greetings.evening')

        expect(result.first.locale).to eq('en')
        expect(result.first.value).to eq('Good evening')

        expect(result.second.locale).to eq('nl')
        expect(result.second.value).to eq('Goedenavond')
      end
    end

    describe '.at' do
      it 'returns an array containing the locale and yaml strings' do
        result = LocaleLab::TranslationFile.at('greetings')

        expect(result[0][:locale]).to eq('en')
        expect(result[0][:content]).to start_with('morning: Good morning')

        expect(result[1][:locale]).to eq('nl')
        expect(result[1][:content]).to start_with('morning: Goedemorgen')
      end
    end
  end
end
