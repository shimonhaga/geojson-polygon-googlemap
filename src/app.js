const h3 = require("h3-js")
const concaveman = require("concaveman")

const ICON_SIZE = 2
const DEFAULT_CENTER = { lat: 35.685121, lng: 139.752885 }

// 初期化処理
function initialize() {
  console.info('initialize')

  // イベント追加
  addEvent()

  // マップ初期化
  initMap()
}

let map
let polygons = []
let markers = []
function initMap() {
  console.info('-- initMap')
  const mapOptions = {
    zoom: 13,
    mapTypeId: google.maps.MapTypeId.TERRAIN,
    mapTypeControlOptions: {
     mapTypeIds: ['my_map_style'],
    },
  }
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions)

  const centerPosition = new google.maps.LatLng(DEFAULT_CENTER)
  map.setCenter(centerPosition)

  // スタイル
  const mapStyledMapType = new google.maps.StyledMapType(
    [
      {
        featureType: 'administrative.province',
        elementType: 'geometry.stroke',
        stylers: [
          { hue: '#ff0000' },
          { visibility: 'on' },
          { saturation: 100 },
          { weight: 2 },
        ],
      },
    ],
    { name: 'MAP' },
  )
  map.mapTypes.set('my_map_style', mapStyledMapType)
  map.setMapTypeId('my_map_style')
}

let prefecture = null
function addEvent() {
  console.info('-- addEvent')
  document.getElementById('map-upload-geojson').addEventListener('click', function(e) {
    const geojsonText = document.getElementById('map-geojson-input').value
    try {
      prefecture = JSON.parse(geojsonText)
      if (prefecture.type && prefecture.type === 'Feature') {
        prefecture = {
          name: '手動',
          features: [prefecture]
        }
      } else if (prefecture.type && prefecture.type !== 'FeatureCollection') {
        throw Error('このタイプの GeoJson は対応していません (support = FeatureCollection, Feature)')
      }
    } catch (error) {
      prefecture = null
      console.error(error)
      alert('geojson のパースに失敗しました')
    }

    try {
      renderCitySelection()
    } catch (error) {
      alert('geojson からの UI構築に失敗しました')
    }
  })

  const citySelection = document.getElementById('map-city-selection')
  const concavity = document.getElementById('map-city-concavity')
  const resolution = document.getElementById('map-city-resolution')
  const ringSize = document.getElementById('map-city-ring-size')
  const checkinner = document.getElementById('map-city-checkinner')
  const reverse = document.getElementById('map-city-reverse')

  document.getElementById('map-city-display').addEventListener('click', function() {
    if (!prefecture) {
      alert('geojson を読み込んでください')
      return
    }
    const cityName = citySelection.innerHtml
    const cityIndexes = JSON.parse(citySelection.value)
    const concavityValue = concavity.value
    const resolutionValue = resolution.value * 1
    const ringSizeValue = ringSize.value * 1
    const isCheckInner = !!(checkinner.value * 1)
    const isLatLngReverse = !!(reverse.value * 1)

    // マップ
    const features = []
    for (const index of cityIndexes) {
      features.push(prefecture.features[index])
    }

    // クリア
    for (const polygon of polygons) {
      polygon.setMap(null)
    }
    polygons = []
    for (const marker of markers) {
      marker.setMap(null)
    }
    markers = []

    // 画面の中心
    const centers = [ 0, 0 ];
    let length = 0
    const latIndex = isLatLngReverse ? 1 : 0
    const lngIndex = isLatLngReverse ? 0 : 1
    for (const feature of features) {
      for (const coordinate of feature.geometry.coordinates[0]) {
        centers[0] += coordinate[latIndex]
        centers[1] += coordinate[lngIndex]
      }
      length += feature.geometry.coordinates[0].length
    }
    const centerCoordinate = [ centers[0] / length, centers[1] / length ]
    const centerPosition = new google.maps.LatLng(centerCoordinate[0], centerCoordinate[1])
    map.setCenter(centerPosition)
    centerMarker = dropPin(centerCoordinate, '#000000')
    markers.push(centerMarker)

    // ズーム
    // map.setZoom(zoom)

    // 区のポリゴン
    const cityPolygons = drawCityPolygons(map, cityName, features, concavityValue, isLatLngReverse)

    // 六角形
    drawHexagon(map, resolutionValue, ringSizeValue, centerCoordinate, cityPolygons, isCheckInner)
  })
}

function renderCitySelection() {
  console.log('renderCitySelection', { prefecture })
  const cities = {}
  for (const [index, feature] of Object.entries(prefecture.features)) {
    const name = (feature.properties.N03_002 || '') + (feature.properties.N03_003 || '') + (feature.properties.N03_004 || '') || '手動'
    if (cities[name]) {
      cities[name].indexes.push(index)
    } else {
      cities[name] = {
        name: name,
        indexes: [index]
      }
    }
  }

  const selection = document.getElementById('map-city-selection')
  selection.textContent = null
  for (const [index, city] of Object.entries(cities)) {
    const option = document.createElement('option')
    option.setAttribute('id', city.name)
    option.setAttribute('value', JSON.stringify(city.indexes))
    option.innerHTML = city.name
    selection.appendChild(option)
  }
}

