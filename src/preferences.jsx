import { createContext, useContext, useEffect, useState } from 'react';

const messages = {
  'pt-BR': {
    directory: 'Diretório',
    title: 'Lista de membros',
    siteTitle: 'Diretório de membros',
    registered: (n) => `${n} ${n === 1 ? 'membro cadastrado' : 'membros cadastrados'}`,
    search: 'Buscar por nome ou sobrenome',
    placeholder: 'Digite um nome…',
    searchPhone: 'Buscar por telefone ou celular',
    phonePlaceholder: 'Digite o número ou parte dele…',
    filters: 'Filtros',
    byState: 'Por estado',
    clear: 'Limpar filtros',
    members: 'Membros',
    perPage: 'Por página',
    view: 'Visualização',
    cards: 'Cartões',
    list: 'Lista',
    results: (first, last, total) =>
      `Exibindo ${first}–${last} de ${total} ${total === 1 ? 'membro' : 'membros'}`,
    noMembers: 'Nenhum membro encontrado',
    noResults: 'Nenhum resultado para esta busca',
    empty: 'O diretório está vazio',
    trySearch: 'Tente outro nome ou número, ou remova os filtros de estado.',
    emptyDescription: 'Não há membros para exibir no momento.',
    pagination: 'Paginação',
    previous: 'Anterior',
    next: 'Próxima',
    page: 'Página',
    of: 'de',
    details: 'Ver detalhes',
    noAddress: 'Endereço não informado',
    missingMember: 'Membro não encontrado',
    missingDescription: 'Este endereço não corresponde a um membro do diretório.',
    back: 'Voltar para a lista',
    profile: 'Perfil do membro',
    contact: 'Informações de contato',
    email: 'E-mail',
    phone: 'Telefone',
    mobile: 'Celular',
    address: 'Endereço',
    city: 'Cidade',
    state: 'Estado',
    postcode: 'CEP',
    notProvided: 'Não informado',
    skip: 'Ir para o conteúdo',
    home: 'início',
    loading: 'Carregando membros…',
    loadError: 'Não foi possível carregar os membros',
    retryDescription: 'Verifique sua conexão e tente novamente.',
    retry: 'Tentar novamente',
    missingPage: 'Página não encontrada',
    language: 'Idioma',
    theme: 'Tema',
    lightTheme: 'Clara',
    mediumTheme: 'Azul-acinzentada',
    darkTheme: 'Escura',
    description:
      'Consulte o diretório de membros. Pesquise por nome, filtre por estado e veja os dados de contato.',
  },
  en: {
    directory: 'Directory',
    title: 'Member directory',
    siteTitle: 'Member directory',
    registered: (n) => `${n} registered ${n === 1 ? 'member' : 'members'}`,
    search: 'Search by first or last name',
    placeholder: 'Enter a name…',
    searchPhone: 'Search by phone or mobile number',
    phonePlaceholder: 'Enter a number or part of it…',
    filters: 'Filters',
    byState: 'By state',
    clear: 'Clear filters',
    members: 'Members',
    perPage: 'Per page',
    view: 'View',
    cards: 'Cards',
    list: 'List',
    results: (first, last, total) =>
      `Showing ${first}–${last} of ${total} ${total === 1 ? 'member' : 'members'}`,
    noMembers: 'No members found',
    noResults: 'No results for this search',
    empty: 'The directory is empty',
    trySearch: 'Try another name or number, or remove the state filters.',
    emptyDescription: 'There are no members to display at the moment.',
    pagination: 'Pagination',
    previous: 'Previous',
    next: 'Next',
    page: 'Page',
    of: 'of',
    details: 'View details',
    noAddress: 'Address not provided',
    missingMember: 'Member not found',
    missingDescription: 'This address does not match a member in the directory.',
    back: 'Back to the list',
    profile: 'Member profile',
    contact: 'Contact information',
    email: 'Email',
    phone: 'Phone',
    mobile: 'Mobile',
    address: 'Address',
    city: 'City',
    state: 'State',
    postcode: 'Postal code',
    notProvided: 'Not provided',
    skip: 'Skip to content',
    home: 'home',
    loading: 'Loading members…',
    loadError: 'Unable to load members',
    retryDescription: 'Check your connection and try again.',
    retry: 'Try again',
    missingPage: 'Page not found',
    language: 'Language',
    theme: 'Theme',
    lightTheme: 'Light',
    mediumTheme: 'Blue-gray',
    darkTheme: 'Dark',
    description:
      'Browse the member directory. Search by name, filter by state and view contact details.',
  },
};

function readPreference(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function savePreference(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* Settings still work for this visit. */
  }
}

const Preferences = createContext(null);

export function PreferencesProvider({ children }) {
  const [language, setLanguage] = useState(() =>
    readPreference('directory-language') === 'en' ? 'en' : 'pt-BR',
  );
  const [theme, setTheme] = useState(() => {
    const stored = readPreference('directory-theme');
    return ['light', 'medium', 'dark'].includes(stored)
      ? stored
      : window.matchMedia?.('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
  });
  useEffect(() => {
    document.documentElement.lang = language;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', messages[language].description);
    savePreference('directory-language', language);
  }, [language]);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    savePreference('directory-theme', theme);
  }, [theme]);
  return (
    <Preferences.Provider value={{ language, setLanguage, theme, setTheme, t: messages[language] }}>
      {children}
    </Preferences.Provider>
  );
}

export function usePreferences() {
  return useContext(Preferences);
}

export function PreferenceControls() {
  const { language, setLanguage, theme, setTheme, t } = usePreferences();
  return (
    <div className="preference-controls">
      <label className="language-control">
        <span>{t.language}</span>
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="pt-BR" lang="pt-BR">
            Português
          </option>
          <option value="en" lang="en">
            English
          </option>
        </select>
      </label>
      <div className="theme-switch" role="group" aria-label={t.theme}>
        {[
          ['light', t.lightTheme],
          ['medium', t.mediumTheme],
          ['dark', t.darkTheme],
        ].map(([value, label]) => (
          <label className="theme-choice" key={value} title={label}>
            <input
              type="radio"
              name="theme"
              value={value}
              checked={theme === value}
              aria-label={label}
              onChange={() => setTheme(value)}
            />
            <span className={`theme-swatch swatch-${value}`} aria-hidden="true">
              {theme === value ? '✓' : ''}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
