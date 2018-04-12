class V1::PeopleController < ApplicationController
  def index
    people = Person.all
    render json: people.as_json
  end

  def create
    person = Person.new(name: params[:name], bio: params[:bio])
    if person.save
      render json: person.as_json
    else
      render json: { errors: person.errors.full_messages }, status: :bad_request
    end
  end

  def update
    person = Person.find_by(id: params[:id])
    person.name = params[:name] || person.name
    person.bio = params[:bio] || person.bio
    person.save
    render json: person.as_json
  end

  def destroy
    person = Person.find_by(id: params[:id])
    person.destroy
    render json: {message: "Person successfully destroyed!"}
  end
end
