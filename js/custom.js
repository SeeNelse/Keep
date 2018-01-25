function ready() {

  // База для записей
  var notes = [];

  var noteText = document.querySelector(".new-note__text"); // Текст
  var noteHead = document.querySelector(".new-note__head"); // Заголовок
  var btnSbmt = document.querySelector(".new-note__btn"); // Кнопка "Записать"

  // Добавляем новую заметку
  function addNote() {
    if (noteText.value === "") {
      console.log('Нет сообщения!');
      return;
    } else {
      var note = {
        noteText: noteText.value,
        noteHead: noteHead.value
      };

      notes.push(note);
      renderNote(note);
    }
    console.log(notes);
  }

  // Чистим textarea и input
  function clearInputs() {
    noteText.value = "";
    noteHead.value = "";
  }

  // Создание нового дива с данными
  function renderNote(newNote) {
    var div = document.createElement("div"),
        remove = document.createElement("span"),
        title = document.createElement("h6"),
        text = document.createElement("p"),
        mainDiv = document.querySelector(".note-list");

    div.className = "note-list__item";
    remove.className = "note-list__del";
    text.className = "note-list__text";
    title.className = "note-list__head";

    remove.innerHTML = "x";
    text.innerHTML = newNote.noteText;
    title.innerHTML = newNote.noteHead;

    remove.addEventListener("click", function() {
      var thisDiv = remove.parentNode;
      var allNotes = document.querySelector(".new-note").childNodes.length;
      console.log(allNotes);
      allNotes.split('');
      console.log(allNotes);
    });

    div.appendChild(remove);
    div.appendChild(title);
    div.appendChild(text);
    mainDiv.appendChild(div);

    
  }

  // Добавление новой заметки по клику на кнопку "Добавить"
  btnSbmt.addEventListener("click", function() {
    addNote();
    clearInputs();
  });

}
document.addEventListener("DOMContentLoaded", ready);