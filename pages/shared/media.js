export default class Media {
  static async getUserAudio(audio = true) {
    return navigator.mediaDevices.getUserMedia({ audio })
  }

  static createMediaStreamFake() {
    return new MediaStream([Media.createEmptyAudioTrack()])
  }

  static createEmptyAudioTrack() {
    const audioContext = new AudioContext()
    const oscilator = audioContext.createOscillator()

    const destination = oscilator.connect(
      audioContext.createMediaStreamDestination()
    )
    oscilator.start()

    const [track] = destination.stream.getAudioTracks()

    return Object.assign(track, { enabled: false })
  }
}
