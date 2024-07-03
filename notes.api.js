// Schlüssel für den Zugriff auf den lokalen Speicher, unter dem die Notizen gespeichert werden
const LOCAL_STORAGE_KEY = "notizapp-notizen";

// Funktion zum Abrufen der gespeicherten Notizen aus dem lokalen Speicher
function getNotes() {
  // Versuche, die Notizen aus dem lokalen Speicher abzurufen.
  // Wenn keine Notizen vorhanden sind, wird ein leeres Array zurückgegeben.
  return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
}

// Funktion zum Ermitteln der nächsten verfügbaren ID für eine neue Notiz
function getNextId() {
  const notes = getNotes();

  // Notizen nach ihrer ID sortieren, um die nächste verfügbare ID zu bestimmen
  const sortedNotes = notes.sort((noteA, noteB) => noteA.id - noteB.id);

  let nextId = 1;

  // Durch die sortierten Notizen iterieren und die nächste verfügbare ID bestimmen
  for (let note of sortedNotes) {
    if (nextId < note.id) break;

    nextId = note.id + 1;
  }

  return nextId;
}

// Funktion zum Speichern einer Notiz im lokalen Speicher
function saveNote(title, content, id = undefined) {
  const notes = getNotes();

  // Wenn keine ID übergeben wird, wird eine neue Notiz erstellt und hinzugefügt
  if (!id) {
    notes.push({
      title,
      content,
      id: getNextId(),
      lastUpdated: new Date().getTime(), // Zeitstempel für das letzte Update hinzufügen
    });
  } else {
    // Wenn eine ID übergeben wird, wird die entsprechende Notiz aktualisiert
    const indexOfNoteWithId = notes.findIndex((note) => note.id === id);

    // Wenn eine Notiz mit der übergebenen ID gefunden wurde, wird sie aktualisiert
    if (indexOfNoteWithId > -1) {
      notes[indexOfNoteWithId] = {
        title,
        content,
        id,
        lastUpdated: new Date().getTime(), // Zeitstempel für das letzte Update aktualisieren
      };
    }
  }

  // Aktualisierte Notizen im lokalen Speicher speichern
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(notes));
}

// Funktion zum Löschen einer Notiz aus dem lokalen Speicher
function deleteNote(id) {
  // Wenn keine ID übergeben wird, wird die Funktion beendet
  if (!id) return;

  const notes = getNotes();

  // Alle Notizen außer derjenigen mit der übergebenen ID filtern
  const filteredNotes = notes.filter((note) => note.id !== Number(id));

  // Gefilterte Notizen im lokalen Speicher speichern
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filteredNotes));
}
