import { useEffect, useRef, useState } from 'react';
import { Link, Route, Routes, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { DATA_URL, PAGE_SIZES, displayName, parseCustomers, selectCustomers } from './customers.js';
import { PreferencesProvider, PreferenceControls, usePreferences } from './preferences.jsx';

function Avatar({ customer, large = false }) {
  const [failed, setFailed] = useState(false);
  const url = large ? customer.picture?.large : customer.picture?.medium;
  return (
    <span className={`avatar ${large ? 'avatar-large' : ''}`} aria-hidden="true">
      {!failed && url ? (
        <img src={url} alt="" loading="lazy" onError={() => setFailed(true)} />
      ) : (
        customer.fullName
          .split(' ')
          .filter(Boolean)
          .slice(0, 2)
          .map((part) => part[0])
          .join('')
      )}
    </span>
  );
}

function CustomerCard({ customer, back }) {
  const { t } = usePreferences();
  return (
    <li>
      <Link
        className="customer-card"
        to={`/customers/${encodeURIComponent(customer.id)}?${new URLSearchParams({ back })}`}
      >
        <Avatar customer={customer} />
        <h2>{customer.fullName}</h2>
        <p>{displayName(customer.location.street || '') || t.noAddress}</p>
        <p className="muted">
          {displayName(customer.location.city || '')}
          <br />
          {displayName(customer.location.state)}
        </p>
        <span className="card-action">
          {t.details} <span aria-hidden="true">→</span>
        </span>
      </Link>
    </li>
  );
}

function CustomerRow({ customer, back }) {
  const { t } = usePreferences();
  const address = [customer.location.street, customer.location.city, customer.location.state]
    .filter(Boolean)
    .map(displayName)
    .join(', ');
  return (
    <li>
      <Link
        className="customer-row"
        to={`/customers/${encodeURIComponent(customer.id)}?${new URLSearchParams({ back })}`}
      >
        <Avatar customer={customer} />
        <strong>{customer.fullName}</strong>
        <span className="muted">{address || t.noAddress}</span>
        <span className="row-arrow" aria-hidden="true">
          →
        </span>
      </Link>
    </li>
  );
}

function Directory({ customers }) {
  const { t } = usePreferences();
  const [params, setParams] = useSearchParams();
  const heading = useRef(null);
  const query = params.get('q') || '';
  const phoneQuery = params.get('phone') || '';
  const states = params.getAll('state');
  const view = params.get('view') === 'list' ? 'list' : 'cards';
  const CustomerItem = view === 'list' ? CustomerRow : CustomerCard;
  const availableStates = [...new Set(customers.map((c) => c.location.state))].sort((a, b) =>
    a.localeCompare(b, 'pt-BR'),
  );
  const { items, total, page, pageCount, pageSize } = selectCustomers(
    customers,
    query,
    states,
    params.get('page'),
    phoneQuery,
    params.get('size'),
  );
  const first = total ? (page - 1) * pageSize + 1 : 0;

  function changeDisplay(key, value) {
    const next = new URLSearchParams(params);
    next.set(key, value);
    if (key === 'size') next.delete('page');
    setParams(next);
  }
  function clearFilters() {
    const next = new URLSearchParams(params);
    ['q', 'phone', 'state', 'page'].forEach((key) => next.delete(key));
    setParams(next);
  }

  function setQuery(key, value) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete('page');
    setParams(next, { replace: true });
  }
  function toggleState(state) {
    const next = new URLSearchParams(params);
    next.delete('state');
    (states.includes(state) ? states.filter((s) => s !== state) : [...states, state]).forEach((s) =>
      next.append('state', s),
    );
    next.delete('page');
    setParams(next);
  }
  function changePage(value) {
    const next = new URLSearchParams(params);
    next.set('page', String(value));
    setParams(next);
    heading.current?.focus();
    window.scrollTo?.({ top: 0, behavior: 'instant' });
  }
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">{t.directory}</p>
          <h1 ref={heading} tabIndex={-1}>
            {t.title}
          </h1>
        </div>
        <p className="muted">{t.registered(customers.length)}</p>
      </div>
      <form role="search" className="search" onSubmit={(event) => event.preventDefault()}>
        <div className="search-group">
          <label htmlFor="search">{t.search}</label>
          <div className="search-field">
            <span aria-hidden="true">⌕</span>
            <input
              id="search"
              type="search"
              placeholder={t.placeholder}
              value={query}
              onChange={(event) => setQuery('q', event.target.value)}
            />
          </div>
        </div>
        <div className="search-group">
          <label htmlFor="phone-search">{t.searchPhone}</label>
          <div className="search-field">
            <span aria-hidden="true">⌕</span>
            <input
              id="phone-search"
              type="tel"
              placeholder={t.phonePlaceholder}
              value={phoneQuery}
              onChange={(event) => setQuery('phone', event.target.value)}
            />
          </div>
        </div>
      </form>
      <div className="results-toolbar">
        <div className="results-bar" role="status" aria-live="polite">
          {total ? t.results(first, first + items.length - 1, total) : t.noMembers}
        </div>
        <div className="display-controls">
          <label className="language-control">
            <span>{t.perPage}</span>
            <select
              value={pageSize}
              onChange={(event) => changeDisplay('size', event.target.value)}
            >
              {PAGE_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
          <label className="language-control">
            <span>{t.view}</span>
            <select value={view} onChange={(event) => changeDisplay('view', event.target.value)}>
              <option value="cards">{t.cards}</option>
              <option value="list">{t.list}</option>
            </select>
          </label>
        </div>
      </div>
      <div className="directory-layout">
        <aside className="filters" aria-label={t.filters}>
          <fieldset>
            <legend>{t.byState}</legend>
            <div className="state-list">
              {availableStates.map((state) => (
                <label key={state}>
                  <input
                    type="checkbox"
                    checked={states.includes(state)}
                    onChange={() => toggleState(state)}
                  />
                  <span>{displayName(state)}</span>
                </label>
              ))}
            </div>
          </fieldset>
          {(query || phoneQuery || states.length > 0) && (
            <button className="text-button" onClick={clearFilters}>
              {t.clear}
            </button>
          )}
        </aside>
        <section aria-label={t.members}>
          {total ? (
            <ul className={view === 'list' ? 'customer-list' : 'card-grid'}>
              {items.map((customer) => (
                <CustomerItem key={customer.id} customer={customer} back={params.toString()} />
              ))}
            </ul>
          ) : (
            <div className="empty">
              <h2>{customers.length ? t.noResults : t.empty}</h2>
              <p>{customers.length ? t.trySearch : t.emptyDescription}</p>
              {(query || phoneQuery || states.length > 0) && (
                <button onClick={clearFilters}>{t.clear}</button>
              )}
            </div>
          )}
          {pageCount > 1 && (
            <nav className="pagination" aria-label={t.pagination}>
              <button disabled={page === 1} onClick={() => changePage(page - 1)}>
                ← {t.previous}
              </button>
              <label>
                {t.page}{' '}
                <select
                  aria-label={t.page}
                  value={page}
                  onChange={(event) => changePage(Number(event.target.value))}
                >
                  {Array.from({ length: pageCount }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
                <span>
                  {' '}
                  {t.of} {pageCount}
                </span>
              </label>
              <button disabled={page === pageCount} onClick={() => changePage(page + 1)}>
                {t.next} →
              </button>
            </nav>
          )}
        </section>
      </div>
    </>
  );
}

function Detail({ customers }) {
  const { t } = usePreferences();
  const { id } = useParams();
  const [params] = useSearchParams();
  const customer = customers.find((c) => c.id === id);
  const back = `/?${params.get('back') || ''}`;
  if (!customer)
    return (
      <Message title={t.missingMember}>
        <p>{t.missingDescription}</p>
        <Link to={back}>{t.back}</Link>
      </Message>
    );
  const fields = [
    [t.email, customer.email],
    [t.phone, customer.phone],
    [t.mobile, customer.cell],
    [t.address, displayName(customer.location.street || '')],
    [t.city, displayName(customer.location.city || '')],
    [t.state, displayName(customer.location.state)],
    [t.postcode, customer.location.postcode],
  ];
  return (
    <>
      <Link className="back-link" to={back}>
        ← {t.back}
      </Link>
      <article className="detail">
        <header className="detail-heading">
          <Avatar customer={customer} large />
          <div>
            <p className="eyebrow">{t.profile}</p>
            <h1>{customer.fullName}</h1>
            <p className="muted">{displayName(customer.location.state)}</p>
          </div>
        </header>
        <h2>{t.contact}</h2>
        <dl>
          {fields.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>
                {value === undefined || value === null || value === ''
                  ? t.notProvided
                  : String(value)}
              </dd>
            </div>
          ))}
        </dl>
      </article>
    </>
  );
}

