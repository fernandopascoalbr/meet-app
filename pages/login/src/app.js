// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js'
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-analytics.js'
import {
  getAuth,
  GithubAuthProvider,
  signInWithPopup,
} from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js'
import { constants } from '../../shared/constants.js'
import UserDb from '../../shared/userDb.js'

function redirectToLobby() {
  window.location = constants.pages.lobby
}

async function onLogin(auth, provider) {
  try {
    const { user } = await signInWithPopup(auth, provider)
    const userData = {
      img: user.photoURL,
      username: user.displayName,
    }
    UserDb.insert(userData)
    redirectToLobby()
  } catch (error) {
    alert(JSON.stringify(error))
    debugger
  }
}

const { firebaseConfig } = constants
initializeApp(firebaseConfig)

const provider = new GithubAuthProvider()
provider.addScope('read:user')

const auth = getAuth()

const data = UserDb.get()

if (data.username && data.img) {
  redirectToLobby()
}

const btnLogin = document.getElementById('btnLogin')

btnLogin.addEventListener('click', () => onLogin(auth, provider))
