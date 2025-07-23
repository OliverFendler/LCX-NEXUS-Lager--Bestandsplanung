
'use client';
import { useState } from 'react';

export default function Home() {
  const [customers, setCustomers] = useState([
    {
      name: 'Kunde 1',
      dailyPaletten: 500,
      tageAusgleich: 10,
      tageAbholung: 5,
    },
  ]);

  const [stellplaetzeProPaletten, setStellplaetzeProPaletten] = useState(20);
  const [stellplatzKosten, setStellplatzKosten] = useState(7);

  const addCustomer = () => {
    setCustomers([
      ...customers,
      {
        name: `Kunde ${customers.length + 1}`,
        dailyPaletten: 0,
        tageAusgleich: 10,
        tageAbholung: 5,
      },
    ]);
  };

  const removeCustomer = (index) => {
    const updated = [...customers];
    updated.splice(index, 1);
    setCustomers(updated);
  };

  const updateCustomer = (index, field, value) => {
    const updated = [...customers];
    updated[index][field] = field === 'name' ? value : parseInt(value);
    setCustomers(updated);
  };

  const totalPaletten = customers.reduce((sum, c) => sum + c.dailyPaletten, 0);
  const puffer = Math.ceil(totalPaletten * 0.1);
  const grundstock = 10000 + puffer;
  const benoetigteStellplaetze = Math.ceil(grundstock / stellplaetzeProPaletten);
  const benoetigteFlaeche = benoetigteStellplaetze * 1.8;
  const lagerkosten = benoetigteStellplaetze * stellplatzKosten;

  const exportCSV = () => {
    const header = ['Kunde', 'Tägliche Paletten', 'Tage Ausgleich', 'Tage Abholung'];
    const rows = customers.map((c) => [c.name, c.dailyPaletten, c.tageAusgleich, c.tageAbholung]);
    rows.push([]);
    rows.push(['Gesamt', totalPaletten, '', '']);
    rows.push(['Puffer (10%)', puffer, '', '']);
    rows.push(['Grundstock', grundstock, '', '']);
    rows.push(['Benötigte Stellplätze', benoetigteStellplaetze, '', '']);
    rows.push(['Benötigte Lagerfläche (m²)', benoetigteFlaeche.toFixed(1), '', '']);
    rows.push(['Monatliche Lagerkosten (€)', lagerkosten.toFixed(2), '', '']);

    const csvContent = [header, ...rows].map((e) => e.join(';')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'lagerplanung.csv');
    link.click();
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">📦 LCX NEXUS Lagerplanungstool</h1>

      <div className="grid gap-6">
        {customers.map((c, i) => (
          <div key={i} className="border rounded-xl p-4 shadow-md bg-white">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium">Kundenname</label>
                <input
                  type="text"
                  value={c.name}
                  onChange={(e) => updateCustomer(i, 'name', e.target.value)}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Tägliche Paletten</label>
                <input
                  type="number"
                  value={c.dailyPaletten}
                  onChange={(e) => updateCustomer(i, 'dailyPaletten', e.target.value)}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Tage bis Ausgleich</label>
                <input
                  type="number"
                  value={c.tageAusgleich}
                  onChange={(e) => updateCustomer(i, 'tageAusgleich', e.target.value)}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Tage bis Abholung</label>
                <input
                  type="number"
                  value={c.tageAbholung}
                  onChange={(e) => updateCustomer(i, 'tageAbholung', e.target.value)}
                  className="w-full border p-2 rounded"
                />
              </div>
            </div>
            <div className="text-right mt-2">
              <button
                onClick={() => removeCustomer(i)}
                className="text-red-500 hover:underline text-sm"
              >
                Entfernen
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col md:flex-row gap-6 items-start md:items-center">
        <button
          onClick={addCustomer}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
        >
          ➕ Kunde hinzufügen
        </button>

        <div className="flex flex-col md:flex-row gap-4">
          <div>
            <label className="block text-sm font-medium">Paletten pro Stellplatz</label>
            <input
              type="number"
              value={stellplaetzeProPaletten}
              onChange={(e) => setStellplaetzeProPaletten(parseInt(e.target.value))}
              className="w-32 border p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Kosten / Stellplatz (€)</label>
            <input
              type="number"
              value={stellplatzKosten}
              onChange={(e) => setStellplatzKosten(parseFloat(e.target.value))}
              className="w-32 border p-2 rounded"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-2 text-lg">
        <p>📊 Gesamtsumme tägliche Paletten: <strong>{totalPaletten}</strong></p>
        <p>🧮 Puffer (10%): <strong>{puffer}</strong></p>
        <p>🏗️ Grundstock inkl. Puffer: <strong>{grundstock}</strong></p>
        <p>📦 Benötigte Stellplätze: <strong>{benoetigteStellplaetze}</strong></p>
        <p>📐 Benötigte Lagerfläche: <strong>{benoetigteFlaeche.toFixed(1)} m²</strong></p>
        <p>💶 Monatliche Lagerkosten: <strong>{lagerkosten.toFixed(2)} €</strong></p>
      </div>

      <div className="mt-6">
        <button
          onClick={exportCSV}
          className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700"
        >
          📤 Export als CSV
        </button>
      </div>
    </div>
  );
}
