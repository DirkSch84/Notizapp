// Selektieren der HTML-Elemente
const saveButtonEl = document.querySelector(".save-note");
const deleteButtonEl = document.querySelector(".delete-note");
const newNoteButtonEl = document.querySelector(".create-new");
const notesListEl = document.querySelector(".notes-list");
const titleInputEl = document.getElementById("title-input");
const contentInputEl = document.getElementById("content-input");

// Event-Listener hinzufügen
saveButtonEl.addEventListener("click", clickSaveButton);
deleteButtonEl.addEventListener("click", clickDeleteButton);
newNoteButtonEl.addEventListener("click", newNote);

// Notizenliste anzeigen und Event-Listener anwenden
displayNotesList();
applyListeners();

// Funktion zum Hinzufügen von Event-Listenern für die Notizeinträge
function applyListeners() {
  const noteEntriesEls = document.querySelectorAll(".note-entry");

  noteEntriesEls.forEach((noteEntry) => {
    noteEntry.addEventListener("click", () =>
      selectNote(noteEntry.getAttribute("data-id"))
    );
  });
}

// Funktion zur Anzeige der Notizenliste
function displayNotesList() {
  const notes = getNotes();

  // Notizen nach dem Datum der letzten Aktualisierung sortieren
  const sortedNotes = notes.sort(
    (noteA, noteB) => noteB.lastUpdated - noteA.lastUpdated
  );

  let html = "";

  // HTML für jedes Notizelement generieren
  sortedNotes.forEach((note) => {
    html += `
            <div class="note-entry" data-id="${note.id}">
              <div class="note-title">${escapeHtml(note.title)}</div>
              <div class="note-content-teaser">${escapeHtml(note.content)}</div>
              <div class="note-date">${new Date(
                note.lastUpdated
              ).toLocaleString("de-DE")}</div>
            </div>`;
  });

  // HTML zur Notizenliste hinzufügen
  notesListEl.innerHTML = html;
}

// Funktion zum Speichern einer Notiz
function clickSaveButton() {
  const title = titleInputEl.value;
  const content = contentInputEl.value;

  // Sicherstellen, dass Titel und Inhalt eingegeben wurden
  if (!title || !content) {
    alert("Bitte Titel und Inhalt eingeben");
    return;
  } else if (/[&<>"']/g.test(title) || /[&<>"']/g.test(content)) {
    // Überprüft, ob der Titel oder der Inhalt Sonderzeichen enthält
    // Wenn ja, werden die Sonderzeichen durch escapeHtml-Funktion ersetzt
    title = escapeHtml(title);
    content = escapeHtml(content);
  }

  let currentId = undefined;

  // ID der aktuell ausgewählten Notiz abrufen
  const currentlySelectedNote = getCurrentlySelectedNote();

  if (currentlySelectedNote)
    currentId = currentlySelectedNote.getAttribute("data-id");

  // Notiz speichern
  saveNote(title, content, Number(currentId));

  // Eingabefelder leeren und Notizenliste aktualisieren
  titleInputEl.value = "";
  contentInputEl.value = "";

  displayNotesList();
  applyListeners();
}

// Funktion zum Löschen einer Notiz
function clickDeleteButton() {
  const currentlySelectedNote = getCurrentlySelectedNote();

  // Sicherstellen, dass eine Notiz ausgewählt ist
  if (!currentlySelectedNote) return;

  const currentId = getCurrentlySelectedNote().getAttribute("data-id");

  // Sicherstellen, dass eine ID vorhanden ist
  if (!currentId) return;

  // Notiz löschen
  deleteNote(currentId);

  // Eingabefelder leeren und Notizenliste aktualisieren
  titleInputEl.value = "";
  contentInputEl.value = "";

  displayNotesList();
  applyListeners();
}

// Funktion zum Auswählen einer Notiz
function selectNote(id) {
  const selectedNoteEl = document.querySelector(`.note-entry[data-id="${id}"]`);

  // Klasse "selected-note" hinzufügen, wenn die Notiz noch nicht ausgewählt ist
  if (selectedNoteEl.classList.contains("selected-note")) return;

  removeSelectedClassFromAllNotes();

  selectedNoteEl.classList.add("selected-note");

  // Informationen der ausgewählten Notiz in die Eingabefelder einfügen
  const notes = getNotes();

  const selectedNote = notes.find((note) => note.id === Number(id));

  if (!selectedNote) return;

  titleInputEl.value = selectedNote.title;
  contentInputEl.value = selectedNote.content;
}

// Funktion zum Entfernen der Klasse "selected-note" von allen Notizeinträgen
function removeSelectedClassFromAllNotes() {
  const noteEntries = document.querySelectorAll(".note-entry");

  noteEntries.forEach((noteEntry) => {
    noteEntry.classList.remove("selected-note");
  });
}

// Funktion zum Erstellen einer neuen Notiz
function newNote() {
  titleInputEl.value = "";
  contentInputEl.value = "";

  removeSelectedClassFromAllNotes();
}

// Funktion zum Abrufen der aktuell ausgewählten Notiz
function getCurrentlySelectedNote() {
  return document.querySelector(".selected-note");
}

// Funktion zum Escapen von HTML-Sonderzeichen
function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Sicherheit: Durch das Escapen von Sonderzeichen wird verhindert, dass bösartiger Code (z. B. JavaScript) in den HTML-Code eingeschleust wird, der dann beim Rendern der Webseite ausgeführt werden könnte. Dadurch wird das Risiko von Cross-Site-Scripting (XSS) Angriffen erheblich reduziert.

// Konsistente Darstellung: Einige Zeichen haben spezielle Bedeutungen in HTML (wie <, >, &). Wenn sie unescaped bleiben, können sie das Markup der Seite beeinträchtigen oder zu Fehlern führen. Durch das Escapen dieser Zeichen wird sichergestellt, dass der Text konsistent und korrekt angezeigt wird.

// Kompatibilität: Einige Zeichen haben eine besondere Bedeutung in HTML, CSS oder JavaScript. Das Escapen dieser Zeichen gewährleistet die korrekte Interpretation durch verschiedene Browser und Plattformen.