function drawCityPolygons(map, cityName, features, concavityValue, isLatLngReverse) {
  const cityPolygons = {}
  const sqls = [];
  for ( const feature of features ) {
    const cityCoordinates = feature.geometry.coordinates[0]

    const latIndex = isLatLngReverse ? 1 : 0
    const lngIndex = isLatLngReverse ? 0 : 1
    const revCityCoordinates = cityCoordinates.map(function(cityCoordinate) { return [cityCoordinate[latIndex], cityCoordinate[lngIndex]] })
    const cavedCityCoordinates = concavityValue && concavityValue > 0
      ? concaveman(revCityCoordinates, concavityValue, 0)
      : revCityCoordinates

    // SQL 用
    coords = cavedCityCoordinates.map(revCityCoordinate => revCityCoordinate.join(' '))
    if (coords[0] !== coords[coords.length - 1]) {
      coords.push(coords[0])
    }
    sqls.push('(' + coords.join(',') + ')')

    // ポリゴン作成
    const cityPolygon = createPolygon(cavedCityCoordinates, '#000000')
    cityPolygon.setMap(map)
    if (cityPolygons[cityName]) {
      cityPolygons[cityName].push(cityPolygon)
    } else {
      cityPolygons[cityName] = [cityPolygon]
    }
    polygons.push(cityPolygon)
  }
  document.getElementById('map-polygon').value = 'POLYGON(' + sqls.join(',') + ')'
  return cityPolygons
}

function drawHexagon(map, resolution, ringSize, centerCoordinate, cityPolygons, checkInner) {
  if (!resolution || resolution < 1) {
    return
  }

  const radius = h3.edgeLength(resolution, h3.UNITS.m)
  const h3Index = h3.geoToH3(centerCoordinate[0], centerCoordinate[1], resolution)
  const kRings = h3.kRing(h3Index, ringSize)
  const hexagons = []
  const innerCenterCoordinates = {}
  for ( const kRing of kRings ) {
    // 中心を取得
    const centerCoordinate = h3.h3ToGeo(kRing)

    // 六角形
    const hexCoordinates = h3.h3ToGeoBoundary(kRing)

    // 範囲内かどうか (h3.polyfill だと粗すぎて使えなかった)
    let isInner = false
    if (checkInner) {
      for ( const cityName of Object.keys(cityPolygons) ) {
        const polygons = cityPolygons[cityName]
        let isInnerCity = checkInnerPolygons(centerCoordinate, polygons)
        for ( const hexCoordinate of hexCoordinates ) {
          if (isInnerCity) {
            break
          }
          isInnerCity = checkInnerPolygons(hexCoordinate, polygons)
        }
        if (isInnerCity) {
          if (innerCenterCoordinates[cityName]) {
            innerCenterCoordinates[cityName].push(centerCoordinate)
          } else {
            innerCenterCoordinates[cityName] = [centerCoordinate]
          }
        }
        isInner = isInner || isInnerCity
      }
    }

    // 色
    const color = isInner ? '#FF0000' : '#0000FF'

    // ピンを設置
    //dropPin(centerCoordinate, color)

    // 六角形を描く
    const hexagon = createPolygon(hexCoordinates, color)
    hexagon.setMap(map)
    hexagons.push(hexagon)

    polygons.push(hexagon)
  }
  return hexagons
}

function checkInnerPolygons(coordinate, polygons) {
  let result = false

  const latlng = new google.maps.LatLng(coordinate[0], coordinate[1])
  for ( const polygon of polygons ) {
    const isIn = google.maps.geometry.poly.containsLocation(latlng, polygon)
    if ( isIn ) {
      result = true
      break
    }
  }

  return result
}

function createPolygon(coordinates, color = '#FF0000') {
  const positions = []
  for ( const coordinate of coordinates ) {
    positions.push(new google.maps.LatLng(coordinate[0], coordinate[1]))
  }

  return new google.maps.Polygon({
    paths: positions,
    strokeColor: color,
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: color,
    fillOpacity: 0.35
  })
}

function changePolygonColor(polygon, color = '#FF0000') {
  polygon.setOptions({
    strokeColor: color,
    fillColor : color,
  })
}

function dropPin(coordinate, color = '#FF0000') {
  const position = new google.maps.LatLng(coordinate[0], coordinate[1])
  const marker = new google.maps.Marker({
    position: position,
    map: map,
    icon: {
      path: google.maps.SymbolPath.BACKWARD_OPEN_ARROW,
      scale: ICON_SIZE,
      fillColor: color,
      fillOpacity: 0.2,
      strokeColor: color,
      strokeWeight: 3.0,
    },
  })

  const infoWindow = new google.maps.InfoWindow({
    content: '<div class="location">' + position.lat() + ',' + position.lng() + '</div>'
  })
  marker.addListener('click', function() {
    infoWindow.open(map, marker)
    marker.setIcon({
      path: google.maps.SymbolPath.CIRCLE,
      scale: ICON_SIZE + 5,
      fillColor: "#0000FF",
      fillOpacity: 0.5,
      strokeColor: "#0000FF",
      strokeWeight: 1.0,
    })
  })

  return marker
}

window.addEventListener('load', function() {
  console.info('window.load')
  initialize()
})
