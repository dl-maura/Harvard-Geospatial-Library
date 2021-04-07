RSpec.describe 'check footer links', type: :view do
    it 'has a link to hollis' do
        render partial: 'shared/footer'
        expect(rendered).to have_link 'Hollis', href: '#'
    end
end
