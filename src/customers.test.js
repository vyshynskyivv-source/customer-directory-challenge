import { describe, expect, it } from 'vitest';
import { normalize, parseCustomers, selectCustomers } from './customers.js';
import dataset from '../reference/customers.json';

const customers = parseCustomers(dataset);

describe('Provided customer data', () => {
  it('paginates every supported page size without losing records and rejects unsupported sizes', () => {
    for (const size of [9, 33, 99]) {
      const first = selectCustomers(customers, '', [], 1, '', String(size));
      expect(first.items).toHaveLength(size);
      expect(first.pageSize).toBe(size);
      const ids = [];
      for (let page = 1; page <= first.pageCount; page++) {
        ids.push(...selectCustomers(customers, '', [], page, '', size).items.map((c) => c.id));
      }
      expect(ids).toEqual(customers.map((c) => c.id));
      const last = selectCustomers(customers, '', [], 999, '', size);
      expect(last.page).toBe(first.pageCount);
      expect(last.items).toHaveLength(200 % size || size);
    }
    for (const size of [null, 'bad', -1, 0, 10, 33.5]) {
      expect(selectCustomers(customers, '', [], 1, '', size).pageSize).toBe(9);
    }
  });
  it('matches partial phone and mobile numbers regardless of formatting, combined with other filters', () => {
    const records = [
      { fullName: 'Ana Silva', location: { state: 'são paulo' }, phone: '(11) 2345-6789' },
      { fullName: 'Bruno Silva', location: { state: 'rio de janeiro' }, cell: '(21) 99876-5432' },
      { fullName: 'Carla Souza', location: { state: 'são paulo' } },
    ];
    expect(selectCustomers(records, '', [], 1, '11 2345 6789').items).toEqual([records[0]]);
    expect(selectCustomers(records, '', [], 1, '9876-54').items).toEqual([records[1]]);
    expect(selectCustomers(records, 'silva', ['são paulo'], 1, '2345').items).toEqual([records[0]]);
    expect(selectCustomers(records, 'bruno', [], 1, '2345').total).toBe(0);
    expect(selectCustomers(records, '', ['são paulo'], 1, '9876').total).toBe(0);
    expect(selectCustomers(records, '', [], 1, '   ').total).toBe(3);
    for (const query of ['---', 'abc', '00000'])
      expect(selectCustomers(records, '', [], 1, query).total).toBe(0);
  });
  it('loads every record and assigns distinct detail-page identifiers', () => {
    expect(customers).toHaveLength(200);
    expect(new Set(customers.map((c) => c.id)).size).toBe(200);
    expect(new Set(customers.map((c) => c.location.state)).size).toBe(27);
  });
  it('finds first names, surnames, and mixed-case multiword names without accents', () => {
    const target = customers[0];
    for (const query of [
      target.name.first,
      target.name.last,
      normalize(target.fullName).toUpperCase(),
    ]) {
      expect(selectCustomers(customers, query, [], 1).total).toBeGreaterThan(0);
    }
    expect(normalize('  JOÃO Ávila  ')).toBe('joao avila');
  });
  it('combines state selection with search, and treats multiple states as alternatives', () => {
    const states = ['são paulo', 'santa catarina'];
    const result = selectCustomers(customers, '', states, 1);
    expect(result.total).toBe(17);
    const query = customers[0].name.first;
    expect(
      selectCustomers(customers, query, ['santa catarina'], 1).items.some(
        (c) => c.id === customers[0].id,
      ),
    ).toBe(true);
    expect(selectCustomers(customers, query, ['not a state'], 1).total).toBe(0);
  });
  it('has no lost or repeated customers across pages, including the final partial page', () => {
    const ids = [];
    for (let page = 1; page <= 23; page++)
      ids.push(...selectCustomers(customers, '', [], page).items.map((c) => c.id));
    expect(ids).toEqual(customers.map((c) => c.id));
    expect(selectCustomers(customers, '', [], 23).items).toHaveLength(2);
  });
  it('handles empty results and invalid page parameters', () => {
    expect(selectCustomers(customers, 'no-such-person-xyz', [], 3)).toMatchObject({
      items: [],
      total: 0,
      page: 1,
      pageCount: 1,
    });
    for (const page of ['NaN', '-3', '1.5', 'Infinity'])
      expect(selectCustomers(customers, '', [], page).page).toBe(1);
    expect(selectCustomers(customers, '', [], 1000).page).toBe(23);
  });
  it('rejects bad payloads and duplicate identifiers rather than showing misleading results', () => {
    for (const payload of [
      null,
      {},
      { results: [null] },
      { results: [{}] },
      { results: [dataset.results[0], dataset.results[0]] },
    ]) {
      expect(() => parseCustomers(payload)).toThrow();
    }
    expect(parseCustomers({ results: [] })).toEqual([]);
  });
});
