﻿function ready() {

  // База для всех записей
  var notes = [];
  notes = JSON.parse(localStorage.getItem("notes"));
  var notesDB;
  console.log(notes);

  var noteDiv = document.querySelector(".new-note"); // Основыной блок
  var noteText = document.querySelector(".new-note__text"); // Текст
  var noteHead = document.querySelector(".new-note__head"); // Заголовок
  var noteBot = document.querySelector(".new-note__bottom"); // Нижняя часть основного блока
  var btnSbmt = document.querySelector(".new-note__btn"); // Кнопка "Записать"
  var btnColor = document.querySelectorAll(".new-note-color__item"); // Круг цвета в основном блоке
  
  var mainDiv = document.querySelector(".note-list"); // Основной блок с заметками
  var mainDivItem = document.querySelectorAll(".note-list__item");

  var notesCounter = 0; // Счетчик для id записей
  var currentNoteId;

  var favoriteList = document.querySelector(".favorite-note-list"); // Блок для избранный записей

  var notePopUp = document.querySelector(".note-popup"); // Попап редактирования
  var popUpColor = document.querySelectorAll(".note-popup-color__item"); // Цвета в поп-апе

  // Рендер заметок с локалсторейдж
  notes.forEach(function(note) {
    renderNote(note);
  });

  // Рендер фаворит заметок
  notes.forEach(function(element, index) {
    for (var l = 0; l < mainDiv.children.length; l++) {
      var currentItem = mainDiv.children[l];
      console.log(currentItem);
      if (element.noteId === +currentItem.getAttribute("data-item-number")) {
        updateDB();
        favoritePin(element, currentItem);
      }
    }
  });

  // Обновление записей
  function updateDB() {
    notesDB = JSON.stringify(notes);
    localStorage.setItem("notes", notesDB);
  }

  // Добавляем новую заметку
  function addNote() {
    if (noteText.value === "") {
      return;
    } else {
      notesCounter++;
      var note = {
        noteId: notesCounter,
        noteText: noteText.value,
        noteHead: noteHead.value,
        colorBg: noteDiv.style.background || "rgb(255, 255, 255)",
        noteFavorite: false
      };
      notes.push(note);
      noteDiv.style.background = "#ffffff";
      renderNote(note);
      updateDB();
      clearInputs();
      noteHead.style.display = "none";
      noteBot.style.display = "none";
    }
  }

  // Чистим textarea и input
  function clearInputs() {
    noteText.value = "";
    noteHead.value = "";
  }

  // Функция появления заголовка
  function headVisible(array, object) {
    if (array.length === 0) {
      object.style.display = "none";
    } else {
      object.style.display = "block";
    }
  }

  // Создание нового дива с данными
  function renderNote(newNote) {
    var div = document.createElement("div"),
      remove = document.createElement("span"),
      title = document.createElement("h6"),
      text = document.createElement("p"),
      favorite = document.createElement("span");

    div.className = "note-list__item";
    remove.className = "note-list__del";
    favorite.className = "note-list__pin";
    text.className = "note-list__text";
    title.className = "note-list__head";

    remove.innerHTML = "<i class='icon-cancel'></i>";
    favorite.innerHTML = "<i class='icon-pin'></i>";
    text.innerHTML = newNote.noteText;
    title.innerHTML = newNote.noteHead;

    // Клик по "Закрепить заметку(пин)"
    favorite.addEventListener('click', function() {
      var thisNoteElement = favorite.parentNode;
      var thisNoteId = thisNoteElement.getAttribute("data-item-number");

      notes.forEach(function(element, index) {
        if (element.noteId === +thisNoteId) {
          element.noteFavorite = true;
          updateDB();
          favoritePin(element, thisNoteElement);
        }
      });
    })

    addRemoveListner(remove, newNote);
    div.setAttribute("data-item-number", (newNote.noteId));
    div.appendChild(remove);
    div.appendChild(title);
    if (noteHead.value.length > 0) {
      title.style.marginBottom = "10px"
    }
    div.appendChild(text);
    mainDiv.insertBefore(div, mainDiv.firstChild);
    div.appendChild(favorite);
    headVisible(notes, document.querySelector(".note-list__main-head"));
    div.style.background = newNote.colorBg; // Сбивание бэкграунда у основного блока

    if (noteText.value.length < 51) {
      text.style.lineHeight = "30px";
      text.style.fontSize = "27px";
    } else if (noteText.value.length < 81) {
      text.style.lineHeight = "25px";
      text.style.fontSize = "20px";
    }

    // Нажатие на заметку, для её редактирования
    var noteItem = document.querySelector(".note-list__item"); // Заметка
    if (noteItem) {
      noteItem.addEventListener("click", function() {
        if (event.target.tagName === "I") { // Проверка клика. Если клик на удаление, то далее код не срабатывает
          return;
        }
        currentNoteId = +noteItem.getAttribute("data-item-number");
        var textValue,
          headValue;
        if (!noteItem.querySelector('.note-list__head')) {
          textValue = noteItem.childNodes[1].innerHTML;
        } else {
          textValue = noteItem.childNodes[2].innerHTML;
          headValue = noteItem.childNodes[1].innerHTML;
        }
        popUpCall();
        editNote(textValue, headValue);
      });
    }
  }

  // Рендер заметок в избранные
  function favoritePin(elementInArray, elementInPage) {
    if (elementInArray.noteFavorite === true) {
      favoriteList.appendChild(elementInPage);
    }
  }

  // Функция вызова поп-апа
  function popUpCall() {
    notes.forEach(function(element, index) { // Красим окно редактирования в цвет заметки
      if (element.noteId === currentNoteId) {
        notePopUp.style.background = element.colorBg;
      }
    });

    function randomAnimate(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    notePopUp.style.display = "flex";
    notePopUp.style.top = "200%";
    setInterval(function() {
      notePopUp.style.top = "25%";
    }, 1);
    document.querySelector(".overlay").style.display = "block";
  }

  // Функция редактирования заметки
  var editHead = document.querySelector(".note-popup__head"),
    editText = document.querySelector(".note-popup__text"),
    editBtn = document.querySelector(".note-popup__btn");

  function editNote(text, head) {
    editText.value = text;
    if (!head) {
      editHead.value = "";
    } else {
      editHead.value = head;
    }
  }

  // Функция сохранение редактируемой заметки
  function saveNoteInPopUp() {
    var currentNote = document.querySelector(".note-list__item[data-item-number='" + currentNoteId + "']");
    notes.forEach(function(element, index) { // Передача данных в массив
      if (element.noteId === currentNoteId) {
        element.noteText = editText.value;
        currentNote.style.background = element.colorBg;
        if (!editHead) {
          element.noteHead = "";
        } else {
          element.noteHead = editHead.value;
        }
      }
    });
    currentNote.querySelector(".note-list__text").innerHTML = editText.value;
    currentNote.querySelector(".note-list__head").innerHTML = editHead.value;
    if (!currentNote.querySelector(".note-list__head").innerHTML) {
      currentNote.querySelector(".note-list__head").style.marginBottom = "0px";
    } else {
      currentNote.querySelector(".note-list__head").style.marginBottom = "10px";
    }
    notePopUp.style.display = 'none';
    document.querySelector(".overlay").style.display = 'none';
  }

  // Сохранение редактируемой заметки при клике
  editBtn.addEventListener("click", function() {
    saveNoteInPopUp()
  });
  document.querySelector(".overlay").addEventListener("click", function() {
    saveNoteInPopUp()
  });


  // Сохранение цвета для редактируемой заметки
  for (var i = 0; i < popUpColor.length; i++) {
    popUpColor[i].addEventListener("click", function(color) {
      color = event.target.getAttribute("data-note-color");
      notes.forEach(function(element) {
        if (element.noteId === currentNoteId) {
          element.colorBg = color;
        }
      });
      for (var q = 0; q < popUpColor.length; q++) {
        popUpColor[q].style.border = "";
      }
      event.target.style.border = "2px solid #9a9a9a";
      colorPopUpBg(color);
    });
  }

  // Задаем цвет поп-апу
  function colorPopUpBg(colorPopUp) {
    notePopUp.style.background = colorPopUp;
  }

  // Задаем цвет главному блоку
  function colorBg(colorBg) {
    noteDiv.style.background = colorBg;
  }

  // Кнопка цветов
  for (var i = 0; i < btnColor.length; i++) {
    btnColor[i].addEventListener("click", function(color) {
      color = event.target.getAttribute("data-note-color");
      for (var q = 0; q < btnColor.length; q++) {
        btnColor[q].style.border = "";
      }
      event.target.style.border = "2px solid #9a9a9a";
      colorBg(color);
    });
  }

  // Добавление новой заметки по клику на кнопку "Добавить"
  btnSbmt.addEventListener("click", function() {
    addNote();
  });


  // Открытие и закрытие основного окна
  noteText.addEventListener("click", function() {
    noteHead.style.display = "block";
    noteBot.style.display = "flex";
  });

  window.addEventListener("click", function() {
    if (isDescendant(noteDiv, event.target) || noteHead.value !== "") {
      return;
    }
    noteHead.style.display = "none";
    noteBot.style.display = "none";
  });

  function isDescendant(parent, child) {
    var node = child.parentNode;
    while (node != null) {
      if (node == parent) {
        return true;
      }
      node = node.parentNode;
    }
    return false;
  }


  // Вешание события удаления
  function addRemoveListner(remove, newNote) {
    remove.addEventListener("click", function() {
      var thisDiv = remove.parentNode,
        thisNote = newNote.noteId,
        arrayId,
        thisNoteId = +thisDiv.getAttribute("data-item-number");
      notes.forEach(function(element, index) {
        if (element.noteId === thisNoteId) {
          arrayId = index;
        }
      });
      notes.splice(arrayId, 1);
      thisDiv.parentNode.removeChild(thisDiv);
      headVisible(notes, document.querySelector(".note-list__main-head"));
      updateDB();
    });
  }

}
document.addEventListener("DOMContentLoaded", ready);