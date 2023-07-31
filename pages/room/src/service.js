import UserStream from './entities/userStream.js'

export default class RoomService {
  constructor({ media }) {
    this.currentPeer = {}
    this.currentUser = {}
    this.currentStream = {}
    this.media = media
    this.peers = new Map()
  }

  async init() {
    const stream = await this.media.getUserAudio()
    this.currentStream = new UserStream({
      stream,
      isFake: true,
    })
  }

  setCurrentPeer(peer) {
    this.currentPeer = peer
  }

  getCurrentUser() {
    return this.currentUser
  }

  upgradeUserPermission(user) {
    if (!user.isSpeaker) return

    const isCurrent = user.id === this.currentUser.id
    if (!isCurrent) return

    this.currentUser = user
  }

  updateCurrentUserProfile(users) {
    this.currentUser = users.find(
      ({ peerId }) => peerId === this.currentPeer.id
    )
  }

  async getCurrentStream() {
    const { isSpeaker } = this.currentUser
    if (isSpeaker) {
      return this.currentStream.stream
    }

    return this.media.createMediaStreamFake()
  }

  addReceivedPeer(call) {
    const callerId = call.peer
    this.peers.set(callerId, { call })

    const isCurrentId = callerId === this.currentUser.id
    return { isCurrentId }
  }

  disconnectPeer({ peerId }) {
    if (!this.peers.has(peerId)) return

    this.peers.get(peerId).call.close()
    this.peers.delete(peerId)
  }

  async callNewUser(user) {
    const { isSpeaker } = this.currentUser
    if (!isSpeaker) return

    const stream = await this.getCurrentStream()
    this.currentPeer.call(user.peerId, stream)
  }
}
