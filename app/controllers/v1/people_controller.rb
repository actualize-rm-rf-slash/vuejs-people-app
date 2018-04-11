class V1::PeopleController < ApplicationController
  def index
    people = Person.all
    render json: people.as_json
  end
end
