class V1::PeopleController < ApplicationController
  def index
    people = Person.all
    render json: people.as_json
  end

  def create
    person = Person.new(name: params[:name], bio: params[:bio])
    person.save
    render json: person.as_json
  end
end
