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

const dataKey = 'code-journal-data';

async function readData(): Promise<Data> {
  let data: Data;
  /*
  const localData = localStorage.getItem(dataKey);
  if (localData) {
    data = JSON.parse(localData) as Data;
  } else {
    data = {
      entries: [],
      nextEntryId: 1,
    };
  }
  */

  try {
    console.log('hu');
    const res = await fetch('/api/entries');
    console.log('res', res);
    if (!res.ok) throw new Error(`fetch Error ${res.status}`);

    const entries = (await res.json()) as Entry[];
    console.log('entries', entries);
    data = {
      entries: entries ?? [],
      nextEntryId: entries ? entries.length : 1,
    };
  } catch (e) {
    throw new Error(e instanceof Error ? e.message : 'Unknown Error');
  }
  return data;
}

function writeData(data: Data): void {
  const dataJSON = JSON.stringify(data);
  localStorage.setItem(dataKey, dataJSON);
}

export async function readEntries(): Promise<Entry[]> {
  return readData().entries;
}

export async function readEntry(entryId: number): Promise<Entry | undefined> {
  return readData().entries.find((e) => e.entryId === entryId);
}

export async function addEntry(entry: Entry): Promise<Entry> {
  const data = readData();
  const newEntry = {
    ...entry,
    entryId: data.nextEntryId++,
  };
  data.entries.unshift(newEntry);
  writeData(data);
  return newEntry;
}

export async function updateEntry(entry: Entry): Promise<Entry> {
  const data = readData();
  const newEntries = data.entries.map((e) =>
    e.entryId === entry.entryId ? entry : e
  );
  data.entries = newEntries;
  writeData(data);
  return entry;
}

export async function removeEntry(entryId: number): Promise<void> {
  const data = readData();
  const updatedArray = data.entries.filter(
    (entry) => entry.entryId !== entryId
  );
  data.entries = updatedArray;
  writeData(data);
}
