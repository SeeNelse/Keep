var dataLoaded = false;

var config = {
  apiKey: "AIzaSyC_vafacYQvOhe98ZKbj-dS8xTPz9NDpms",
  authDomain: "keep-13bd2.firebaseapp.com",
  databaseURL: "https://keep-13bd2.firebaseio.com",
  projectId: "keep-13bd2",
  storageBucket: "keep-13bd2.appspot.com",
  messagingSenderId: "1024428624148"
};
firebase.initializeApp(config);


var uiConfig = {
  signInSuccessUrl: 'index.html',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID
  ],
  // signInFlow: 'popup',
};
var ui = new firebaseui.auth.AuthUI(firebase.auth());
ui.start('.login__auth', uiConfig);


/*АУТЕНТИФИКАЦИЯ ПОЛЬЗОВАТЕЛЯ*/
function toggleSignIn() {
  // Если пользователь разлогинен
  if (!firebase.auth().currentUser) {
    var provider = new firebase.auth.GoogleAuthProvider();
    // [Логин]
    firebase.auth().signInWithPopup(provider).then(function(result) {
      var token = result.credential.accessToken;
      var user = result.user;
      location.reload();
    }).catch(function(error) {
      // В случае ошибок
      var errorCode = error.code;
      var errorMessage = error.message;
      var email = error.email;
      var credential = error.credential;
      if (errorCode === 'auth/account-exists-with-different-credential') {
        alert('Вы уже зарегистрировались за другим провайдером за этим email');
      } else {
        console.log(error);
      }
    });
  } else {
    // [Разлогин]
    firebase.auth().signOut();
    location.reload();
  }
}


function initApp() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // Пользователь авторизован
      var displayName = user.displayName;
      var photoURL = user.photoURL;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var uid = user.uid;
      document.querySelector('.header-person__auth').innerHTML = 'Выйти';
      document.querySelector('.header-person__name').innerHTML = displayName;
      document.querySelector('.header-person__email').innerHTML = email;
      document.querySelector('.header-person__photo').setAttribute("src", photoURL);
      document.querySelector('.header-person__photo_big').setAttribute("src", photoURL);
    } else {
      // Пользователь не авторизован
      document.querySelector(".loading").classList.add('hide');
    }
  });
  document.querySelector('.header-person__auth').addEventListener('click', toggleSignIn, false);
}

/*ПОДКЛЮЧЕНИЕ БАЗЫ ДАННЫХ*/

var database = firebase.database();

function writeDB(db, counter, favCount, tags) {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      var name = user.displayName,
        email = user.email,
        uid = user.uid;
      database.ref('database/' + uid).set({
        notesDB: db,
        notesCounter: counter,
        notesFavCount: favCount,
        username: name,
        email: email,
        allTags: tags,
      });
    } else {
      console.log('аноним');
    }
  });
}

function readDB(db, counter, favCount, tags) {
  var user = firebase.auth().currentUser;
  if (user) {
    var uid = user.uid;

    var notesInDB = database.ref('database/' + uid + '/');
    notesInDB.on('value', function(snap) {
      if (!dataLoaded) {
        db = snap.val();
        dataLoaded = true;
        triggerUpdate(db);
        document.querySelector(".loading").classList.add('hide');
      }
    });
  }
}