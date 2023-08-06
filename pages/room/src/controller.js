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
    this.view.configureLeaveButton()
    this.view.configureOnMicrophoneActivation(
      this.onMicrophoneActivation.bind(this)
    )
    this.view.configureClapButton(this.onClapPressed.bind(this))
  }

  async onMicrophoneActivation() {
    await this.roomService.toggleAudioActivation()
  }

  onClapPressed() {
    this.socket.emit(constants.events.SPEAK_REQUEST, this.roomInfo.user)
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
      .setOnSpeakRequested(this.onSpeakRequested.bind(this))
      .build()
  }

  onSpeakRequested(data) {
    const attendee = new Attendee(data)
    const result = prompt(
      `O usuário ${attendee.username} pediu para falar, deseja aceitar? 1: sim, 0: não`
    )
    const answer = Number(result)
    this.socket.emit(constants.events.SPEAK_ANSWER, {
      answer: Boolean(answer),
      user: attendee,
    })
    console.log('request speaker', data)
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

    if (attendee.isSpeaker) {
      this.roomService.upgradeUserPermission(attendee)
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
