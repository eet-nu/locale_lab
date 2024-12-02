require 'rails_helper'

RSpec.describe LocaleLab::Translation do
  context 'class methods' do
    describe '.find' do
      it 'returns the translation for the given key and locale' do
        translation = LocaleLab::Translation.find('greetings.morning', 'en')
        expect(translation.value).to eq('Good morning')
      end
    end
  end

  context 'instance methods' do
    let(:translation) { LocaleLab::Translation.find('greetings.formal.salutation', 'en') }

    describe '#copy' do
      it 'copies the translation to the given key' do
        expect{
          translation.copy_to('greetings.informal.salutation')
        }.to change {
          LocaleLab::Translation.find('greetings.informal.salutation', 'en')&.value
        }.from(nil).to(translation.value)
      end
    end

    describe '#move' do
      it 'copies the translation to the given key' do
        expect{
          translation.copy_to('greetings.informal.salutation')
        }.to change {
          LocaleLab::Translation.find('greetings.informal.salutation', 'en')&.value
        }.from(nil).to(translation.value)
      end
    end
  end
end
