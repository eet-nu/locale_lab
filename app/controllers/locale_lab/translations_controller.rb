module LocaleLab
  class TranslationsController < ApplicationController

    before_action :check_existence,
      unless: :action_is_forced?,
      only:   %i[create move duplicate]

    before_action :load_navigation,
      only: %i[show update destroy yaml]

    def index
      redirect_to locale_lab.dashboard_url
    end

    def search
      if params[:search].blank?
        return redirect_to action: 'show', id: params[:id]
      end

      @navigation = LocaleLab::Translation.search(params[:search])

      render 'show'
    end

    def show
      if (params[:offset].to_i > 0)
        return render turbo_stream: turbo_stream.append('translations-list', partial: "translations")
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
      LocaleLab::TranslationFile.all.each do |file|
        file.merge!(params[:id], value_param) if file.locale == params[:locale]
      end

      redirect_to action: 'show', id: params[:id]
    end

    private

    def load_navigation
      @navigation = LocaleLab::Translation.navigate(params[:id])
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