function Message({ title, children }) {
  return (
    <section className="message">
      <h1>{title}</h1>
      {children}
    </section>
  );
}

function RouteFocus({ status }) {
  const { t } = usePreferences();
  const { pathname } = useLocation();
  useEffect(() => {
    const heading = document.querySelector('h1');
    if (heading) {
      heading.setAttribute('tabindex', '-1');
      heading.focus();
    }
  }, [pathname, status]);
  useEffect(() => {
    document.title = `${document.querySelector('h1')?.textContent || t.siteTitle} | Juntos Somos Mais`;
  }, [pathname, status, t]);
  return null;
}

function AppContent() {
  const { t } = usePreferences();
  const [state, setState] = useState({ status: 'loading', customers: [] });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    let active = true;
    setState({ status: 'loading', customers: [] });
    async function load() {
      try {
        const response = await fetch(DATA_URL, { signal: controller.signal });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const customers = parseCustomers(await response.json());
        if (active) setState({ status: 'ready', customers });
      } catch {
        if (active) setState({ status: 'error', customers: [] });
      } finally {
        clearTimeout(timer);
      }
    }
    load();
    return () => {
      active = false;
      clearTimeout(timer);
      controller.abort();
    };
  }, [attempt]);

  return (
    <>
      <a
        className="skip-link"
        href="#main"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById('main').focus();
        }}
      >
        {t.skip}
      </a>
      <header className="site-header">
        <div className="header-inner">
          <Link className="brand" to="/" aria-label={`Juntos Somos Mais — ${t.home}`}>
            <img src="./jsm-logo.png" alt="Juntos Somos Mais" width="180" height="49" />
          </Link>
          <PreferenceControls />
        </div>
      </header>
      <main id="main" tabIndex={-1}>
        {state.status === 'loading' && (
          <div className="message" role="status">
            <span className="loading-dot" aria-hidden="true" />
            <p>{t.loading}</p>
          </div>
        )}
        {state.status === 'error' && (
          <Message title={t.loadError}>
            <div role="alert">
              <p>{t.retryDescription}</p>
              <button onClick={() => setAttempt((value) => value + 1)}>{t.retry}</button>
            </div>
          </Message>
        )}
        {state.status === 'ready' && (
          <>
            <Routes>
              <Route path="/" element={<Directory customers={state.customers} />} />
              <Route path="/customers/:id" element={<Detail customers={state.customers} />} />
              <Route
                path="*"
                element={
                  <Message title={t.missingPage}>
                    <Link to="/">{t.back}</Link>
                  </Message>
                }
              />
            </Routes>
          </>
        )}
      </main>
      <RouteFocus status={state.status} />
      <footer>
        Juntos Somos Mais <span>·</span> {t.siteTitle}
      </footer>
    </>
  );
}

export default function App() {
  return (
    <PreferencesProvider>
      <AppContent />
    </PreferencesProvider>
  );
}
