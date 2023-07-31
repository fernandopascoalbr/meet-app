import { constants } from '../../shared/constants.js'
import Attendee from './entities/attendee.js'

export default class RoomController {
  constructor({ socketBuilder, roomInfo, view, peerBuilder, roomService }) {
    this.socketBuilder = socketBuilder
    this.roomInfo = roomInfo
    this.view = view
    this.peerBuilder = peerBuilder
    this.roomService = roomService
  }

  static async initialize(deps) {
    return new RoomController(deps)._initialize()
  }

  async _initialize() {
    this._setupViewEvent()
    this.roomService.init()
    this.socket = this._setupSocket()
    this.roomService.setCurrentPeer(await this._setupWebRTC())
  }

  _setupViewEvent() {
    this.view.updateUserImage(this.roomInfo.user)
    this.view.updateTopicTitle(this.roomInfo.room)
  }

  async _setupWebRTC() {
    return this.peerBuilder
      .setOnError(this.onPeerError.bind(this))
      .setOnConnectionOpened(this.onPeerConnectionOpened.bind(this))
      .setOnCallReceived(this.onCallReceived.bind(this))
      .setOnStreamReceived(this.onStreamReceived.bind(this))
      .setOnCallClose(this.onCallClose.bind(this))
      .setOnCallError(this.onCallError.bind(this))
      .build()
  }

  async onCallReceived(call) {
    const stream = await this.roomService.getCurrentStream()
    console.log('answering call', call)
    call.answer(stream)
  }
  onStreamReceived(call, stream) {
    const callerId = call.peer
    const { isCurrentId } = this.roomService.addReceivedPeer(call)
    this.view.renderAudioElement({
      callerId,
      stream,
      isCurrentId,
    })
    console.log('onStreamReceived', call, stream)
  }
  onCallClose(call) {
    console.log('onCallClose', call)
    this.roomService.disconnectPeer({ peerId: call.peer })
  }
  onCallError(call, error) {
    console.log('onCallError', call, error)
    this.roomService.disconnectPeer({ peerId: call.peer })
  }

  _setupSocket() {
    return this.socketBuilder
      .setOnUserConnected(this.onUserConnected.bind(this))
      .setOnUserDisconnected(this.onUserDisconnected.bind(this))
      .setOnRoomUpdated(this.onRoomUpdated.bind(this))
      .setOnUserProfileUpgrade(this.onUserProfileUpgrade.bind(this))
      .build()
  }

  onPeerError(error) {
    console.log('peerError', error)
  }

  onPeerConnectionOpened(peer) {
    console.log('peerConnection', peer)
    this.roomInfo.user.peerId = peer.id
    this.socket.emit(constants.events.JOIN_ROOM, this.roomInfo)
  }

  onUserProfileUpgrade(data) {
    const attendee = new Attendee(data)
    console.log('onUserProfileUpgrade', data)
    this.roomService.upgradeUserPermission(attendee)

    if (attendee.isSpeaker) {
      this.view.addAttendeeOnGrid(data, true)
    }

    this.activateUserFeatures()
  }

  onUserConnected(data) {
    const attendee = new Attendee(data)
    console.log('user connected', attendee)
    this.view.addAttendeeOnGrid(attendee)
    this.roomService.callNewUser(attendee)
  }
  onUserDisconnected(data) {
    const attendee = new Attendee(data)
    console.log(`user ${attendee.username} disconnected`)
    this.view.removeItemOnGrid(attendee.id)
    this.roomService.disconnectPeer(attendee)
  }

  onRoomUpdated(data) {
    const users = data.map((user) => new Attendee(user))
    this.view.updateAttendeesOnGrid(users)
    this.roomService.updateCurrentUserProfile(users)
    this.activateUserFeatures()
  }

  activateUserFeatures() {
    const currentUser = this.roomService.getCurrentUser()
    this.view.showUserFeatures(currentUser.isSpeaker)
  }
}
