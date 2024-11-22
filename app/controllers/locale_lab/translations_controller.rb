module LocaleLab
  class TranslationsController < ApplicationController
    before_action :load_navigation, only: %i[show update destroy yaml]

    def index
      redirect_to locale_lab.dashboard_url
    end

    def search
      if params[:search].blank?
        return redirect_to action: 'show', id: params[:id]
      end

      @navigation = LocaleLab::Translation.search(params[:search])
      @browser    = @navigation
      @keys       = @navigation.search_keys

      @translations = Hash[
        @keys.map do |key|
          [key, @navigation.with_key(key)]
        end
      ]

      @yamls = []

      render 'show'
    end

    def show
      if @navigation.key?
        @keys    = @navigation.keys
        @browser = LocaleLab::Translation.navigate(@navigation.parent_folder)
      else
        @keys    = @navigation.matching_keys
        @browser = @navigation
      end

      @translations = Hash[
        @keys.map do |key|
          [key, @navigation.with_key(key)]
        end
      ]

      @yamls = yamls
    end

    def destroy
      LocaleLab::Translation.destroy(params[:id], is_folder: is_folder)

      if @navigation.parent_folder
        redirect_to action: 'show', id: @navigation.parent_folder
      else
        redirect_to action: 'new'
      end
    end

    def new
      @path = ""
      @path.prepend("#{params[:scope]}.") if params[:scope].present?
    end

    def create
      @path = params[:path]

      if LocaleLab::Translation.create(@path)
        redirect_to action: 'show', id: @path
      else
        flash.now[:error] = 'Something went wrong, please check for errors and try again.'
        render 'new', status: :unprocessable_entity
      end
    end

    def edit
      redirect_to action: 'show'
    end

    def update
      @translation = Translation.find(params[:id], params[:locale])

      if @translation.update(params[:value])
        respond_to do |format|
          @yamls = yamls
          format.turbo_stream
          return
        end
      else
        flash.now[:error] = 'Something went wrong, please check for errors and try again.'
        render 'show', status: :unprocessable_entity
      end
    end

    def move
      updated = false

      if is_folder
        updated = Translation.move_folder(params[:id], params[:new_id])
      else
        locales.each do |locale|
          translation = Translation.find(params[:id], locale)
          updated     = translation.copy_to(params[:new_id])
        end

        Translation.destroy(params[:id]) if updated
      end

      if updated
        redirect_to action: 'show', id: params[:new_id]
      else
        flash.now[:error] = 'Something went wrong, please check for errors and try again.'
        redirect_to action: 'show', id: params[:id]
      end
    end

    def duplicate
      updated = false

      if is_folder
        updated = Translation.copy_folder(params[:id], params[:new_id])
      else
        locales.each do |locale|
          translation = Translation.find(params[:id], locale)
          updated     = translation.copy_to(params[:new_id])
        end
      end

      if updated
        redirect_to action: 'show', id: params[:new_id]
      else
        flash.now[:error] = 'Something went wrong, please check for errors and try again.'
        redirect_to action: 'show', id: params[:id]
      end
    end

    def yaml
      new_hash = YAML.safe_load(params[:value].to_s)

      LocaleLab::TranslationFile.all.each do |file|
        file.merge!(params[:id], new_hash) if file.locale == params[:locale]
      end

      redirect_to action: 'show', id: params[:id]
    end

    private

    def load_navigation
      @navigation = LocaleLab::Translation.navigate(params[:id])
    end

    def is_folder
      ActiveModel::Type::Boolean.new.cast(params[:is_folder])
    end

    def locales
      LocaleLab::TranslationFile.all.flat_map(&:locales).sort.uniq
    end

    def yamls
      if request.method == 'GET'
        keys = params[:id].to_s.split('.')
      else
        keys = request.referer.split('/').last.split('.')
      end

      return [] if keys.empty?

      TranslationFile.all.map do |file|
        locale = file.locales.first
        {
          locale: locale,
          content: file.data[locale].dig(*keys).to_yaml.sub(/^---/, '').strip
        }
      end
    end
  end
end
