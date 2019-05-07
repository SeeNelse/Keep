initApp();
// База для всех записей
var notes = [];
// Счетчик для id записей
var notesCounter = 0;
var notesFavCounter = 0;
// Список тегов
var tags;

function triggerUpdate(data) {
  if (data) {
    notes = data.notesDB;
    notesCounter = data.notesCounter;
    notesFavCounter = data.notesFavCount;
    tags = data.allTags;
  } else {
    notes = [];
    notesCounter = 0;
    notesFavCounter = 0;
    tags = [];
  }
  
  ready();
  document.querySelector(".loading").classList.add('hide');
}

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    readDB(notes, notesCounter, notesFavCounter);
    document.querySelector("body").classList.remove('anonymous');
  }
});

function ready() {

  if(!dataLoaded) {
    return;
  }

  var notesDB;
  notes.sort(function(a, b) {
    if (a.noteId > b.noteId) {
      return 1;
    }
    if (a.noteId < b.noteId) {
      return -1;
    }
  });

  var noteDiv = document.querySelector(".new-note"); // Основыной блок
  var noteText = document.querySelector(".new-note__text"); // Текст
  var noteHead = document.querySelector(".new-note__head"); // Заголовок
  var noteBot = document.querySelector(".new-note__bottom"); // Нижняя часть основного блока
  var btnSbmt = document.querySelector(".new-note__btn"); // Кнопка "Записать"
  var btnColor = document.querySelectorAll(".new-note-color__item"); // Круг цвета в основном блоке

  var mainDiv = document.querySelector(".note-list"); // Основной блок с заметками
  var mainDivItem = document.querySelectorAll(".note-list__item");
  var favoriteList = document.querySelector(".favorite-note-list"); // Блок для избранный записей

  var currentNoteId; // для редактирования заметки
  var notePopUp = document.querySelector(".note-popup"); // Попап редактирования
  var popUpColor = document.querySelectorAll(".note-popup-color__item"); // Цвета в поп-апе

  // Окно пользователя
  var userBtn = document.querySelector(".header-person__photo");
  var userDiv = document.querySelector(".header-person-div")

  // Рендер заметок
  notes.forEach(function(note) {
    renderNote(note);
  });
  
  // Рендер фаворит заметок
  var notesFav = notes.slice();
  notesFav.sort(function(a, b) {
    if (!a.noteFavoritePos) {
      return 1;
    }
    if (a.noteFavoritePos > b.noteFavoritePos) {
      return 1;
    }
    if (a.noteFavoritePos < b.noteFavoritePos) {
      return -1;
    }
  });
  notesFav.forEach(function(element, index) {
    for (var l = 0; l < mainDiv.children.length; l++) {
      var currentItem = mainDiv.children[l];
      if (element.noteId === +currentItem.getAttribute("data-item-number")) {
        updateDB();
        favoritePin(element, currentItem, true);
      }
    }
  });

  // Обновление записей
  function updateDB() {
    writeDB(notes, notesCounter, notesFavCounter, tags);
    readDB(notes, notesCounter, notesFavCounter, tags);
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
        tags: [],
        noteFavorite: false,
        noteFavoritePos: null,
      };
      notes.unshift(note);
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
  function headVisible(div, object) {
    if (div.children.length >= 2) {
      object.style.display = "block";
    } else {
      object.style.display = "none";
    }
  }

  // Создание нового дива с данными
  function renderNote(newNote) {
    var div = document.createElement("div"),
      remove = document.createElement("span"),
      title = document.createElement("h6"),
      text = document.createElement("p"),
      favorite = document.createElement("span"),
      tags = document.createElement("span");

    div.className = "note-list__item";
    remove.className = "note-list__del";
    favorite.className = "note-list__pin";
    tags.className = "note-list-tags";
    text.className = "note-list__text";
    title.className = "note-list__head";

    remove.innerHTML = "<i class='icon-cancel'></i>";
    favorite.innerHTML = "<i class='icon-pin'></i>";
    tags.innerHTML = "<i class='icon-tags'></i><div class='note-list-tags__block'><div class='note-list-tags__top'><input type='text' class='note-list-tags__input'><span class='note-list-tags__plus'>+</span></div></div>";
    text.innerHTML = newNote.noteText;
    title.innerHTML = newNote.noteHead;

    addRemoveListner(remove, newNote);
    div.setAttribute("data-item-number", (newNote.noteId));
    div.appendChild(remove);
    div.appendChild(title);
    if (noteHead.value.length > 0) {
      title.style.marginBottom = "10px"
    }
    div.appendChild(text);
    div.appendChild(favorite);
    div.appendChild(tags);
    mainDiv.insertBefore(div, mainDiv.firstChild);
    headVisible(mainDiv, document.querySelector(".note-list__main-head"));
    div.style.background = newNote.colorBg; // Сбивание бэкграунда у основного блока
    if (text.innerHTML.length < 51) {
      text.style.lineHeight = "30px";
      text.style.fontSize = "27px";
    } else if (text.innerHTML.length < 81) {
      text.style.lineHeight = "25px";
      text.style.fontSize = "20px";
    }
    if (!title.innerHTML) {
      title.style.marginBottom = "0px";
    } else {
      title.style.marginBottom = "10px";
    }

    favoritePinBtn(favorite, newNote); // Клик по "Закрепить заметку(пин)"
    editNoteFunc(); // Нажатие на заметку, для её редактирования
    addTag(); // Функция добавления тега
  }

  // Клик по "Закрепить заметку(пин)"
  function favoritePinBtn(favorite, newNote) {
    favorite.addEventListener('click', function() {
      var thisNoteElement = favorite.parentNode;
      var thisNoteId = thisNoteElement.getAttribute("data-item-number");
      if (newNote.noteFavorite === true) { // Удаление из избранного
        notes.forEach(function(element, index) {
          if (element.noteId === +thisNoteId) {
            element.noteFavorite = false;
            updateDB();
            favoritePin(element, thisNoteElement);
          }
        });
      } else { // Добавление в избранное
        notes.forEach(function(element, index) {
          if (element.noteId === +thisNoteId) {
            element.noteFavorite = true;
            updateDB();
            favoritePin(element, thisNoteElement);
          }
        });
      }
    });
  }

  // Рендер заметок в избранные и обратно
  function favoritePin(elementInArray, elementInPage, isFromInit) {
    var cacheElementId;
    var cacheElementDOM;
    var cloneElement;
    if (elementInArray.noteFavorite === true) {
      if (!elementInArray.noteFavoritePos) {
        notesFavCounter++;
        elementInArray.noteFavoritePos = notesFavCounter;
      }
      elementInPage.setAttribute('data-fav-number', elementInArray.noteFavoritePos);

      favoriteList.insertBefore(elementInPage, favoriteList.firstChild);
    } else {
      elementInPage.removeAttribute('data-fav-number');
      elementInArray.noteFavoritePos = null;
      if (isFromInit) {
        return;
      }
      if (!mainDiv.querySelectorAll('.note-list__item').length) {
        mainDiv.appendChild(elementInPage);
        return;
      }
      notes.forEach(function(element, index, array) {
        if (elementInArray.noteId > element.noteId && !element.noteFavorite) {
          cacheElementId = element.noteId;
        }
      });
      cacheElementDOM = document.querySelector(".note-list__item[data-item-number='" + cacheElementId + "']");
      mainDiv.insertBefore(elementInPage, cacheElementDOM);
    }
    updateDB();
    headVisible(favoriteList, document.querySelector(".favorite-note-list__head"));
  }

  // Функция добавление тега
  function addTag() {
    var plusTagBtn = document.querySelectorAll(".note-list-tags__plus");
    var inputTag = document.querySelector(".note-list-tags__input");
    // Добавление тега
    for (var i = 0; i < plusTagBtn.length; i++) {
      
      var old_element = plusTagBtn[i];
      var new_element = old_element.cloneNode(true);
      old_element.parentNode.replaceChild(new_element, old_element);

      new_element.addEventListener("click", function addTagClick(event) {
        console.log(event.target);
      });
    }
  }

  // Нажатие на заметку, для её редактирования
  function editNoteFunc() {
    var noteItem = document.querySelector(".note-list__item"); // Заметка
    if (noteItem) {
      noteItem.addEventListener("click", function(event) {
        if (event.target.className !== 'note-list__item' && event.target.className !== 'note-list__head' && event.target.className !== 'note-list__text') {
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

  // Функция вызова поп-апа
  function popUpCall() {
    notes.forEach(function(element, index) { // Красим окно редактирования в цвет заметки
      if (element.noteId === currentNoteId) {
        notePopUp.style.background = element.colorBg;
      }
    });
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
    updateDB();
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


  window.addEventListener("click", function(event) {
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
      headVisible(mainDiv, document.querySelector(".note-list__main-head"));
      updateDB();
    });
  }

  // Выпадающее окно на клику на аватар
  var userDivIsOpen = false;
  userBtn.addEventListener("click", function(e) {
    if (userDiv.style.display === "flex") {
      userDivIsOpen = false;
      userDiv.style.display = "none";
    } else {
      userDivIsOpen = true;
      userDiv.style.display = "flex";
    }
  });
  document.addEventListener("click", function(e) {
    console.log('1', e.target !== userDiv);
    console.log('2', !userDiv.contains(e.target))
    console.log('3', userDivIsOpen)
    if (e.target !== userDiv && !userDiv.contains(e.target) && e.target !== userBtn && userDivIsOpen) {
      userDivIsOpen = false;
      userDiv.style.display = "none";
    }
  });
}
document.addEventListener("DOMContentLoaded", ready);
