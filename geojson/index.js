module.exports = {
  tokyo: {
    name: '東京都',
    geojson: require('./tokyo'),
    center: { lat: 35.685121, lng: 139.752885 },
  },
  kyoto: {
    name: '京都府',
    geojson: require('./kyoto'),
    center: { lat: 34.9221499, lng: 135.6135885 },
  },
  aichi: {
    name: '愛知県',
    geojson: require('./aichi'),
    center: { lat: 35.0820833, lng: 137.1518136　},
  },
  osaka: {
    name: '大阪府',
    geojson: require('./osaka'),
    center: { lat: 34.688215, lng: 135.541584 },
  },
  hyogo: {
    name: '兵庫県',
    geojson: require('./hyogo'),
    center: { lat: 35.062167, lng: 134.824769　},
  },
  fukuoka: {
    name: '福岡県',
    geojson: require('./fukuoka'),
    center: { lat: 33.583708, lng: 130.447152 },
  },
  okinawa: {
    name: '沖縄県',
    geojson: require('./okinawa'),
    center: { lat: 26.524186, lng: 127.987710 },
  },
}
