module LocaleLab
  module ApplicationHelper
    def application_name
      @application_name ||= begin
        klass = Rails.application.class
        if klass.respond_to?(:module_parent_name)
          klass.module_parent_name
        elsif klass.respond_to?(:parent_name)
          klass.parent_name
        else
          File.basename(Rails.root)
        end
      end
    end

    def current_branch
      @current_branch ||= begin
        branch = `git -C #{Rails.root} rev-parse --abbrev-ref HEAD 2>/dev/null`.strip
        branch.empty? ? 'unknown' : branch
      end
    end
  end
end
