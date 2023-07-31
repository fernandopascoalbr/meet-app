import Attendee from './entities/attendee.js'
import getTemplate from './templates/usersTemplate.js'

const imgUser = document.getElementById('imgUser')
const pTopic = document.getElementById('pTopic')
const gAttendee = document.getElementById('gridAttendees')
const gSpeakers = document.getElementById('gridSpeakers')

const btnMicrophone = document.getElementById('btnMicrophone')
const btnClap = document.getElementById('btnClap')
const btnClipBoard = document.getElementById('btnClipBoard')

export default class View {
  static updateUserImage({ img, username }) {
    imgUser.src = img
    imgUser.alt = username
  }

  static updateTopicTitle({ topic }) {
    pTopic.innerHTML = topic
  }

  static updateAttendeesOnGrid(users) {
    users.forEach((item) => View.addAttendeeOnGrid(item))
  }

  static addAttendeeOnGrid(item, removeFirst = false) {
    const attendee = new Attendee(item)
    const id = attendee.id
    const htmlTemplate = getTemplate(attendee)
    const baseElement = attendee.isSpeaker ? gSpeakers : gAttendee

    if (removeFirst) {
      View.removeItemOnGrid(id)
      baseElement.innerHTML += htmlTemplate
      return
    }

    const existingItem = View._getExistingItemOnGrid({ id, baseElement })
    if (existingItem) {
      existingItem.innerHTML = htmlTemplate
      return
    }

    baseElement.innerHTML += htmlTemplate
  }

  static _getExistingItemOnGrid({ id, baseElement = document }) {
    const existingItem = baseElement.querySelector(`[id="${id}"]`)
    return existingItem
  }

  static removeItemOnGrid(id) {
    const existingElement = View._getExistingItemOnGrid({ id })
    existingElement?.remove()
  }

  static showUserFeatures(isSpeaker) {
    if (!isSpeaker) {
      btnClap.classList.remove('hidden')
      btnMicrophone.classList.add('hidden')
      btnClipBoard.classList.add('hidden')
      return
    }

    btnClap.classList.add('hidden')
    btnMicrophone.classList.remove('hidden')
    btnClipBoard.classList.remove('hidden')
  }

  static _createAudioElement({ muted = true, srcObject }) {
    const audio = document.createElement('audio')
    audio.muted = muted
    audio.srcObject = srcObject
    audio.addEventListener('loadedmetadata', async () => {
      try {
        await audio.play()
      } catch (error) {
        console.error('error to play', error)
      }
    })
  }

  static renderAudioElement({ callerId, stream, isCurrentId }) {
    View._createAudioElement({
      muted: isCurrentId,
      srcObject: stream,
    })
  }

  static removeExistingAttendeOnGrid(id) {}
}
