import Attendee from '../entities/attendee.js'
const speakerIcon = `<img src="./../../assets/icons/asterisk.svg" alt="File icon" class="icon" />`

export default function getTemplate(attendee = new Attendee()) {
  const speakerTemplate = attendee.isSpeaker ? speakerIcon : ''
  return `
    <div class="room-card__user" id="${attendee.id}">
        <div class="room-card__user__img">
            <img src="${attendee.img}" alt="${attendee.username}">
        </div>
        <p class="room-card__user__name">
        ${speakerTemplate}
        ${attendee.firstname}
        </p>
    </div>
    `
}
