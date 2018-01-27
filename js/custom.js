function ready() {

  // База для записей
  var notes = [];

  var noteDiv = document.querySelector(".new-note"); // Основыной див
  var noteText = document.querySelector(".new-note__text"); // Текст
  var noteHead = document.querySelector(".new-note__head"); // Заголовок
  var noteBot = document.querySelector(".new-note__bottom"); // Нижняя часть основного блока
  var btnSbmt = document.querySelector(".new-note__btn"); // Кнопка "Записать"
  var btnColor = document.querySelectorAll(".new-note-color__item"); // Круг цвета в основном диве
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
        noteHead: noteHead.value,
        colorBg: noteDiv.style.background
      };
      notes.push(note);
      noteDiv.style.background = "#ffffff";
      // console.log(colorBg());
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

    remove.innerHTML = "<i class='icon-cancel'></i>";
    text.innerHTML = newNote.noteText;
    title.innerHTML = newNote.noteHead;

    addRemoveListner(remove, newNote);
    console.log(noteText.value.length);
    div.setAttribute("data-item-number", (newNote.noteNumber));
    div.appendChild(remove);
    if (noteHead.value.length > 0) {
      div.appendChild(title);
    }
    div.appendChild(text);
    mainDiv.insertBefore(div, mainDiv.firstChild);

    div.style.background = newNote.colorBg; // Сбивание бэкграунда у основного блока

    if (noteText.value.length < "51") {
      text.style.lineHeight = "30px";
      text.style.overflowWrap = "break-word";
      text.style.fontSize = "27px";
    } else if (noteText.value.length < "81") {
      text.style.lineHeight = "25px";
      text.style.overflowWrap = "break-word";
      text.style.fontSize = "20px";
    }
  }

  // Задаем цвет главному блоку
  function colorBg(colorBg) {
    noteDiv.style.background = colorBg;
  }

  // Добавление новой заметки по клику на кнопку "Добавить"
  btnSbmt.addEventListener("click", function() {
    addNote();
    clearInputs();
  });

  // Кнопка цветов
  for (var i = 0; i < btnColor.length; i++) {
    btnColor[i].addEventListener("click", function(color) {
      color = event.target.getAttribute("data-note-color")
      colorBg(color);
    });
  }

  noteText.addEventListener("focus", function() {
    noteHead.style.display = "block";
    noteBot.style.display = "flex";
  });
  if (noteText.focus) {
    console.log('focus')
  } else if(noteText.blur) {
    console.log('blur')
  }
  // if (noteDiv.blur) {
  //   console.log('Фокус не на диве');
  //   noteHead.style.display = "none";
  //   noteBot.style.display = "none";
  // }
  

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