export const constants = {
  socketUrl: 'http://192.168.0.13:3000',
  socketNamespaces: {
    room: 'room',
    lobby: 'lobby',
  },
  peerConfig: Object.values({
    id: undefined,
    // config: {
    //   port: 9000,
    //   host: 'localhost',
    //   path: '/'
    // }
  }),
  pages: {
    lobby: '/pages/lobby',
    login: '/pages/login',
  },
  events: {
    CONNECTION: 'connect',
    USER_CONNECTED: 'userConnection',
    USER_DISCONNECTED: 'userDisconnection',

    JOIN_ROOM: 'joinRoom',
    LOBBY_UPDATED: 'lobbyUpdated',
    UPGRADE_USER_PERMISSION: 'upgradeUserPermission',

    SPEAK_REQUEST: 'speakRequest',
    SPEAK_ANSWER: 'speakAnswer',
  },
  firebaseConfig: {
    apiKey: 'AIzaSyDsuhtl4CerCFcFbozvBhvHGSQ8OGEsT_o',
    authDomain: 'meet-7e197.firebaseapp.com',
    projectId: 'meet-7e197',
    storageBucket: 'meet-7e197.appspot.com',
    messagingSenderId: '952769645195',
    appId: '1:952769645195:web:c3471074b27664dbde228e',
  },
  storageKey: 'meet:storage:key',
}
