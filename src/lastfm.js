/* global fetch */

const config = require('./config')

const UnexpectedError = new Error('Unexpected response from Last.fm')

exports.getRecentTracks = async (user) => {
  const api = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${user}&api_key=${config.lastfm.apiKey}&format=json&limit=1`

  const response = await fetch(api)

  if (response.ok) {
    const data = await response.json()

    if (data && data.recenttracks && data.recenttracks.track && data.recenttracks.track.length > 0) {
      const track = data.recenttracks.track[0]
      const nowplaying = track['@attr'] && track['@attr'].nowplaying === 'true'
      return { track, nowplaying }
    } else throw UnexpectedError

  } else if (response.status === 404) throw new Error('User not found')
  else throw UnexpectedError
}