import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App.jsx';

const results = Array.from({ length: 20 }, (_, index) => ({
  name: { first: index === 0 ? 'joão' : `pessoa${index}`, last: 'silva' },
  email: `member${index}@example.com`,
  location: {
    state: index < 12 ? 'são paulo' : 'rio de janeiro',
    city: 'cidade',
    street: 'rua teste',
    postcode: 12345,
  },
  phone: '12345',
  picture: { medium: 'https://example.com/avatar.jpg' },
}));
const success = () => Promise.resolve({ ok: true, json: async () => ({ results }) });

function mount(path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  localStorage.clear();
  vi.stubGlobal('fetch', vi.fn(success));
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
});

describe('Directory user journeys', () => {
  it('switches list/card views and page size while retaining filters and detail return settings', async () => {
    const user = userEvent.setup();
    const { container } = mount('/?q=silva&phone=123&state=s%C3%A3o+paulo&page=2');
    await screen.findByRole('heading', { name: 'Lista de membros' });
    await user.selectOptions(screen.getByRole('combobox', { name: 'Idioma' }), 'en');
    await user.selectOptions(screen.getByRole('combobox', { name: 'View', exact: true }), 'list');
    expect(screen.getByText('Showing 10–12 of 12 members')).toBeInTheDocument();
    expect(container.querySelectorAll('.customer-row')).toHaveLength(3);
    expect(container.querySelector('.customer-row')).toHaveTextContent(
      'Rua Teste, Cidade, São Paulo',
    );
    expect(container.querySelector('.customer-card')).toBeNull();
    await user.selectOptions(screen.getByRole('combobox', { name: 'Per page' }), '33');
    expect(screen.getByText('Showing 1–12 of 12 members')).toBeInTheDocument();
    expect(container.querySelectorAll('.customer-row')).toHaveLength(12);
    await user.click(screen.getByRole('link', { name: /João Silva/ }));
    await user.click(screen.getByRole('link', { name: /Back to the list/ }));
    expect(screen.getByRole('combobox', { name: 'Per page' })).toHaveValue('33');
    expect(screen.getByRole('combobox', { name: 'View', exact: true })).toHaveValue('list');
    expect(screen.getByRole('searchbox')).toHaveValue('silva');
    await user.click(screen.getByRole('button', { name: 'Clear filters' }));
    expect(container.querySelectorAll('.customer-row')).toHaveLength(20);
    expect(screen.getByRole('combobox', { name: 'Per page' })).toHaveValue('33');
    await user.selectOptions(screen.getByRole('combobox', { name: 'Per page' }), '99');
    await user.selectOptions(screen.getByRole('combobox', { name: 'View', exact: true }), 'cards');
    expect(container.querySelectorAll('.customer-card')).toHaveLength(20);
    expect(container.querySelector('.customer-row')).toBeNull();
  });
  it('resets the page for phone search, preserves it through detail navigation, and clears all filters', async () => {
    const user = userEvent.setup();
    mount('/?q=silva&state=s%C3%A3o+paulo&page=2');
    await screen.findByRole('heading', { name: 'Lista de membros' });
    await user.type(screen.getByRole('textbox', { name: 'Buscar por telefone ou celular' }), '123');
    expect(screen.getByText('Exibindo 1–9 de 12 membros')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Próxima/ }));
    await user.click(screen.getByRole('link', { name: /Pessoa9 Silva/ }));
    await user.click(screen.getByRole('link', { name: /Voltar para a lista/ }));
    expect(screen.getByRole('textbox', { name: 'Buscar por telefone ou celular' })).toHaveValue(
      '123',
    );
    expect(screen.getByText('Exibindo 10–12 de 12 membros')).toBeInTheDocument();
    await user.selectOptions(screen.getByRole('combobox', { name: 'Idioma' }), 'en');
    const phone = screen.getByRole('textbox', { name: 'Search by phone or mobile number' });
    expect(phone).toHaveValue('123');
    await user.clear(phone);
    await user.type(phone, '999');
    expect(screen.getByRole('heading', { name: 'No results for this search' })).toBeInTheDocument();
    await user.click(screen.getAllByRole('button', { name: 'Clear filters' })[0]);
    expect(phone).toHaveValue('');
    expect(screen.getByRole('searchbox')).toHaveValue('');
    expect(screen.getByText('Showing 1–9 of 20 members')).toBeInTheDocument();
  });
  it('switches language and theme without losing filters, translates detail labels and restores preferences', async () => {
    const user = userEvent.setup();
    const view = mount('/?q=silva&state=s%C3%A3o+paulo&page=2');
    await screen.findByRole('heading', { name: 'Lista de membros' });
    await user.selectOptions(screen.getByRole('combobox', { name: 'Idioma' }), 'en');
    expect(screen.getByText('Showing 10–12 of 12 members')).toBeInTheDocument();
    expect(screen.getByRole('searchbox')).toHaveValue('silva');
    expect(document.documentElement).toHaveAttribute('lang', 'en');
    expect(document.title).toBe('Member directory | Juntos Somos Mais');
    await user.click(screen.getByRole('radio', { name: 'Blue-gray', exact: true }));
    expect(document.documentElement).toHaveAttribute('data-theme', 'medium');
    await user.click(screen.getByRole('link', { name: /Pessoa9 Silva/ }));
    expect(screen.getByRole('heading', { name: 'Contact information' })).toBeInTheDocument();
    expect(screen.getByText('Postal code')).toBeInTheDocument();
    view.unmount();
    mount();
    await screen.findByRole('heading', { name: 'Member directory' });
    expect(screen.getByRole('radio', { name: 'Blue-gray' })).toBeChecked();
    expect(document.documentElement).toHaveAttribute('data-theme', 'medium');
    expect(screen.getByRole('combobox', { name: 'Language' })).toHaveValue('en');
    await user.click(screen.getByRole('radio', { name: 'Dark', exact: true }));
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    await user.click(screen.getByRole('radio', { name: 'Light', exact: true }));
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');
  });
  it('keeps settings usable when browser storage is unavailable, including translated error messages', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Blocked');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Blocked');
    });
    fetch.mockRejectedValueOnce(new Error('Offline'));
    const user = userEvent.setup();
    mount();
    await screen.findByRole('alert');
    await user.selectOptions(screen.getByRole('combobox', { name: 'Idioma' }), 'en');
    expect(screen.getByRole('heading', { name: 'Unable to load members' })).toBeInTheDocument();
    await user.click(screen.getByRole('radio', { name: 'Dark', exact: true }));
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(await screen.findByRole('heading', { name: 'Member directory' })).toBeInTheDocument();
  });
  it('shows loading, renders cards, changes pages and resets pagination when searching', async () => {
    const user = userEvent.setup();
    mount();
    expect(screen.getByText('Carregando membros…')).toBeInTheDocument();
    await screen.findByRole('heading', { name: 'Lista de membros' });
    expect(screen.getByText('Exibindo 1–9 de 20 membros')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Anterior/ })).toBeDisabled();
    await user.click(screen.getByRole('button', { name: /Próxima/ }));
    expect(screen.getByText('Exibindo 10–18 de 20 membros')).toBeInTheDocument();
    await user.type(screen.getByRole('searchbox'), 'JOAO SILVA');
    expect(screen.getByRole('heading', { name: 'João Silva' })).toBeInTheDocument();
    expect(screen.getByText('Exibindo 1–1 de 1 membro')).toBeInTheDocument();
    expect(screen.queryByRole('navigation', { name: 'Paginação' })).not.toBeInTheDocument();
  });
  it('combines filters, shows zero matches, and clears all filters', async () => {
    const user = userEvent.setup();
    mount();
    await screen.findByRole('heading', { name: 'Lista de membros' });
    await user.click(screen.getByRole('checkbox', { name: 'Rio de Janeiro' }));
    expect(screen.getByText('Exibindo 1–8 de 8 membros')).toBeInTheDocument();
    await user.type(screen.getByRole('searchbox'), 'joao');
    expect(
      screen.getByRole('heading', { name: 'Nenhum resultado para esta busca' }),
    ).toBeInTheDocument();
    await user.click(screen.getAllByRole('button', { name: 'Limpar filtros' })[0]);
    expect(screen.getByText('Exibindo 1–9 de 20 membros')).toBeInTheDocument();
    expect(screen.getByRole('searchbox')).toHaveValue('');
    expect(screen.getByRole('checkbox', { name: 'Rio de Janeiro' })).not.toBeChecked();
  });
  it('opens a member and returns to the same filters and page', async () => {
    const user = userEvent.setup();
    mount('/?q=silva&state=s%C3%A3o+paulo&page=2');
    await screen.findByRole('heading', { name: 'Lista de membros' });
    expect(screen.getByText('Exibindo 10–12 de 12 membros')).toBeInTheDocument();
    await user.click(screen.getByRole('link', { name: /Pessoa9 Silva/ }));
    expect(screen.getByRole('heading', { level: 1, name: 'Pessoa9 Silva' })).toBeInTheDocument();
    expect(screen.getByText('member9@example.com')).toBeInTheDocument();
    await user.click(screen.getByRole('link', { name: /Voltar para a lista/ }));
    expect(screen.getByText('Exibindo 10–12 de 12 membros')).toBeInTheDocument();
    expect(screen.getByRole('searchbox')).toHaveValue('silva');
  });
  it('opens a direct detail URL and reports an unknown customer', async () => {
    const view = mount('/customers/member0%40example.com');
    expect(
      await screen.findByRole('heading', { name: 'João Silva', level: 1 }),
    ).toBeInTheDocument();
    view.unmount();
    mount('/customers/missing');
    expect(
      await screen.findByRole('heading', { name: 'Membro não encontrado' }),
    ).toBeInTheDocument();
  });
  it('recovers from a failed request on retry', async () => {
    fetch.mockRejectedValueOnce(new Error('Offline'));
    const user = userEvent.setup();
    mount();
    await screen.findByRole('alert');
    await user.click(screen.getByRole('button', { name: 'Tentar novamente' }));
    expect(await screen.findByRole('heading', { name: 'Lista de membros' })).toBeInTheDocument();
  });
  it('handles malformed server data and a valid empty dataset separately', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ wrong: [] }) });
    const view = mount();
    await screen.findByRole('alert');
    view.unmount();
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ results: [] }) });
    mount();
    expect(
      await screen.findByRole('heading', { name: 'O diretório está vazio' }),
    ).toBeInTheDocument();
  });
  it('replaces broken photos with initials', async () => {
    const { container } = mount();
    await screen.findByRole('heading', { name: 'Lista de membros' });
    fireEvent.error(container.querySelector('.avatar img'));
    await waitFor(() => expect(container.querySelector('.avatar')).toHaveTextContent('JS'));
  });
});
