class AddDisplayNameToUsers < ActiveRecord::Migration[6.1]
  def change
      add_column :users, :display_name, :string
  end
end
