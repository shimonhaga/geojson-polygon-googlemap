const CITIES = [
  {
    name: {
      ja: '福岡市東区',
      en: 'Fukuokashi Higashiku',
    },
    center: [33.653041, 130.389961],
    geo_json: require("../geo_json/fukuoka/fukuokashi-higashiku.json"),
    ring_size: 35,
    zoom: 12,
  },
  {
    name: {
      ja: '福岡市博多区',
      en: 'Fukuokashi Hakataku',
    },
    center: [33.575116, 130.443732],
    geo_json: require("../geo_json/fukuoka/fukuokashi-hakataku.json"),
    ring_size: 21,
    zoom: 13,
  },
  {
    name: {
      ja: '福岡市中央区',
      en: 'Fukuokashi Chuoku',
    },
    center: [33.580846, 130.385307],
    geo_json: require("../geo_json/fukuoka/fukuokashi-chuoku.json"),
    ring_size: 14,
    zoom: 13,
  },
  {
    name: {
      ja: '糟屋郡新宮町',
      en: 'Kasuyagun Shingumachi',
    },
    center: [33.698469, 130.457129],
    geo_json: require("../geo_json/fukuoka/shingumachi.json"),
    ring_size: 17,
    zoom: 13,
  },
  {
    name: {
      ja: '久山町',
      en: 'Hisayamamachi',
    },
    center: [33.667173, 130.513692],
    geo_json: require("../geo_json/fukuoka/hisayamamachi.json"),
    ring_size: 18,
    zoom: 13,
  },
  {
    name: {
      ja: '古賀市',
      en: 'Kogashi',
    },
    center: [33.723194, 130.497135],
    geo_json: require("../geo_json/fukuoka/kogashi.json"),
    ring_size: 19,
    zoom: 12,
  },
  {
    name: {
      ja: '福津市',
      en: 'Fukutsushi',
    },
    center: [33.782298, 130.496898],
    geo_json: require("../geo_json/fukuoka/fukutsushi.json"),
    ring_size: 28,
    zoom: 12,
  },

  {
    name: {
      ja: '宗像市',
      en: 'Munakatashi',
    },
    center: [33.815275, 130.547382],
    geo_json: require("../geo_json/fukuoka/munakatashi.json"),
    ring_size: 30 ,
    zoom: 11,
  },
  {
    name: {
      ja: '飯塚市',
      en: 'Izukashi',
    },
    center: [33.617480, 130.660937],
    geo_json: require("../geo_json/fukuoka/izukashi.json"),
    ring_size: 45,
    zoom: 11,
  },
  {
    name: {
      ja: '宮若市',
      en: 'Miyawakashi',
    },
    center: [33.712802, 130.614414],
    geo_json: require("../geo_json/fukuoka/miyawakashi.json"),
    ring_size: 33,
    zoom: 11,
  },
  {
    name: {
      ja: '岡垣町',
      en: 'Okagakimachi',
    },
    center: [33.859873, 130.601416],
    geo_json: require("../geo_json/fukuoka/okagakimachi.json"),
    ring_size: 10,
    zoom: 13,
  },
]

module.exports = CITIES
