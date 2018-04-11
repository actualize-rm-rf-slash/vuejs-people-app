class Person < ApplicationRecord
  def as_json
    {
      id: id,
      name: name,
      bio: bio,
      bioVisible: true
    }
  end
end
