module LocaleLab
  class TranslationsController < ApplicationController
    def index
      redirect_to locale_lab.dashboard_url
    end

    def show
      @navigation = LocaleLab::Translation.navigate(params[:id])

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
    end

    def destroy
      @navigation = LocaleLab::Translation.navigate(params[:id])

      LocaleLab::Translation.destroy(params[:id])

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
      @navigation = LocaleLab::Translation.navigate(params[:id])
      @translation = @navigation.translations.find do |translation|
        translation.key == params[:id] && translation.locale == params[:locale]
      end

      if @translation
        @translation.value = params[:value]
        @translation.save

        if @navigation.parent_folder
          redirect_to action: 'show', id: @navigation.parent_folder
        else
          redirect_to action: 'show', id: params[:id]
        end
      else
        flash.now[:error] = 'Something went wrong, please check for errors and try again.'
        render 'show', status: :unprocessable_entity
      end
    end

    def move
      if LocaleLab::Translation.move(params[:id], params[:new_id])
        redirect_to action: 'show', id: params[:new_id]
      else
        flash.now[:error] = 'Something went wrong, please check for errors and try again.'
        redirect_to action: 'show', id: params[:id]
      end
    end
  end
end
