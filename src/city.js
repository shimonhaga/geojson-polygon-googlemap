const CITIES = [
  // {
  //   name: {
  //     ja: '23区',
  //     en: '23',
  //   },
  //   center: [35.685121, 139.752885],
  //   geo_json: require("../geo_json/tokyo_23.json"),
  //   ring_size: 15,
  //   zoom: 13,
  // },
  // {
  //   name: {
  //     ja: '都心6区',
  //     en: '6',
  //   },
  //   center: [35.689876, 139.744363],
  //   geo_json: require("../geo_json/tokyo_toshin.json"),
  //   ring_size: 26,
  //   zoom: 12,
  // },

  {
    name: {
      ja: '足立区',
      en: 'Adachi',
    },
    center: [35.778726, 139.79768],
    geo_json: require("../geo_json/23/adachi.json"),
    ring_size: 20,
    zoom: 12,
  },
  {
    name: {
      ja: '荒川区',
      en: 'Arakawa',
    },
    center: [35.738958, 139.780328],
    geo_json: require("../geo_json/23/arakawa.json"),
    ring_size: 11,
    zoom: 13,
  },
  {
    name: {
      ja: '文京区',
      en: 'Bunkyo',
    },
    center: [35.718534, 139.748100],
    geo_json: require("../geo_json/23/bunkyo.json"),
    ring_size: 9,
    zoom: 13,
  },
  {
    name: {
      ja: '千代田区',
      en: 'Chiyoda',
    },
    center: [35.689176, 139.755948],
    geo_json: require("../geo_json/23/chiyoda.json"),
    ring_size: 9,
    zoom: 13,
  },
  {
    name: {
      ja: '中央区',
      en: 'Chuo',
    },
    center: [35.6745, 139.775852],
    geo_json: require("../geo_json/23/chuo.json"),
    ring_size: 9,
    zoom: 13,
  },
  {
    name: {
      ja: '江戸川区',
      en: 'Edogawa',
    },
    center: [35.693340, 139.875077],
    geo_json: require("../geo_json/23/edogawa.json"),
    ring_size: 21,
    zoom: 12,
  },
  {
    name: {
      ja: '板橋区',
      en: 'Itabashi',
    },
    center: [35.768964, 139.674435],
    geo_json: require("../geo_json/23/itabashi.json"),
    ring_size: 17,
    zoom: 12,
  },

  {
    name: {
      ja: '葛飾区',
      en: 'Katsushika',
    },
    center: [35.754773, 139.863543],
    geo_json: require("../geo_json/23/katsushika.json"),
    ring_size: 16,
    zoom: 13,
  },
  {
    name: {
      ja: '北区',
      en: 'Kita',
    },
    center: [35.762001, 139.731043],
    geo_json: require("../geo_json/23/kita.json"),
    ring_size: 16,
    zoom: 12,
  },
  {
    name: {
      ja: '江東区',
      en: 'Koto',
    },
    center: [35.655691, 139.815083],
    geo_json: require("../geo_json/23/koto.json"),
    ring_size: 20,
    zoom: 12,
  },
  {
    name: {
      ja: '目黒区',
      en: 'Meguro',
    },
    center: [35.632500, 139.682012],
    geo_json: require("../geo_json/23/meguro.json"),
    ring_size: 11,
    zoom: 13,
  },
  {
    name: {
      ja: '港区',
      en: 'Minato',
    },
    center: [35.64854,139.743272],
    geo_json: require("../geo_json/23/minato.json"),
    ring_size: 14,
    zoom: 13,
  },
  {
    name: {
      ja: '中野区',
      en: 'Nakano',
    },
    center: [35.705279, 139.654791],
    geo_json: require("../geo_json/23/nakano.json"),
    ring_size: 12,
    zoom: 13,
  },
  {
    name: {
      ja: '練馬区',
      en: 'Nerima',
    },
    center: [35.745407, 139.622],
    geo_json: require("../geo_json/23/nerima.json"),
    ring_size: 20,
    zoom: 12,
  },
  {
    name: {
      ja: '大田区',
      en: 'Ota',
    },
    center: [35.570356, 139.737],
    geo_json: require("../geo_json/23/ota.json"),
    ring_size: 30,
    zoom: 12,
  },
  {
    name: {
      ja: '世田谷区',
      en: 'Setagaya',
    },
    center: [35.641005, 139.637505],
    geo_json: require("../geo_json/23/setagaya.json"),
    ring_size: 20,
    zoom: 12,
  },
  {
    name: {
      ja: '渋谷区',
      en: 'Shibuya',
    },
    center: [35.665598, 139.695],
    geo_json: require("../geo_json/23/shibuya.json"),
    ring_size: 12,
    zoom: 13,
  },
  {
    name: {
      ja: '品川区',
      en: 'Shinagawa',
    },
    center: [35.612499, 139.734853],
    geo_json: require("../geo_json/23/shinagawa.json"),
    ring_size: 14,
    zoom: 13,
  },
  {
    name: {
      ja: '新宿区',
      en: 'Shinjuku',
    },
    center: [35.701230, 139.708682],
    geo_json: require("../geo_json/23/shinjuku.json"),
    ring_size: 13,
    zoom: 13,
  },
  {
    name: {
      ja: '杉並区',
      en: 'Suginami',
    },
    center: [35.697664, 139.627320],
    geo_json: require("../geo_json/23/suginami.json"),
    ring_size: 15,
    zoom: 13,
  },
  {
    name: {
      ja: '墨田区',
      en: 'Sumida',
    },
    center: [35.712505, 139.810302],
    geo_json: require("../geo_json/23/sumida.json"),
    ring_size: 11,
    zoom: 13,
  },
  {
    name: {
      ja: '台東区',
      en: 'Taito',
    },
    center: [35.714215, 139.78773],
    geo_json: require("../geo_json/23/taito.json"),
    ring_size: 9,
    zoom: 13,
  },
  {
    name: {
      ja: '豊島区',
      en: 'Toshima',
    },
    center: [35.730837, 139.715411],
    geo_json: require("../geo_json/23/toshima.json"),
    ring_size: 12,
    zoom: 13,
  },
]

module.exports = CITIES
