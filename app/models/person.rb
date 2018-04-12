class Person < ApplicationRecord
  validates :name, presence: true
  validates :bio, presence: true

  def as_json
    {
      id: id,
      name: name,
      bio: bio,
      bioVisible: true
    }
  end
end
