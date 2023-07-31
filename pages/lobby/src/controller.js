export default class LobbyController {
  constructor({ socketBuilder, user, view }) {
    this.socketBuilder = socketBuilder
    this.user = user
    this.view = view
  }

  static async initialize(deps) {
    return new LobbyController(deps)._initialize()
  }

  async _initialize() {
    this._setupViewEvents()
    this.socket = this._setupSocket()
  }

  onLobbyUpdated(rooms) {
    console.log('onLobbyUpdated', rooms)
    this.view.updateRoomList(rooms)
  }

  _setupViewEvents() {
    this.view.updateUserImage(this.user)
    this.view.configureCreateRoomButton()
  }

  _setupSocket() {
    return this.socketBuilder
      .setOnLobbyUpdated(this.onLobbyUpdated.bind(this))
      .build()
  }
}
