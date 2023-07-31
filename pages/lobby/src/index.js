import { constants } from '../../shared/constants.js'
import LobbyController from './controller.js'
import LobbySocketBuilder from './util/lobbySocketBuilder.js'
import View from './view.js'

const socketBuilder = new LobbySocketBuilder({
  socketUrl: constants.socketUrl,
  namespace: constants.socketNamespaces.lobby,
})

const user = {
  img: 'https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/batman_hero_avatar_comics-128.png',
  username: 'Fernando ' + Date.now(),
}

const dependencies = {
  socketBuilder,
  user,
  view: View,
}

await LobbyController.initialize(dependencies)
