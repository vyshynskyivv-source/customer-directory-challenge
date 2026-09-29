export const DATA_URL = '/api/customers';
export const PAGE_SIZE = 9;
export const PAGE_SIZES = [9, 33, 99];

export function normalize(text) {
  return String(text)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
    .trim();
}

export function displayName(text = '') {
  return text
    .trim()
    .split(/\s+/)
    .map((word, index) =>
      index > 0 && ['de', 'da', 'do', 'das', 'dos', 'e'].includes(word.toLowerCase())
        ? word.toLowerCase()
        : word.charAt(0).toLocaleUpperCase('pt-BR') + word.slice(1),
    )
    .join(' ');
}

export function parseCustomers(data) {
  if (!Array.isArray(data?.results)) throw new Error('Invalid customer dataset');
  const ids = new Set();
  return data.results.map((customer) => {
    if (
      !customer ||
      typeof customer.email !== 'string' ||
      !customer.email.trim() ||
      typeof customer.name?.first !== 'string' ||
      typeof customer.name?.last !== 'string' ||
      typeof customer.location?.state !== 'string' ||
      !customer.location.state.trim() ||
      ids.has(customer.email)
    )
      throw new Error('Invalid or duplicate customer');
    ids.add(customer.email);
    return {
      ...customer,
      id: customer.email,
      fullName: displayName(`${customer.name.first} ${customer.name.last}`),
    };
  });
}

export function selectCustomers(
  customers,
  query,
  states,
  requestedPage,
  phoneQuery = '',
  requestedSize = PAGE_SIZE,
) {
  const pageSize = PAGE_SIZES.includes(Number(requestedSize)) ? Number(requestedSize) : PAGE_SIZE;
  const words = normalize(query).split(/\s+/).filter(Boolean);
  const phoneDigits = phoneQuery.replace(/\D/g, '');
  const filtered = customers.filter(
    (customer) =>
      words.every((word) => normalize(customer.fullName).includes(word)) &&
      (!states.length || states.includes(customer.location.state)) &&
      (!phoneQuery.trim() ||
        (phoneDigits.length > 0 &&
          [customer.phone, customer.cell].some((number) =>
            String(number ?? '')
              .replace(/\D/g, '')
              .includes(phoneDigits),
          ))),
  );
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const number = Number(requestedPage);
  const page = Number.isSafeInteger(number) && number > 0 ? Math.min(number, pageCount) : 1;
  return {
    items: filtered.slice((page - 1) * pageSize, page * pageSize),
    total: filtered.length,
    pageCount,
    page,
    pageSize,
  };
}
