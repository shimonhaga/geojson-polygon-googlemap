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
          name: '選択不要',
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

    // ポリゴンの重心
    const centers = [ 0, 0 ];
    let length = 0

    const latIndex = isLatLngReverse ? 1 : 0
    const lngIndex = isLatLngReverse ? 0 : 1
    function addCenterByCoordinate(coords) {
      for (const coord of coords) {
        centers[0] += coord[latIndex] * 1
        centers[1] += coord[lngIndex] * 1
        length++
      }
    }

    for (const feature of features) {
      if (feature.geometry.type === 'MultiPolygon') {
        feature.geometry.coordinates.forEach(function(nested) {
          addCenterByCoordinate(nested[0])
        })
      } else {
        addCenterByCoordinate(feature.geometry.coordinates[0])
      }
    }

    const centerCoordinate = [ centers[0] / length, centers[1] / length ]
    const centerPosition = new google.maps.LatLng(centerCoordinate[0], centerCoordinate[1])
    map.setCenter(centerPosition)
    centerMarker = dropPin(centerCoordinate, '#000000')
    markers.push(centerMarker)

    document.getElementById('map-center-lat').value = centerCoordinate[0]
    document.getElementById('map-center-lng').value = centerCoordinate[1]
    document.getElementById('map-center-point').value = 'POINT(' + centerCoordinate[0] + ' ' + centerCoordinate[1] + ')'

    // ズーム
    // map.setZoom(zoom)

    // 区のポリゴン
    const cityPolygons = drawCityPolygons(map, cityName, features, concavityValue, isLatLngReverse)

    // 六角形
    drawHexagon(map, resolutionValue, ringSizeValue, centerCoordinate, cityPolygons, isCheckInner)
  })

  const toggleFunction = function() {
    if (this.classList.contains('opened')) {
      this.classList.remove('opened')
      console.info('* close: ' + this.innerText)
    } else {
      this.classList.add('opened')
      console.info('* open: ' + this.innerText)
    }
  }
  const toggleElements = document.getElementsByClassName('toggle')
  for (let i = 0; i < toggleElements.length; i++) {
    toggleElements[i].addEventListener('click', toggleFunction)
  }
}

function renderCitySelection() {
  const cities = {}
  for (const [index, feature] of Object.entries(prefecture.features)) {
    const name = (feature.properties.N03_002 || '') + (feature.properties.N03_003 || '') + (feature.properties.N03_004 || '') || '選択不要'
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
  const polygonsForSql = []
  const polygonsForGeoJson = []
  let hasMulti = false
  const shouldConvertMultiPolygon = features.length > 1
  function innerFunction (coordinates, isMulti = false) {
    const refinedCoordinates = isLatLngReverse
      ? coordinates.map(function(coord) { return [coord[1], coord[0]] })
      : coordinates
    const cavedCoordinates = concavityValue && concavityValue > 0
      ? concaveman(refinedCoordinates, concavityValue, 0)
      : refinedCoordinates

    // SQL 用
    const coordinatesForSql = cavedCoordinates.map(cavedCoordinate => cavedCoordinate.join(' '))
    if (coordinatesForSql[0] !== coordinatesForSql[coordinatesForSql.length - 1]) {
      // 閉じる
      coordinatesForSql.push(coordinatesForSql[0])
    }
    polygonsForSql.push('(' + coordinatesForSql.join(',') + ')')

    // GeoJson 用
    const coordinatesForGeoJson = cavedCoordinates.map(cavedCoordinate => '[' + cavedCoordinate.join(',') + ']')
    if (coordinatesForGeoJson[0] !== coordinatesForGeoJson[coordinatesForGeoJson.length - 1]) {
      // 閉じる
      coordinatesForGeoJson.push(coordinatesForGeoJson[0])
    }
    polygonsForGeoJson.push((isMulti ? '[[' : '[') + coordinatesForGeoJson.join(',') + (isMulti ? ']]' : ']'))

    // ポリゴン作成
    const cityPolygon = createPolygon(cavedCoordinates, '#000000')
    cityPolygon.setMap(map)
    if (cityPolygons[cityName]) {
      cityPolygons[cityName].push(cityPolygon)
    } else {
      cityPolygons[cityName] = [cityPolygon]
    }
    polygons.push(cityPolygon)
  }
  for (const feature of features) {
    if (feature.geometry.type === 'MultiPolygon') {
      hasMulti = true
      feature.geometry.coordinates.forEach(function(nested) {
        innerFunction(nested[0], true)
      })
    } else {
      innerFunction(feature.geometry.coordinates[0], shouldConvertMultiPolygon)
    }
  }

  // SQL 表示
  const sql = 'POLYGON(' + polygonsForSql.join(',') + ')'
  document.getElementById('map-polygon').value = sql
  document.getElementById('map-polygon-length').innerHTML = sql.length.toLocaleString()

  // GeoJson 表示
  const geoJson = '{"type":"Feature","properties":{},"geometry":{"type":"' + (hasMulti || shouldConvertMultiPolygon ? 'MultiPolygon' : 'Polygon') + '","coordinates":[' + polygonsForGeoJson.join(',') + ']}}'
  document.getElementById('map-geojson-output').value = geoJson
  document.getElementById('map-geojson-output-length').innerHTML = geoJson.length.toLocaleString()

  // 返却
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
