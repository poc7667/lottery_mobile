class Staff  
  include Mongoid::Document
  include Mongoid::Timestamps
  has_many :prizes
  field :year, type: Time
  field :department, type: String
  field :name, type: String
  field :arrival_date, type: Time
  field :trial_date, type: Time

  scope :by_year, ->(year) { where(:year.gte => Date.strptime( year.to_s,"%Y"), :year.lte => Date.strptime( (year+1).to_s,"%Y")) }
  default_scope -> { by_year(2016).without(:comment, :arrival_date, :created_at, :updated_at, :year) }
end
