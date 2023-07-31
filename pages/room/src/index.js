import { constants } from '../../shared/constants.js'
import PeerBuilder from '../../shared/peerBuilder.js'
import RoomController from './controller.js'
import RoomService from './service.js'
import RoomSocketBuilder from './util/roomSocket.js'
import View from './view.js'
import Media from '../../shared/media.js'

const socketBuilder = new RoomSocketBuilder({
  socketUrl: constants.socketUrl,
  namespace: constants.socketNamespaces.room,
})

const urlParams = new URLSearchParams(window.location.search)

const keys = ['id', 'topic']
const urlData = keys.map((key) => [key, urlParams.get(key)])

const user = {
  img: 'https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/batman_hero_avatar_comics-128.png',
  username: 'Fernando ' + Date.now(),
}

const roomInfo = {
  room: { ...Object.fromEntries(urlData) },
  user,
}

const peerBuilder = new PeerBuilder({ peerConfig: constants.peerConfig })
const roomService = new RoomService({
  media: Media,
})

const dependencies = {
  view: View,
  socketBuilder,
  roomInfo,
  peerBuilder,
  roomService,
}

const roomController = RoomController.initialize(dependencies)