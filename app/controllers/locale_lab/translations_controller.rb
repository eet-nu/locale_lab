module LocaleLab
  class TranslationsController < ApplicationController

    PER_PAGE = 25

    before_action :check_existence,
      unless: :action_is_forced?,
      only:   %i[create move duplicate]

    before_action :load_navigation,
      only: %i[show update destroy yaml search]

    def index
      redirect_to locale_lab.root_url
    end

    def search
      unless params[:search].present?
        if params[:id].present?
          return redirect_to action: 'show', id: params[:id]
        end

        return redirect_to locale_lab.root_url
      end

      @translations = all_translations.drop((current_page - 1) * PER_PAGE).take(PER_PAGE)

      respond_to do |format|
        format.html { render 'show' }
        format.turbo_stream { render 'show' }
      end
    end

    def show
      @translations = all_translations.drop((current_page - 1) * PER_PAGE).take(PER_PAGE)

      respond_to do |format|
        format.html
        format.turbo_stream
      end
    end

    def destroy
      LocaleLab::Translation.destroy(params[:id], is_folder: is_folder?)

      if @navigation.parent_folder
        redirect_to action: 'show', id: @navigation.parent_folder
      else
        redirect_to action: 'new'
      end
    end

    def create
      if Translation.create(params[:new_id])
        redirect_to action: 'show', id: params[:new_id]
      else
        flash[:error] = 'Something went wrong, please check for errors and try again.'
        respond_to do |format|
          format.turbo_stream { render turbo_stream: turbo_stream.replace(:dialog_flash, partial: 'dialog_flash') }
          format.html         { redirect_to action: 'show' }
        end
      end
    end

    def edit
      redirect_to action: 'show'
    end

    def update
      @translation = Translation.find(params[:id], params[:locale])

      if @translation.update(value_param)
        respond_to do |format|
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

      if is_folder?
        updated = Translation.move_folder(params[:id], params[:new_id])
      else
        Translation.locales.each do |locale|
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

      if is_folder?
        updated = Translation.copy_folder(params[:id], params[:new_id])
      else
        Translation.locales.each do |locale|
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
      unless yaml_is_valid?(params[:value].to_s)
        respond_to do |format|
          format.turbo_stream do
            flash.now[:error] = t('.invalid_yaml')
            render turbo_stream: turbo_stream.replace_all('.dialog_flash', partial: 'dialog_flash')
          end
        end

        return
      end

      LocaleLab::TranslationFile.all.each do |file|
        file.merge!(params[:id], value_param) if file.locale == params[:locale]
      end

      redirect_to action: 'show', id: params[:id]
    end

    private

    def current_page
      @current_page ||= [1, params[:page].presence].compact.map(&:to_i).max
    end
    helper_method :current_page

    def load_navigation
      if params[:search].present?
        @navigation = LocaleLab::Translation.search(params[:search])
      else
        @navigation = LocaleLab::Translation.navigate(params[:id])
      end
    end

    def is_folder?
      !!ActiveModel::Type::Boolean.new.cast(params[:is_folder])
    end

    def value_is_yaml?
      params[:content_type] == 'yaml'
    end

    def value_param
      @value_param ||= value_is_yaml? ? YAML.safe_load(params[:value].to_s) : params[:value]
    end

    def action_is_forced?
      params[:force] == '1' ? true : false
    end

    def all_translations
      @all_translations ||= Hash[
        keys.map do |key|
          [key, @navigation.with_key(key)]
        end
      ]
    end

    def check_existence
      return unless Translation.exists?(params[:new_id])

      respond_to do |format|
        format.turbo_stream do
          flash.now[:error] = t('.already_exists', path: params[:new_id])
          render turbo_stream: turbo_stream.replace_all('.dialog_flash', partial: 'dialog_flash')
        end

        format.html do
          flash[:error] = t('.already_exists', path: params[:new_id])
          redirect_back fallback_location: locale_lab.translation_path(params[:id] || params[:new_id])
        end
      end

      false
    end
  end
end
