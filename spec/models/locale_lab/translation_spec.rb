require 'rails_helper'

RSpec.describe LocaleLab::Translation do
  context 'class methods' do
    describe '.find' do
      it 'returns the translation for the given key and locale' do
        translation = LocaleLab::Translation.find('greetings.morning', 'en')
        expect(translation.value).to eq('Good morning')
      end
    end

    describe '.create' do
      it 'creates a translation key' do
        expect{
          LocaleLab::Translation.create('some.random.key')
        }.to change {
          LocaleLab::Translation.exists?('some.random.key')
        }.from(false).to(true)
      end
    end

    describe '.copy_folder' do
      let(:from_folder) { 'actions' }
      let(:to_folder)   { 'copied_actions' }

      it 'creates a new translation folder' do
        expect(LocaleLab::Translation.is_folder?(to_folder)).to be(false)
        LocaleLab::Translation.copy_folder(from_folder, to_folder)
        expect(LocaleLab::Translation.is_folder?(to_folder)).to be(true)
      end

      it 'does not delete the old folder' do
        LocaleLab::Translation.copy_folder(from_folder, to_folder)
        expect(LocaleLab::Translation.is_folder?(from_folder)).to be(true)
      end
    end

    describe '.move_folder' do
      let(:from_folder) { 'actions' }
      let(:to_folder)   { 'copied_actions' }

      it 'creates a new translation folder' do
        expect(LocaleLab::Translation.is_folder?(to_folder)).to be(false)
        LocaleLab::Translation.move_folder(from_folder, to_folder)
        expect(LocaleLab::Translation.is_folder?(to_folder)).to be(true)
      end

      it 'does delete the old folder' do
        LocaleLab::Translation.move_folder(from_folder, to_folder)
        expect(LocaleLab::Translation.is_folder?(from_folder)).to be(false)
      end
    end

    describe '.destroy' do
      context 'when the key is a folder' do
        it 'destroys the given folder' do
          expect(LocaleLab::Translation.is_folder?('greetings')).to be(true)
          LocaleLab::Translation.destroy('greetings', is_folder: true)
          expect(LocaleLab::Translation.exists?('greetings')).to be(false)
        end
      end

      context 'when the key is a key (not a folder)' do
        it 'destroys the given folder' do
          expect(LocaleLab::Translation.is_key?('greetings.evening')).to be(true)
          LocaleLab::Translation.destroy('greetings.evening', is_folder: false)
          expect(LocaleLab::Translation.exists?('greetings.evening')).to be(false)
        end
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

    describe '#update' do
      it 'updates the value field' do
        expect(translation.value).to eq('We hope this message finds you well')
        translation.update('Howdy do?')
        expect(translation.value).to eq('Howdy do?')
      end
    end

    describe '#incomplete?' do
      let(:translation) {
        LocaleLab::Translation.create('new')
        LocaleLab::Translation.find('new', 'en')
      }

      it 'returns true if it does not have a value' do
        expect(translation.incomplete?).to be(true)
      end

      it 'returns false if it does have a value' do
        translation.update('Now it is complete')
        expect(translation.incomplete?).to be(false)
      end
    end
  end
end
