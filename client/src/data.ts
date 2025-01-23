export type Entry = {
  entryId?: number;
  title: string;
  notes: string;
  photoUrl: string;
};

type Data = {
  entries: Entry[];
  nextEntryId: number;
};

async function readData(): Promise<Data> {
  let data: Data | null = null;

  try {
    const res = await fetch('/api/entries');
    if (!res.ok) throw new Error(`fetch Error ${res.status}`);

    const entries = (await res.json()) as Entry[];
    data = {
      entries: entries ?? [],
      nextEntryId: entries ? entries.length : 1,
    };
  } catch (e) {
    throw new Error(e instanceof Error ? e.message : 'Unknown Error');
  } finally {
    if (!data) {
      data = {
        entries: [],
        nextEntryId: 1,
      };
    }
  }
  return data;
}

export async function readEntries(): Promise<Entry[]> {
  return (await readData()).entries;
}

export async function readEntry(entryId: number): Promise<Entry | undefined> {
  return (await readData()).entries.find((e) => e.entryId === entryId);
}

export async function addEntry(entry: Entry): Promise<Entry | null> {
  const data = await readData();
  let newEntry: Entry | null = null;
  const req = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  };
  try {
    const res = await fetch('/api/entries', req);
    if (!res.ok) throw new Error(`fetch Error ${res.status}`);
    newEntry = (await res.json()) as Entry;
    data.entries.unshift(newEntry);
  } catch (e) {
    new Error(e instanceof Error ? e.message : 'Unknown Error');
  }
  return newEntry;
}

export async function updateEntry(entry: Entry): Promise<Entry> {
  const data = await readData();
  const req = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  };
  try {
    const res = await fetch(`/api/entries/${entry.entryId}`, req);
    if (!res.ok) throw new Error(`fetch Error ${res.status}`);
    const updatedEntry = (await res.json()) as Entry;
    const newEntries = data.entries.map((e) =>
      e.entryId === entry.entryId ? updatedEntry : e
    );
    data.entries = newEntries;
  } catch (e) {
    new Error(e instanceof Error ? e.message : 'Unknown Error');
  }

  return entry;
}

export async function removeEntry(entryId: number): Promise<void> {
  const data = await readData();
  const req = {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ entryId }),
  };
  try {
    const res = await fetch(`/api/entries/${entryId}`, req);
    if (!res.ok) throw new Error(`fetch Error ${res.status}`);
    //const entry = (await res.json()) as Entry;
    const newEntries = data.entries.filter(
      (entry) => entry.entryId !== entryId
    );
    data.entries = newEntries;
  } catch (e) {
    new Error(e instanceof Error ? e.message : 'Unknown Error');
  }
}
