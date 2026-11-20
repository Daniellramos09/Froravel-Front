import { describe, it, expect } from 'vitest';
import { escapeCsvCell, formatCsvRow } from '../csvExport';

describe('csvExport', () => {
  it('returns empty string for null or undefined', () => {
    expect(escapeCsvCell(null)).toBe('');
    expect(escapeCsvCell(undefined)).toBe('');
  });

  it('quotes cells containing delimiter, double quotes, or newlines per RFC-4180', () => {
    expect(escapeCsvCell('Engenharia')).toBe('Engenharia');
    expect(escapeCsvCell('Vendas;Sul')).toBe('"Vendas;Sul"');
    expect(escapeCsvCell('Vendas;"Sul"')).toBe('"Vendas;""Sul"""');
    expect(escapeCsvCell('Linha 1\nLinha 2')).toBe('"Linha 1\nLinha 2"');
    expect(escapeCsvCell('Linha 1\rLinha 2')).toBe('"Linha 1\rLinha 2"');
  });

  it('neutralizes spreadsheet formula-injection prefixes (=, +, -, @, tab, CR)', () => {
    expect(escapeCsvCell('=1+1')).toBe("'=1+1");
    expect(escapeCsvCell('+SUM(A1:A2)')).toBe("'+SUM(A1:A2)");
    expect(escapeCsvCell('-cmd|calc')).toBe("'-cmd|calc");
    expect(escapeCsvCell('@SUM(1,2)')).toBe("'@SUM(1,2)");
    expect(escapeCsvCell('\tpayload')).toBe("'\tpayload");
    expect(escapeCsvCell('\rpayload')).toBe('"\'\rpayload"');
    expect(escapeCsvCell('=1+1;A"B')).toBe('"\'=1+1;A""B"');
  });

  it('formats complete CSV rows with custom or default semicolon delimiter', () => {
    expect(formatCsvRow(['Setor', 'ColaboradorasAtivas', 'AgrupadoPorKAnonimato'])).toBe(
      'Setor;ColaboradorasAtivas;AgrupadoPorKAnonimato'
    );
    expect(formatCsvRow(['=HYPERLINK("x")', 6, 'NAO'])).toBe(
      '"\'=HYPERLINK(""x"")";6;NAO'
    );
    expect(formatCsvRow(['A,B', 'C'], ',')).toBe('"A,B",C');
  });
});
