function ready() {

  // База для записей
  var notes = [];

  var noteText = document.querySelector(".new-note__text"); // Текст
  var noteHead = document.querySelector(".new-note__head"); // Заголовок
  var btnSbmt = document.querySelector(".new-note__btn"); // Кнопка "Записать"
  var notesCounter = 0;

  // Добавляем новую заметку
  function addNote() {
    if (noteText.value === "") {
      console.log('Нет сообщения!');
      return;
    } else {
      notesCounter++;
      var note = {
        noteNumber: notesCounter,
        noteText: noteText.value,
        noteHead: noteHead.value
      };
      notes.push(note);
      renderNote(note);
    }
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

    addRemoveListner(remove, newNote);

    div.setAttribute("data-item-number", (newNote.noteNumber));
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

  // Вешание события удаления
  function addRemoveListner(remove, newNote) {
    remove.addEventListener("click", function() {
      var thisDiv = remove.parentNode,
          thisNote = newNote.noteNumber,
          arrayId,
          thisNoteId = +thisDiv.getAttribute("data-item-number");
      notes.forEach(function(element, index) {
        if(element.noteNumber === thisNoteId) {
          arrayId = index;
        }
      });
      notes.splice(arrayId, 1);
      thisDiv.parentNode.removeChild(thisDiv);
    });
  }

}
document.addEventListener("DOMContentLoaded", ready);