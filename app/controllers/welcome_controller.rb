class WelcomeController < ApplicationController
  respond_to :json

  def index
    # @vivotek_members = Staff.where(:id=>/A.*/).to_a
    # @vatics_members = Staff.where(:id=>/B.*/).to_a
    # @otus_members = Staff.where(:id=>/E.*/).to_a
  end

  def get_winner_list
    result = Prize.winner_list.order_by(:id.desc).collect do | prize |
      prize.attributes.merge({staff_name: prize.staff.name})
    end
    render json: Oj.dump( result)
  end

  def about_us
  end
end
