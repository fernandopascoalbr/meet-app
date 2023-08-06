import { constants } from '../../shared/constants.js'
import UserDb from '../../shared/userDb.js'
import LobbyController from './controller.js'
import LobbySocketBuilder from './util/lobbySocketBuilder.js'
import View from './view.js'

const user = UserDb.get()

if (!user.username || !user.img) {
  View.redirectToLogin()
}

const socketBuilder = new LobbySocketBuilder({
  socketUrl: constants.socketUrl,
  namespace: constants.socketNamespaces.lobby,
})

const dependencies = {
  socketBuilder,
  user,
  view: View,
}

LobbyController.initialize(dependencies).catch((err) =>
  alert(err?.message || '')
)
